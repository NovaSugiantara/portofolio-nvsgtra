<template>
  <div class="mx-auto max-w-4xl space-y-8 px-4 py-16 md:px-6 lg:py-20">
    <div v-if="pending" class="text-sm text-[var(--foreground-muted)]">Loading project...</div>
    <div v-else-if="project?.data" class="space-y-8">
      <div class="space-y-4">
        <h1 class="text-4xl font-extrabold tracking-tight font-heading text-[var(--foreground-primary)]">{{ project.data.title }}</h1>
        <p class="max-w-prose leading-relaxed text-[var(--foreground-secondary)]">{{ project.data.description }}</p>
        <div class="flex flex-wrap gap-2" v-if="project.data.tech_stack?.length">
          <span
            v-for="tech in project.data.tech_stack"
            :key="tech"
            class="rounded-md bg-[var(--background-muted)] px-2 py-0.5 font-mono text-xs text-[var(--foreground-secondary)]"
          >{{ tech }}</span>
        </div>
      </div>

      <div class="grid gap-4 text-sm sm:grid-cols-2">
        <div v-if="project.data.role" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4">
          <span class="font-semibold font-heading text-[var(--foreground-primary)]">Role</span>
          <p class="mt-1 text-[var(--foreground-secondary)]">{{ project.data.role }}</p>
        </div>
        <div v-if="project.data.project_url" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4">
          <span class="font-semibold font-heading text-[var(--foreground-primary)]">Live</span>
          <p class="mt-1"><a :href="project.data.project_url" target="_blank" rel="noopener" class="text-[var(--accent-primary)] underline underline-offset-2">Visit project</a></p>
        </div>
        <div v-if="project.data.repo_url" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4">
          <span class="font-semibold font-heading text-[var(--foreground-primary)]">Code</span>
          <p class="mt-1"><a :href="project.data.repo_url" target="_blank" rel="noopener" class="text-[var(--accent-primary)] underline underline-offset-2">Repository</a></p>
        </div>
      </div>

      <hr class="border-[var(--border-subtle)]" />

      <NuxtLink to="/projects" class="inline-flex text-sm font-medium text-[var(--accent-primary)] underline underline-offset-4 font-heading">← Back to Portofolio</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: project, status } = useFetch('/api/projects', {
  key: 'projects',
  transform: (projects: Array<{ slug: string }>) =>
    (projects as Array<{ slug: string }>).find((p) => p.slug === route.params.slug),
})
const pending = computed(() => status.value === 'idle' || status.value === 'pending')

useSeoMeta({
  title: () => project?.value?.title ?? 'Project',
  description: () => project?.value?.description?.slice(0, 160) ?? '',
})
</script>
