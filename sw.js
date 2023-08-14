// const addResourcesToCache = async (resources) => {
//     const cache = await caches.open('v1');
//     await cache.addAll(resources);
// };

// const putInCache = async (request, response) => {
//     const cache = await caches.open('v1');
//     await cache.put(request, response);
// };

// const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
//     console.log('cacheFirst 1')
//     // First try to get the resource from the cache
//     const responseFromCache = await caches.match(request);
//     if (responseFromCache) {
//         console.log('cacheFirst 2')
//         return responseFromCache;
//     }

//     // Next try to use the preloaded response, if it's there
//     const preloadResponse = await preloadResponsePromise;
//     if (preloadResponse) {
//         console.log('cacheFirst 3')
//         console.info('using preload response', preloadResponse);
//         putInCache(request, preloadResponse.clone());
//         return preloadResponse;
//     }

//     // Next try to get the resource from the network
//     try {
//         console.log('cacheFirst 4')
//         const responseFromNetwork = await fetch(request);
//         // response may be used only once
//         // we need to save clone to put one copy in cache
//         // and serve second one
//         putInCache(request, responseFromNetwork.clone());
//         return responseFromNetwork;
//     } catch (error) {
//         console.log('cacheFirst 5')
//         const fallbackResponse = await caches.match(fallbackUrl);
//         if (fallbackResponse) {
//             console.log('cacheFirst 6')
//             return fallbackResponse;
//         }
//         // when even the fallback response is not available,
//         // there is nothing we can do, but we must always
//         // return a Response object
//         return new Response('Network error happened', {
//             status: 408,
//             headers: { 'Content-Type': 'text/plain' },
//         });
//     }
// };

// const enableNavigationPreload = async () => {
//     if (self.registration.navigationPreload) {
//         // Enable navigation preloads!
//         await self.registration.navigationPreload.enable();
//     }
// };

// self.addEventListener('activate', (event) => {
//     console.log("WORKER: activate event in progress.");
//     event.waitUntil(enableNavigationPreload());
// });

// self.addEventListener('install', (event) => {
//     console.log('install 1')
//     self.skipWaiting();
//     event.waitUntil(
//         addResourcesToCache([
//         'http://localhost/booker/',
//         'http://localhost/booker/index.html',
//         'http://localhost/booker/index.js',
//         'http://localhost/booker/index.css',
//         'http://localhost/booker/fallback.png',
//         ])
//     );
// });

// self.addEventListener('fetch', (event) => {
//     console.log('WORKER: Fetching', event.request);
//     event.respondWith(
//         cacheFirst({
//         request: event.request,
//         preloadResponsePromise: event.preloadResponse,
//         fallbackUrl: 'http://localhost/booker/fallback.png',
//         })
//     );
// });


//////////////////////////////////




// self.addEventListener("install", (event) => {
//     event.waitUntil(
//       caches.open("v1").then((cache) => {
//         return cache.addAll([
//           "./booker/",
//           "./booker/index.html",
//           "./booker/index.js",
//           "./booker/index.css",
//           "./booker/fallback.png",
//         ]);
//       }),
//     );
// });
  
  
// self.addEventListener('fetch', event => {
//     console.log('ok');
//     // event.respondWith(
//     //   cacheFirst({
//     //     request: event.request,
//     //     preloadResponsePromise: event.preloadResponse,
//     //     fallbackUrl: '/booker/fallback.png',
//     //   })
//     // );
//     event.respondWith(caches.match(event.request));
// });



// const CACHE = 'cache-only-v1';
// console.log('1');

// self.addEventListener('install', (event) => {
//     console.log('Установлен');
//     event.waitUntil(
//         caches.open(CACHE).then((cache) => {
//             return cache.addAll([
//                 "/index.html",
//                 "/index.js",
//                 "/index.css",
//                 "/fallback.png",
//             ]);
//         })
//     );
// });

// self.addEventListener('activate', (event) => {
//     console.log('Активирован');
// });

// self.addEventListener('fetch', (event) => {
//     console.log('Происходит запрос на сервер');
//     event.respondWith(fromCache(event.request));
// });


// function fromCache(request) {
//     return caches.open(CACHE).then((cache) =>
//       cache.match(request)
//           .then((matching) => matching || Promise.reject('no-match'))
//     );
// }



// self.addEventListener('install', (event) => {
//     console.log('Установлен');
// });

// self.addEventListener('activate', (event) => {
//     console.log('Активирован');
// });

// self.addEventListener('fetch', (event) => {
//     console.log('Происходит запрос на сервер');
// });