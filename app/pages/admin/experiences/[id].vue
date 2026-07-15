<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold mb-4">{{ isNew ? 'New' : 'Edit' }} Experience</h1>

    <form v-if="form" class="space-y-4" @submit.prevent="save">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Company</label>
          <input v-model="form.company" class="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Role</label>
          <input v-model="form.role" class="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Location</label>
          <input v-model="form.location" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Start Date</label>
          <input v-model="form.start_date" type="date" class="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">End Date (blank = present)</label>
          <input v-model="form.end_date" type="date" class="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Sort Order</label>
          <input v-model.number="form.sort_order" type="number" class="w-full rounded border px-3 py-2" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Bullets (one per line)</label>
        <textarea :value="form.bullets.join('\n')" @input="onBullets" rows="6" class="w-full rounded border px-3 py-2" />
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.is_published" type="checkbox" />
        Published
      </label>

      <div class="flex gap-3">
        <button type="submit" :disabled="saving" class="rounded bg-blue-600 px-4 py-2 text-white">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <NuxtLink to="/admin/experiences" class="self-center text-sm text-gray-600">Cancel</NuxtLink>
        <span v-if="err" class="text-sm text-red-600 self-center">{{ err }}</span>
      </div>
    </form>
    <p v-else class="text-gray-600">Loading...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface ExpForm {
  company: string
  role: string
  location: string | null
  start_date: string
  end_date: string | null
  bullets: string[]
  sort_order: number
  is_published: boolean
}

const route = useRoute()
const id = computed(() => route.params.id as string)
const isNew = computed(() => id.value === 'new')
const form = ref<ExpForm | null>(null)
const saving = ref(false)
const err = ref('')

if (!isNew.value) {
  const { data } = await useFetch<ExpForm>(`/api/admin/experiences/${id.value}`)
  if (data.value) form.value = data.value
} else {
  form.value = {
    company: '', role: '', location: null, start_date: '', end_date: null,
    bullets: [], sort_order: 0, is_published: true,
  }
}

const onBullets = (e: Event) => {
  const v = (e.target as HTMLTextAreaElement).value
  if (form.value) form.value.bullets = v.split('\n').map(s => s.trim()).filter(Boolean)
}

const save = async () => {
  saving.value = true
  err.value = ''
  try {
    if (isNew.value) {
      await $fetch('/api/admin/experiences', { method: 'POST', body: form.value })
    } else {
      await $fetch(`/api/admin/experiences/${id.value}`, { method: 'PUT', body: form.value })
    }
    await navigateTo('/admin/experiences')
  } catch (e) {
    err.value = e instanceof Error ? e.message : 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>
