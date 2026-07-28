<template>
  <NuxtLink
    :to="to"
    class="relative px-2 py-1 text-sm font-medium font-heading transition"
    :class="[
      isActive
        ? 'text-[var(--accent-primary)]'
        : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground-primary)]',
    ]"
  >
    {{ label }}
    <span
      v-if="isActive"
      class="absolute -bottom-0.5 left-0 h-0.5 w-full"
      style="background-color: var(--accent-primary)"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  label: string
  isActive: boolean
}>()
</script>
