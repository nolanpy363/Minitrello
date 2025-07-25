// service-worker.js
self.addEventListener('install', () => {
  console.log('SW: Instalado');
});

self.addEventListener('activate', () => {
  console.log('SW: Activado');
});

// AÑADIMOS ESTE BLOQUE
self.addEventListener('fetch', (event) => {
  // Por ahora, no interceptamos la petición, solo la dejamos pasar.
  // La sola presencia de este listener es a menudo suficiente.
  event.respondWith(fetch(event.request));
});