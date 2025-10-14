<template>
  <div class="pwa-settings">
    <div class="settings-section">
      <div class="section-header">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m-6-6h6m6 0h-6"></path>
          </svg>
        </div>
        <h3>Atualizações do App</h3>
      </div>
      
      <div class="settings-content">
        <!-- Status da versão -->
        <div class="setting-item">
          <div class="setting-info">
            <label>Versão Atual</label>
            <p class="setting-description">{{ appVersion }}</p>
          </div>
        </div>

        <!-- Status do PWA -->
        <div class="setting-item">
          <div class="setting-info">
            <label>Status do PWA</label>
            <p class="setting-description">
              <span :class="pwaStatusClass">{{ pwaStatusText }}</span>
            </p>
          </div>
        </div>

        <!-- Última verificação -->
        <div class="setting-item">
          <div class="setting-info">
            <label>Última Verificação</label>
            <p class="setting-description">{{ lastCheckTime }}</p>
          </div>
        </div>

        <!-- Botão de verificar atualização -->
        <div class="setting-item">
          <button 
            @click="handleCheckUpdates" 
            :disabled="isChecking"
            class="btn-check-update"
          >
            <svg v-if="isChecking" class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span v-else>🔍</span>
            {{ isChecking ? 'Verificando...' : 'Verificar Atualizações' }}
          </button>
        </div>

        <!-- Info sobre atualizações automáticas -->
        <div class="info-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p>
            O app verifica automaticamente por atualizações a cada minuto quando está aberto.
            Quando uma nova versão estiver disponível, você será notificado.
          </p>
        </div>

        <!-- Estatísticas do Service Worker -->
        <div v-if="showAdvanced" class="advanced-info">
          <h4>Informações Avançadas</h4>
          <ul>
            <li><strong>Service Worker:</strong> {{ swStatus }}</li>
            <li><strong>Cache Storage:</strong> {{ cacheStatus }}</li>
            <li><strong>Modo PWA:</strong> {{ isPWAMode ? 'Sim' : 'Não' }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePwaUpdate } from '~/composables/usePwaUpdate'

const props = defineProps({
  showAdvanced: {
    type: Boolean,
    default: false
  },
  version: {
    type: String,
    default: '1.0.0'
  }
})

const { checkForUpdates, updateAvailable } = usePwaUpdate()

const isChecking = ref(false)
const lastCheckTime = ref('Nunca')
const swStatus = ref('Verificando...')
const cacheStatus = ref('Verificando...')
const isPWAMode = ref(false)

const appVersion = computed(() => props.version)

const pwaStatusClass = computed(() => {
  if (updateAvailable.value) return 'status-update'
  return 'status-ok'
})

const pwaStatusText = computed(() => {
  if (updateAvailable.value) return '🎉 Atualização disponível'
  return '✅ Atualizado'
})

const handleCheckUpdates = async () => {
  isChecking.value = true
  
  try {
    await checkForUpdates()
    lastCheckTime.value = new Date().toLocaleString('pt-BR')
    
    // Aguarda um pouco para mostrar feedback visual
    setTimeout(() => {
      if (!updateAvailable.value) {
        useToastify('Você já está usando a versão mais recente!', {
          autoClose: 2000,
          theme: "light",
          type: 'success',
          position: ToastifyOption.POSITION.TOP_CENTER,
        })
      }
    }, 1000)
  } catch (error) {
    console.error('Erro ao verificar atualizações:', error)
    useToastify('Erro ao verificar atualizações', {
      autoClose: 2000,
      type: 'error',
      position: ToastifyOption.POSITION.TOP_CENTER,
    })
  } finally {
    setTimeout(() => {
      isChecking.value = false
    }, 1500)
  }
}

// Verifica informações do Service Worker
const checkServiceWorkerInfo = async () => {
  // Evita acesso no SSR
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    swStatus.value = '❌ Não suportado'
    cacheStatus.value = '❌ Não suportado'
    return
  }

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      
      if (registration) {
        if (registration.active) {
          swStatus.value = '✅ Ativo'
        } else if (registration.installing) {
          swStatus.value = '⏳ Instalando...'
        } else if (registration.waiting) {
          swStatus.value = '⏸️ Aguardando'
        } else {
          swStatus.value = '❌ Inativo'
        }
      } else {
        swStatus.value = '❌ Não registrado'
      }
    } catch (error) {
      swStatus.value = '❌ Erro'
    }
  } else {
    swStatus.value = '❌ Não suportado'
  }

  // Verifica Cache Storage
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys()
      cacheStatus.value = `✅ ${cacheNames.length} cache(s) ativos`
    } catch (error) {
      cacheStatus.value = '❌ Erro'
    }
  } else {
    cacheStatus.value = '❌ Não suportado'
  }

  // Detecta modo PWA
  isPWAMode.value = 
    (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
    ((window.navigator as any).standalone) ||
    document.referrer.includes('android-app://')
}

onMounted(() => {
  checkServiceWorkerInfo()
  
  // Atualiza info a cada 30 segundos
  const id = setInterval(() => {
    checkServiceWorkerInfo()
  }, 30000)

  onBeforeUnmount(() => clearInterval(id))
})
</script>
<!-- 
<style scoped>
.pwa-settings {
  max-width: 600px;
  margin: 0 auto;
}

.settings-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.section-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.settings-content {
  padding: 20px;
}

.setting-item {
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.setting-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.status-ok {
  color: #4caf50;
  font-weight: 600;
}

.status-update {
  color: #ff9800;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.btn-check-update {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-check-update:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-check-update:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.info-box {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f0f4ff;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  margin-top: 16px;
}

.info-box svg {
  flex-shrink: 0;
  color: #667eea;
  margin-top: 2px;
}

.info-box p {
  margin: 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

.advanced-info {
  margin-top: 20px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.advanced-info h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.advanced-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.advanced-info li {
  padding: 8px 0;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #eee;
}

.advanced-info li:last-child {
  border-bottom: none;
}

.advanced-info strong {
  color: #333;
}
</style> -->
