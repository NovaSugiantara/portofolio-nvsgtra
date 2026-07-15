// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    // Server-only — never exposed to client bundle
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
      whatsappNumber: process.env.WHATSAPP_NUMBER || '',
      whatsappGreeting:
        process.env.WHATSAPP_GREETING ||
        'Halo Nova! Saya tertarik dengan portofolio Anda.',
    },
  },

  modules: ["nuxt-icons"],
})