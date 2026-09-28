# Changelog — نور العلم

## v42 — 28 septembre 2026

### Horaires de prière
- **17 méthodes de calcul**, classées par région : Ligue islamique mondiale, ISNA, Égypte, Karachi, Umm al-Qurâ, Golfe, Koweït, Qatar, Diyanet (Turquie), MUIS (Singapour), Habous (Maroc), Algérie, Tunisie, UOIF, France 15°, France 18°, et **angles personnalisés**.
- **Réglages avancés** : calcul du 'Asr (majorité dont malikite / hanafite), règle des hautes latitudes (angle, milieu de la nuit, 1/7 de la nuit, aucune), latitude/longitude manuelles.
- **Ajustements manuels** en minutes pour chaque prière, pour coller au calendrier de sa mosquée.
- **Comparateur** : Fajr et 'Ishâ' du jour pour toutes les méthodes, côte à côte.
- 7 villes ajoutées (Londres, Rabat, Oran, Le Caire, Istanbul, Bamako, Abidjan).

### Écran widget & raccourcis
- **Écran widget** plein écran : prochaine prière en grand avec compte à rebours, horaires du jour, hadith du jour, date hégirienne ; rafraîchi toutes les 30 s. Accessible depuis l'accueil, les Horaires, ou l'URL `/?vue=widget`.
- **Raccourcis d'application** (manifest `shortcuts`) : appui long sur l'icône → Horaires, Hadith du jour, Mode veille, Guide de prière (Android/Chrome, Windows/Edge).

### Mode veille
- Deux nouveaux styles en plus de « Mihrab » : **Nuit calme** (texte seul, horloge discrète en bas) et **Ciel étoilé** (étoiles scintillantes, croissant de lune, étoile filante occasionnelle ; animation à ~20 i/s, figée si « réduire les animations »). Choix dans les réglages de la veille.

### Technique
- Service Worker `nur-al-ilm-v42` ; les navigations avec paramètres (`/?vue=widget`…) sont servies hors-ligne.

## v41 — 28 septembre 2026

### Relecture fiqh malikite — Piliers, Ramadan, Spiritualité
- **Ce qui annule le wudu** : retrait du saignement et du vomissement (avis hanafite, pas malikite — l'école malikite ne les considère PAS comme des annulateurs). Ajout du contact conjugal avec désir, précision sur le contact des parties intimes « sans barrière ».
- **Zakat al-Fitr / Siyam (fiche Piliers)** : le vomissement volontaire et la poursuite d'un repas après s'être souvenu d'un oubli ne demandent qu'un rattrapage (qada), sans expiation (kaffara) — ils étaient à tort classés avec les actes qui exigent la kaffara. La kaffara ne concerne que manger/boire intentionnellement et les rapports intimes.
- **Distance de voyage** : corrigée de « ≥48 km » à « 4 burud, environ 80 km, en étant parti avant l'aube » — cohérence avec la fiche Ramadan (déjà corrigée en v39) et avec la fiche Piliers (qui ne l'était pas encore).
- **Mawlid an-Nabawî** : la fiche affirmait que c'était une « pratique répandue dans l'école malikite » comme un fait établi ; reformulée pour indiquer qu'il s'agit d'une pratique culturelle répandue dans les régions malikites, dont le statut religieux reste discuté entre savants.
- Vérification de Croyance (Tawhid, Anges, Livres, Shirk, Barzakh, Janna, Signes) : contenu de aqida générale, sans particularité d'école, aucune correction nécessaire.

## v40 — 28 septembre 2026

### Sécurité
- **Clé ElevenLabs retirée du code.** Nouveau relais `functions/api/tts.js` (Cloudflare Pages Function, route `POST /api/tts`) : clé lue dans le secret `ELEVENLABS_API_KEY`, contrôle d'origine, voix en liste blanche, texte limité à 3 000 caractères, cache au bord.
- L'ancienne clé stockée dans le navigateur des utilisateurs est effacée automatiquement. Une clé personnelle reste possible dans les réglages de la voix.

