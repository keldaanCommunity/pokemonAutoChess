const CACHE_NAME = 'CACHE_V1';

// Cache-first strategy
const cacheFirst = (event) => {
    event.respondWith(
        caches.match(event.request).then((cacheResponse) => {
            return cacheResponse || fetch(event.request).then((networkResponse) => {
                if(networkResponse.ok && networkResponse.status !== 206){ // do not cache errors or partial content
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse
                    })
                }
                return networkResponse;
            })
        })
    )
}

async function clearObsoleteCaches() {
    const cachesKeys = await caches.keys()
    return Promise.all(
        cachesKeys.filter(key => key !== CACHE_NAME)
            .map(oldCache => caches.delete(oldCache))
    )
}

self.addEventListener('fetch', async (event) => {
    const url = event.request.url
    if (event.request.method === 'GET' && (
           url.includes("/assets/")
        || url.includes("/SpriteCollab/")
        || url.includes("/pokemonAutoChessMusic/")
    )) cacheFirst(event)
});

self.addEventListener('install', function () {
    self.skipWaiting(); // immediately activates this service worker
})

self.addEventListener('activate', event => {
    event.waitUntil(clearObsoleteCaches().then(() => self.clients.claim()));
});