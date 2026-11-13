<template>
  <a
    v-if="waUrl"
    :href="waUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-5 right-4 z-40 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[var(--whatsapp-bg)] p-3 text-white shadow-[var(--shadow-lg)] transition-[background-color,transform,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:bg-[var(--whatsapp-hover)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-page)] motion-reduce:transition-none sm:bottom-6 sm:right-6"
    :class="isHidden ? 'pointer-events-none translate-y-2 opacity-0' : 'opacity-100'"
    :aria-hidden="isHidden ? 'true' : undefined"
    :tabindex="isHidden ? -1 : undefined"
    aria-label="Chat with Nova on WhatsApp (opens in a new tab)"
    title="Chat on WhatsApp"
  >
    <Icon name="ph:whatsapp-logo" size="1.75rem" aria-hidden="true" />
  </a>
</template>

<script setup lang="ts">
const waUrl = useWhatsAppLink()

// Hidden while the footer or a section with its own WhatsApp button is on screen,
// so it never covers footer links or duplicates a visible call to action.
const visibleTargets = ref(new Set<Element>())
const isHidden = computed(() => visibleTargets.value.size > 0)
let observer: IntersectionObserver | undefined

const observeTargets = () => {
  observer?.disconnect()
  visibleTargets.value = new Set()
  observer = new IntersectionObserver((entries) => {
    const next = new Set(visibleTargets.value)
    for (const entry of entries) {
      if (entry.isIntersecting) next.add(entry.target)
      else next.delete(entry.target)
    }
    visibleTargets.value = next
  })
  document.querySelectorAll('.site-footer, [data-wa-cta]').forEach((element) => observer?.observe(element))
}

onMounted(observeTargets)
// Re-scan after each client-side navigation, once the new page is in the DOM.
useNuxtApp().hook('page:finish', () => nextTick(observeTargets))
onBeforeUnmount(() => observer?.disconnect())
</script>
