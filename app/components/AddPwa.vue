<template>
  <Transition name="fade">
    <div v-if="showPrompt" class="install-overlay" @click="closePrompt">
      <div class="install-popup" @click.stop>
        <button class="close-button" @click="closePrompt" aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

         <!-- Android template - original design  -->
        <div v-if="isAndroidDevice" class="popup-content">
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
              <span>Funciona offline</span>
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

          <button class="later-button" @click="remindLater">
            Lembrar mais tarde
          </button>
        </div>

         <!-- iOS template - carousel with step-by-step instructions  -->
        <div v-if="isIOSDevice" class="popup-content ios-content">
          <h2 class="popup-title">Instale o App</h2>
          <p class="popup-description">
            Siga os passos abaixo para adicionar <strong>To De Carona</strong> à sua tela inicial
          </p>

          <div class="carousel-container">
            <div class="carousel-track" :style="{ transform: `translateX(-${currentStep * 100}%)` }">
               Step 1 
              <div class="carousel-slide">
                <div class="step-number">Passo 1</div>
                <div class="step-illustration">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <rect x="20" y="10" width="80" height="100" rx="12" fill="#f0f0f0" stroke="#2196F3" stroke-width="2"/>
                    <rect x="45" y="95" width="30" height="3" rx="1.5" fill="#666"/>
                    <circle cx="60" cy="60" r="25" fill="#2196F3" opacity="0.1"/>
                    <path d="M60 45 L60 55 M50 50 L60 55 L70 50" stroke="#2196F3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="48" y="62" width="24" height="3" rx="1.5" fill="#2196F3"/>
                  </svg>
                </div>
                <h3 class="step-title">Toque no botão Compartilhar</h3>
                <p class="step-description">
                  Na barra inferior do Safari, toque no ícone de compartilhar 
                  <span class="ios-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                  </span>
                </p>
              </div>

               Step 2 
              <div class="carousel-slide">
                <div class="step-number">Passo 2</div>
                <div class="step-illustration">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <rect x="20" y="10" width="80" height="100" rx="12" fill="#f0f0f0" stroke="#2196F3" stroke-width="2"/>
                    <rect x="45" y="95" width="30" height="3" rx="1.5" fill="#666"/>
                    <rect x="25" y="20" width="70" height="12" rx="2" fill="#e0e0e0"/>
                    <rect x="25" y="36" width="70" height="12" rx="2" fill="#e0e0e0"/>
                    <rect x="25" y="52" width="70" height="12" rx="2" fill="#2196F3" opacity="0.3"/>
                    <circle cx="32" cy="58" r="4" fill="#2196F3"/>
                    <path d="M30 58 L32 60 L35 56" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <text x="42" y="60" font-size="6" fill="#2196F3" font-weight="600">Adicionar à Tela Inicial</text>
                  </svg>
                </div>
                <h3 class="step-title">Selecione "Adicionar à Tela Inicial"</h3>
                <p class="step-description">
                  Role o menu e encontre a opção "Adicionar à Tela Inicial" 
                  <span class="ios-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                  </span>
                </p>
              </div>

               Step 3 
              <div class="carousel-slide">
                <div class="step-number">Passo 3</div>
                <div class="step-illustration">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <rect x="20" y="10" width="80" height="100" rx="12" fill="#f0f0f0" stroke="#2196F3" stroke-width="2"/>
                    <rect x="45" y="95" width="30" height="3" rx="1.5" fill="#666"/>
                    <circle cx="60" cy="40" r="18" fill="#2196F3"/>
                    <path d="M54 40 L58 44 L68 34" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <text x="60" y="70" font-size="8" fill="#333" text-anchor="middle" font-weight="600">To De Carona</text>
                    <rect x="35" y="85" width="50" height="10" rx="5" fill="#2196F3"/>
                    <text x="60" y="92" font-size="6" fill="white" text-anchor="middle" font-weight="600">Adicionar</text>
                  </svg>
                </div>
                <h3 class="step-title">Confirme a instalação</h3>
                <p class="step-description">
                  Toque em "Adicionar" no canto superior direito para finalizar. O app aparecerá na sua tela inicial!
                </p>
              </div>
            </div>

             Carousel Navigation 
            <div class="carousel-nav">
              <button 
                class="nav-arrow nav-prev" 
                @click="prevStep" 
                :disabled="currentStep === 0"
                aria-label="Passo anterior"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <div class="carousel-dots">
                <button
                  v-for="step in 3"
                  :key="step"
                  class="dot"
                  :class="{ active: currentStep === step - 1 }"
                  @click="goToStep(step - 1)"
                  :aria-label="`Ir para passo ${step}`"
                ></button>
              </div>

              <button 
                class="nav-arrow nav-next" 
                @click="nextStep" 
                :disabled="currentStep === 2"
                aria-label="Próximo passo"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <button class="later-button" @click="remindLater">
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showPrompt = ref(false)
const deferredPrompt = ref<any>(null)
const isAndroidDevice = ref(false)
const isIOSDevice = ref(false)
const currentStep = ref(0)

const isAndroid = () => {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent.toLowerCase()
  return /android/.test(ua)
}

const isIOS = () => {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(ua)
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

const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const goToStep = (step: number) => {
  currentStep.value = step
}

onMounted(() => {
  isAndroidDevice.value = isAndroid()
  isIOSDevice.value = isIOS()

  // Verificar se deve mostrar o prompt
  if ((!isAndroidDevice.value && !isIOSDevice.value) || isStandalone() || hasBeenDismissed()) {
    return
  }

  // Para Android: capturar o evento beforeinstallprompt
  if (isAndroidDevice.value) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      
      setTimeout(() => {
        showPrompt.value = true
      }, 3000)
    })

    setTimeout(() => {
      if (!deferredPrompt.value && !showPrompt.value) {
        showPrompt.value = true
      }
    }, 5000)
  }

  // Para iOS: mostrar após 3 segundos
  if (isIOSDevice.value) {
    setTimeout(() => {
      showPrompt.value = true
    }, 3000)
  }
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
  z-index: 10;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

.popup-content {
  padding: 40px 32px 32px;
  text-align: center;
}

/* iOS specific content styling */
.ios-content {
  padding: 40px 24px 24px;
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

/* Carousel styles for iOS */
.carousel-container {
  margin-bottom: 24px;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  padding: 0 8px;
}

.step-number {
  display: inline-block;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.step-illustration {
  margin: 0 auto 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.step-description {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
}

.ios-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 4px;
  color: #2196F3;
}

.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.nav-arrow {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.nav-arrow:hover:not(:disabled) {
  border-color: #2196F3;
  color: #2196F3;
  transform: scale(1.05);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d0d0d0;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot.active {
  background: #2196F3;
  width: 24px;
  border-radius: 4px;
}

.dot:hover {
  background: #2196F3;
  opacity: 0.7;
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

  .ios-content {
    padding: 32px 20px 20px;
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

  .step-title {
    font-size: 18px;
  }

  .step-description {
    font-size: 14px;
  }

  .step-illustration svg {
    width: 100px;
    height: 100px;
  }
}
</style>
