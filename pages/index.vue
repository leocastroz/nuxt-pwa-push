<template>
  <div style="padding: 20px;">
    <h1>PWA Push Notification</h1>
    
    <div style="margin: 20px 0;">
      <h2>Status das Permissões:</h2>
      <p><strong>Notificações:</strong> {{ notificationStatus }}</p>
      <p><strong>Service Worker:</strong> {{ swStatus }}</p>
      <p><strong>Push Manager:</strong> {{ pushStatus }}</p>
    </div>

    <div style="margin: 20px 0;">
      <button @click="checkPermissions" style="margin-right: 10px;">
        Verificar Permissões
      </button>
      <button @click="subscribeUser" style="margin-right: 10px;">
        Ativar Push
      </button>
      <button @click="sendTest" style="margin-right: 10px;">
        Enviar Notificação
      </button>
      <button @click="testLocalNotification">
        Teste Local
      </button>
    </div>

    <div v-if="logs.length > 0" style="margin: 20px 0;">
      <h3>Logs:</h3>
      <div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">
        <div v-for="(log, index) in logs" :key="index" style="margin: 5px 0;">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from 'nuxt/app';
import { ref, onMounted } from 'vue';

// Estados reativos
const notificationStatus = ref('Verificando...');
const swStatus = ref('Verificando...');
const pushStatus = ref('Verificando...');
const logs = ref<string[]>([]);

// Função para adicionar logs
const addLog = (message: string) => {
  logs.value.push(`${new Date().toLocaleTimeString()}: ${message}`);
  console.log(message);
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

// Verificar permissões e status
const checkPermissions = async () => {
  addLog('🔍 Verificando permissões...');
  
  // Verificar suporte a notificações
  if (!("Notification" in window)) {
    notificationStatus.value = "❌ Não suportado";
    addLog('❌ Notificações não suportadas');
  } else {
    notificationStatus.value = `📱 ${Notification.permission}`;
    addLog(`📱 Status de notificações: ${Notification.permission}`);
  }

  // Verificar Service Worker
  if (!("serviceWorker" in navigator)) {
    swStatus.value = "❌ Não suportado";
    addLog('❌ Service Worker não suportado');
  } else {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      swStatus.value = registration ? "✅ Registrado" : "❌ Não registrado";
      addLog(`🔧 Service Worker: ${registration ? 'registrado' : 'não registrado'}`);
    } catch (error) {
      swStatus.value = "❌ Erro";
      addLog(`❌ Erro no Service Worker: ${error}`);
    }
  }

  // Verificar Push Manager
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    pushStatus.value = "❌ Não suportado";
    addLog('❌ Push Manager não suportado');
  } else {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      pushStatus.value = subscription ? "✅ Inscrito" : "⚠️ Não inscrito";
      addLog(`📡 Push: ${subscription ? 'inscrito' : 'não inscrito'}`);
    } catch (error) {
      pushStatus.value = "❌ Erro";
      addLog(`❌ Erro no Push Manager: ${error}`);
    }
  }
};

// Testar notificação local
const testLocalNotification = async () => {
  addLog('🧪 Testando notificação local...');
  
  if (!("Notification" in window)) {
    addLog('❌ Notificações não suportadas');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    addLog('❌ Permissão negada para notificações');
    return;
  }

  new Notification("Teste Local! 🎉", {
    body: "Esta é uma notificação de teste local",
    icon: "/favicon.ico"
  });
  
  addLog('✅ Notificação local enviada');
};

const subscribeUser = async () => {
  addLog('📝 Iniciando inscrição...');
  
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    addLog('❌ Navegador não suporta notificações');
    alert("Navegador não suporta notificações.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    addLog('❌ Permissão negada pelo usuário');
    alert("Permissão negada!");
    return;
  }

  addLog('✅ Permissão concedida');

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        String(useRuntimeConfig().public.VAPID_PUBLIC_KEY)
      )
    });

    addLog('📡 Inscrição criada com sucesso');
    console.log("📡 Subscription:", subscription);

    await $fetch("/api/save-subscription", {
      method: "POST",
      body: subscription
    });

    addLog('💾 Inscrição salva no servidor');
    alert("Dispositivo inscrito para notificações!");
    
    // Atualizar status
    await checkPermissions();
  } catch (error) {
    addLog(`❌ Erro na inscrição: ${error}`);
    console.error("Erro na inscrição:", error);
  }
};

const sendTest = async () => {
  addLog('📤 Enviando notificação de teste...');
  
  try {
    await $fetch("/api/send-push", {
      method: "POST",
      body: { title: "Hello!", body: "Notificação de teste via PWA 🎉" }
    });
    
    addLog('✅ Notificação enviada pelo servidor');
  } catch (error) {
    addLog(`❌ Erro ao enviar: ${error}`);
    console.error("Erro ao enviar:", error);
  }
};

// Verificar permissões quando a página carrega
onMounted(() => {
  checkPermissions();
});
</script>
