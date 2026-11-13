<template>
  <div class="flex flex-wrap items-center justify-end gap-2">
    <span role="status" aria-live="polite" class="max-w-[28ch] text-right text-sm leading-snug text-secondary">{{ status }}</span>
    <button type="button" class="btn btn-primary btn-sm" :disabled="busy" @click="publish">
      <Icon name="ph:rocket-launch" size="1rem" aria-hidden="true" />
      {{ busy ? 'Publishing…' : 'Publish site' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { authHeaders } = useOwnerSession()
const busy = ref(false)
const status = ref('')

/**
 * Edits save to the database straight away, but the public site is static HTML.
 * Publishing starts a rebuild; Vercel usually finishes within a couple of minutes.
 */
const publish = async () => {
  busy.value = true
  status.value = ''
  try {
    await $fetch('/api/publish', { method: 'POST', headers: await authHeaders(), body: { site: 'portfolio' } })
    status.value = 'Build started. Live in about 2 minutes.'
  } catch (error) {
    const message = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
    status.value = message ? `Publish failed: ${message}` : 'Publish failed. Try again.'
  } finally {
    busy.value = false
  }
}
</script>
