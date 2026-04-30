/* ════════════════════════════════════════════════════════════════════════
   MonCocktail — Service Worker
   ────────────────────────────────────────────────────────────────────────
   Stratégie : Cache First
   - À l'installation, on met tout l'app shell en cache.
   - Toute requête est d'abord servie depuis le cache (instantané, hors ligne).
   - Si la ressource n'est pas en cache, on tente le réseau.
   - À chaque nouvelle version (CACHE_NAME change), l'ancien cache est purgé.
   ════════════════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'moncktl-v1';

// Ressources à mettre en cache à l'installation.
// Les polices Google Fonts ne sont pas listées ici car elles ont leur propre
// cache HTTP et sont optionnelles (l'app fonctionne sans elles).
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ── Installation ──────────────────────────────────────────────────────────
// Pré-cache toutes les ressources listées dans ASSETS.
// waitUntil() empêche le SW de s'activer avant que le cache soit prêt.
self.addEventListener('install', function(event) {
  console.log('[SW] Installation — cache:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      // Force l'activation immédiate sans attendre la fermeture des onglets
      return self.skipWaiting();
    })
  );
});

// ── Activation ────────────────────────────────────────────────────────────
// Supprime les anciens caches dont le nom ne correspond plus à CACHE_NAME.
// Permet de vider proprement le cache lors des mises à jour de l'app.
self.addEventListener('activate', function(event) {
  console.log('[SW] Activation — nettoyage des anciens caches');
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) {
            console.log('[SW] Suppression ancien cache:', key);
            return caches.delete(key);
          })
      );
    }).then(function() {
      // Prend le contrôle de tous les clients immédiatement
      return self.clients.claim();
    })
  );
});

// ── Interception des requêtes (Fetch) ─────────────────────────────────────
// Stratégie Cache First :
//   1. On cherche dans le cache.
//   2. Si trouvé → on sert depuis le cache (rapide, hors ligne).
//   3. Si absent → on va chercher sur le réseau et on met en cache pour la prochaine fois.
self.addEventListener('fetch', function(event) {
  // Ignorer les requêtes non-GET (POST, PUT…) et les extensions navigateur
  if (event.request.method !== 'GET') return;
  // Ignorer les requêtes vers d'autres origines (Google Fonts, CDN…)
  // On les laisse passer normalement sans interférer
  var url = new URL(event.request.url);
  if (url.origin !== location.origin && !event.request.url.startsWith('./')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        return cached; // Servi depuis le cache
      }
      // Pas en cache → réseau
      return fetch(event.request).then(function(response) {
        // Ne pas mettre en cache les réponses invalides ou les requêtes opaque
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        // Cloner car la réponse ne peut être consommée qu'une fois
        var toCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(function() {
        // Hors ligne et pas en cache → page de fallback minimale
        return new Response(
          '<html><body style="background:#0C0F1D;color:#D4AA4A;font-family:sans-serif;text-align:center;padding:60px"><h2>🍸 MonCocktail</h2><p>Vous êtes hors ligne.<br>Ouvrez l\'app une première fois en ligne pour activer le mode hors ligne.</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      });
    })
  );
});
