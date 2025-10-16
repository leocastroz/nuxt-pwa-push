<!-- <template>
    <div v-if="true" class="pwa-install-banner">
      <p>Você pode adicionar este app à tela inicial!</p>
      <button @click="promptInstall">Adicionar à tela inicial</button>
    </div>
</template>

<script setup lang="ts">
import { usePwaPrompt } from '../composables/usePwaPrompt'
import { ref, computed, onMounted } from 'vue';

const { isPwaInstallable, promptInstall } = usePwaPrompt();
const isStandalone = ref(false);
const showIosBrowserWarning = ref(false);
const showIosPrompt = ref(false)

const showInstallBanner = computed(() => {
  return isPwaInstallable.value && !isStandalone.value
})

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

<style scoped>

.pwa-install-banner {
    position: fixed;
    top: 0;
    left: 0;
    width: -webkit-fill-available;
    background: #2196f37a;
    height: -webkit-fill-available;
    z-index: 9;
}
</style> -->


<template>
  <Transition name="fade">
    <div v-if="showPrompt" class="install-overlay" @click="closePrompt">
      <div class="install-popup" @click.stop>
        <!-- <button class="close-button" @click="closePrompt" aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button> -->

        <div class="popup-content">
          <div class="icon-container">
            <svg class="install-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>

          <h2 class="popup-title">Instale o App</h2>
          <p class="popup-description">
            Adicione o <strong>To De Carona</strong> à sua tela inicial para acesso rápido e uma experiência completa!
          </p>

          <div class="benefits">
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Acesso instantâneo</span>
            </div>
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Otimização e Performance</span>
            </div>
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Autenticação sempre mantida</span>
            </div>
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Notificações em tempo real</span>
            </div>
          </div>

          <button class="install-button" @click="handleInstall">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Instalar Agora
          </button>
<!-- 
          <button class="later-button" @click="remindLater">
            Lembrar mais tarde
          </button> -->
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const { isPwaInstallable, promptInstall } = usePwaPrompt()
const showIosPrompt = ref(false)
const showIosBrowserWarning = ref(false)
// const isStandalone = ref(false)

const showPrompt = ref(false)
const deferredPrompt = ref<any>(null)

const isAndroid = () => {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent.toLowerCase()
  return /android/.test(ua)
}

const isStandalone = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true
}

const hasBeenDismissed = () => {
  if (typeof localStorage === 'undefined') return false
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (!dismissed) return false
  
  const dismissedTime = parseInt(dismissed)
  const threeDays = 3 * 24 * 60 * 60 * 1000
  return Date.now() - dismissedTime < threeDays
}

const handleInstall = async () => {
  if (!deferredPrompt.value) {
    // Fallback: mostrar instruções manuais
    alert('Para instalar: toque no menu (⋮) e selecione "Adicionar à tela inicial"')
    closePrompt()
    return
  }

  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  
  if (outcome === 'accepted') {
    console.log('PWA instalado com sucesso')
  }
  
  deferredPrompt.value = null
  closePrompt()
}

const closePrompt = () => {
  showPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

const remindLater = () => {
  closePrompt()
}

onMounted(() => {
  // Verificar se deve mostrar o prompt
  if (!isAndroid() || isStandalone() || hasBeenDismissed()) {
    return
  }

  // Capturar o evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    
    // Mostrar o prompt após 3 segundos
    setTimeout(() => {
      showPrompt.value = true
    }, 3000)
  })

  // Se o evento não disparar, mostrar mesmo assim após 5 segundos
  setTimeout(() => {
    if (!deferredPrompt.value && !showPrompt.value) {
      showPrompt.value = true
    }
  }, 5000)
})
</script>

<style scoped>
.install-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.install-popup {
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  border-radius: 24px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

.popup-content {
  padding: 40px 32px 32px;
  text-align: center;
}

.icon-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.3);
}

.install-icon {
  color: white;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.popup-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.popup-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 28px 0;
}

.popup-description strong {
  color: #2196F3;
  font-weight: 600;
}

.benefits {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: #333;
  font-size: 15px;
}

.benefit-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.benefit-item svg {
  color: #4CAF50;
  flex-shrink: 0;
}

.install-button {
  width: 100%;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}

.install-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}

.install-button:active {
  transform: translateY(0);
}

.later-button {
  width: 100%;
  background: transparent;
  color: #666;
  border: none;
  padding: 12px;
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.later-button:hover {
  color: #2196F3;
}

/* Animação de fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 480px) {
  .install-popup {
    border-radius: 20px;
    max-width: 100%;
  }

  .popup-content {
    padding: 32px 24px 24px;
  }

  .popup-title {
    font-size: 24px;
  }

  .popup-description {
    font-size: 15px;
  }

  .icon-container {
    width: 70px;
    height: 70px;
  }

  .install-icon {
    width: 56px;
    height: 56px;
  }
}
</style>
