<template>
  <figure class="shot">
    <div class="shot-bar" aria-hidden="true">
      <span /><span /><span />
      <p v-if="host">{{ host }}</p>
    </div>
    <img
      v-if="src"
      :src="src"
      :alt="alt || ''"
      width="1280"
      height="800"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
    >
  </figure>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string | null
  alt: string | null
  /** Live URL; only the host is shown in the fake address bar. */
  url?: string | null
  eager?: boolean
}>()

const host = computed(() => {
  if (!props.url) return ''
  try {
    return new URL(props.url).host
  } catch {
    return ''
  }
})
</script>
