<template>
  <div class="min-h-screen bg-[var(--background-page)] text-[var(--foreground-primary)]">
    <a
      href="#admin-main"
      class="sr-only fixed left-4 top-4 z-50 rounded-md bg-[var(--background-card)] px-4 py-3 text-sm font-semibold shadow-[var(--shadow-md)] focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
    >
      Skip to main content
    </a>

    <div class="flex min-h-screen flex-col lg:flex-row">
      <aside class="hidden w-72 shrink-0 border-r border-[var(--border-subtle)] bg-[var(--background-card)] p-6 lg:flex lg:flex-col" aria-label="Owner navigation">
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">Nova Sugiantara</p>
          <h1 class="mt-2 font-heading text-2xl font-bold">Owner console</h1>
        </div>

        <nav aria-label="Admin" class="space-y-1 text-sm">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :aria-current="isCurrent(item.to) ? 'page' : undefined"
            class="block rounded-md px-3 py-3 font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--background-muted)] hover:text-[var(--foreground-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            :class="isCurrent(item.to) ? 'bg-[var(--background-muted)] text-[var(--foreground-primary)]' : ''"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="mt-auto border-t border-[var(--border-subtle)] pt-5">
          <p v-if="user?.email" class="mb-3 truncate text-xs text-[var(--foreground-muted)]" :title="user.email">
            {{ user.email }}
          </p>
          <p v-if="logoutError" class="mb-3 text-xs text-red-700" role="alert">{{ logoutError }}</p>
          <button
            type="button"
            class="min-h-11 w-full rounded-md border border-[var(--border-subtle)] px-3 py-2 text-left text-sm font-semibold transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoggingOut"
            :aria-busy="isLoggingOut"
            @click="handleLogout"
          >
            {{ isLoggingOut ? 'Signing out…' : 'Sign out' }}
          </button>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--background-card)] px-4 sm:px-6 lg:hidden">
          <NuxtLink to="/admin/dashboard" class="font-heading text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">
            Owner console
          </NuxtLink>
          <button
            ref="mobileMenuButton"
            type="button"
            class="min-h-11 min-w-11 rounded-md border border-[var(--border-subtle)] px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            :aria-expanded="mobileNavOpen"
            aria-controls="admin-mobile-navigation"
            aria-label="Toggle owner navigation"
            @click="mobileNavOpen = !mobileNavOpen"
          >
            {{ mobileNavOpen ? 'Close' : 'Menu' }}
          </button>
        </header>

        <nav
          v-if="mobileNavOpen"
          id="admin-mobile-navigation"
          ref="mobileNav"
          aria-label="Admin"
          class="border-b border-[var(--border-subtle)] bg-[var(--background-card)] p-4 lg:hidden"
          @keydown.esc="mobileNavOpen = false"
        >
          <div class="space-y-1 text-sm">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :aria-current="isCurrent(item.to) ? 'page' : undefined"
              class="block rounded-md px-3 py-3 font-medium text-[var(--foreground-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--foreground-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
              :class="isCurrent(item.to) ? 'bg-[var(--background-muted)] text-[var(--foreground-primary)]' : ''"
              @click="mobileNavOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
          <p v-if="logoutError" class="mt-4 text-xs text-red-700" role="alert">{{ logoutError }}</p>
          <button
            type="button"
            class="mt-4 min-h-11 w-full rounded-md border border-[var(--border-subtle)] px-3 py-2 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoggingOut"
            :aria-busy="isLoggingOut"
            @click="handleLogout"
          >
            {{ isLoggingOut ? 'Signing out…' : 'Sign out' }}
          </button>
        </nav>

        <main id="admin-main" class="min-w-0 flex-1 p-4 sm:p-6 lg:p-10" tabindex="-1">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Profile', to: '/admin/profile' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Experiences', to: '/admin/experiences' },
  { label: 'Skills', to: '/admin/skills' },
  { label: 'Education', to: '/admin/education' },
  { label: 'Certifications', to: '/admin/certifications' },
  { label: 'Blog', to: '/admin/blog' },
  { label: 'CV', to: '/admin/cv' },
  { label: 'Messages', to: '/admin/contact-messages' },
] as const

const route = useRoute()
const { user, loading: authLoading, logout } = useAuth()
const mobileNavOpen = ref(false)
const mobileNav = ref<HTMLElement | null>(null)
const mobileMenuButton = ref<HTMLButtonElement | null>(null)
const isLoggingOut = ref(false)
const logoutError = ref('')

const isCurrent = (path: string) => route.path === path || route.path.startsWith(`${path}/`)

const handleLogout = async () => {
  isLoggingOut.value = true
  logoutError.value = ''

  try {
    await logout()
    await navigateTo('/admin/login', { replace: true })
  } catch {
    logoutError.value = 'Unable to sign out. Please try again.'
  } finally {
    isLoggingOut.value = false
  }
}

watch(mobileNavOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    mobileNav.value?.querySelector<HTMLElement>('a')?.focus()
  } else if (import.meta.client) {
    mobileMenuButton.value?.focus()
  }
})

if (import.meta.client) {
  watch([user, authLoading], ([currentUser, isLoading]) => {
    if (!isLoading && !currentUser && route.path.startsWith('/admin')) {
      mobileNavOpen.value = false
      void navigateTo('/admin/login', { replace: true })
    }
  }, { immediate: true })
}
</script>
