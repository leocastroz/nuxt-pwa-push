import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  if ("serviceWorker" in navigator) {
    // O Workbox será registrado automaticamente pelo @vite-pwa/nuxt
    navigator.serviceWorker.ready.then((registration) => {
      console.log("✅ Service Worker do Workbox pronto!");
      
      // Adiciona listeners para push notifications no service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PUSH_RECEIVED') {
          console.log("📩 Push recebido:", event.data.payload);
          
          const notificationData = event.data.payload;
          
          registration.showNotification(notificationData.title || "Nova mensagem", {
            body: notificationData.body || "Você recebeu uma notificação!",
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: "push-notification",
            requireInteraction: false,
            actions: [
              {
                action: "open",
                title: "Abrir",
                icon: "/favicon.ico"
              }
            ]
          });
        }
      });
    }).catch((error) => {
      console.error("❌ Erro com Service Worker:", error);
    });
  }
});
