// ✅ correto em Nuxt 3 (ESM)
import webpush from "web-push";
import { subscriptions } from "./save-subscription.post";

// Verificar se as VAPID keys estão configuradas
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  throw new Error("VAPID keys não configuradas! Configure VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY nas variáveis de ambiente.");
}

webpush.setVapidDetails(
  "mailto:seuemail@dominio.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, JSON.stringify({
        title: "Hello!",
        body: "Notificação de teste via PWA 🎉"
      }));
    } catch (err) {
      console.error("Erro ao enviar push:", err);
    }
  }

  return { success: true };
});
