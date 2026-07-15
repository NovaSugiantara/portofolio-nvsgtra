<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 md:py-32 container mx-auto px-4 max-w-4xl text-center">
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
        {{ profile?.full_name }}
      </h1>
      <p class="mt-4 text-xl text-gray-600">{{ profile?.headline }}</p>
      <p v-if="profile?.location" class="mt-2 text-gray-600">{{ profile.location }}</p>
      <p class="mt-6 max-w-2xl mx-auto text-gray-600 leading-relaxed">
        {{ profile?.summary }}
      </p>
      <div class="mt-8 flex gap-4 justify-center">
        <a
          href="/contact"
          class="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Contact Me
        </a>
        <!-- ponytail: Download CV CTA — CV generation in Fase 3, link placeholder for now -->
        <span
          class="inline-flex items-center rounded-md border px-6 py-3 text-sm font-medium text-gray-600 cursor-not-allowed"
          title="CV Generator coming soon (Phase 3)"
        >
          Download CV
        </span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: profile } = useProfile()

useSeoMeta({
  title: 'Nova Sugiantara — Full Stack Web Developer',
  description: () => profile.value?.summary?.slice(0, 160) ?? '',
})
</script>
