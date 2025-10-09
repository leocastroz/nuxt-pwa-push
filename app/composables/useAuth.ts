export const useAuth = () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const { $auth } = useNuxtApp()

  // Estado reativo da sessão
  const isLoggedIn = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // Login com email e senha
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      console.log('✅ Login realizado com sucesso:', data.user?.email)
      
      // Armazenar também no formato antigo para compatibilidade
      if (data.session) {
        const authData = {
          user: data.user,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + (24 * 60 * 60 * 1000)
        }
        
        localStorage.setItem('sb-api-auth-token', JSON.stringify(authData))
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('❌ Erro no login:', error.message)
      return { data: null, error }
    }
  }

  // Login com CPF (mantendo compatibilidade)
  const loginWithCpf = async (cpf: string) => {
    try {
      const cleanedCpf = cpf.replace(/\D/g, '')
      
      // Buscar usuário pelo CPF na tabela personalizada
      const { data: userData, error: userError } = await supabase
        .from('users_sorteio_qrcode')
        .select('email, password')
        .eq('cpf', cleanedCpf)
        .single()

      if (userError) throw new Error('CPF não encontrado')
      if (!userData) throw new Error('CPF não cadastrado')

      // Fazer login com os dados encontrados
      return await login((userData as any).email, (userData as any).password)
    } catch (error: any) {
      console.error('❌ Erro no login com CPF:', error.message)
      return { data: null, error }
    }
  }

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      
      // Limpar dados locais
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-auth-token')
        localStorage.removeItem('sb-api-auth-token')
      }
      
      console.log('👋 Logout realizado com sucesso')
      await navigateTo('/login')
    } catch (error: any) {
      console.error('❌ Erro no logout:', error.message)
    }
  }

  // Verificar se sessão ainda é válida
  const validateSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        user.value = null
        return false
      }
      
      user.value = session.user
      return true
    } catch (error) {
      console.error('❌ Erro ao validar sessão:', error)
      return false
    }
  }

  // Renovar sessão
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) throw error
      
      console.log('🔄 Sessão renovada com sucesso')
      return true
    } catch (error: any) {
      console.error('❌ Erro ao renovar sessão:', error.message)
      return false
    }
  }

  // Dados do usuário formatados
  const userProfile = computed(() => {
    if (!user.value) return null
    
    return {
      id: user.value.id,
      email: user.value.email,
      name: user.value.user_metadata?.name || user.value.email?.split('@')[0],
      avatar: user.value.user_metadata?.avatar_url,
      lastSignIn: user.value.last_sign_in_at,
      createdAt: user.value.created_at
    }
  })

  // Verificar se é PWA
  const isPWA = computed(() => {
    if (typeof window === 'undefined') return false
    
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://')
  })

  return {
    // Estados
    isLoggedIn,
    currentUser,
    userProfile,
    isPWA,
    
    // Métodos
    login,
    loginWithCpf,
    logout,
    validateSession,
    refreshSession
  }
}