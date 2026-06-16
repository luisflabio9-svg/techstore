// ==========================================
// SERVICE WORKER SIMPLE - TechStore
// ==========================================

const CACHE_NAME = 'techstore-v2';

// Archivos a cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalación
self.addEventListener('install', (event) => {
  console.log('SW: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cacheando recursos');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Error en instalación:', error);
      })
  );
});

// Activación
self.addEventListener('activate', (event) => {
  console.log('SW: Activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve cache si existe
        if (response) {
          return response;
        }
        
        // Si no, fetch de red
        return fetch(event.request)
          .then((response) => {
            // Guardar en cache
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Si es navegación, devolver index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Offline');
          });
      })
  );
});

console.log('✅ Service Worker listo!');
