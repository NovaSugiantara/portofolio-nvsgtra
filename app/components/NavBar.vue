<template>
  <nav
    class="sticky top-0 z-50 border-b border-[var(--border-subtle)]"
    :style="{
      backgroundColor: 'rgba(217, 255, 244, 0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }"
    :class="[isScrolled && 'shadow-sm']"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-12">
      <!-- Brand -->
      <NuxtLink
        to="/"
        class="text-lg font-extrabold tracking-tight font-heading text-[var(--foreground-primary)] hover:text-[var(--accent-primary)] transition"
      >
        Nova Sugiantara
      </NuxtLink>

      <!-- Nav links -->
      <div class="flex items-center gap-1 md:gap-4">
        <NavLink to="/" label="Home" :is-active="$route.path === '/'" />
        <NavLink to="/projects" label="Portofolio" :is-active="$route.path.startsWith('/projects')" />
        <NavLink to="/blog" label="Blog" :is-active="$route.path.startsWith('/blog')" />
        <NavLink to="/contact" label="Contact" :is-active="$route.path === '/contact'" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const isScrolled = ref(false)

onMounted(() => {
  const onScroll = () => {
    isScrolled.value = window.scrollY > 8
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>
