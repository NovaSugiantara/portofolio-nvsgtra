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
  meta: [{ name: 'theme-color', content: '#fbfcfd' }],
  script: [{
    key: 'theme-init',
    tagPosition: 'head',
    innerHTML: `(function () {
      var saved;
      try {
        saved = localStorage.getItem('nova-theme');
      } catch (_) {}
      var dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', dark);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#21162c' : '#fbfcfd');
    })();`,
  }],
})
</script>
