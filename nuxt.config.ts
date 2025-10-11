// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // devServer: {
  //   port: 3000,
  //   host: '0.0.0.0'
  // },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
    [
      'nuxt-toastify',
      {
        autoClose: 2000,
        position: 'top-right',
        theme: 'auto',
      }
    ]
  ],
  runtimeConfig: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
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
  },
  supabase: {
    redirect: false
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      id: '/?source=pwa',
      name: 'To De Carona',
      short_name: 'To De Carona',
      description: 'Aplicativo PWA criado com Nuxt.js e pronto para a Play Store!',
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait',
      theme_color: '#4CAF50',
      background_color: '#ffffff',
      icons: [
        {
          src: '/icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: '/icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: '/icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
      screenshots: [
        {
          src: '/screenshots/screen1.png',
          sizes: '1080x1920',
          type: 'image/png'
        },
        {
          src: '/screenshots/screen2.png',
          sizes: '1080x1920',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      // Evita warns no modo dev: só aplica globPatterns em produção
      globPatterns: process.env.NODE_ENV === 'production' ? ['**/*.{js,css,html,png,svg,ico}'] : [],
      // Usar service worker personalizado
      importScripts: ['/sw-custom.js'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60 // <== 30 days
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
      // Limpa mais logs no dev
      suppressWarnings: true
    }
  }
})