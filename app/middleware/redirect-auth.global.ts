export default defineNuxtRouteMiddleware(async (to) => {
  // Evita SSR acessar window/localStorage desnecessariamente
  if (process.server) return

  // Só age nas rotas públicas iniciais
  const publicEntrypoints = ['/', '/login']
  if (!publicEntrypoints.includes(to.path)) return

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Já autenticado via estado reativo?
  if (user.value) return navigateTo('/cliente')

  // Tenta hidratar sessão do Supabase
  try {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      return navigateTo('/cliente')
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
        return navigateTo('/cliente')
      }
    } catch {
      localStorage.removeItem('sb-api-auth-token')
    }
  }
})
