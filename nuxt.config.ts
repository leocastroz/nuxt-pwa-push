// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/ui'],
  runtimeConfig: {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    public: {
      VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY
    }
  },
  nitro: {
    externals: {
      inline: ["web-push"]
    }
  }
})