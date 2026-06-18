// نور العلم — Service Worker v35
const CACHE_NAME = 'nur-al-ilm-v35';
const PRECACHE = ['/', '/index.html'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (['api.elevenlabs.io','server8.mp3quran.net','fonts.googleapis.com','fonts.gstatic.com'].some(d => url.hostname.includes(d))) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => { if (e.request.destination === 'document') return caches.match('/'); });
    })
  );
});
self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
