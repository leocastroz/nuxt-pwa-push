// public/service-worker.js
self.addEventListener("push", (event) => {
  console.log("📩 Push recebido:", event.data?.text()); // debug
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || "Nova mensagem", {
      body: data.body || "Você recebeu uma notificação!",
      icon: "/icon.png", // opcional
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // abre o app quando clica
  );
});

