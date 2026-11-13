import tailwindcss from '@tailwindcss/vite'

/**
 * Admin app for novasugiantara.web.id (and later forgebyte.id).
 *
 * Runs as a single page app: every screen sits behind a login, nothing here should be indexed,
 * and the browser talks to Supabase directly under owner-only RLS. The few server routes hold
 * what the browser must not: deploy hooks and upload validation.
 */
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  runtimeConfig: {
    // Server only. One Vercel deploy hook per public site; the Publish button triggers it.
    deployHookPortfolio: process.env.DEPLOY_HOOK_PORTFOLIO || '',
    deployHookForgebyte: process.env.DEPLOY_HOOK_FORGEBYTE || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
    public: {
      // The publishable key is designed to be public; RLS is what protects the data.
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
      portfolioUrl: process.env.PORTFOLIO_URL || 'https://novasugiantara.web.id',
    },
  },

  app: {
    head: {
      title: 'Admin',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'referrer', content: 'same-origin' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'same-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=()',
        'x-robots-tag': 'noindex, nofollow',
      },
    },
  },

  nitro: {
    vercel: { functions: { regions: ['sin1'] } },
  },

  modules: ['@nuxt/icon'],
  icon: {
    provider: 'none',
    serverBundle: false,
    clientBundle: { scan: true },
  },
})
