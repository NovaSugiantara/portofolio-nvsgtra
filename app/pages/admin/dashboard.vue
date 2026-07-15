<template>
  <div>
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <p class="mt-2 text-gray-600">Owner-only admin dashboard.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })
</script>
