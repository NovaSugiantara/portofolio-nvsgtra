<template>
  <div class="max-w-4xl">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">CV Variants</h1>
      <button
        class="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
        @click="startNew"
      >
        + New Variant
      </button>
    </div>

    <!-- Editor -->
    <div v-if="editing" class="mb-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-card)] p-6 shadow-sm">
      <h2 class="mb-4 text-lg font-semibold">{{ form.id ? 'Edit' : 'New' }} Variant</h2>
      <form class="space-y-5" @submit.prevent="save">
        <div>
          <label class="mb-1 block text-sm font-medium">Name</label>
          <input v-model="form.name" class="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-2" required />
        </div>

        <fieldset class="space-y-3">
          <legend class="text-sm font-medium">Include content</legend>
          <div class="grid gap-4 md:grid-cols-3">
            <div>
              <p class="mb-1 text-xs uppercase tracking-wide text-[var(--foreground-muted)]">Experiences</p>
              <div class="max-h-40 space-y-1 overflow-y-auto rounded border border-[var(--border-subtle)] p-2">
                <label v-for="e in experiences" :key="e.id" class="flex items-center gap-2 text-sm">
                  <input type="checkbox" :value="e.id" v-model="form.included_experience_ids" />
                  <span>{{ e.role }} — {{ e.company }}</span>
                </label>
              </div>
            </div>
            <div>
              <p class="mb-1 text-xs uppercase tracking-wide text-[var(--foreground-muted)]">Projects</p>
              <div class="max-h-40 space-y-1 overflow-y-auto rounded border border-[var(--border-subtle)] p-2">
                <label v-for="p in projects" :key="p.id" class="flex items-center gap-2 text-sm">
                  <input type="checkbox" :value="p.id" v-model="form.included_project_ids" />
                  <span>{{ p.title }}</span>
                </label>
              </div>
            </div>
            <div>
              <p class="mb-1 text-xs uppercase tracking-wide text-[var(--foreground-muted)]">Skills</p>
              <div class="max-h-40 space-y-1 overflow-y-auto rounded border border-[var(--border-subtle)] p-2">
                <label v-for="s in skillsFlat" :key="s.id" class="flex items-center gap-2 text-sm">
                  <input type="checkbox" :value="s.id" v-model="form.included_skill_ids" />
                  <span>{{ s.category }}: {{ s.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="form.is_default" />
          Set as default variant (public download uses this)
        </label>

        <div class="flex gap-3">
          <button type="submit" :disabled="saving" class="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
          <button type="button" class="text-sm text-[var(--foreground-muted)]" @click="cancelEdit">Cancel</button>
        </div>
        <p v-if="err" class="text-sm text-red-600">{{ err }}</p>
      </form>
    </div>

    <!-- List -->
    <p v-if="pending" class="text-sm text-[var(--foreground-muted)]">Loading…</p>
    <div v-else class="space-y-3">
      <div
        v-for="v in variants"
        :key="v.id"
        class="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--background-card)] p-4"
      >
        <div>
          <p class="font-semibold font-heading">{{ v.name }}
            <span v-if="v.is_default" class="ml-2 rounded-full bg-[var(--accent-primary)] px-2 py-0.5 text-xs text-white">default</span>
          </p>
          <p class="text-sm text-[var(--foreground-muted)]">
            {{ v.included_experience_ids?.length || 0 }} exp · {{ v.included_project_ids?.length || 0 }} proj · {{ v.included_skill_ids?.length || 0 }} skills
          </p>
        </div>
        <div class="flex gap-3 text-sm">
          <button class="text-[var(--accent-primary)]" @click="startEdit(v)">Edit</button>
          <button class="text-red-600" @click="remove(v)">Delete</button>
        </div>
      </div>
      <p v-if="!variants.length" class="text-sm text-[var(--foreground-muted)]">No variants yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface Variant {
  id: string
  name: string
  is_default: boolean
  included_experience_ids: string[]
  included_project_ids: string[]
  included_skill_ids: string[]
}

interface PickRow { id: string; role?: string; company?: string; title?: string; category?: string; name?: string }

const { data: variants, pending, refresh } = await useFetch<Variant[]>('/api/admin/cv-variants')
const { data: experiences } = await useFetch<PickRow[]>('/api/admin/experiences')
const { data: projects } = await useFetch<PickRow[]>('/api/admin/projects')
const { data: skills } = await useFetch<PickRow[]>('/api/admin/skills')
const skillsFlat = computed(() => skills.value ?? [])

const editing = ref(false)
const saving = ref(false)
const err = ref('')
const form = ref<Partial<Variant>>({
  name: '', is_default: false,
  included_experience_ids: [], included_project_ids: [], included_skill_ids: [],
})

const startNew = () => {
  form.value = { name: '', is_default: false, included_experience_ids: [], included_project_ids: [], included_skill_ids: [] }
  editing.value = true
  err.value = ''
}
const startEdit = (v: Variant) => {
  form.value = { ...v }
  editing.value = true
  err.value = ''
}
const cancelEdit = () => { editing.value = false; err.value = '' }

const save = async () => {
  saving.value = true
  err.value = ''
  try {
    if (form.value.id) {
      await $fetch(`/api/admin/cv-variants/${form.value.id}`, { method: 'PUT', body: form.value })
    } else {
      await $fetch('/api/admin/cv-variants', { method: 'POST', body: form.value })
    }
    await refresh()
    editing.value = false
  } catch (e) {
    err.value = e instanceof Error ? e.message : 'Save failed'
  } finally {
    saving.value = false
  }
}

const remove = async (v: Variant) => {
  if (!confirm(`Delete variant "${v.name}"?`)) return
  await $fetch(`/api/admin/cv-variants/${v.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
