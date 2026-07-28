<template>
  <footer class="border-t mt-auto" style="border-color: var(--border-subtle);">
    <div class="mx-auto max-w-7xl grid gap-8 px-4 py-10 text-sm text-[var(--foreground-secondary)] md:grid-cols-3 md:px-6 lg:px-12">
      <div class="space-y-2">
        <p class="font-semibold font-heading text-[var(--foreground-primary)]">Nova Sugiantara</p>
        <p class="max-w-xs leading-relaxed">
          Full Stack Web Developer. Laravel · Vue.js · React · AWS · Ruby on Rails.
        </p>
        <p class="text-xs text-[var(--foreground-muted)]">&copy; {{ new Date().getFullYear() }} Nova Sugiantara</p>
      </div>

      <div class="space-y-2">
        <p class="font-semibold font-heading text-[var(--foreground-primary)]">Tech Stack</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="tech in ['Laravel', 'Vue.js', 'React', 'Ruby on Rails', 'AWS', 'Docker']" :key="tech" class="rounded-md bg-[var(--background-muted)] px-2 py-0.5 font-mono text-xs text-[var(--foreground-secondary)]">{{ tech }}</span>
        </div>
      </div>

      <div class="space-y-2">
        <p class="font-semibold font-heading text-[var(--foreground-primary)]">Connect</p>
        <div class="space-y-1">
          <a href="https://github.com/NovaSugiantara" target="_blank" rel="noopener" class="block underline decoration-[var(--accent-primary)] underline-offset-4">GitHub</a>
          <a href="https://linkedin.com/in/novasugiantara" target="_blank" rel="noopener" class="block underline decoration-[var(--accent-primary)] underline-offset-4">LinkedIn</a>
          <NuxtLink to="/contact" class="block underline decoration-[var(--accent-primary)] underline-offset-4">Contact</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
