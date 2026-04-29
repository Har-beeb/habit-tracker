const CACHE_NAME = "habit-tracker-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting(); // <-- FIX 1: Force immediate activation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // return cache.addAll(["/", "/manifest.json"]);
      return cache.addAll(["/"]);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim()); // <-- FIX 2: Take control of the open tab immediately
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If offline, it falls back to the cached "/"
      return response || fetch(event.request).catch(() => caches.match("/"));
    }),
  );
});
