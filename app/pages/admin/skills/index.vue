<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Skills</h1>
      <button class="rounded bg-blue-600 px-4 py-2 text-white text-sm" @click="addRow">+ Add</button>
    </div>

    <p v-if="pending" class="text-gray-600">Loading...</p>
    <form v-else class="space-y-3" @submit.prevent="saveAll">
      <div v-for="(s, i) in rows" :key="i" class="flex gap-2 items-center">
        <input v-model="s.category" placeholder="Category" class="w-40 rounded border px-2 py-1 text-sm" />
        <input v-model="s.name" placeholder="Skill name" class="flex-1 rounded border px-2 py-1 text-sm" />
        <label class="flex items-center gap-1 text-sm">
          <input v-model="s.is_published" type="checkbox" /> Pub
        </label>
        <button type="button" class="text-red-600 text-sm" @click="removeRow(i)">✕</button>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" :disabled="saving" class="rounded bg-blue-600 px-4 py-2 text-white text-sm">
          {{ saving ? 'Saving...' : 'Save All' }}
        </button>
        <span v-if="saved" class="text-sm text-green-600 self-center">Saved!</span>
        <span v-if="err" class="text-sm text-red-600 self-center">{{ err }}</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface SkillRow {
  id?: string
  category: string
  name: string
  is_published: boolean
}

const { data, pending, refresh } = await useFetch<SkillRow[]>('/api/admin/skills')
const rows = ref<SkillRow[]>(data.value ?? [])
const saving = ref(false)
const saved = ref(false)
const err = ref('')

watch(data, () => { if (!rows.value.length) rows.value = data.value ?? [] })

const addRow = () => rows.value.push({ category: '', name: '', is_published: true })
const removeRow = (i: number) => rows.value.splice(i, 1)

const saveAll = async () => {
  saving.value = true
  err.value = ''
  saved.value = false
  try {
    // upsert via PUT per row that has id, POST for new
    for (const s of rows.value) {
      if (s.id) {
        await $fetch(`/api/admin/skills/${s.id}`, { method: 'PUT', body: { category: s.category, name: s.name, is_published: s.is_published } })
      } else if (s.name && s.category) {
        await $fetch('/api/admin/skills', { method: 'POST', body: { category: s.category, name: s.name, is_published: s.is_published } })
      }
    }
    saved.value = true
    await refresh()
  } catch (e) {
    err.value = e instanceof Error ? e.message : 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>
