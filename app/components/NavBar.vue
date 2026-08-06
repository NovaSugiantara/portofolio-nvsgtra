<template>
  <header class="site-header" @keydown="handleNavigationKeydown">
    <nav class="site-nav home-container" aria-label="Primary navigation">
      <NuxtLink to="/" class="site-brand" aria-label="Nova Sugiantara home" @click="closeMenu(false)">
        <span class="site-brand-mark" aria-hidden="true">NS</span>
        <span class="site-brand-copy">
          <strong>Nova Sugiantara</strong>
          <span>Full Stack Developer</span>
        </span>
      </NuxtLink>

      <ul class="site-nav-links" role="list">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            :class="{ 'is-current': isActive(item.to) }"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="site-nav-actions">
        <button
          type="button"
          class="site-theme-toggle"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'ph:sun' : 'ph:moon'" size="1.25rem" aria-hidden="true" />
        </button>
        <a
          class="site-cv-link"
          href="/api/cv/generate?variant=default"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="ph:file-arrow-up" size="1.125rem" aria-hidden="true" />
          Open CV<span class="sr-only"> in a new tab</span>
        </a>
        <button
          ref="menuButton"
          type="button"
          class="site-menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="public-navigation-menu"
          :aria-label="menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          :title="menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="toggleMenu"
        >
          <Icon :name="menuOpen ? 'ph:x' : 'ph:list'" size="1.35rem" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <Transition
      enter-active-class="transition-[opacity,transform] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none"
      enter-from-class="-translate-y-1 opacity-0 motion-reduce:translate-y-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-[opacity,transform] duration-150 ease-[var(--ease-in)] motion-reduce:transition-none"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-1 opacity-0 motion-reduce:translate-y-0"
    >
      <nav
        v-show="menuOpen"
        id="public-navigation-menu"
        ref="mobileMenu"
        class="site-mobile-menu"
        aria-label="Mobile navigation"
      >
        <ul class="home-container" role="list">
          <li v-for="item in navItems" :key="`mobile-${item.to}`">
            <NuxtLink
              :to="item.to"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              :class="{ 'is-current': isActive(item.to) }"
              @click="closeMenu()"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
const isDark = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const mobileMenu = ref<HTMLElement | null>(null)
const route = useRoute()
let desktopQuery: MediaQueryList | undefined

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Portofolio', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
] as const

const isActive = (path: (typeof navItems)[number]['to']) =>
  path === '/' ? route.path === '/' : route.path === path || route.path.startsWith(`${path}/`)

const syncThemeColor = () => {
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', isDark.value ? '#21162c' : '#fbfcfd')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  try {
    localStorage.setItem('nova-theme', isDark.value ? 'dark' : 'light')
  } catch {
    // The selected theme still applies when browser storage is unavailable.
  }
  syncThemeColor()
}

const focusFirstMenuLink = () => {
  nextTick(() => mobileMenu.value?.querySelector<HTMLElement>('a[href]')?.focus())
}

const closeMenu = (restoreFocus = true) => {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (restoreFocus) nextTick(() => menuButton.value?.focus())
}

const toggleMenu = () => {
  if (menuOpen.value) {
    closeMenu()
    return
  }

  menuOpen.value = true
  focusFirstMenuLink()
}

const handleNavigationKeydown = (event: KeyboardEvent) => {
  if (!menuOpen.value || event.key !== 'Escape') return
  event.preventDefault()
  closeMenu()
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  syncThemeColor()
  desktopQuery = window.matchMedia('(min-width: 768px)')
  desktopQuery.addEventListener('change', closeMenuAtDesktop)
})

const closeMenuAtDesktop = (event: MediaQueryListEvent) => {
  if (event.matches) closeMenu(false)
}

onBeforeUnmount(() => desktopQuery?.removeEventListener('change', closeMenuAtDesktop))

watch(() => route.path, () => closeMenu(false))
</script>
