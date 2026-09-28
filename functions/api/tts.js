/**
 * نور العلم — Relais TTS sécurisé (Cloudflare Pages Function)
 * Route : POST /api/tts   body : { text, voiceId?, speed? }
 *
 * La clé ElevenLabs n'est JAMAIS dans le code : elle est lue dans la variable
 * d'environnement chiffrée ELEVENLABS_API_KEY (Pages › Settings › Variables and Secrets).
 *
 * Protections :
 *  - seules les requêtes venant du site lui-même sont acceptées (Origin / Referer) ;
 *  - voix autorisées en liste blanche, texte limité en longueur, vitesse bornée ;
 *  - réponses mises en cache au bord (Cache API) → un même texte n'est payé qu'une fois.
 */

const ALLOWED_VOICES = ['pqHfZKP75CvOlQylNhV4'];
const DEFAULT_VOICE  = 'pqHfZKP75CvOlQylNhV4';
const MAX_CHARS      = 3000;
const MODEL          = 'eleven_multilingual_v2';

const json = (status, obj) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

function isAllowedOrigin(request, env) {
  const self = new URL(request.url).host;
  const extra = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const src = request.headers.get('Origin') || request.headers.get('Referer');
  if (!src) return false;
  try {
    const u = new URL(src);
    return u.host === self || extra.includes(u.origin) || extra.includes(u.host);
  } catch { return false; }
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env, waitUntil }) {
  if (!env.ELEVENLABS_API_KEY) return json(500, { error: 'ELEVENLABS_API_KEY manquante côté serveur' });
  if (!isAllowedOrigin(request, env)) return json(403, { error: 'Origine non autorisée' });

  let body;
  try { body = await request.json(); } catch { return json(400, { error: 'JSON invalide' }); }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) return json(400, { error: 'Texte vide' });
  if (text.length > MAX_CHARS) return json(413, { error: `Texte trop long (max ${MAX_CHARS} caractères)` });

  const voiceId = ALLOWED_VOICES.includes(body.voiceId) ? body.voiceId : DEFAULT_VOICE;
  const speed = Math.min(1.2, Math.max(0.7, Number(body.speed) || 1.0));

  // Cache au bord : même texte + voix + vitesse → même audio
  const cache = caches.default;
  const cacheKey = new Request(`https://tts-cache.nur-al-ilm/${await sha256(`${voiceId}|${speed}|${MODEL}|${text}`)}`);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({
      text, model_id: MODEL,
      voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0, use_speaker_boost: true, speed }
    })
  });

  if (!upstream.ok) {
    const detail = (await upstream.text().catch(() => '')).slice(0, 300);
    return json(upstream.status === 401 ? 502 : upstream.status, { error: 'ElevenLabs a refusé la requête', detail });
  }

  const res = new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff'
    }
  });
  waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}

export function onRequest() {
  return json(405, { error: 'Méthode non autorisée — utilisez POST' });
}
