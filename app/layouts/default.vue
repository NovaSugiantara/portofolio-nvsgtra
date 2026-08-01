<template>
  <div class="flex min-h-screen flex-col overflow-x-clip">
    <a
      href="#main-content"
      class="sr-only fixed left-4 top-4 z-50 rounded-[var(--radius-md)] bg-[var(--background-inverse)] px-4 py-3 text-sm font-semibold text-[var(--background-page)] shadow-[var(--shadow-md)] focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-page)]"
    >
      Skip to main content
    </a>
    <NavBar />
    <main id="main-content" class="min-w-0 flex-1" tabindex="-1">
      <slot />
    </main>
    <Footer />
    <WhatsAppFloatButton />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Nova Sugiantara - Full Stack Web Developer',
  description:
    'Portfolio of Nova Sugiantara, a Full Stack Developer with 4+ years building web applications with React, Vue.js, Laravel, and Ruby on Rails, including payment, booking, and blockchain systems.',
  ogSiteName: 'Nova Sugiantara Portfolio',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: { lang: 'en' },
})
</script>
