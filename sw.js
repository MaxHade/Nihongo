const CACHE_VERSION = 'nihongo-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/flashcard.js',
  '/js/speech.js',
  '/js/stats.js',
  '/js/storage.js',
  '/data/hiragana.js',
  '/data/katakana.js',
  '/data/dates.js',
  '/data/times.js',
  '/data/numbers.js',
  '/data/vocabulary.js',
  '/data/particles.js',
  '/data/greetings.js',
  '/data/lessons.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png'
];

// Install: Cache all app files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
