<template>
  <div class="mx-auto max-w-sm pt-10 md:pt-20">
    <h1 class="text-2xl font-semibold tracking-[-0.03em]">{{ step === 'mfa' ? 'Enter your authenticator code' : 'Sign in to admin' }}</h1>
    <p class="mt-2 text-secondary">
      {{ step === 'mfa' ? 'Open your authenticator app and type the 6 digit code for this account.' : 'Owner account only. There is no sign up.' }}
    </p>

    <p v-if="state === 'not-owner'" class="notice notice-error mt-6" role="alert">
      This account is signed in but is not allowed to edit content.
      <button type="button" class="font-semibold underline" @click="signOut">Sign out</button>
    </p>

    <form v-if="step === 'password'" class="mt-8 grid gap-5" novalidate @submit.prevent="signIn">
      <div class="field">
        <label for="email" class="field-label">Email</label>
        <input id="email" v-model.trim="email" class="input" type="email" autocomplete="username" required :aria-invalid="Boolean(error)">
      </div>
      <div class="field">
        <label for="password" class="field-label">Password</label>
        <input id="password" v-model="password" class="input" type="password" autocomplete="current-password" required :aria-invalid="Boolean(error)">
      </div>
      <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
      <button class="btn btn-primary" type="submit" :disabled="busy || !email || !password">{{ busy ? 'Signing in…' : 'Sign in' }}</button>
    </form>

    <form v-else class="mt-8 grid gap-5" novalidate @submit.prevent="verifyCode">
      <div class="field">
        <label for="code" class="field-label">6 digit code</label>
        <input
          id="code"
          v-model="code"
          class="input font-mono text-lg tracking-[0.3em]"
          inputmode="numeric"
          autocomplete="one-time-code"
          pattern="[0-9]*"
          maxlength="6"
          required
          :aria-invalid="Boolean(error)"
        >
      </div>
      <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
      <button class="btn btn-primary" type="submit" :disabled="busy || code.length !== 6">{{ busy ? 'Checking…' : 'Verify' }}</button>
      <button class="btn btn-secondary" type="button" @click="signOut">Use another account</button>
    </form>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Sign in · Admin' })

const supabase = useSupabase()
const route = useRoute()
const { state, refresh, signOut } = useOwnerSession()

const step = ref<'password' | 'mfa'>(state.value === 'needs-mfa' ? 'mfa' : 'password')
const email = ref('')
const password = ref('')
const code = ref('')
const busy = ref(false)
const error = ref('')

const next = computed(() => {
  const value = route.query.next
  // Only same-app paths; never an absolute or protocol-relative URL.
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/'
})

const finish = async () => {
  const access = await refresh()
  if (access === 'needs-mfa') step.value = 'mfa'
  else if (access === 'ready') await navigateTo(next.value)
}

const signIn = async () => {
  busy.value = true
  error.value = ''
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  busy.value = false
  if (signInError) {
    error.value = signInError.status === 400 ? 'Email or password is incorrect.' : 'Sign in failed. Try again in a moment.'
    return
  }
  password.value = ''
  await finish()
}

const verifyCode = async () => {
  busy.value = true
  error.value = ''
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
  const factor = factors?.totp.find((item) => item.status === 'verified')
  if (factorsError || !factor) {
    busy.value = false
    error.value = 'No authenticator is set up for this account.'
    return
  }
  const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.value })
  busy.value = false
  if (verifyError) {
    error.value = 'That code did not work. Codes change every 30 seconds; try the current one.'
    code.value = ''
    return
  }
  await finish()
}
</script>
