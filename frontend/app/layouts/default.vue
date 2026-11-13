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
// Page-level title, description, canonical, and image come from usePageSeo in each page.
useSeoMeta({
  ogSiteName: 'Nova Sugiantara',
  ogLocale: 'en_US',
})

useHead({
  htmlAttrs: { lang: 'en' },
})
</script>
