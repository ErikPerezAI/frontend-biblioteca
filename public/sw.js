// Service Worker para Biblioteca App PWA (Paso 4, Opción A y Opción B)
const CACHE_NAME = 'biblioteca-v1';
const API_CACHE_NAME = 'api-libros-cache-v1';

// Archivos estáticos y páginas a guardar en caché durante la instalación
const ARCHIVOS_A_GUARDAR = [
  '/',
  '/manifest.json',
  '/offline',
  '/icon-192.png',
  '/icon-512.png',
];

// Evento Install: se descargan y guardan los recursos estáticos iniciales
self.addEventListener('install', (event) => {
  console.log('Service Worker: instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: cacheando archivos iniciales');
      return cache.addAll(ARCHIVOS_A_GUARDAR);
    })
  );
  self.skipWaiting();
});

// Evento Activate: limpieza de cachés obsoletas y control inmediato de clientes
self.addEventListener('activate', (event) => {
  console.log('Service Worker: activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Service Worker: eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento Fetch: intercepción de peticiones
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Opción B: Estrategia Network-First para las peticiones a la API (/api/libros)
  if (url.pathname.includes('/api/libros') && event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la respuesta de red es válida (200), actualizamos la caché de la API
          if (response.status === 200) {
            const copiaResponse = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(event.request, copiaResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Si la red falla (offline o Laravel apagado), servimos la última copia en caché
          console.log('Service Worker: red fallida para API, intentando recuperar de caché');
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(JSON.stringify({ error: 'Sin conexión ni caché disponible' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            });
          });
        })
    );
    return;
  }

  // Opción A: Navegación de páginas HTML con fallback a /offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Paso 4: Recursos estáticos (Cache-First)
  event.respondWith(
    caches.match(event.request).then((respuestaEnCache) => {
      return respuestaEnCache || fetch(event.request);
    })
  );
});
