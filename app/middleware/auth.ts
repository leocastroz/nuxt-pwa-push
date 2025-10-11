export default defineNuxtRouteMiddleware(async (to) => {
  // Execute somente no client
  if (process.server) return

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const routeByRole = (role?: string) => (role === 'admin' ? '/dashboard' : '/cliente')

  let isAuthenticated = false
  let role: string | undefined

  // 1) Tenta via estado reativo do Nuxt/Supabase
  if (user.value) {
    isAuthenticated = true
    role = (user.value.user_metadata as any)?.role
  } else {
    // 2) Tenta hidratar sessão do Supabase
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        isAuthenticated = true
        role = (data.session.user?.user_metadata as any)?.role
      }
    } catch (e) {
      console.warn('auth middleware: getSession falhou', e)
    }

    // 3) Fallback: espelho no localStorage
    if (!isAuthenticated && typeof window !== 'undefined') {
      const raw = localStorage.getItem('sb-api-auth-token')
      try {
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed?.access_token && parsed?.user) {
            isAuthenticated = true
            role = parsed.user?.user_metadata?.role
          }
        }
      } catch (e) {
        localStorage.removeItem('sb-api-auth-token')
      }
    }
  }

  // 4) Sem sessão: redireciona para login (evita loop na própria página de login)
  if (!isAuthenticated) {
    if (to.path !== '/login') return navigateTo('/login')
    return
  }

  // 5) Com sessão: se estiver em '/' ou '/login', envia para rota por role
  if (to.path === '/' || to.path === '/login') {
    return navigateTo(routeByRole(role))
  }

  // 6) (Opcional) Enforce de seção por role
  // Admin não deve ficar nas rotas do cliente, e vice-versa — ajuste conforme necessidade
  if (to.path.startsWith('/dashboard') && role !== 'admin') {
    return navigateTo('/cliente')
  }
  if (to.path.startsWith('/cliente') && role === 'admin') {
    return navigateTo('/dashboard')
  }
})
