/* ════════════════════════════════════════════════════════════════════════
   MonCocktail — Service Worker
   URL de production : https://alexbien-59.github.io/moncktl/
   ════════════════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'moncktl-v1';

const ASSETS = [
  '/moncktl/',
  '/moncktl/index.html',
  '/moncktl/manifest.json',
  '/moncktl/icon-192.png',
  '/moncktl/icon-512.png',
];

// ── Installation : pré-cache l'app shell ─────────────────────────────────
self.addEventListener('install', function(event) {
  console.log('[SW] Installation — cache:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── Activation : purge les anciens caches ─────────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Fetch : Cache First ───────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        var toCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(function() {
        return new Response(
          '<html><body style="background:#0C0F1D;color:#D4AA4A;font-family:sans-serif;text-align:center;padding:60px"><h2>🍸 MonCocktail</h2><p>Vous êtes hors ligne.<br>Ouvrez l\'app une première fois en ligne pour activer le mode hors ligne.</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      });
    })
  );
});
