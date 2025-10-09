import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const user = useSupabaseUser()
  
  // Configuração do Supabase com persistência de sessão
  const supabase = createClient(
    config.public.supabase.url,
    config.public.supabase.key,
    {
      auth: {
        persistSession: true,
        storageKey: 'sb-auth-token',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        detectSessionInUrl: false,
        flowType: 'pkce'
      }
    }
  )

  // Função para verificar e restaurar sessão
  const restoreSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Erro ao restaurar sessão:', error)
        return null
      }

      if (session) {
        console.log('✅ Sessão restaurada com sucesso:', session.user.email)
        return session
      }

      return null
    } catch (error) {
      console.error('Erro ao verificar sessão:', error)
      return null
    }
  }

  // Função para manter sessão ativa
  const keepSessionAlive = () => {
    if (typeof window === 'undefined') return

    // Verificar sessão a cada 5 minutos
    setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          // Renovar token se necessário (30 minutos antes de expirar)
          const expiresAt = session.expires_at ? session.expires_at * 1000 : 0
          const now = Date.now()
          const thirtyMinutes = 30 * 60 * 1000
          
          if (expiresAt > 0 && expiresAt - now < thirtyMinutes) {
            console.log('🔄 Renovando token de sessão...')
            await supabase.auth.refreshSession()
          }
        }
      } catch (error) {
        console.error('Erro ao manter sessão ativa:', error)
      }
    }, 5 * 60 * 1000) // 5 minutos
  }

  // Listener para mudanças de sessão
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state changed:', event)
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('✅ Usuário logado:', session?.user?.email)
          user.value = session?.user || null
          break
          
        case 'SIGNED_OUT':
          console.log('👋 Usuário deslogado')
          user.value = null
          // Limpar dados locais
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sb-auth-token')
            localStorage.removeItem('sb-api-auth-token')
          }
          break
          
        case 'TOKEN_REFRESHED':
          console.log('🔄 Token renovado')
          user.value = session?.user || null
          break
          
        case 'PASSWORD_RECOVERY':
          console.log('🔑 Recuperação de senha')
          break
      }
    })
  }

  // Apenas no cliente
  if (typeof window !== 'undefined') {
    // Restaurar sessão ao inicializar
    await restoreSession()
    
    // Configurar listeners
    setupAuthListener()
    
    // Manter sessão ativa
    keepSessionAlive()
    
    // Detectar quando PWA volta ao foco
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden) {
        console.log('📱 PWA voltou ao foco, verificando sessão...')
        await restoreSession()
      }
    })
    
    // Detectar quando PWA é instalada
    window.addEventListener('appinstalled', () => {
      console.log('📱 PWA instalado! Sessão será mantida.')
    })
  }

  // Funções utilitárias globais
  return {
    provide: {
      auth: {
        supabase,
        restoreSession,
        isLoggedIn: () => !!user.value,
        getCurrentUser: () => user.value,
        logout: async () => {
          await supabase.auth.signOut()
          await navigateTo('/login')
        }
      }
    }
  }
})