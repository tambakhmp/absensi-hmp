var CACHE = 'absensi-hmp-v2';
// Tambahkan /app.html ke dalam daftar aset agar tersimpan di memori HP
var ASSETS = [
  '/', 
  '/index.html', 
  '/app.html', 
  '/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { 
      return c.addAll(ASSETS); 
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Biarkan permintaan ke Google Script tetap online agar data absensi sinkron
  if (e.request.url.indexOf('script.google.com') >= 0) return;

  e.respondWith(
    caches.match(e.request).then(function(c) {
      return c || fetch(e.request).catch(function() { 
        return c; 
      });
    })
  );
});
