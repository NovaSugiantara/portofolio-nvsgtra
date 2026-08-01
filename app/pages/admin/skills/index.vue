<template>
  <section class="mx-auto max-w-5xl space-y-6">
    <header class="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Owner console / capabilities</p>
        <h1 class="mt-2 font-heading text-3xl font-bold tracking-tight">Skills</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">Edit the grouped skills shown in the public profile. Save all rows together when the list is ready.</p>
      </div>
      <button type="button" class="min-h-11 rounded-md bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60" :disabled="saving" @click="addRow">
        Add skill
      </button>
    </header>

    <div v-if="pending" class="space-y-3" role="status" aria-busy="true">
      <div v-for="row in 3" :key="row" class="h-24 animate-pulse rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)]" />
      <span class="sr-only">Loading skills</span>
    </div>

    <div v-else-if="fetchError" class="rounded-lg border border-red-300 bg-[var(--background-card)] p-6" role="alert">
      <h2 class="font-heading text-lg font-semibold">Skills could not be loaded</h2>
      <p class="mt-2 text-sm text-[var(--foreground-secondary)]">{{ getApiError(fetchError, 'Unable to load skills.') }}</p>
      <button type="button" class="mt-4 min-h-11 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" @click="refresh">Try again</button>
    </div>

    <form v-else class="space-y-4" novalidate @input="markDirty" @submit.prevent="saveAll">
      <div v-if="!rows.length" class="rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--background-card)] p-8 text-center" role="status">
        <h2 class="font-heading text-lg font-semibold">No skills yet</h2>
        <p class="mt-2 text-sm text-[var(--foreground-secondary)]">Add the first capability group to start building the public skills section.</p>
        <button type="button" class="mt-4 min-h-11 rounded-md border border-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" @click="addRow">Add first skill</button>
      </div>

      <fieldset v-for="(skill, index) in rows" :key="skill.id ?? `new-${index}`" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
        <legend class="sr-only">Skill {{ index + 1 }}</legend>
        <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7rem_auto] md:items-end">
          <div>
            <label :for="`skill-category-${index}`" class="field-label">Category</label>
            <input :id="`skill-category-${index}`" v-model="skill.category" :name="`skills[${index}][category]`" class="field-input" :class="hasRowError(index, 'category') ? 'border-red-600' : ''" :aria-invalid="hasRowError(index, 'category')" :aria-describedby="`skill-category-${index}-error`" placeholder="Frontend" autocomplete="off" />
            <p v-if="rowErrors[index]?.category" :id="`skill-category-${index}-error`" class="field-error">{{ rowErrors[index].category }}</p>
          </div>
          <div>
            <label :for="`skill-name-${index}`" class="field-label">Skill name</label>
            <input :id="`skill-name-${index}`" v-model="skill.name" :name="`skills[${index}][name]`" class="field-input" :class="hasRowError(index, 'name') ? 'border-red-600' : ''" :aria-invalid="hasRowError(index, 'name')" :aria-describedby="`skill-name-${index}-error`" placeholder="Vue.js" autocomplete="off" />
            <p v-if="rowErrors[index]?.name" :id="`skill-name-${index}-error`" class="field-error">{{ rowErrors[index].name }}</p>
          </div>
          <div>
            <label :for="`skill-order-${index}`" class="field-label">Order</label>
            <input :id="`skill-order-${index}`" v-model.number="skill.sort_order" :name="`skills[${index}][sort_order]`" type="number" min="0" max="100000" class="field-input" :class="hasRowError(index, 'sort_order') ? 'border-red-600' : ''" :aria-invalid="hasRowError(index, 'sort_order')" :aria-describedby="`skill-order-${index}-error`" autocomplete="off" />
            <p v-if="rowErrors[index]?.sort_order" :id="`skill-order-${index}-error`" class="field-error">{{ rowErrors[index].sort_order }}</p>
          </div>
          <div class="flex items-center justify-between gap-3 md:flex-col md:items-stretch">
            <label :for="`skill-published-${index}`" class="flex min-h-11 items-center gap-2 text-sm font-semibold">
              <input :id="`skill-published-${index}`" v-model="skill.is_published" :name="`skills[${index}][is_published]`" type="checkbox" class="h-5 w-5 rounded border-[var(--border-subtle)] text-[var(--accent-primary)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" />
              Published
            </label>
            <button type="button" class="min-h-11 rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-60" :disabled="saving || deletingId === skill.id" @click="removeRow(index)">
              {{ deletingId === skill.id ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </fieldset>

      <div v-if="formError" class="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">{{ formError }}</div>
      <p v-if="saved" class="rounded-md border border-teal-300 bg-[var(--background-muted)] px-4 py-3 text-sm font-semibold" role="status" aria-live="polite">Skills saved successfully.</p>
      <p v-if="deletedLabel" class="rounded-md border border-teal-300 bg-[var(--background-muted)] px-4 py-3 text-sm" role="status" aria-live="polite">{{ deletedLabel }}</p>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" :disabled="saving || !rows.length" :aria-busy="saving" class="min-h-11 rounded-md bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60">{{ saving ? 'Saving…' : 'Save all skills' }}</button>
        <span v-if="isDirty && !saving" class="text-sm text-[var(--foreground-muted)]">Unsaved changes</span>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { onBeforeRouteLeave } from 'vue-router'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface SkillRow { id?: string; category: string; name: string; sort_order: number; is_published: boolean }
type ApiErrorLike = { data?: unknown; statusMessage?: unknown }
type RowErrors = Record<number, Record<string, string>>

const skillSchema = z.object({
  category: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  sort_order: z.number().int().min(0).max(100000).optional(),
  is_published: z.boolean().optional(),
}).strict()

const getApiError = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback
  const candidate = error as ApiErrorLike
  const data = candidate.data && typeof candidate.data === 'object' ? candidate.data as Record<string, unknown> : null
  const message = data?.statusMessage ?? candidate.statusMessage
  return typeof message === 'string' && message.length > 0 ? message : fallback
}

const { data, pending, error: fetchError, refresh } = await useFetch<SkillRow[]>('/api/admin/skills')
const rows = ref<SkillRow[]>(data.value ?? [])
const saving = ref(false)
const isDirty = ref(false)
const saved = ref(false)
const formError = ref('')
const rowErrors = ref<RowErrors>({})
const deletingId = ref<string | null>(null)
const deletedLabel = ref('')

watch(data, (value) => { if (!isDirty.value) rows.value = value ?? [] })

const markDirty = () => {
  isDirty.value = true
  saved.value = false
  deletedLabel.value = ''
  rowErrors.value = {}
}

const addRow = () => {
  rows.value = [...rows.value, { category: '', name: '', sort_order: rows.value.length, is_published: true }]
  markDirty()
}

const hasRowError = (index: number, field: string) => Boolean(rowErrors.value[index]?.[field])

const removeRow = async (index: number) => {
  const skill = rows.value[index]
  const label = skill.name.trim() || 'this skill'
  if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return

  if (!skill.id) {
    rows.value = rows.value.filter((_row, rowIndex) => rowIndex !== index)
    markDirty()
    return
  }

  deletingId.value = skill.id
  formError.value = ''
  deletedLabel.value = ''
  try {
    await $fetch(`/api/admin/skills/${skill.id}`, { method: 'DELETE' })
    const hadUnsavedChanges = isDirty.value
    rows.value = rows.value.filter((row) => row.id !== skill.id)
    isDirty.value = hadUnsavedChanges
    deletedLabel.value = `${label} deleted.`
  } catch (error) {
    formError.value = getApiError(error, 'Unable to delete the skill. It is still in the list.')
  } finally {
    deletingId.value = null
  }
}

const saveAll = async () => {
  saving.value = true
  saved.value = false
  formError.value = ''
  rowErrors.value = {}

  const parsedRows = rows.value.map((row) => skillSchema.safeParse({
    category: row.category,
    name: row.name,
    sort_order: row.sort_order,
    is_published: row.is_published,
  }))
  const errors: RowErrors = {}
  parsedRows.forEach((result, index) => {
    if (!result.success) errors[index] = Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0] ?? 'form'), issue.message]))
  })
  if (Object.keys(errors).length) {
    rowErrors.value = errors
    formError.value = 'Review the highlighted skill rows before saving.'
    await nextTick()
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    saving.value = false
    return
  }

  try {
    for (const [index, result] of parsedRows.entries()) {
      if (!result.success) continue
      const response = result.data
      const savedRow = rows.value[index].id
        ? await $fetch<SkillRow>(`/api/admin/skills/${rows.value[index].id}`, { method: 'PUT', body: response })
        : await $fetch<SkillRow>('/api/admin/skills', { method: 'POST', body: response })
      rows.value = rows.value.map((row, rowIndex) => rowIndex === index ? savedRow : row)
    }
    isDirty.value = false
    saved.value = true
  } catch (error) {
    formError.value = getApiError(error, 'Unable to save all skills. Saved rows remain in the list; review and try again.')
  } finally {
    saving.value = false
  }
}

const beforeUnload = (event: BeforeUnloadEvent) => {
  if (!isDirty.value) return
  event.preventDefault()
  event.returnValue = ''
}

onMounted(() => window.addEventListener('beforeunload', beforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
onBeforeRouteLeave((_to, _from, next) => {
  if (!isDirty.value || saving.value || window.confirm('You have unsaved skill changes. Leave without saving?')) next()
  else next(false)
})
</script>

<style scoped>
.field-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; }
.field-input { min-height: 2.75rem; width: 100%; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--background-page); padding: 0.625rem 0.75rem; color: var(--foreground-primary); transition: var(--transition-smooth); }
.field-input::placeholder { color: var(--foreground-muted); }
.field-input:focus-visible { border-color: var(--border-focus); outline: 2px solid var(--border-focus); outline-offset: 2px; }
.field-error { margin-top: 0.375rem; font-size: 0.75rem; font-weight: 600; color: #991b1b; }
</style>
