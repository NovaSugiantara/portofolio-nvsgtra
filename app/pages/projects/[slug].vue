<template>
  <div class="container mx-auto px-4 max-w-4xl py-12">
    <div v-if="pending" class="text-gray-600">Loading project...</div>
    <div v-else-if="project?.data" class="space-y-6">
      <h1 class="text-4xl font-bold">{{ project.data.title }}</h1>
      <p class="text-gray-600 max-w-prose">{{ project.data.description }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div v-if="project.data.role">
          <span class="font-medium">Role:</span> {{ project.data.role }}
        </div>
        <div v-if="project.data.tech_stack?.length">
          <span class="font-medium">Tech Stack:</span>
          <span class="ml-1 flex flex-wrap gap-1 mt-1">
            <span
              v-for="tech in project.data.tech_stack"
              :key="tech"
              class="rounded-full bg-gray-100 px-2 py-0.5 text-xs"
            >
              {{ tech }}
            </span>
          </span>
        </div>
        <div v-if="project.data.project_url">
          <span class="font-medium">Live:</span>
          <a :href="project.data.project_url" target="_blank" rel="noopener" class="ml-1 underline">Visit project</a>
        </div>
        <div v-if="project.data.repo_url">
          <span class="font-medium">Code:</span>
          <a :href="project.data.repo_url" target="_blank" rel="noopener" class="ml-1 underline">Repository</a>
        </div>
      </div>
      <hr class="my-4" />
      <NuxtLink to="/projects" class="text-sm text-blue-600 underline">← Back to Portofolio</NuxtLink>
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
