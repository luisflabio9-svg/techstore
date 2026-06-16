// ==========================================
// SERVICEWORKER PROFESIONAL - Electrónicos Japón
// ==========================================

const CACHE_VERSION = 'v2';
const CACHE_NAME = `electronicos-japon-${CACHE_VERSION}`;
const RUNTIME_CACHE = `electronicos-japon-runtime-${CACHE_VERSION}`;

// Recursos que siempre deben estar en caché (App Shell)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Recursos estáticos que cachearemos por tipo
const STATIC_CACHE_PATTERNS = [
  /\.(js|css)$/,           // JS y CSS
  /\.(png|jpg|jpeg|gif|svg|webp)$/, // Imágenes
  /\.(woff|woff2|ttf|eot)$/, // Fuentes
];

// ==========================================
// INSTALACIÓN - Precache de recursos esenciales
// ==========================================
self.addEventListener('install', (event) => {
  console.log('🔧 SW: Instalando versión', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Precaching recursos esenciales...');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('✅ Precaching completado');
        // Forzar activación inmediata
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Error en precaching:', error);
      })
  );
});

// ==========================================
// ACTIVACIÓN - Limpiar cachés viejas
// ==========================================
self.addEventListener('activate', (event) => {
  console.log('✅ SW: Activado v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Mantener solo los cachés de la versión actual
              return cacheName !== CACHE_NAME && 
                     cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('🗑️ Eliminando caché antigua:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('🎯 SW: Reclamando clientes');
        return self.clients.claim();
      })
  );
});

// ==========================================
// ESTRATEGIAS DE CACHÉ POR TIPO DE RECURSO
// ==========================================

// Determinar si una URL es de desarrollo local
const isLocalDev = (url) => {
  return url.includes('localhost') || 
         url.includes('127.0.0.1') ||
         url.includes('vite');
};

// Cache First (para recursos estáticos)
const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Solo cachear respuestas válidas
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('⚠️ Error fetch (cacheFirst):', request.url);
    throw error;
  }
};

// Network First (para datos que cambian frecuentemente)
const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('⚠️ Offline, usando caché:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
};

// ==========================================
// MANEJO DE FETCH - Interceptar peticiones
// ==========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar peticiones que no sean GET
  if (request.method !== 'GET') return;
  
  // Ignorar APIs externas (Firebase, Google, etc.)
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('firestore') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('google-analytics') ||
      url.hostname.includes('stripe')) {
    return;
  }
  
  // No cachear en desarrollo
  if (isLocalDev(url.hostname)) {
    return;
  }
  
  // Estrategia según el tipo de recurso
  const isStaticResource = STATIC_CACHE_PATTERNS.some(pattern => 
    pattern.test(request.url)
  );
  
  const isHtmlRequest = request.mode === 'navigate' || 
                        request.destination === 'document';
  
  if (isHtmlRequest) {
    // HTML: Network First (para tener siempre la última versión)
    event.respondWith(
      networkFirst(request).catch(() => {
        return caches.match('/index.html');
      })
    );
  } else if (isStaticResource) {
    // CSS, JS, Imágenes: Cache First (cambian poco)
    event.respondWith(cacheFirst(request));
  } else {
    // Otros: Network First con fallback
    event.respondWith(
      networkFirst(request).catch(() => {
        return new Response('Recurso no disponible offline', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
    );
  }
});

// ==========================================
// MANEJO DE MENSAJES (útil para depuración)
// ==========================================
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data === 'CLEAR_CACHES') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => caches.delete(name))
      );
    }).then(() => {
      console.log('🗑️ Todos los cachés limpiados');
    });
  }
  
  if (event.data === 'GET_CACHE_INFO') {
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((name) => 
          caches.open(name).then((cache) => 
            cache.keys().then((keys) => ({
              name,
              itemCount: keys.length,
              urls: keys.map(k => k.url)
            }))
          )
        )
      ).then((info) => {
        console.table(info);
      });
    });
  }
});

// ==========================================
// NOTIFICACIONES PUSH (Opcional - Futuro)
// ==========================================
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nueva actualización disponible',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Electrónicos Japón',
        options
      )
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir nueva ventana
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('🚀 Service Worker de Electrónicos Japón listo!');
