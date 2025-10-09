export default defineNuxtRouteMiddleware((to) => {
  // Only run on client side
  console.log("RUNNING MIDDLEWARE");
  if (typeof window !== 'undefined') {
    console.log("RUNNING MIDDLEWARE");
    
    try {
      const authDataString = localStorage.getItem("sb-api-auth-token");
      
      if (!authDataString && to.path !== "/login") {
        console.log("No auth data found, redirecting to login");
        return navigateTo("/login");
      }
      
      if (authDataString) {
        const authData = JSON.parse(authDataString);
        console.log("Auth Data =>:", authData);
        
        // Check if user exists and token is valid
        if (!authData?.user || !authData?.access_token) {
          console.log("Invalid auth data, clearing and redirecting");
          localStorage.removeItem("sb-api-auth-token");
          if (to.path !== "/login") {
            return navigateTo("/login");
          }
        }
        
        // Check if token is expired (if expires_at exists)
        
        // if (authData.expires_at && Date.now() > authData.expires_at) {
        //   console.log("Token expired, clearing and redirecting");
        //   localStorage.removeItem("sb-api-auth-token");
        //   if (to.path !== "/login") {
        //     return navigateTo("/login");
        //   }
        // }
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
      localStorage.removeItem("sb-api-auth-token");
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