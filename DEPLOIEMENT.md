# Déploiement — نور العلم (Cloudflare Pages + GitHub)

## 1. Révoquer l'ancienne clé ElevenLabs (à faire en premier)
L'ancienne clé était écrite dans `index.html` : considérez-la comme publique.
ElevenLabs › Settings › API Keys → **supprimer** l'ancienne clé → **créer** une nouvelle clé.

## 2. Structure du dépôt
```
/
├── index.html
├── sw.js
├── manifest.json
├── _headers
├── icon-180.png · icon-192.png · icon-512.png
├── functions/
│   └── api/
│       └── tts.js          ← relais TTS (route POST /api/tts)
├── .gitignore               ← exclut .dev.vars
├── .dev.vars.example
├── CHANGELOG.md
└── DEPLOIEMENT.md
```

## 3. Relier Cloudflare Pages au dépôt GitHub
Le dossier `functions/` n'est pris en compte que par un déploiement **Git** ou **Wrangler**. Le glisser-déposer du ZIP ne publie que les fichiers statiques.

Pages › votre projet › Settings › Builds & deployments › **Connect to Git** :
- Framework preset : **None**
- Build command : *(vide)*
- Build output directory : **/**

## 4. Ajouter la clé côté serveur
Pages › Settings › **Variables and Secrets** → Add :
- Nom : `ELEVENLABS_API_KEY` · Type : **Secret** · Valeur : la nouvelle clé
- (à faire pour **Production** et **Preview**)
- Optionnel : `ALLOWED_ORIGINS` = `https://mon-domaine.fr` si vous utilisez un domaine en plus de `*.pages.dev`

Puis **redéployer** (un nouveau commit suffit).

## 5. Vérifier
- Ouvrir l'app → un bouton 🔊 → le son doit venir de `/api/tts` (onglet Réseau du navigateur).
- En cas de souci, l'app bascule automatiquement sur la voix du téléphone.

## 6. Recommandé : limiter les abus
Security › WAF › **Rate limiting rules** : par exemple 30 requêtes / minute / IP sur le chemin `/api/tts`.

## Test en local (facultatif)
```
cp .dev.vars.example .dev.vars   # puis y coller la clé
npx wrangler pages dev .
```
