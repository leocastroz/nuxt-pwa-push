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

  // Sincroniza entre abas: quando o localStorage mudar em outra aba, reagimos
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === 'sb-api-auth-token') {
        // Apenas força a leitura do estado atual de sessão
        supabase.auth.getSession().catch(() => {})
      }
    })

    // Opcional: BroadcastChannel para melhor sincronização
    try {
      const bc = new BroadcastChannel('sb-auth')
      bc.onmessage = (msg) => {
        if (msg?.data === 'refresh') {
          supabase.auth.getSession().catch(() => {})
        }
      }
      // Sempre que auth mudar, notifica outras abas
      supabase.auth.onAuthStateChange(() => {
        bc.postMessage('refresh')
      })
    } catch {}
  }
})
