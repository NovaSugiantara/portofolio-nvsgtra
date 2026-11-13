<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  script: [{
    key: 'theme-init',
    tagPosition: 'head',
    innerHTML: `document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)`,
  }],
})
</script>