### Harmonisation avec l'école malikite
- **Prière Homme / Femme** : Fâtiḥa sans basmala, tashahhud de 'Umar (Muwaṭṭa'), ṣalawât avec « fi l-'âlamîn », salâm « As-salâmu 'alaykum » en position assise, tawarruk dans toutes les assises, mains levées au seul takbir d'ouverture, glorifications recommandées (pas de nombre imposé), posture « ramassée » de la femme selon la Risâla. Fiche Femme passée à 9 étapes.
- **Conditions & piliers** : âge de la puberté (18 ans à défaut de signes), Fâtiḥa derrière l'imam, assise obligatoire limitée au salâm, i'tidâl.
- **Annulateurs** : le rire aux éclats n'annule pas le wudu ; prosternation de l'oubli remise dans le bon sens (omission → avant le salâm, ajout → après) ; doute → après le salâm.
- **Najâsa** : classification lourde/moyenne/légère retirée (propre à d'autres écoles) ; chien et porc vivants purs ; sperme impur ; urine du nourrisson lavée ; nouvelle rubrique « impuretés pardonnées ».
- **Ramadan** : une intention pour tout le mois ; voyage de 4 burud (~80 km) ; manger par oubli → rattrapage.
- **Quiz** : 5 réponses corrigées en conséquence.

### Rappel « Hadith du jour »
- Bouton 🔔 sur la carte Hadith du jour : notification quotidienne après l'heure choisie, via Periodic Background Sync (Chrome/Android, app installée). Pas de doublon si l'app a déjà été ouverte dans la journée. Un clic ouvre l'app sur le hadith.
- Service Worker `nur-al-ilm-v40` ; cache `nur-al-ilm-data` conservé entre les versions ; `/api/` jamais mis en cache.

## v39 — 28 septembre 2026

### Ajouts
- **Qunūt du Fajr (école malikite)** — onglet Salat › *Qunūt du Fajr* : texte arabe, translittération, traduction, frise « où le placer » (2ᵉ rak'a, avant le rukū'), règles de l'école, audio, mode mémorisation et marquage « appris ».
- **Guide de prière pas à pas** — onglet Salat › *Guide pas à pas* : Subh, Dhuhr, 'Asr, Maghrib, 'Ishâ' ; chaque position avec ce qu'on prononce, voix haute/basse, compteur de rak'a, navigation clavier ← →. Qunūt intégré au Subh.
- **Horaires de prière** — onglet Salat › *Horaires* : calcul local hors-ligne (géolocalisation ou 19 villes), 4 méthodes (LIM 18°/17°, UOIF 12°, 15°, Umm al-Qurâ), 'Asr selon l'avis malikite, ajustement hautes latitudes.
- **Accueil** — carte « Prochaine prière » avec compte à rebours + « Hadith du jour ».
- **Mode veille « Mihrab »** — bouton lune dans la navigation flottante ou déclenchement après inactivité (2/5/10 min) ; hadiths en rotation (25 hadiths courts + An-Nawawî), horloge et date hégirienne, Wake Lock, anti-marquage OLED, Échap/clic pour quitter.
- **Suivi de progression** — 3 nouveaux modules : Pratique (prières guidées + qunūt), 40 Nawawî (hadiths mémorisés, bouton dans chaque fiche), Assiduité (jours d'affilée).
- **Quiz** — 5 nouvelles questions (qunūt, salâm).

### Technique
- Service Worker `nur-al-ilm-v39`.
- Nouvelles clés localStorage : `nur_al_ilm_veille`, `nur_al_ilm_pt` ; nouveaux champs dans `nur_al_ilm` : `guideDone`, `qunutAppris`, `nawawiAppris`, `visitDays`.
- Branchements non destructifs sur `updateDashboard`, `renderSalat`, `openModal`, `razExecute`.
