<template>
  <!-- Banner de Atualização Disponível -->
  <Transition name="slide-up">
    <div v-if="updateAvailable" class="pwa-update-banner" :class="bannerPosition">
      <div class="update-content">
        <div class="update-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </div>
        
        <div class="update-text">
          <h3 v-if="needRefresh">{{ updateTitle }}</h3>
          <h3 v-else-if="offlineReady">{{ offlineTitle }}</h3>
          <p>{{ updateMessage }}</p>
        </div>
        
        <div class="update-actions">
          <button @click="updateApp" class="btn-update">
            {{ updateButtonText }}
          </button>
          <button @click="closeUpdate" class="btn-close" :aria-label="closeButtonText">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Barra de progresso visual -->
      <div v-if="showProgress" class="update-progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePwaUpdate } from '~/composables/usePwaUpdate'

const props = defineProps({
  position: {
    type: String,
    default: 'bottom', // 'top', 'bottom'
    validator: (value: string) => ['top', 'bottom'].includes(value)
  },
  updateTitle: {
    type: String,
    default: '🎉 Nova versão disponível!'
  },
  offlineTitle: {
    type: String,
    default: '✅ App pronto para uso offline'
  },
  updateMessage: {
    type: String,
    default: 'Clique em atualizar para obter as últimas melhorias.'
  },
  updateButtonText: {
    type: String,
    default: 'Atualizar Agora'
  },
  closeButtonText: {
    type: String,
    default: 'Fechar'
  },
  autoUpdateDelay: {
    type: Number,
    default: 0 // Se > 0, atualiza automaticamente após X segundos
  }
})

const { needRefresh, offlineReady, updateAvailable, updateApp, closeUpdate } = usePwaUpdate()

const showProgress = ref(false)
const progress = ref(0)

const bannerPosition = computed(() => {
  return props.position === 'top' ? 'banner-top' : 'banner-bottom'
})

// Auto-update após delay (se configurado)
let autoUpdateTimer: NodeJS.Timeout | null = null

watch(updateAvailable, (available) => {
  if (available && props.autoUpdateDelay > 0) {
    showProgress.value = true
    progress.value = 0
    
    const interval = 100 // Atualiza a cada 100ms
    const steps = (props.autoUpdateDelay * 1000) / interval
    let currentStep = 0
    
    const progressTimer = setInterval(() => {
      currentStep++
      progress.value = (currentStep / steps) * 100
      
      if (currentStep >= steps) {
        clearInterval(progressTimer)
        showProgress.value = false
      }
    }, interval)
    
    autoUpdateTimer = setTimeout(() => {
      console.log('⏰ Auto-update disparado')
      updateApp()
    }, props.autoUpdateDelay * 1000)
  }
})

// Limpa timer se usuário clicar em fechar
const handleClose = () => {
  if (autoUpdateTimer) {
    clearTimeout(autoUpdateTimer)
    autoUpdateTimer = null
  }
  showProgress.value = false
  progress.value = 0
  closeUpdate()
}
</script>
<!-- 
<style scoped>
.pwa-update-banner {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.5s ease-out;
}

.banner-top {
  top: 0;
}

.banner-bottom {
  bottom: 0;
}

.update-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
}

.update-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: rotate 2s linear infinite;
}

.update-icon svg {
  color: white;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.update-text {
  flex: 1;
}

.update-text h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.update-text p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.update-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-update {
  background: white;
  color: #667eea;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-update:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-update:active {
  transform: translateY(0);
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-close svg {
  color: white;
}

.update-progress {
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: white;
  transition: width 0.1s linear;
}

/* Animações */
.slide-up-enter-active {
  animation: slideUp 0.5s ease-out;
}

.slide-up-leave-active {
  animation: slideDown 0.5s ease-in;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* Responsivo */
@media (max-width: 768px) {
  .update-content {
    flex-wrap: wrap;
    padding: 12px 16px;
    gap: 12px;
  }

  .update-icon {
    width: 40px;
    height: 40px;
  }

  .update-text h3 {
    font-size: 16px;
  }

  .update-text p {
    font-size: 13px;
  }

  .update-actions {
    width: 100%;
    justify-content: space-between;
  }

  .btn-update {
    flex: 1;
  }
}
</style> -->
