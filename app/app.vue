<template>
  <div>
    <VitePwaManifest />
    <NuxtRouteAnnouncer />
    <!-- <NuxtWelcome /> -->
    <!-- <NuxtLayout>
      <NuxtPage />
    </NuxtLayout> -->
    <template>
  <div>
    <h1>PWA Push Notification - Functioning</h1>
    <button @click="subscribeUser">Ativar Push</button>
    <button @click="sendTest">Enviar Notificação</button>

    <div v-if="showInstallBanner" class="pwa-install-banner">
      <p>Você pode adicionar este app à tela inicial!</p>
      <button @click="promptInstall">Adicionar à tela inicial</button>
    </div>

  </div>
</template>



  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from 'nuxt/app';
import { onMounted, ref, computed} from 'vue';
import { usePwaPrompt } from '../composables/usePwaPrompt'

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
  if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch(err => console.error("Erro ao registrar SW:", err));
}

console.log('App mounted ttest aaa new version  2')
  if (typeof window !== 'undefined') {
    const ua = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(ua)
    isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || (window.navigator.standalone === true)

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