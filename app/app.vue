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
    <pre>teste - {{ showInstallBanner }}</pre> -->

    <div v-if="false" class="pwa-install-banner">
      <p>Você pode adicionar este app à tela inicial!</p>
      <button @click="promptInstall">Adicionar à tela inicial</button>
    </div>


    <!-- <div v-if="showInstallBanner" class="pwa-install-banner">
      <p>Você pode adicionar este app à tela inicial!</p>
      <button @click="promptInstall">Adicionar à tela inicial</button>
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

.leaflet-container .leaflet-control-attribution {
  display: none;
}

.leaflet-routing-container {
  background-color: green !important;
  display: none !important;
  pointer-events: none !important;
}
</style>