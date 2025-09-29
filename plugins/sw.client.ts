import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(() => {
      console.log("✅ Service Worker registrado!");
    });
  }
});
