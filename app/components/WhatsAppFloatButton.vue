<template>
  <a
    v-if="waUrl"
    :href="waUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-6 right-4 z-40 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[var(--whatsapp-bg)] p-3 shadow-[var(--shadow-lg)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[var(--whatsapp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-page)] motion-reduce:transition-none sm:right-6"
    aria-label="Chat with Nova on WhatsApp in a new tab"
    title="Chat with Nova on WhatsApp"
  >
    <Icon name="ph:whatsapp-logo" size="1.75rem" aria-hidden="true" />
  </a>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { public: { whatsappNumber, whatsappGreeting } } = config
const { data: profile } = useProfile()

const whatsappDigits = computed(() => String(whatsappNumber || profile.value?.phone || '').replace(/\D/g, ''))
const waUrl = computed(() => whatsappDigits.value
  ? `https://wa.me/${whatsappDigits.value}?text=${encodeURIComponent(whatsappGreeting || '')}`
  : '')
</script>
