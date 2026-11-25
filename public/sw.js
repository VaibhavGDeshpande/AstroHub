// AstroHub service worker: makes the site installable and keeps field tools usable without signal.
// Pages: network first, falling back to the last copy seen, then /offline.
// Hashed build assets (/_next/static) and icons: cache first, they never change under the same URL.
// API calls, admin pages and RSC requests are never cached, so data is never served stale by accident.

const VERSION = 'v1';
const PAGES = `astrohub-pages-${VERSION}`;
const ASSETS = `astrohub-assets-${VERSION}`;
const MAX_PAGES = 40;
// Field tools are precached at install, with the scripts they need, so they open offline even if never visited.
const PRECACHE_PAGES = ['/offline', '/sky-chart'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const pages = await caches.open(PAGES);
    const assets = await caches.open(ASSETS);
    for (const url of PRECACHE_PAGES) {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (!res.ok) continue;
        const html = await res.clone().text();
        await pages.put(url, res);
        const chunks = [...new Set(html.match(/\/_next\/static\/[^"'\s)\\]+/g) || [])];
        await Promise.all(chunks.map((c) => assets.add(c).catch(() => {})));
      } catch {
        // Offline during install: the page is cached later when visited.
      }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([PAGES, ASSETS]);
    for (const key of await caches.keys()) {
      if (key.startsWith('astrohub-') && !keep.has(key)) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(key);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;
  if (url.searchParams.has('_rsc') || request.headers.get('RSC')) return;

  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const res = await fetch(request);
      if (res.ok) (await caches.open(ASSETS)).put(request, res.clone());
      return res;
    })());
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(request);
        if (res.ok && res.type === 'basic') {
          const cache = await caches.open(PAGES);
          await cache.put(url.pathname, res.clone());
          event.waitUntil(trim(PAGES, MAX_PAGES));
        }
        return res;
      } catch {
        return (await caches.match(url.pathname)) || (await caches.match('/offline')) || Response.error();
      }
    })());
  }
});
