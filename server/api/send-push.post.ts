// ✅ correto em Nuxt 3 (ESM)
import webpush from "web-push";
import { subscriptions } from "./save-subscription.post";

webpush.setVapidDetails(
  "mailto:seuemail@dominio.com",
  process.env.VAPID_PUBLIC_KEY || "BLz7pBTNqqVbrsgmFtER4l7tdlhExuTRny2NXzJND6lCM6QVg5t1vm6SPa9O6apy1XqJ835WBZ8q2horM7VE2TA",
  process.env.VAPID_PRIVATE_KEY || "W0A7sEPcMd0D2hyGHjAeI2bnx9f44C76j7rBV4fbYhw"
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
