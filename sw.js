/* ════════════════════════════════════════════════════════════════════════
   MonCocktail — Service Worker v1.0.0
   ────────────────────────────────────────────────────────────────────────
   Stratégie : Cache First + notification de mise à jour.

   Pour déclencher une mise à jour côté utilisateur :
   → Changer CACHE_VERSION (ex: 'moncktl-v2' → 'moncktl-v3') et pousser
     les fichiers sur GitHub. L'app affichera le bouton "🔄 Mettre à jour".
   ════════════════════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'moncktl-v1.0.0';

// Les chemins sont résolus dynamiquement depuis le scope du SW,
// indépendamment du nom du dépôt GitHub.
function getAssets() {
  var base = self.registration.scope;
  return [
    base,
    base + 'index.html',
    base + 'manifest.json',
    base + 'icon-192.png',
    base + 'icon-512.png',
  ];
}

/* ── Installation : mise en cache de l'app shell ─────────────────────── */
self.addEventListener('install', function(event) {
  console.log('[SW] Nouvelle version :', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function(cache) { return cache.addAll(getAssets()); })
      .then(function() {
        // Ne PAS appeler skipWaiting() ici — le SW reste en "waiting"
        // jusqu'à ce que l'utilisateur clique sur le bouton.
        console.log('[SW] En attente d\'activation');

        // Notifier tous les onglets ouverts qu'une MAJ est disponible
        return self.clients.matchAll({ includeUncontrolled: true })
          .then(function(clients) {
            clients.forEach(function(client) {
              client.postMessage({ type: 'SW_WAITING', version: CACHE_VERSION });
            });
          });
      })
      .catch(function(err) { console.error('[SW] Erreur cache :', err); })
  );
});

/* ── Activation : nettoyage des anciens caches ───────────────────────── */
self.addEventListener('activate', function(event) {
  console.log('[SW] Activation :', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) { return k !== CACHE_VERSION; })
          .map(function(k) {
            console.log('[SW] Suppression :', k);
            return caches.delete(k);
          })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

/* ── Messages reçus de l'app ─────────────────────────────────────────── */
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // L'utilisateur a confirmé la mise à jour — on prend le contrôle
    console.log('[SW] skipWaiting() déclenché');
    self.skipWaiting();
  }
});

/* ── Fetch : Cache First ─────────────────────────────────────────────── */
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);
  var isThirdParty = url.origin !== self.location.origin;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || isThirdParty) return response;
        var clone = response.clone();
        caches.open(CACHE_VERSION).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function() {
        return new Response(
          '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">' +
          '<meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<title>MonCocktail — Hors ligne</title>' +
          '<style>body{font-family:sans-serif;background:#0C0F1D;color:#D4AA4A;' +
          'display:flex;flex-direction:column;align-items:center;' +
          'justify-content:center;min-height:100vh;text-align:center;padding:24px}' +
          'h2{font-size:28px;margin-bottom:12px}p{color:#9A92B0;max-width:320px;line-height:1.6}' +
          '</style></head><body>' +
          '<h2>🍸 MonCocktail</h2>' +
          '<p>Vous êtes hors ligne.<br>Ouvrez l\'app une première fois en ligne ' +
          'pour activer le mode hors ligne.</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      });
    })
  );
});
