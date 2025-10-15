<template>
  <div>
    <VitePwaManifest />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Banner de Atualização PWA -->
    <!-- <PwaUpdateBanner 
      position="bottom"
      updateTitle="🎉 Nova versão disponível!"
      updateMessage="Atualize agora para obter as últimas melhorias e correções."
    /> -->

    <!-- PWA Install Banner -->
    <!-- <h1>PWA Push Notification - Functioning</h1>
    <button @click="subscribeUser">Ativar Push</button>
    <button @click="sendTest">Enviar Notificação</button>
    <div v-if="showInstallBanner" class="pwa-install-banner">
      <p>Você pode adicionar este app à tela inicial!</p>
      <button @click="promptInstall">Adicionar à tela inicial</button>
      <button @click="subscribeUser">Ativar Push</button>
      <button @click="sendTest">Enviar Notificação</button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from 'nuxt/app';
import { onMounted, ref, computed } from 'vue';
import { usePwaPrompt } from './composables/usePwaPrompt'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
    }
  ]
})

const { isPwaInstallable, promptInstall } = usePwaPrompt()

const showIosPrompt = ref(false)
const showIosBrowserWarning = ref(false)
const isStandalone = ref(false)

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const showInstallBanner = computed(() => {
  return isPwaInstallable.value && !isStandalone.value
})

const subscribeUser = async () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    alert("Navegador não suporta notificações.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Permissão negada!");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      String(useRuntimeConfig().public.VAPID_PUBLIC_KEY)
    )
  });

  console.log("📡 Subscription:", subscription);

  await $fetch("/api/save-subscription", {
    method: "POST",
    body: subscription
  });

  alert("Dispositivo inscrito para notificações!");
};

const sendTest = async () => {
  await $fetch("/api/send-push", {
    method: "POST",
    body: { title: "Hello!", body: "Notificação de teste via PWA 🎉" }
  });
};


onMounted(() => {
  console.log('App component mounted');
  
  if (typeof window !== 'undefined') {
    const ua = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(ua)
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || ((window.navigator as any).standalone === true)

    const isSafari = ua.includes('safari') && !ua.includes('crios') && !ua.includes('fxios')
    const isChrome = ua.includes('crios')
    const isFirefox = ua.includes('fxios')

    if (isIosDevice && !isStandalone.value && isSafari) {
      showIosPrompt.value = true
    }

    if (isIosDevice && (isChrome || isFirefox)) {
      showIosBrowserWarning.value = true
    }
  }
});
</script>
<!-- 
<style scoped>

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

body {
  background-color: red !important;
  box-sizing: border-box;
  margin: 0 !important;
  padding: 0 !important;
}


.pwa-install-banner {
  position: fixed;
  bottom: 200px;
  left: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
}

.pwa-install-banner p {
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.pwa-install-banner button {
  background: white;
  color: #4CAF50;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin: 0 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.pwa-install-banner button:hover {
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .pwa-install-banner {
    left: 10px;
    right: 10px;
    bottom: 10px;
  }
}
</style>

<style>
.pwa-install-banner {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #667eea;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
}

.pwa-install-banner p {
  margin: 0;
  flex: 1;
  font-size: 0.9rem;
}

.pwa-install-banner button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s;
}

.pwa-install-banner button:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style> -->

<style>

body {
  background: linear-gradient(180deg, #49DEFF 0%, #0C4F65 100%);
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

input {
  font-size: 16px !important;
}

.leaflet-routing-container {
  background-color: green !important;
  display: none !important;
  pointer-events: none !important;
}
</style>