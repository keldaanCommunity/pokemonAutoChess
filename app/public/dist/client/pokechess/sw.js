/* Offline cache service worker */

const CACHE_VERSION = "v1.06"
const EXTENSIONS_SAVED = [".png", ".jpg", ".json", ".mp3", ".ogg", ".wav"]

this.addEventListener('install', (event) => {
    this.skipWaiting();
    event.waitUntil(caches.open(CACHE_VERSION));

    /* Cleanup obsolete caches */
    caches.keys().then(cacheVersions => cacheVersions.filter(v => v !== CACHE_VERSION).forEach(version => {
        console.log(`Cleaning old cache ${version}`)
        caches.delete(version)
    }));
});

/* Cache First Strategy */
this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.match(event.request)
                .then((cachedResponse) => cachedResponse || fetch(event.request.url)
                    .then((fetchedResponse) => {
                        if (fetchedResponse.status === 200 
                        && EXTENSIONS_SAVED.some(ext => event.request.url.endsWith(ext))) {
                            // Store the response in the cache for future calls
                            cache.put(event.request, fetchedResponse.clone());
                        }
                        return fetchedResponse;
                    }))
            )
    );
});