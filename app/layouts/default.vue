<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
    <WhatsAppFloatButton />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Nova Sugiantara — Full Stack Web Developer',
  description:
    'Portfolio of Nova Sugiantara, Full Stack Web Developer specialized in Laravel, Vue.js, React, AWS, and Ruby on Rails.',
})
</script>
