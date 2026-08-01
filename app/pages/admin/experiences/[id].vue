<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <header class="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Owner console / timeline</p>
        <h1 class="mt-2 font-heading text-3xl font-bold tracking-tight">{{ isCreate ? 'New experience' : 'Edit experience' }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">Capture the role, dates, scope, and publication status for one timeline entry.</p>
      </div>
      <NuxtLink to="/admin/experiences" class="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--border-subtle)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Back to experience</NuxtLink>
    </header>

    <div v-if="loading" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-6" role="status" aria-busy="true">
      <div class="space-y-3 animate-pulse"><div class="h-11 rounded bg-[var(--background-muted)]" /><div class="h-11 rounded bg-[var(--background-muted)]" /><div class="h-28 rounded bg-[var(--background-muted)]" /></div>
      <span class="sr-only">Loading experience</span>
    </div>

    <div v-else-if="loadError" class="rounded-lg border border-red-300 bg-[var(--background-card)] p-6" role="alert">
      <h2 class="font-heading text-lg font-semibold">Experience could not be loaded</h2>
      <p class="mt-2 text-sm text-[var(--foreground-secondary)]">{{ loadError }}</p>
      <button type="button" class="mt-4 min-h-11 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" @click="reload">Try again</button>
    </div>

    <div v-else-if="!form" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-6" role="status">
      <h2 class="font-heading text-lg font-semibold">Experience record not found</h2>
      <p class="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">This record is not available to the current owner account.</p>
    </div>

    <form v-else class="space-y-6" novalidate @input="markDirty" @submit.prevent="save">
      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="experience-company" class="field-label">Company</label>
            <input id="experience-company" v-model="form.company" name="company" class="field-input" :class="fieldClass('company')" :aria-invalid="Boolean(fieldErrors.company)" aria-describedby="experience-company-error" autocomplete="organization" />
            <p v-if="fieldErrors.company" id="experience-company-error" class="field-error">{{ fieldErrors.company }}</p>
          </div>
          <div>
            <label for="experience-role" class="field-label">Role</label>
            <input id="experience-role" v-model="form.role" name="role" class="field-input" :class="fieldClass('role')" :aria-invalid="Boolean(fieldErrors.role)" aria-describedby="experience-role-error" autocomplete="off" />
            <p v-if="fieldErrors.role" id="experience-role-error" class="field-error">{{ fieldErrors.role }}</p>
          </div>
          <div>
            <label for="experience-location" class="field-label">Location <span class="font-normal text-[var(--foreground-muted)]">(optional)</span></label>
            <input id="experience-location" v-model="form.location" name="location" class="field-input" :class="fieldClass('location')" :aria-invalid="Boolean(fieldErrors.location)" aria-describedby="experience-location-error" autocomplete="address-level2" />
            <p v-if="fieldErrors.location" id="experience-location-error" class="field-error">{{ fieldErrors.location }}</p>
          </div>
          <div>
            <label for="experience-sort-order" class="field-label">Sort order</label>
            <input id="experience-sort-order" v-model.number="form.sort_order" name="sort_order" type="number" min="0" max="100000" class="field-input" :class="fieldClass('sort_order')" :aria-invalid="Boolean(fieldErrors.sort_order)" aria-describedby="experience-sort-order-error" autocomplete="off" />
            <p v-if="fieldErrors.sort_order" id="experience-sort-order-error" class="field-error">{{ fieldErrors.sort_order }}</p>
          </div>
          <div>
            <label for="experience-start-date" class="field-label">Start date</label>
            <input id="experience-start-date" v-model="form.start_date" name="start_date" type="date" class="field-input" :class="fieldClass('start_date')" :aria-invalid="Boolean(fieldErrors.start_date)" aria-describedby="experience-start-date-error" autocomplete="off" />
            <p v-if="fieldErrors.start_date" id="experience-start-date-error" class="field-error">{{ fieldErrors.start_date }}</p>
          </div>
          <div>
            <label for="experience-end-date" class="field-label">End date <span class="font-normal text-[var(--foreground-muted)]">(blank if current)</span></label>
            <input id="experience-end-date" v-model="form.end_date" name="end_date" type="date" class="field-input" :class="fieldClass('end_date')" :aria-invalid="Boolean(fieldErrors.end_date)" aria-describedby="experience-end-date-error" autocomplete="off" />
            <p v-if="fieldErrors.end_date" id="experience-end-date-error" class="field-error">{{ fieldErrors.end_date }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <label for="experience-bullets" class="field-label">Highlights <span class="font-normal text-[var(--foreground-muted)]">(one per line)</span></label>
        <textarea id="experience-bullets" :value="form.bullets.join('\n')" name="bullets" rows="8" class="field-input resize-y" :class="fieldClass('bullets')" :aria-invalid="Boolean(fieldErrors.bullets)" aria-describedby="experience-bullets-help experience-bullets-error" @input="onBullets" />
        <p id="experience-bullets-help" class="field-help">Use concise, outcome-focused statements. Up to 50 lines.</p>
        <p v-if="fieldErrors.bullets" id="experience-bullets-error" class="field-error">{{ fieldErrors.bullets }}</p>
      </div>

      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <label for="experience-published" class="flex min-h-11 items-start gap-3 text-sm font-semibold">
          <input id="experience-published" v-model="form.is_published" name="is_published" type="checkbox" class="mt-1 h-5 w-5 rounded border-[var(--border-subtle)] text-[var(--accent-primary)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" />
          <span>Publish experience<span class="mt-1 block font-normal leading-6 text-[var(--foreground-secondary)]">Draft records remain visible only in this owner console.</span></span>
        </label>
      </div>

      <div v-if="formError" class="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">{{ formError }}</div>
      <p v-if="saved" class="rounded-md border border-teal-300 bg-[var(--background-muted)] px-4 py-3 text-sm font-semibold" role="status" aria-live="polite">Experience saved successfully.</p>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" :disabled="saving" :aria-busy="saving" class="min-h-11 rounded-md bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60">{{ saving ? 'Saving…' : isCreate ? 'Create experience' : 'Save experience' }}</button>
        <span v-if="isDirty && !saving" class="text-sm text-[var(--foreground-muted)]">Unsaved changes</span>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { onBeforeRouteLeave } from 'vue-router'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface ExperienceForm { id?: string; company: string; role: string; location: string | null; start_date: string; end_date: string | null; bullets: string[]; sort_order: number; is_published: boolean }
type FieldErrors = Partial<Record<keyof ExperienceForm, string>>
type ApiErrorLike = { data?: unknown; statusMessage?: unknown }

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional()
const date = z.string().date()
const experienceSchema = z.object({
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  location: optionalText(200),
  start_date: date,
  end_date: date.nullable().optional(),
  bullets: z.array(z.string().trim().min(1).max(1000)).max(50),
  sort_order: z.number().int().min(0).max(100000).optional(),
  is_published: z.boolean().optional(),
}).strict().refine(({ start_date, end_date }) => !end_date || end_date >= start_date, { path: ['end_date'], message: 'End date must not precede start date' })

const getApiError = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback
  const candidate = error as ApiErrorLike
  const data = candidate.data && typeof candidate.data === 'object' ? candidate.data as Record<string, unknown> : null
  const message = data?.statusMessage ?? candidate.statusMessage
  return typeof message === 'string' && message.length > 0 ? message : fallback
}
const normalize = (value: string | null) => value?.trim() ? value.trim() : null
const normalizeForm = (value: ExperienceForm): ExperienceForm => ({ ...value, company: value.company.trim(), role: value.role.trim(), location: normalize(value.location), end_date: normalize(value.end_date), bullets: value.bullets.map((item) => item.trim()).filter(Boolean) })
const defaults = (): ExperienceForm => ({ company: '', role: '', location: null, start_date: '', end_date: null, bullets: [], sort_order: 0, is_published: true })

const route = useRoute()
const id = computed(() => String(route.params.id ?? 'new'))
const isNew = computed(() => id.value === 'new')
const persistedId = ref<string | null>(isNew.value ? null : id.value)
const isCreate = computed(() => !persistedId.value)
const form = ref<ExperienceForm | null>(null)
const loading = ref(!isNew.value)
const loadError = ref('')
const saving = ref(false)
const saved = ref(false)
const formError = ref('')
const fieldErrors = ref<FieldErrors>({})
const isDirty = ref(false)

if (isNew.value) form.value = defaults()
else {
  const { data: initialData, error: initialError } = await useFetch<ExperienceForm>(`/api/admin/experiences/${id.value}`)
  if (initialError.value) loadError.value = getApiError(initialError.value, 'Unable to load the experience record.')
  else if (initialData.value) form.value = { ...initialData.value, bullets: [...initialData.value.bullets] }
  else loadError.value = 'Experience record was not returned by the server.'
  loading.value = false
}

const reload = async () => {
  if (isNew.value) { form.value = defaults(); return }
  loading.value = true
  loadError.value = ''
  try {
    const response = await $fetch<ExperienceForm>(`/api/admin/experiences/${id.value}`)
    form.value = { ...response, bullets: [...response.bullets] }
  } catch (error) {
    loadError.value = getApiError(error, 'Unable to load the experience record.')
  } finally {
    loading.value = false
  }
}

const markDirty = () => { isDirty.value = true; saved.value = false; fieldErrors.value = {} }
const onBullets = (event: Event) => { if (form.value) form.value.bullets = (event.target as HTMLTextAreaElement).value.split('\n').map((item) => item.trim()).filter(Boolean) }
const fieldClass = (field: keyof ExperienceForm) => fieldErrors.value[field] ? 'border-red-600 focus-visible:ring-red-600' : ''
const collectErrors = (issues: z.ZodIssue[]) => {
  const errors: FieldErrors = {}
  for (const issue of issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && field in experienceSchema.shape && !(field in errors)) errors[field as keyof ExperienceForm] = issue.message
  }
  return errors
}

