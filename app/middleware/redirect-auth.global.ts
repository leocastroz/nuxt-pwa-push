export default defineNuxtRouteMiddleware(async (to) => {
  // Evita SSR acessar window/localStorage desnecessariamente
  if (process.server) return

  // Só age nas rotas públicas iniciais
  // const publicEntrypoints = ['/', '/login']
  const publicEntrypoints = ['/', '/']
  if (!publicEntrypoints.includes(to.path)) return

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Helper para decidir rota pelo role
  const routeByRole = (role?: string) => (role === 'admin' ? '/dashboard' : '/cliente')

  // Já autenticado via estado reativo?
  if (user.value) {
    const role = (user.value.user_metadata as any)?.role
    return navigateTo(routeByRole(role))
  }

  // Tenta hidratar sessão do Supabase
  try {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      const role = (data.session.user?.user_metadata as any)?.role
      return navigateTo(routeByRole(role))
    }
  } catch {
    // ignora
  }

  // Fallback final: checa espelho local (mantido pelo plugin)
  const raw = localStorage.getItem('sb-api-auth-token')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.access_token && parsed?.user) {
        const role = parsed.user?.user_metadata?.role
        return navigateTo(routeByRole(role))
      }
    } catch {
      localStorage.removeItem('sb-api-auth-token')
    }
  }
})
