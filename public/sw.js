const CACHE_NAME = "habit-tracker-v2"; // Bumped version to force an update

const URLS_TO_CACHE = [
  "/",
  "/dashboard", // We must actually cache the dashboard!
  "/login", // And the login page!
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. If the file is in the cache, serve it immediately
      if (response) {
        return response;
      }

      // 2. If it's not in the cache, try to fetch it from the internet
      return fetch(event.request).catch(() => {
        // 3. If the internet is OFF, ONLY serve the fallback page if the app is asking for a webpage (navigation)
        // This stops the SW from serving the HTML splash screen in place of missing JavaScript files
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      });
    }),
  );
});
