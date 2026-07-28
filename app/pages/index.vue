<template>
  <div class="mx-auto min-h-screen max-w-7xl px-4 py-16 md:px-6 lg:px-12 lg:py-24">
    <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <!-- Hero Text -->
      <div class="space-y-6">
        <h1
          class="text-4xl font-extrabold leading-[1.1] tracking-tight font-heading text-[var(--foreground-primary)] md:text-5xl"
        >
          {{ profile?.full_name || 'Nova Sugiantara' }}
        </h1>
        <p class="text-xl leading-relaxed text-[var(--foreground-secondary)] font-heading">
          {{ profile?.headline || 'Full Stack Web Developer' }}
        </p>
        <p class="max-w-xl leading-relaxed text-[var(--foreground-secondary)]">
          {{ profile?.summary }}
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <NuxtLink
            to="/contact"
            class="inline-flex h-11 items-center rounded-full bg-[var(--accent-primary)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-2"
          >
            Contact Me
          </NuxtLink>
          <a
            href="/api/cv/generate?variant=default"
            target="_blank"
            class="inline-flex h-11 items-center rounded-full border border-[var(--border-subtle)] bg-[var(--background-card)] px-6 text-sm font-medium text-[var(--foreground-primary)] transition hover:bg-[var(--background-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-2"
          >
            Download CV
          </a>
        </div>
      </div>

      <!-- Hero Photo — DESIGN.md §5 Triple-Layer Canvas -->
      <div class="relative mx-auto w-full max-w-[340px] md:max-w-[400px]">
        <!-- Glow -->
        <div
          class="absolute inset-0 scale-95 transform rounded-full opacity-20 blur-3xl transition-all duration-700 hover:scale-105"
          style="background-color: var(--accent-primary)"
        />
        <!-- Outer Dashed Border -->
        <div
          class="absolute inset-2 rounded-2xl border-2 border-dashed opacity-40"
          style="border-color: var(--accent-primary)"
        />
        <!-- Main Image Canvas -->
        <div
          class="absolute inset-6 overflow-hidden rounded-2xl border shadow-xl transition-all duration-300 hover:-translate-y-1"
          :style="{
            backgroundColor: 'var(--background-muted)',
            borderColor: 'var(--border-subtle)',
          }"
        >
          <div
            v-if="profile?.avatar_url"
            class="absolute inset-0 z-10 bg-gradient-to-tr opacity-45 transition-opacity duration-300 hover:opacity-0 pointer-events-none"
            :style="{
              background: 'linear-gradient(to top right, var(--color-obsidian), var(--color-steel))',
              mixBlendMode: 'color',
            }"
          />
          <img
            :src="profile?.avatar_url || '/images/placeholder-portrait.jpg'"
            :alt="`${profile?.full_name || 'Nova Sugiantara'} portrait`"
            class="h-full w-full scale-100 object-cover object-center grayscale transition-all duration-500 hover:scale-105 hover:grayscale-0"
          />
        </div>
        <!-- Available badge -->
        <div
          class="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono shadow-lg"
          :style="{
            backgroundColor: 'var(--background-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--foreground-primary)',
          }"
        >
          <span
            class="h-2 w-2 rounded-full"
            style="background-color: var(--accent-primary)"
          />
          <span>Available for Hire</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: profile } = useProfile()

useSeoMeta({
  title: 'Nova Sugiantara — Full Stack Web Developer',
  description: () => profile.value?.summary?.slice(0, 160) ?? '',
})
</script>
