const CACHE_NAME = "habit-tracker-v2";

// 1. The "App Shell" - the bare minimum required to load the UI
const CORE_ASSETS = ["/", "/manifest.json", "/icon-512.png"];

// Install Event: Pre-cache the core assets immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches if we update the CACHE_NAME
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch Event: The traffic cop intercepting all network requests
self.addEventListener("fetch", (event) => {
  // Only intercept requests from our own domain
  if (!event.request.url.startsWith(self.location.origin)) return;

  // STRATEGY 1: HTML Pages (Network First, Fallback to Cache)
  // We always want the freshest data if online, but will load the last visited version if offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If network is good, save a copy to the cache for next time
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // If network fails (offline), pull the page from the cache
          return caches.match(event.request).then((cachedResponse) => {
            // If the specific page isn't in cache, fallback to the root dashboard
            return cachedResponse || caches.match("/");
          });
        }),
    );
    return;
  }

  // STRATEGY 2: Static Assets like CSS, JS, and Images (Stale-While-Revalidate)
  // Serve instantly from cache for speed, but silently update the cache in the background
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => {
          // Ignore network errors for background asset updates
        });

      return cachedResponse || fetchPromise;
    }),
  );
});
