<template>
  <footer class="site-footer">
    <div class="home-container site-footer-inner">
      <p>&copy; {{ currentYear }} Nova Sugiantara. Full Stack Web Developer.</p>
      <nav aria-label="Footer navigation">
        <a href="https://linkedin.com/in/novasugiantara" target="_blank" rel="noopener noreferrer"><Icon name="ph:linkedin-logo" size="1.125rem" aria-hidden="true" />LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>
        <a href="https://github.com/NovaSugiantara" target="_blank" rel="noopener noreferrer"><Icon name="ph:github-logo" size="1.125rem" aria-hidden="true" />GitHub<span class="sr-only"> (opens in a new tab)</span></a>
        <NuxtLink to="/#home">Back to top <Icon name="ph:arrow-up" size="1.125rem" aria-hidden="true" /></NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
