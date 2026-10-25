// Service worker: makes the site installable and readable offline.
// - Pages: network first, so new posts show up immediately; falls back to the
//   cached copy, then to /offline/.
// - Hashed build assets (/_astro/) and fonts: cache first, they never change.
// - Images: cache first, capped so a long browse doesn't fill the device.
// Bump VERSION when changing this file's caching logic to drop old caches.
const VERSION = 'v1';
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const IMAGES = `images-${VERSION}`;
const MAX_IMAGES = 200;
const PRECACHE = ['/', '/offline/', '/manifest.webmanifest', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  const current = [PAGES, ASSETS, IMAGES];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !current.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (url.origin === location.origin && url.pathname.startsWith('/_astro/')) {
    event.respondWith(cacheFirst(request, ASSETS));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, ASSETS));
  } else if (url.origin === location.origin && request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGES, MAX_IMAGES));
  } else if (url.origin === location.origin) {
    // Anything else (manifest, feed): network, falling back to a cached copy.
    event.respondWith(fetch(request).catch(() => caches.match(request).then((r) => r ?? Response.error())));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) ?? (await cache.match('/offline/'));
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // Opaque (cross-origin, no-cors) font responses report status 0 but are usable.
  if (response.ok || response.type === 'opaque') {
    await cache.put(request, response.clone());
    if (maxEntries) trim(cache, maxEntries);
  }
  return response;
}

async function trim(cache, maxEntries) {
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)));
}
