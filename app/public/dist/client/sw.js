/* Change this cache name every time you want to force players 
  to invalidate their cache and download all assets again */

const CACHE_NAME = "CACHE v6.8.0.766"

// Cache-first strategy
const cacheFirst = (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return (
        cacheResponse ||
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok && networkResponse.status !== 206) {
            // do not cache errors or partial content
            return caches.open(CACHE_NAME).then((cache) => {
              try {
                cache.put(event.request, networkResponse.clone())
              } catch (err) {
                console.error(err)
                // ignore if could not be cached
              }
              return networkResponse
            })
          }
          return networkResponse
        })
      )
    })
  )
}

async function clearObsoleteCaches() {
  const cachesKeys = await caches.keys()
  return Promise.all(
    cachesKeys
      .filter((key) => key !== CACHE_NAME)
      .map((oldCache) => caches.delete(oldCache))
  )
}

self.addEventListener("fetch", async (event) => {
  const url = event.request.url
  if (
    event.request.method === "GET" &&
    (url.includes("/assets/") || url.includes("/SpriteCollab/"))
  )
    cacheFirst(event)
})

self.addEventListener("install", function () {
  self.skipWaiting() // immediately activates this service worker
})

self.addEventListener("activate", (event) => {
  event.waitUntil(clearObsoleteCaches().then(() => self.clients.claim()))
})

self.addEventListener("message", async (event) => {
  if (event.data && event.data.type === "CACHE_STATUS") {
    const keys = await caches.keys()
    const clients = await self.clients.matchAll()
    clients.forEach((client) => {
      client.postMessage({
        type: "CACHE_STATUS",
        version: CACHE_NAME.replace("CACHE v", ""),
        cached: keys.includes(CACHE_NAME)
      })
    })
  }
})
