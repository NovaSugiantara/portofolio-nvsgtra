<template>
  <footer class="site-footer">
    <div class="site-container site-footer-inner">
      <p>&copy; {{ currentYear }} Nova Sugiantara · Full stack web developer · Bali, Indonesia</p>
      <nav aria-label="Footer navigation">
        <a href="https://linkedin.com/in/novasugiantara" target="_blank" rel="noopener noreferrer"><Icon name="ph:linkedin-logo" size="1.125rem" aria-hidden="true" />LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>
        <a href="https://github.com/NovaSugiantara" target="_blank" rel="noopener noreferrer"><Icon name="ph:github-logo" size="1.125rem" aria-hidden="true" />GitHub<span class="sr-only"> (opens in a new tab)</span></a>
        <a href="https://www.vibedev.id/nop" target="_blank" rel="noopener noreferrer"><Icon name="ph:code" size="1.125rem" aria-hidden="true" />VibeDev<span class="sr-only"> (opens in a new tab)</span></a>
        <a href="#main-content">Back to top <Icon name="ph:arrow-up" size="1.125rem" aria-hidden="true" /></a>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
