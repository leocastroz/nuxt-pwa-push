export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client side
  if (typeof window !== 'undefined') {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    
    console.log("🔐 Running Auth Middleware for:", to.path)
    
    try {
      // Primeiro, verificar sessão do Supabase
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error("Erro ao verificar sessão:", error)
      }
      
      // Se há sessão válida no Supabase
      if (session && session.user) {
        console.log("✅ Sessão válida encontrada:", session.user.email)
        user.value = session.user
        
        // Se está tentando acessar login tendo sessão válida, redirecionar para dashboard
        if (to.path === "/login") {
          return navigateTo("/dashboard")
        }
        
        return // Autorizado
      }
      
      // Fallback: verificar localStorage (compatibilidade com sistema anterior)
      const authDataString = localStorage.getItem("sb-auth-token") || localStorage.getItem("sb-api-auth-token")
      
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString)
          
          if (authData?.access_token && authData?.user) {
            // Tentar restaurar sessão com o token encontrado
            const { data: { user: restoredUser }, error: restoreError } = await supabase.auth.getUser(authData.access_token)
            
            if (!restoreError && restoredUser) {
              console.log("✅ Sessão restaurada do localStorage:", restoredUser.email)
              user.value = restoredUser
              
              if (to.path === "/login") {
                return navigateTo("/dashboard")
              }
              
              return // Autorizado
            }
          }
        } catch (parseError) {
          console.error("Erro ao processar token do localStorage:", parseError)
          // Limpar dados corrompidos
          localStorage.removeItem("sb-auth-token")
          localStorage.removeItem("sb-api-auth-token")
        }
      }
      
      // Não autorizado
      console.log("❌ Não autorizado, redirecionando para login")
      user.value = null
      
      if (to.path !== "/login") {
        return navigateTo("/login")
      }
      
    } catch (error) {
      console.error("Erro no middleware de auth:", error)
      
      // Limpar dados em caso de erro
      localStorage.removeItem("sb-auth-token")
      localStorage.removeItem("sb-api-auth-token")
      if (to.path !== "/login") {
        return navigateTo("/login");
      }
    }
  }
});


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