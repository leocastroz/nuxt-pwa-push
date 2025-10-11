export default defineNuxtRouteMiddleware(async (to) => {
  // Execute somente no client
  if (process.server) return

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Primeiro, se o Nuxt já tem user, seguimos
  if (user.value) return

  // Sem user reativo? tenta recuperar sessão persistida do Supabase
  try {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      // Nuxt/supabase plugin atualizará useSupabaseUser automaticamente
      return
    }
  } catch (e) {
    console.warn('auth middleware: getSession falhou', e)
  }

  // Fallback: checa espelho no localStorage (mantido por plugin)
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('sb-api-auth-token')
    try {
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.access_token && parsed?.user) {
          // Opcional: poderíamos setar algo no state aqui.
          return
        }
      }
    } catch (e) {
      localStorage.removeItem('sb-api-auth-token')
    }
  }

  // Sem sessão: redireciona para login (evita loop na própria página de login)
  if (to.path !== '/login') {
    return navigateTo('/login')
  }
})


// export default defineNuxtRouteMiddleware((to) => {
//   if (typeof window !== 'undefined') {
//     console.log("Running auth middleware on client side");
//     const authData = JSON.parse(localStorage.getItem("sb-api-auth-token"));

//     if (!authData && to.path !== "/login") {
//       return navigateTo("/login");
//     }

//     try {
//       if (!authData?.user) {
//         localStorage.removeItem("sb-api-auth-token");
//         return navigateTo("/login");
//       }
//     } catch {
//       localStorage.removeItem("sb-api-auth-token");
//       return navigateTo("/login");
//     }
//   }
// });