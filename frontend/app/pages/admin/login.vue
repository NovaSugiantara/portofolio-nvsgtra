<template>
  <div class="min-h-screen bg-[var(--background-page)] px-4 py-8 text-[var(--foreground-primary)] sm:px-6 sm:py-12">
    <a
      href="#login-main"
      class="sr-only fixed left-4 top-4 z-50 rounded-md bg-[var(--background-card)] px-4 py-3 text-sm font-semibold shadow-[var(--shadow-md)] focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
    >
      Skip to sign-in form
    </a>

    <main id="login-main" class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center" tabindex="-1">
      <section class="w-full rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-card)] p-6 shadow-[var(--shadow-lg)] sm:p-8" aria-labelledby="login-title">
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">Nova Sugiantara</p>
          <h1 id="login-title" class="mt-3 font-heading text-3xl font-bold">Owner sign in</h1>
          <p class="mt-3 text-sm leading-6 text-[var(--foreground-secondary)]">Use the provisioned owner account to manage your portfolio and CV.</p>
        </div>

        <p v-if="isCheckingSession" class="rounded-md bg-[var(--background-muted)] px-4 py-3 text-sm text-[var(--foreground-secondary)]" role="status" aria-live="polite">
          Checking your session…
        </p>

        <form v-else class="space-y-5" novalidate @submit.prevent="onSubmit">
          <div>
            <label for="email" class="mb-2 block text-sm font-semibold">Email address</label>
            <input
              id="email"
              ref="emailInput"
              v-model="email"
              type="email"
              inputmode="email"
              autocomplete="username"
              class="min-h-12 w-full rounded-md border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-base transition-colors placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60"
              :aria-invalid="Boolean(errorMsg)"
              :aria-describedby="errorMsg ? 'login-error' : undefined"
              :disabled="isSubmitting"
              required
            />
          </div>

          <div>
            <label for="password" class="mb-2 block text-sm font-semibold">Password</label>
            <input
              id="password"
              ref="passwordInput"
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="min-h-12 w-full rounded-md border border-[var(--border-subtle)] bg-transparent px-3 py-2 text-base transition-colors placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60"
              :aria-invalid="Boolean(errorMsg)"
              :aria-describedby="errorMsg ? 'login-error' : undefined"
              :disabled="isSubmitting"
              required
            />
          </div>

          <p v-if="errorMsg" id="login-error" class="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800" role="alert" aria-live="assertive">
            {{ errorMsg }}
          </p>

          <button
            type="submit"
            class="min-h-12 w-full rounded-md bg-[var(--accent-primary)] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSubmitting"
            :aria-busy="isSubmitting"
          >
            {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: [] })

useSeoMeta({
  title: 'Owner sign in — Nova Sugiantara',
  description: 'Sign in to the private Nova Sugiantara owner console.',
})

const { login, fetchUser, getSafeAuthMessage } = useAuth()
const route = useRoute()
const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const isCheckingSession = ref(true)
const errorMsg = ref('')
const emailInput = ref<HTMLInputElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)

const getRedirectTarget = (): string => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string') return '/admin/dashboard'
  if (redirect === '/admin') return '/admin/dashboard'
  if (redirect.startsWith('/admin/') && redirect !== '/admin/login') return redirect
  return '/admin/dashboard'
}

onMounted(async () => {
  const currentUser = await fetchUser()
  if (currentUser) {
    await navigateTo(getRedirectTarget(), { replace: true })
    return
  }

  isCheckingSession.value = false
})

const onSubmit = async () => {
  errorMsg.value = ''

  if (!email.value.trim() || !password.value) {
    errorMsg.value = 'Enter your email and password to continue.'
    await nextTick()
    if (!email.value.trim()) emailInput.value?.focus()
    else passwordInput.value?.focus()
    return
  }

  isSubmitting.value = true

  try {
    await login(email.value, password.value)
    await navigateTo(getRedirectTarget(), { replace: true })
  } catch (error) {
    errorMsg.value = getSafeAuthMessage(error)
    await nextTick()
    emailInput.value?.focus()
  } finally {
    isSubmitting.value = false
  }
}
</script>
