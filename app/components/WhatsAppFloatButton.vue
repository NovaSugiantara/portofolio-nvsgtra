<template>
  <a
    v-if="waUrl"
    :href="waUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-6 right-4 z-40 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[var(--whatsapp-bg)] p-3 shadow-[var(--shadow-lg)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[var(--whatsapp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-page)] motion-reduce:transition-none sm:right-6"
    aria-label="Chat with Nova on WhatsApp"
    title="Chat with Nova on WhatsApp"
  >
    <!-- SVG WhatsApp icon (brand green bg, white logo) -->
    <svg
      viewBox="0 0 32 32"
      class="h-7 w-7 fill-white"
      aria-hidden="true"
    >
      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.634.79 5.103 2.158 7.144L2 30l7.012-2.03A13.944 13.944 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.45c-2.25 0-4.45-.574-6.38-1.67l-.46-.27-4.16 1.21 1.28-4.04-.3-.5A11.36 11.36 0 0 1 4.55 16c0-6.31 5.14-11.45 11.45-11.45S27.45 9.69 27.45 16 22.31 27.45 16 27.45zm6.35-7.45c-.35-.18-2.07-1.02-2.39-1.14-.32-.12-.55-.18-.78.18s-.9 1.14-1.1 1.37c-.2.23-.4.26-.75.09-.35-.18-1.48-.55-2.82-1.74a10.56 10.56 0 0 1-1.96-2.44c-.2-.35-.02-.54.15-.72.16-.16.35-.4.53-.6.18-.2.24-.35.36-.58.12-.24.06-.44-.03-.62-.09-.18-.78-1.88-1.07-2.58-.28-.7-.57-.58-.78-.59h-.72c-.26 0-.69.1-1.05.49-.36.39-1.38 1.35-1.38 3.3s1.42 3.83 1.62 4.1c.2.27 2.8 4.28 6.8 5.4 2.94.82 4.1.69 4.84.42.6-.22 1.07-.54 1.23-1.06.14-.52.14-.96.1-1.06-.04-.1-.18-.16-.35-.24h-.01z"/>
    </svg>
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
