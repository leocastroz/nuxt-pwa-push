// composables/usePwaPrompt.ts
import { ref, onMounted } from 'vue'

export const usePwaPrompt = () => {
  const deferredPrompt = ref<Event | null>(null)
  const isPwaInstallable = ref(false)

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      isPwaInstallable.value = true
    })
  })

  const promptInstall = async () => {
    if (deferredPrompt.value) {
      const promptEvent = deferredPrompt.value as any
      promptEvent.prompt()
      const choiceResult = await promptEvent.userChoice
      console.log('Usuário escolheu:', choiceResult.outcome)
      deferredPrompt.value = null
      isPwaInstallable.value = false
    }
  }

  return {
    isPwaInstallable,
    promptInstall,
  }
}
