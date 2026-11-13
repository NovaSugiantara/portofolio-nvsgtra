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
    // Read at build time to prerender public pages. Only the publishable key is used here;
    // the portfolio never needs the service role key. Unset means static fallback content.
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
    // Contact form delivery (Resend). Without a key the endpoint refuses instead of pretending to send.
    resendApiKey: process.env.RESEND_API_KEY || '',
    contactToEmail: process.env.CONTACT_TO_EMAIL || '',
    contactFromEmail: process.env.CONTACT_FROM_EMAIL || 'Portfolio contact <onboarding@resend.dev>',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://novasugiantara.web.id',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '',
      whatsappGreeting:
        process.env.WHATSAPP_GREETING ||
        'Hi Nova, I found your portfolio and would like to talk about a project.',
    },
  },

  // Public pages are built once (reading Supabase or static data) and served from the CDN.
  // Only the contact endpoint and the CV PDF run as functions. The admin app republishes by
  // triggering a new build through a Vercel deploy hook.
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
      // The CV link is a live PDF; it should not be baked into static files.
      ignore: ['/api'],
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
