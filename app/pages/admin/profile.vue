<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">Profile</h1>

    <form v-if="form" class="space-y-4" @submit.prevent="save">
      <div>
        <label class="block text-sm font-medium mb-1">Full name</label>
        <input v-model="form.full_name" class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Headline</label>
        <input v-model="form.headline" class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Summary</label>
        <textarea v-model="form.summary" rows="4" class="w-full rounded border px-3 py-2" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Location</label>
          <input v-model="form.location" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone</label>
          <input v-model="form.phone" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">LinkedIn</label>
          <input v-model="form.linkedin_url" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Website</label>
          <input v-model="form.website_url" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Avatar URL</label>
          <input v-model="form.avatar_url" class="w-full rounded border px-3 py-2" />
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.is_published" type="checkbox" />
        Published (visible on public site)
      </label>

      <div class="flex gap-3">
        <button type="submit" :disabled="saving" class="rounded bg-blue-600 px-4 py-2 text-white">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <span v-if="saved" class="text-sm text-green-600 self-center">Saved!</span>
        <span v-if="err" class="text-sm text-red-600 self-center">{{ err }}</span>
      </div>
    </form>
    <p v-else class="text-gray-600">Loading...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface ProfileForm {
  full_name: string
  headline: string
  summary: string | null
  location: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  website_url: string | null
  avatar_url: string | null
  is_published: boolean
}

const { data, refresh } = await useFetch<ProfileForm[]>('/api/admin/profile')
const form = ref<ProfileForm | null>(data.value?.[0] ?? null)
const saving = ref(false)
const saved = ref(false)
const err = ref('')

watch(data, () => {
  if (!form.value) form.value = data.value?.[0] ?? null
})

const save = async () => {
  saving.value = true
  err.value = ''
  saved.value = false
  try {
    await $fetch('/api/admin/profile', { method: 'PUT', body: form.value })
    saved.value = true
    await refresh()
  } catch (e) {
    err.value = e instanceof Error ? e.message : 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>
