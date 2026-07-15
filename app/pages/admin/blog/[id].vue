<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">{{ isNew ? 'New' : 'Edit' }} Blog Post</h1>

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
        <label class="block text-sm font-medium mb-1">Excerpt</label>
        <textarea v-model="form.excerpt" rows="2" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Content (Markdown)</label>
        <textarea v-model="form.content" rows="12" class="w-full rounded border px-3 py-2 font-mono text-sm" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Tags (comma separated)</label>
        <input :value="form.tags.join(', ')" @input="onTags" class="w-full rounded border px-3 py-2" />
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.is_published" type="checkbox" />
        Published
      </label>
      <div class="flex gap-3">
        <button type="submit" :disabled="saving" class="rounded bg-blue-600 px-4 py-2 text-white">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <NuxtLink to="/admin/blog" class="self-center text-sm text-gray-600">Cancel</NuxtLink>
        <span v-if="err" class="text-sm text-red-600 self-center">{{ err }}</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface Form {
  title: string
  slug: string
  excerpt: string | null
  content: string
  tags: string[]
  is_published: boolean
}

const route = useRoute()
const id = computed(() => route.params.id as string)
const isNew = computed(() => id.value === 'new')
const form = ref<Form | null>(null)
const saving = ref(false)
const err = ref('')

if (!isNew.value) {
  const { data } = await useFetch<Form>(`/api/admin/blog-posts/${id.value}`)
  if (data.value) form.value = data.value
} else {
  form.value = { title: '', slug: '', excerpt: null, content: '', tags: [], is_published: false }
}
const onTags = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  if (form.value) form.value.tags = v.split(',').map(s => s.trim()).filter(Boolean)
}
const save = async () => {
  saving.value = true
  err.value = ''
  try {
    if (isNew.value) await $fetch('/api/admin/blog-posts', { method: 'POST', body: form.value })
    else await $fetch(`/api/admin/blog-posts/${id.value}`, { method: 'PUT', body: form.value })
    await navigateTo('/admin/blog')
  } catch (e) {
    err.value = e instanceof Error ? e.message : 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>
