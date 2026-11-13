<template>
  <div class="min-h-dvh bg-page text-primary">
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">Skip to content</a>
    <header v-if="isReady" class="border-b border-line bg-card">
      <div class="shell flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-primary no-underline">
          <span class="grid size-8 place-items-center rounded-md bg-inverse font-mono text-xs text-page">NS</span>
          Admin
        </NuxtLink>
        <nav aria-label="Admin" class="order-last flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="nav-link">{{ item.label }}</NuxtLink>
        </nav>
        <div class="ml-auto flex items-center gap-2">
          <PublishButton />
          <button type="button" class="btn btn-secondary btn-sm" @click="signOut">Sign out</button>
        </div>
      </div>
    </header>
    <main id="main" class="shell py-8 md:py-12">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { state, signOut } = useOwnerSession()
const isReady = computed(() => state.value === 'ready')
const nav = [
  { to: '/', label: 'Projects' },
  { to: '/profile', label: 'Profile & hero' },
  { to: '/security', label: 'Security' },
]
</script>

<style scoped>
.nav-link {
  display: inline-flex; align-items: center; min-height: 2.5rem; padding: 0 0.75rem;
  border-radius: var(--radius-md); color: var(--foreground-secondary); font-weight: 600;
  font-size: 0.9375rem; text-decoration: none; white-space: nowrap;
}
.nav-link:hover { color: var(--foreground-primary); background: var(--background-section); }
.nav-link.router-link-exact-active,
.nav-link[aria-current="page"] { color: var(--foreground-primary); background: var(--background-section); }
</style>
