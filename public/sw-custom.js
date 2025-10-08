// Service Worker personalizado que integra com Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Verifica se o Workbox está disponível
if (workbox) {
  console.log('✅ Workbox carregado');
  
  // Configura o Workbox
  workbox.setConfig({
    debug: false
  });

  // Precaching será feito automaticamente pelo @vite-pwa/nuxt
  workbox.precaching.precacheAndRoute([]);

  // Estratégia de cache para navegação
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        {
          cacheKeyWillBeUsed: async ({ request }) => {
            return `${request.url}?v=${Date.now()}`;
          },
        },
      ],
    })
  );

  // Estratégia de cache para assets estáticos
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // Estratégia de cache para imagens
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        {
          cacheKeyWillBeUsed: async ({ request }) => {
            return `${request.url}?v=${Date.now()}`;
          },
        },
      ],
    })
  );

  // Push notifications
  self.addEventListener('push', (event) => {
    console.log('📩 Push recebido:', event.data?.text());
    
    let notificationData;
    try {
      notificationData = event.data?.json() || {};
      console.log('📦 Dados parseados:', notificationData);
    } catch (error) {
      console.error('❌ Erro ao parsear dados:', error);
      notificationData = {
        title: 'Nova mensagem',
        body: 'Você recebeu uma notificação!'
      };
    }

    const options = {
      body: notificationData.body || 'Você recebeu uma notificação!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'push-notification',
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/favicon.ico'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(
        notificationData.title || 'Nova mensagem',
        options
      )
    );
  });

  // Click na notificação
  self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notificação clicada:', event.action);
    event.notification.close();
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Se já há uma aba aberta, foca nela
        for (const client of clientList) {
          if (client.url === self.location.origin + '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Se não há aba aberta, abre uma nova
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  });

} else {
  console.log('❌ Workbox não carregado');
}
