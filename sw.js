const CACHE_NAME = "my-rota-dynamic-cache";

// Force the new service worker to activate immediately
self.addEventListener("install", (e) => {
    self.skipWaiting(); 
});

// Take control of all pages immediately
self.addEventListener("activate", (e) => {
    e.waitUntil(clients.claim()); 
});

// Network-First Strategy
self.addEventListener("fetch", (e) => {
    // Only apply this to requests from your own app, ignore third-party API calls
    if (!e.request.url.startsWith(self.location.origin)) return;

    e.respondWith(
        fetch(e.request)
            .then((networkResponse) => {
                // If the internet works, save a fresh copy to the cache and show it to the user
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // If the phone is offline, load the app from the cache
                return caches.match(e.request);
            })
    );
});