const save = async () => {
  if (!form.value) return
  saving.value = true
  saved.value = false
  formError.value = ''
  fieldErrors.value = {}
  const parsed = experienceSchema.safeParse(normalizeForm(form.value))
  if (!parsed.success) {
    fieldErrors.value = collectErrors(parsed.error.issues)
    formError.value = 'Review the highlighted fields before saving.'
    await nextTick()
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    saving.value = false
    return
  }
  try {
    const response = persistedId.value
      ? await $fetch<ExperienceForm>(`/api/admin/experiences/${persistedId.value}`, { method: 'PUT', body: parsed.data })
      : await $fetch<ExperienceForm>('/api/admin/experiences', { method: 'POST', body: parsed.data })
    form.value = { ...response, bullets: [...response.bullets] }
    persistedId.value = response.id ?? persistedId.value
    isDirty.value = false
    saved.value = true
  } catch (error) {
    formError.value = getApiError(error, 'Unable to save the experience. Your changes are still on this form.')
  } finally { saving.value = false }
}

const beforeUnload = (event: BeforeUnloadEvent) => { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
onMounted(() => window.addEventListener('beforeunload', beforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
onBeforeRouteLeave((_to, _from, next) => {
  if (!isDirty.value || saving.value || window.confirm('You have unsaved experience changes. Leave without saving?')) next()
  else next(false)
})
</script>

<style scoped>
.field-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; }
.field-input { min-height: 2.75rem; width: 100%; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--background-page); padding: 0.625rem 0.75rem; color: var(--foreground-primary); transition: var(--transition-smooth); }
.field-input::placeholder { color: var(--foreground-muted); }
.field-input:focus-visible { border-color: var(--border-focus); outline: 2px solid var(--border-focus); outline-offset: 2px; }
.field-help { margin-top: 0.375rem; font-size: 0.75rem; line-height: 1.25rem; color: var(--foreground-muted); }
.field-error { margin-top: 0.375rem; font-size: 0.75rem; font-weight: 600; color: #991b1b; }
</style>
