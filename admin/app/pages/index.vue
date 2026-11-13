<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold tracking-[-0.035em]">Projects</h1>
        <p class="mt-2 max-w-[60ch] text-secondary">Changes save immediately but show on the site after you press <strong>Publish site</strong>. Hidden projects stay here as drafts.</p>
      </div>
      <NuxtLink to="/projects/new" class="btn btn-primary"><Icon name="ph:plus" size="1rem" aria-hidden="true" />New project</NuxtLink>
    </div>

    <p v-if="actionError" class="notice notice-error mt-6" role="alert">{{ actionError }}</p>

    <div v-if="loading" class="mt-8 grid gap-3" aria-busy="true" aria-label="Loading projects">
      <div v-for="n in 3" :key="n" class="panel h-24 animate-pulse" />
    </div>

    <div v-else-if="error" class="notice notice-error mt-8" role="alert">
      {{ error }} <button type="button" class="font-semibold underline" @click="load">Retry</button>
    </div>

    <div v-else-if="!projects.length" class="panel mt-8 p-8 text-center">
      <h2 class="text-lg font-semibold">No projects yet</h2>
      <p class="mx-auto mt-2 max-w-[44ch] text-secondary">Add the first one. It stays hidden until you switch it to visible and publish.</p>
      <NuxtLink to="/projects/new" class="btn btn-primary mt-5">Add a project</NuxtLink>
    </div>

    <ol v-else class="mt-8 grid gap-3" aria-label="Projects in display order">
      <li v-for="(project, index) in projects" :key="project.id" class="panel flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
        <div class="flex flex-col gap-1">
          <button type="button" class="btn btn-secondary btn-icon" :disabled="busyId !== null || index === 0" :aria-label="`Move ${project.title} up`" @click="run(project.id, () => move(index, -1))">
            <Icon name="ph:caret-up" size="1rem" aria-hidden="true" />
          </button>
          <button type="button" class="btn btn-secondary btn-icon" :disabled="busyId !== null || index === projects.length - 1" :aria-label="`Move ${project.title} down`" @click="run(project.id, () => move(index, 1))">
            <Icon name="ph:caret-down" size="1rem" aria-hidden="true" />
          </button>
        </div>
        <img v-if="project.cover_image_url" :src="resolve(project.cover_image_url)" alt="" class="hidden aspect-[16/10] w-28 rounded-md border border-line object-cover sm:block">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-base font-semibold">{{ project.title }}</h2>
            <span class="tag" :class="{ 'tag-live': project.is_published }">
              <Icon :name="project.is_published ? 'ph:eye' : 'ph:eye-slash'" size="0.875rem" aria-hidden="true" />
              {{ project.is_published ? 'Visible' : 'Hidden' }}
            </span>
            <span class="tag">{{ project.kind === 'challenge' ? 'Challenge' : 'Work' }}</span>
          </div>
          <p class="mt-1 line-clamp-2 text-sm text-secondary">{{ project.summary }}</p>
        </div>
        <div class="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
          <button type="button" class="btn btn-secondary btn-sm" :disabled="busyId !== null" @click="run(project.id, () => setPublished(project, !project.is_published))">
            {{ project.is_published ? 'Hide' : 'Show' }}
          </button>
          <NuxtLink :to="`/projects/${project.id}`" class="btn btn-secondary btn-sm">Edit</NuxtLink>
          <button type="button" class="btn btn-danger btn-sm" :disabled="busyId !== null" @click="confirmRemove(project)">Delete</button>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { ProjectRow } from '~/composables/useProjectsAdmin'

useHead({ title: 'Projects · Admin' })

const { projects, loading, error, load, setPublished, move, remove } = useProjectsAdmin()
const { portfolioUrl } = useRuntimeConfig().public
const busyId = ref<string | null>(null)
const actionError = ref('')

const resolve = (url: string) => (url.startsWith('/') ? `${portfolioUrl}${url}` : url)

const run = async (id: string, action: () => Promise<void>) => {
  busyId.value = id
  actionError.value = ''
  try {
    await action()
  } catch (actionFailure) {
    actionError.value = actionFailure instanceof Error ? actionFailure.message : 'That did not work.'
  } finally {
    busyId.value = null
  }
}

const confirmRemove = (project: ProjectRow) => {
  if (!window.confirm(`Delete "${project.title}"? This cannot be undone. To take it off the site but keep it, use Hide instead.`)) return
  run(project.id, () => remove(project))
}

onMounted(load)
</script>
