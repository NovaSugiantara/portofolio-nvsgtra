<template>
  <footer class="site-footer">
    <div class="home-container site-footer-inner">
      <p>&copy; {{ currentYear }} Nova Sugiantara. Full Stack Web Developer.</p>
      <nav aria-label="Footer navigation">
        <a href="https://linkedin.com/in/novasugiantara" target="_blank" rel="noopener noreferrer">LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>
        <a href="https://github.com/NovaSugiantara" target="_blank" rel="noopener noreferrer">GitHub<span class="sr-only"> (opens in a new tab)</span></a>
        <NuxtLink to="/#home">Back to top <span aria-hidden="true">↑</span></NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
