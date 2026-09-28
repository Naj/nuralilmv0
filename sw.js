// نور العلم — Service Worker v42
const CACHE_NAME = 'nur-al-ilm-v42';
const DATA_CACHE = 'nur-al-ilm-data';          // données du rappel (conservées entre versions)
const DATA_URL = '/__nur/hadiths.json';
const PRECACHE = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME && k !== DATA_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;           // /api/tts (POST) passe directement au réseau
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/__nur/')) return;
  if (['api.elevenlabs.io','server8.mp3quran.net','fonts.googleapis.com','fonts.gstatic.com']
      .some(d => url.hostname.includes(d))) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: e.request.mode === 'navigate' }).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => { if (e.request.destination === 'document') return caches.match('/'); });
    })
  );
});

// ── Rappel « Hadith du jour » ─────────────────────────────────────────────
const pad = n => String(n).padStart(2, '0');
const dayKey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

async function notifyHadith(force) {
  const cache = await caches.open(DATA_CACHE);
  const r = await cache.match(DATA_URL);
  if (!r) return;
  const data = await r.json();
  const now = new Date(), k = dayKey(now);
  if (!force) {
    if (!data.on) return;
    if (now.getHours() < (data.hour || 8)) return;       // pas avant l'heure choisie
    if (data.notified === k || data.seen === k) return;  // déjà notifié ou app déjà ouverte aujourd'hui
  }
  const h = data.days && data.days[k];
  if (!h) return;
  await self.registration.showNotification(h.t, {
    body: h.b, icon: '/icon-192.png', badge: '/icon-192.png',
    tag: 'hadith-du-jour', renotify: false, lang: 'fr', data: { url: '/?hadith=1' }
  });
  data.notified = k;
  await cache.put(DATA_URL, new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }));
}

self.addEventListener('periodicsync', e => {
  if (e.tag === 'nur-hadith-du-jour') e.waitUntil(notifyHadith(false));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) { c.postMessage({ type: 'NUR_HADITH' }); return c.focus(); } }
      return self.clients.openWindow(target);
    })
  );
});

self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data.type === 'NUR_NOTIFY_TEST') e.waitUntil(notifyHadith(true));
});
