<template>
  <div class="mx-auto max-w-6xl">
    <div v-if="loading" class="rounded-md border border-[var(--border-subtle)] bg-[var(--background-card)] p-6" role="status" aria-busy="true" aria-live="polite">
      <div class="h-6 w-48 animate-pulse rounded bg-[var(--background-muted)]"></div>
      <div class="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-[var(--background-muted)]"></div>
      <span class="sr-only">Checking your owner session…</span>
    </div>

    <template v-else-if="user">
      <header class="border-b border-[var(--border-subtle)] pb-6">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Owner workspace</p>
        <h1 class="mt-3 font-heading text-3xl font-bold sm:text-4xl">Dashboard</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">Manage the structured content that powers your public portfolio and tailored CVs.</p>
        <p class="mt-4 text-sm text-[var(--foreground-muted)]">Signed in as <span class="font-semibold text-[var(--foreground-secondary)]">{{ user.email }}</span></p>
      </header>

      <section class="mt-8" aria-labelledby="admin-sections-title">
        <h2 id="admin-sections-title" class="font-heading text-xl font-bold">Manage content</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="section in sections"
            :key="section.to"
            :to="section.to"
            class="rounded-md border border-[var(--border-subtle)] bg-[var(--background-card)] p-5 transition-colors hover:border-[var(--accent-primary)] hover:bg-[var(--background-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
          >
            <span class="font-heading text-lg font-bold">{{ section.label }}</span>
            <span class="mt-2 block text-sm leading-5 text-[var(--foreground-secondary)]">{{ section.description }}</span>
            <span class="mt-4 inline-block text-sm font-bold text-[var(--accent-hover)]">Open {{ section.label }} →</span>
          </NuxtLink>
        </div>
      </section>
    </template>

    <p v-else class="rounded-md border border-[var(--border-subtle)] bg-[var(--background-card)] p-6 text-sm text-[var(--foreground-secondary)]" role="status" aria-live="polite">
      Your session is being verified. You will be redirected if it has ended.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

const { user, loading } = useAuth()

const sections = [
  { label: 'Profile', to: '/admin/profile', description: 'Update the public identity and contact details.' },
  { label: 'Projects', to: '/admin/projects', description: 'Manage portfolio projects and publication state.' },
  { label: 'Experiences', to: '/admin/experiences', description: 'Keep your work history current.' },
  { label: 'Skills', to: '/admin/skills', description: 'Organize the skills shown in your portfolio.' },
  { label: 'Blog', to: '/admin/blog', description: 'Write, edit, and publish Markdown posts.' },
  { label: 'CV', to: '/admin/cv', description: 'Manage CV variants and generate tailored documents.' },
] as const
</script>
