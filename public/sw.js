// self.addEventListener("push", event => {
//   const data = event.data.json();

//   event.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.body,
//       icon: "/icon.png"
//     })
//   );
// });

// self.addEventListener("notificationclick", event => {
//   event.notification.close();
//   event.waitUntil(clients.openWindow("/"));
// });


self.addEventListener("push", (event) => {
  console.log("📩 Push recebido:", event.data?.text());
  
  let notificationData;
  try {
    // Tenta parsear os dados JSON
    notificationData = event.data?.json() || {};
    console.log("📦 Dados parseados:", notificationData);
  } catch (error) {
    console.error("❌ Erro ao parsear dados:", error);
    notificationData = {
      title: "Nova mensagem",
      body: "Você recebeu uma notificação!"
    };
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title || "Nova mensagem", {
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
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notificação clicada:", event.action);
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Se já há uma aba aberta, foca nela
      for (const client of clientList) {
        if (client.url === self.location.origin + "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Se não há aba aberta, abre uma nova
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});