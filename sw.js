const staticCacheName = 'pomo-cache-v1.0';
const filesToCache = [
    '.',
    'index.html',
    'assets/main.css',
    'assets/main.js',
    'https://freesound.org/data/previews/316/316847_4939433-lq.mp3'
];

self.addEventListener('install', event => {
    console.log('Ready to cache');
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('pomo-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then( ada_response => {
            if (ada_response) {
                return ada_response;
            }
            // tidak ada response, ambil ke jaringan
            else {
                return fetch(event.request)
            }
        })
        .catch(error => {
            return new Response("Damn it " + error);
        })
    );
});