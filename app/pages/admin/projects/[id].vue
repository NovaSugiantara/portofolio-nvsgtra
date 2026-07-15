<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">{{ isNew ? 'New' : 'Edit' }} Project</h1>

    <form v-if="form" class="space-y-4" @submit.prevent="save">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input v-model="form.title" class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Slug</label>
        <input v-model="form.slug" class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Role</label>
        <input v-model="form.role" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="form.description" rows="4" class="w-full rounded border px-3 py-2" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Project URL</label>
          <input v-model="form.project_url" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Repo URL</label>
          <input v-model="form.repo_url" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Cover Image URL</label>
          <input v-model="form.cover_image_url" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Sort Order</label>
          <input v-model.number="form.sort_order" type="number" class="w-full rounded border px-3 py-2" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
        <input :value="form.tech_stack.join(', ')" @input="onTech" class="w-full rounded border px-3 py-2" />
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.is_published" type="checkbox" />
        Published
      </label>

      <div class="flex gap-3">
        <button type="submit" :disabled="saving" class="rounded bg-blue-600 px-4 py-2 text-white">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <NuxtLink to="/admin/projects" class="self-center text-sm text-gray-600">Cancel</NuxtLink>
        <span v-if="err" class="text-sm text-red-600 self-center">{{ err }}</span>
      </div>
    </form>
    <p v-else class="text-gray-600">Loading...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface ProjectForm {
  title: string
  slug: string
  role: string | null
  description: string | null
  project_url: string | null
  repo_url: string | null
  cover_image_url: string | null
  sort_order: number
  tech_stack: string[]
  is_published: boolean
}

const route = useRoute()
const id = computed(() => route.params.id as string)
const isNew = computed(() => id.value === 'new')
const form = ref<ProjectForm | null>(null)
const saving = ref(false)
const err = ref('')

if (!isNew.value) {
  const { data } = await useFetch<ProjectForm>(`/api/admin/projects/${id.value}`, {
    onResponse({ response }) {
      if (response._data) form.value = response._data
    },
  })
  if (data.value) form.value = data.value
} else {
  form.value = {
    title: '', slug: '', role: null, description: null, project_url: null,
    repo_url: null, cover_image_url: null, sort_order: 0, tech_stack: [], is_published: false,
  }
}

const onTech = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  if (form.value) form.value.tech_stack = v.split(',').map(s => s.trim()).filter(Boolean)
}

const save = async () => {
  saving.value = true
  err.value = ''
  try {
    if (isNew.value) {
      await $fetch('/api/admin/projects', { method: 'POST', body: form.value })
    } else {
      await $fetch(`/api/admin/projects/${id.value}`, { method: 'PUT', body: form.value })
    }
    await navigateTo('/admin/projects')
  } catch (e) {
    err.value = e instanceof Error ? e.message : 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>
