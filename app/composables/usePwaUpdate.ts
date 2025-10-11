import { ref, onMounted, watchEffect } from 'vue'

export const usePwaUpdate = () => {
  // Estados expostos
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const updateAvailable = ref(false)

  // Função de atualização (no-op no SSR)
  let _updateServiceWorker: (reloadPage?: boolean) => Promise<void> = async () => {}

  // Inicializa somente no client para evitar acessar navigator no SSR
  onMounted(async () => {
    if (import.meta.client) {
      try {
        const { useRegisterSW } = await import('virtual:pwa-register/vue')

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

        // Guarda função para uso externo
        _updateServiceWorker = updateServiceWorker

        // Sincroniza refs reativos
        watchEffect(() => {
          needRefresh.value = _needRefresh.value
          offlineReady.value = _offlineReady.value
          updateAvailable.value = _needRefresh.value || _offlineReady.value
        })
      } catch (err) {
        console.error('❌ Falha ao inicializar PWA updates:', err)
      }
    }
  })

  // Atualiza o app (força reload com novo SW)
  const updateApp = async () => {
    console.log('🔄 Atualizando aplicativo...')
    await _updateServiceWorker(true)
  }

  // Fecha o banner de atualização
  const closeUpdate = () => {
    needRefresh.value = false
    offlineReady.value = false
    updateAvailable.value = false
  }

  // Verifica manualmente por atualizações (somente client)
  const checkForUpdates = async () => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
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
