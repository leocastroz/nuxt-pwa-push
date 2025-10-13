import { computed } from 'vue'

export const useAuthUser = () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const isLoggedIn = computed(() => !!user.value)

  const profile = computed(() => {
    const u = user.value
    const meta = (u?.user_metadata as any) || {}
    const nameFromEmail = u?.email ? String(u.email).split('@')[0] : undefined
    return {
      id: u?.id || null,
      email: u?.email || null,
      name: meta.name || meta.full_name || nameFromEmail || 'Usuário',
      avatarUrl: meta.avatar_url || meta.picture || '/icons/icon-192x192.png',
      raw: u || null,
    }
  })

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-api-auth-token')
      }
      // Toast unificado no logout
      try {
        useToastify('Logout realizado com sucesso!', {
          autoClose: 2000,
          position: ToastifyOption.POSITION.TOP_RIGHT,
          type: 'success',
        })
      } catch {}
      await navigateTo('/')
    }
  }

  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.getSession()
      return data.session
    } catch (e) {
      return null
    }
  }

  return {
    user,
    isLoggedIn,
    profile,
    logout,
    refreshSession,
  }
}
