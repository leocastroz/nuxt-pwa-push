import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Hidrata a sessão ao iniciar o app (reabre/volta do background)
  try {
    const { data } = await supabase.auth.getSession()
    const session = data.session

    if (session) {
      // Espelha em uma chave estável (opcional, compat com seu middleware antigo)
      localStorage.setItem(
        'sb-api-auth-token',
        JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: session.user,
          expires_at: session.expires_at,
        }),
      )
    }
  } catch (e) {
    // Silencioso em dev; apenas loga
    console.warn('Falha ao hidratar sessão do Supabase:', e)
  }

  // Mantém sessão sincronizada (autoRefresh já é feito pelo SDK)
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      localStorage.setItem(
        'sb-api-auth-token',
        JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: session.user,
          expires_at: session.expires_at,
        }),
      )
    } else {
      localStorage.removeItem('sb-api-auth-token')
    }
  })
})
