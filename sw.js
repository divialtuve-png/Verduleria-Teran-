const CACHE = "teran-v3";

const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./config.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-180.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (
    event.request.url.includes("app.js") ||
    event.request.url.includes("config.js")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});