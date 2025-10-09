/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');

  // Pre-cache important assets
  event.waitUntil(
    caches.open('terraguardian-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/favicon.ico',
        '/logo192.png',
        '/logo512.png',
        // Add other important assets here
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== 'terraguardian-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Handle navigation requests (pages) with network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // For API requests, try network first, fall back to cached data or return error
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // For API calls, we don't cache responses but provide offline feedback
        return new Response(JSON.stringify({ error: 'Offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Listen for message events from the client
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle push notifications (optional)
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  const payload = event.data ? event.data.json() : {};
  
  const options = {
    body: payload.body || 'TerraGuardian Notification',
    icon: '/logo192.png',
    badge: '/favicon.ico',
    tag: payload.tag || 'terraguardian',
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'TerraGuardian', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Open the app when notification is clicked
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

export {};