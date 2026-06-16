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
  '/robots.txt'
];

// Recursos estáticos que cachearemos por tipo
const STATIC_CACHE_PATTERNS = [
  /\.(js|css)$/,
  /\.(png|jpg|jpeg|gif|svg|webp|ico)$/,
  /\.(woff|woff2|ttf|eot)$/,
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
        return Promise.allSettled(
          PRECACHE_URLS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`⚠️ No se pudo cachear: ${url}`, err);
            })
          )
        );
      })
      .then(() => {
        console.log('✅ Precaching completado');
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
// ESTRATEGIAS DE CACHÉ
// ==========================================

const isLocalDev = (url) => {
  return url.includes('localhost') || 
         url.includes('127.0.0.1') ||
         url.includes('vite');
};

const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('⚠️ Error fetch:', request.url);
    throw error;
  }
};

const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    
    throw error;
  }
};

// Página offline bonita
const getOfflinePage = () => {
  return new Response(
    `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sin conexión - TechStore</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: system-ui, sans-serif;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
        }
        .container {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          max-width: 500px;
        }
        .emoji { font-size: 5rem; margin-bottom: 1.5rem; }
        h1 { font-size: 2rem; margin-bottom: 1rem; }
        p { font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9; line-height: 1.6; }
        button {
          background: white;
          color: #f97316;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        button:hover { transform: scale(1.05); }
        button:active { transform: scale(0.95); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="emoji">📡</div>
        <h1>¡Sin conexión!</h1>
        <p>Parece que no tienes internet. Puedes seguir viendo los productos que ya visitaste.</p>
        <button onclick="location.reload()">🔄 Reintentar</button>
      </div>
    </body>
    </html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    }
  );
};

// ==========================================
// MANEJO DE FETCH
// ==========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (request.method !== 'GET') return;
  
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('firestore') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('google-analytics') ||
      url.hostname.includes('stripe') ||
      url.hostname.includes('supabase')) {
    return;
  }
  
  if (isLocalDev(url.hostname)) return;
  
  const isStaticResource = STATIC_CACHE_PATTERNS.some(pattern => 
    pattern.test(request.url)
  );
  
  const isHtmlRequest = request.mode === 'navigate' || 
                        request.destination === 'document';
  
  if (isHtmlRequest) {
    event.respondWith(
      networkFirst(request).catch(() => getOfflinePage())
    );
  } else if (isStaticResource) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(
      networkFirst(request).catch(() => 
        new Response('Sin conexión', { status: 503 })
      )
    );
  }
});

// ==========================================
// MENSAJES DE DEPURACIÓN
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
// NOTIFICACIONES PUSH
// ==========================================
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'Nueva actualización disponible',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        data: { url: data.url || '/' }
      };
      
      event.waitUntil(
        self.registration.showNotification(
          data.title || 'Electrónicos Japón',
          options
        )
      );
    } catch (error) {
      console.error('Error en notificación:', error);
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('🚀 Service Worker de Electrónicos Japón listo!');
