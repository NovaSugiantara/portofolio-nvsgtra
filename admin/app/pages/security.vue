<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-semibold tracking-[-0.035em]">Security</h1>
    <p class="mt-2 max-w-[60ch] text-secondary">
      With an authenticator app set up, a stolen password alone cannot change the site: the database refuses edits until the 6 digit code is entered.
    </p>

    <div v-if="loading" class="panel mt-8 h-40 animate-pulse" aria-busy="true" aria-label="Loading security settings" />

    <section v-else-if="verifiedFactor" class="panel mt-8 p-5 md:p-6" aria-labelledby="mfa-on">
      <h2 id="mfa-on" class="flex items-center gap-2 text-lg font-semibold"><Icon name="ph:shield-check" size="1.25rem" class="text-accent" aria-hidden="true" />Authenticator app is on</h2>
      <p class="mt-2 text-secondary">Added {{ new Date(verifiedFactor.created_at).toLocaleDateString() }}. Sign in now asks for a code every time.</p>
      <p v-if="error" class="notice notice-error mt-4" role="alert">{{ error }}</p>
      <button type="button" class="btn btn-danger mt-5" :disabled="busy" @click="removeFactor">Turn off</button>
    </section>

    <section v-else class="panel mt-8 grid gap-5 p-5 md:p-6" aria-labelledby="mfa-off">
      <h2 id="mfa-off" class="text-lg font-semibold">Set up an authenticator app</h2>
      <template v-if="!enrolment">
        <p class="text-secondary">Use Google Authenticator, 1Password, Authy or any app that supports TOTP codes.</p>
        <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
        <div><button type="button" class="btn btn-primary" :disabled="busy" @click="startEnrolment">Start setup</button></div>
      </template>
      <template v-else>
        <ol class="grid gap-5">
          <li>
            <p><strong>1.</strong> Scan this QR code with the app.</p>
            <img :src="enrolment.qr" alt="QR code for the authenticator app" width="200" height="200" class="mt-3 rounded-md bg-white p-2">
            <details class="mt-3 text-sm">
              <summary class="cursor-pointer font-semibold">Cannot scan? Enter the key by hand</summary>
              <code class="mt-2 block break-all rounded-md bg-section p-3">{{ enrolment.secret }}</code>
            </details>
          </li>
          <li>
            <form class="grid gap-3" novalidate @submit.prevent="confirmEnrolment">
              <label for="totp" class="field-label"><strong>2.</strong> Type the 6 digit code it shows</label>
              <input id="totp" v-model="code" class="input max-w-48 font-mono text-lg tracking-[0.3em]" inputmode="numeric" autocomplete="one-time-code" maxlength="6" :aria-invalid="Boolean(error)">
              <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
              <div class="flex gap-3">
                <button type="submit" class="btn btn-primary" :disabled="busy || code.length !== 6">Turn on</button>
                <button type="button" class="btn btn-secondary" :disabled="busy" @click="cancelEnrolment">Cancel</button>
              </div>
            </form>
          </li>
        </ol>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Factor } from '@supabase/supabase-js'

useHead({ title: 'Security · Admin' })

const supabase = useSupabase()
const { refresh } = useOwnerSession()
const loading = ref(true)
const busy = ref(false)
const error = ref('')
const code = ref('')
const verifiedFactor = ref<Factor | null>(null)
const enrolment = ref<{ id: string, qr: string, secret: string } | null>(null)

const load = async () => {
  const { data } = await supabase.auth.mfa.listFactors()
  verifiedFactor.value = data?.totp.find((factor) => factor.status === 'verified') ?? null
  // An abandoned setup leaves an unverified factor behind; clear it so a new one can start.
  for (const factor of data?.all.filter((item) => item.status === 'unverified') ?? []) {
    await supabase.auth.mfa.unenroll({ factorId: factor.id })
  }
  loading.value = false
}

const startEnrolment = async () => {
  busy.value = true
  error.value = ''
  const { data, error: enrolError } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: `Admin ${new Date().toISOString().slice(0, 10)}` })
  busy.value = false
  if (enrolError || !data) return (error.value = 'Could not start setup. Is TOTP enabled in Supabase Auth settings?')
  enrolment.value = { id: data.id, qr: data.totp.qr_code, secret: data.totp.secret }
}

const confirmEnrolment = async () => {
  if (!enrolment.value) return
  busy.value = true
  error.value = ''
  const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrolment.value.id, code: code.value })
  busy.value = false
  if (verifyError) {
    code.value = ''
    return (error.value = 'That code did not match. Try the current one.')
  }
  enrolment.value = null
  code.value = ''
  await refresh()
  await load()
}

const cancelEnrolment = async () => {
  if (enrolment.value) await supabase.auth.mfa.unenroll({ factorId: enrolment.value.id })
  enrolment.value = null
  code.value = ''
  error.value = ''
}

const removeFactor = async () => {
  if (!verifiedFactor.value) return
  if (!window.confirm('Turn off the authenticator? Anyone with your password could then edit the site.')) return
  busy.value = true
  const { error: removeError } = await supabase.auth.mfa.unenroll({ factorId: verifiedFactor.value.id })
  busy.value = false
  if (removeError) return (error.value = 'Could not turn it off. Sign out and back in with a code, then try again.')
  await supabase.auth.refreshSession()
  await load()
}

onMounted(load)
</script>
