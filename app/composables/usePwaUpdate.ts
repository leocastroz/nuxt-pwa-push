import { ref, onMounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

export const usePwaUpdate = () => {
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const updateAvailable = ref(false)

  const {
    needRefresh: _needRefresh,
    offlineReady: _offlineReady,
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      console.log('✅ Service Worker registrado:', swUrl)
      
      // Verifica por atualizações a cada 60 segundos
      if (registration) {
        setInterval(async () => {
          console.log('🔍 Verificando atualizações...')
          try {
            await registration.update()
          } catch (error) {
            console.error('Erro ao verificar atualização:', error)
          }
        }, 60 * 1000) // 60 segundos
      }
    },
    onRegisterError(error) {
      console.error('❌ Erro ao registrar Service Worker:', error)
    },
  })

  // Sincroniza os refs
  const syncRefs = () => {
    needRefresh.value = _needRefresh.value
    offlineReady.value = _offlineReady.value
    updateAvailable.value = _needRefresh.value || _offlineReady.value
  }

  onMounted(() => {
    syncRefs()
  })

  // Atualiza o app (força reload com novo SW)
  const updateApp = async () => {
    console.log('🔄 Atualizando aplicativo...')
    await updateServiceWorker(true)
  }

  // Fecha o banner de atualização
  const closeUpdate = () => {
    needRefresh.value = false
    offlineReady.value = false
    updateAvailable.value = false
  }

  // Verifica manualmente por atualizações
  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        console.log('🔍 Verificando atualizações manualmente...')
        await registration.update()
      }
    }
  }

  return {
    needRefresh,
    offlineReady,
    updateAvailable,
    updateApp,
    closeUpdate,
    checkForUpdates,
  }
}
