// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    // Server-only — never exposed to client bundle
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseOwnerId: process.env.SUPABASE_OWNER_ID,
    // Contact form delivery (Resend). Without a key the endpoint refuses instead of pretending to send.
    resendApiKey: process.env.RESEND_API_KEY || '',
    contactToEmail: process.env.CONTACT_TO_EMAIL || '',
    contactFromEmail: process.env.CONTACT_FROM_EMAIL || 'Portfolio contact <onboarding@resend.dev>',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://novasugiantara.web.id',
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
      whatsappNumber: process.env.WHATSAPP_NUMBER || '',
      whatsappGreeting:
        process.env.WHATSAPP_GREETING ||
        'Hi Nova, I found your portfolio and would like to talk about a project.',
    },
  },

  // Public content is static data, so public pages are built once and served from the CDN.
  // Only the contact endpoint, the CV PDF, and the admin area run as functions.
  routeRules: {
    '/': { prerender: true },
    '/projects': { prerender: true },
    '/projects/**': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/contact': { prerender: true },
    '/sitemap.xml': { prerender: true },
    '/api/cv/**': { headers: { 'cache-control': 'private, no-store' } },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml'],
      // The CV link is a live PDF and admin needs a session; neither should be baked into static files.
      ignore: ['/api', '/admin'],
      failOnError: true,
    },
    // Run functions next to Indonesian visitors instead of the default US East region.
    vercel: {
      functions: {
        regions: ['sin1'],
      },
    },
  },

  modules: ['@nuxt/icon'],
  icon: {
    provider: 'none',
    serverBundle: false,
    clientBundle: {
      scan: true,
      icons: ['ph:sun', 'ph:moon', 'ph:list', 'ph:x'],
    },
  },
})
