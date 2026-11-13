<template>
  <ul v-if="items.length" class="flex flex-wrap gap-2" aria-label="Technologies">
    <li v-for="item in items" :key="item" class="rounded-sm border border-line bg-soft px-2 py-0.5 font-mono text-xs leading-5 text-secondary">{{ item }}</li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>
