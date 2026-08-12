<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <header class="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Owner console / work</p>
        <h1 class="mt-2 font-heading text-3xl font-bold tracking-tight">{{ isCreate ? 'New project' : 'Edit project' }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">Use the project form to control the portfolio record and its public visibility.</p>
      </div>
      <NuxtLink to="/admin/projects" class="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--border-subtle)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Back to projects</NuxtLink>
    </header>

    <div v-if="loading" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-6" role="status" aria-busy="true">
      <div class="space-y-3 animate-pulse"><div class="h-11 rounded bg-[var(--background-muted)]" /><div class="h-11 rounded bg-[var(--background-muted)]" /><div class="h-28 rounded bg-[var(--background-muted)]" /></div>
      <span class="sr-only">Loading project</span>
    </div>

    <div v-else-if="loadError" class="rounded-lg border border-red-300 bg-[var(--background-card)] p-6" role="alert">
      <h2 class="font-heading text-lg font-semibold">Project could not be loaded</h2>
      <p class="mt-2 text-sm text-[var(--foreground-secondary)]">{{ loadError }}</p>
      <button type="button" class="mt-4 min-h-11 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" @click="reload">Try again</button>
    </div>

    <div v-else-if="!form" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-6" role="status">
      <h2 class="font-heading text-lg font-semibold">Project not found</h2>
      <p class="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">This project is not available to the current owner account.</p>
    </div>

    <form v-else class="space-y-6" novalidate @input="markDirty" @submit.prevent="save">
      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="project-title" class="field-label">Title</label>
            <input id="project-title" v-model="form.title" name="title" class="field-input" :class="fieldClass('title')" :aria-invalid="Boolean(fieldErrors.title)" aria-describedby="project-title-error" autocomplete="off" />
            <p v-if="fieldErrors.title" id="project-title-error" class="field-error">{{ fieldErrors.title }}</p>
          </div>
          <div>
            <label for="project-slug" class="field-label">Slug</label>
            <input id="project-slug" v-model="form.slug" name="slug" class="field-input font-mono" :class="fieldClass('slug')" :aria-invalid="Boolean(fieldErrors.slug)" aria-describedby="project-slug-help project-slug-error" autocomplete="off" spellcheck="false" />
            <p id="project-slug-help" class="field-help">Lowercase letters, numbers, and single hyphens.</p>
            <p v-if="fieldErrors.slug" id="project-slug-error" class="field-error">{{ fieldErrors.slug }}</p>
          </div>
          <div>
            <label for="project-role" class="field-label">Role <span class="font-normal text-[var(--foreground-muted)]">(optional)</span></label>
            <input id="project-role" v-model="form.role" name="role" class="field-input" :class="fieldClass('role')" :aria-invalid="Boolean(fieldErrors.role)" aria-describedby="project-role-error" autocomplete="off" />
            <p v-if="fieldErrors.role" id="project-role-error" class="field-error">{{ fieldErrors.role }}</p>
          </div>
          <div>
            <label for="project-sort-order" class="field-label">Sort order</label>
            <input id="project-sort-order" v-model.number="form.sort_order" name="sort_order" type="number" min="0" max="100000" class="field-input" :class="fieldClass('sort_order')" :aria-invalid="Boolean(fieldErrors.sort_order)" aria-describedby="project-sort-order-error" autocomplete="off" />
            <p v-if="fieldErrors.sort_order" id="project-sort-order-error" class="field-error">{{ fieldErrors.sort_order }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="project-description" class="field-label">Description <span class="font-normal text-[var(--foreground-muted)]">(optional)</span></label>
            <textarea id="project-description" v-model="form.description" name="description" rows="5" class="field-input resize-y" :class="fieldClass('description')" :aria-invalid="Boolean(fieldErrors.description)" aria-describedby="project-description-error" />
            <p v-if="fieldErrors.description" id="project-description-error" class="field-error">{{ fieldErrors.description }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="project-tech-stack" class="field-label">Tech stack</label>
            <input id="project-tech-stack" :value="form.tech_stack.join(', ')" name="tech_stack" class="field-input" :class="fieldClass('tech_stack')" :aria-invalid="Boolean(fieldErrors.tech_stack)" aria-describedby="project-tech-stack-help project-tech-stack-error" autocomplete="off" @input="onTech" />
            <p id="project-tech-stack-help" class="field-help">Separate technologies with commas.</p>
            <p v-if="fieldErrors.tech_stack" id="project-tech-stack-error" class="field-error">{{ fieldErrors.tech_stack }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <h2 class="mb-5 font-heading text-xl font-semibold">Links and media</h2>
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="project-url" class="field-label">Project URL</label>
            <input id="project-url" v-model="form.project_url" name="project_url" type="url" class="field-input" :class="fieldClass('project_url')" :aria-invalid="Boolean(fieldErrors.project_url)" aria-describedby="project-url-error" inputmode="url" autocomplete="url" />
            <p v-if="fieldErrors.project_url" id="project-url-error" class="field-error">{{ fieldErrors.project_url }}</p>
          </div>
          <div>
            <label for="project-repo-url" class="field-label">Repository URL</label>
            <input id="project-repo-url" v-model="form.repo_url" name="repo_url" type="url" class="field-input" :class="fieldClass('repo_url')" :aria-invalid="Boolean(fieldErrors.repo_url)" aria-describedby="project-repo-url-error" inputmode="url" autocomplete="url" />
            <p v-if="fieldErrors.repo_url" id="project-repo-url-error" class="field-error">{{ fieldErrors.repo_url }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="project-cover-image" class="field-label">Cover image URL</label>
            <input id="project-cover-image" v-model="form.cover_image_url" name="cover_image_url" type="url" class="field-input" :class="fieldClass('cover_image_url')" :aria-invalid="Boolean(fieldErrors.cover_image_url)" aria-describedby="project-cover-image-error" inputmode="url" autocomplete="url" />
            <p v-if="fieldErrors.cover_image_url" id="project-cover-image-error" class="field-error">{{ fieldErrors.cover_image_url }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <label for="project-published" class="flex min-h-11 items-start gap-3 text-sm font-semibold">
          <input id="project-published" v-model="form.is_published" name="is_published" type="checkbox" class="mt-1 h-5 w-5 rounded border-[var(--border-subtle)] text-[var(--accent-primary)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" />
          <span>Publish project<span class="mt-1 block font-normal leading-6 text-[var(--foreground-secondary)]">Drafts stay out of public project listings.</span></span>
        </label>
      </div>

      <div v-if="formError" class="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">{{ formError }}</div>
      <p v-if="saved" class="rounded-md border border-teal-300 bg-[var(--background-muted)] px-4 py-3 text-sm font-semibold" role="status" aria-live="polite">Project saved successfully.</p>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" :disabled="saving" :aria-busy="saving" class="min-h-11 rounded-md bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60">{{ saving ? 'Saving…' : isCreate ? 'Create project' : 'Save project' }}</button>
        <span v-if="isDirty && !saving" class="text-sm text-[var(--foreground-muted)]">Unsaved changes</span>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { onBeforeRouteLeave } from 'vue-router'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface ProjectForm { id?: string; title: string; slug: string; role: string | null; description: string | null; project_url: string | null; repo_url: string | null; cover_image_url: string | null; sort_order: number; tech_stack: string[]; is_published: boolean }
type FieldErrors = Partial<Record<keyof ProjectForm, string>>
type ApiErrorLike = { data?: unknown; statusMessage?: unknown }

const text = (max: number) => z.string().trim().max(max).nullable().optional()
const httpUrl = z.string().trim().max(2048).url().refine((value) => {
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}, 'URL must use HTTP or HTTPS')
const projectSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase kebab-case'),
  title: z.string().trim().min(1).max(200),
  description: text(5000),
  tech_stack: z.array(z.string().trim().min(1).max(100)).max(50),
  role: text(200),
  project_url: httpUrl.nullable().optional(),
  repo_url: httpUrl.nullable().optional(),
  cover_image_url: httpUrl.nullable().optional(),
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
const normalize = (value: string | null) => value?.trim() ? value.trim() : null
const normalizeForm = (value: ProjectForm): ProjectForm => ({ ...value, title: value.title.trim(), slug: value.slug.trim(), role: normalize(value.role), description: normalize(value.description), project_url: normalize(value.project_url), repo_url: normalize(value.repo_url), cover_image_url: normalize(value.cover_image_url), tech_stack: value.tech_stack.map((item) => item.trim()).filter(Boolean) })
const defaults = (): ProjectForm => ({ title: '', slug: '', role: null, description: null, project_url: null, repo_url: null, cover_image_url: null, sort_order: 0, tech_stack: [], is_published: false })

const route = useRoute()
const id = computed(() => String(route.params.id ?? 'new'))
const isNew = computed(() => id.value === 'new')
const persistedId = ref<string | null>(isNew.value ? null : id.value)
const isCreate = computed(() => !persistedId.value)
const form = ref<ProjectForm | null>(null)
const loading = ref(isNew.value === false)
const loadError = ref('')
const saving = ref(false)
const saved = ref(false)
const formError = ref('')
const fieldErrors = ref<FieldErrors>({})
const isDirty = ref(false)

if (isNew.value) form.value = defaults()
else {
  const { data: initialData, error: initialError } = await useFetch<ProjectForm>(`/api/admin/projects/${id.value}`)
  if (initialError.value) loadError.value = getApiError(initialError.value, 'Unable to load the project.')
  else if (initialData.value) form.value = { ...initialData.value, tech_stack: [...initialData.value.tech_stack] }
  else loadError.value = 'Project was not returned by the server.'
  loading.value = false
}

const reload = async () => {
  if (isNew.value) { form.value = defaults(); return }
  loading.value = true
  loadError.value = ''
  try {
    const response = await $fetch<ProjectForm>(`/api/admin/projects/${id.value}`)
    form.value = { ...response, tech_stack: [...response.tech_stack] }
  } catch (error) {
    loadError.value = getApiError(error, 'Unable to load the project.')
  } finally {
    loading.value = false
  }
}

const markDirty = () => { isDirty.value = true; saved.value = false; fieldErrors.value = {} }
const onTech = (event: Event) => {
  if (!form.value) return
  const value = (event.target as HTMLInputElement).value
  form.value.tech_stack = value.split(',').map((item) => item.trim()).filter(Boolean)
}
const fieldClass = (field: keyof ProjectForm) => fieldErrors.value[field] ? 'border-red-600 focus-visible:ring-red-600' : ''
const collectErrors = (issues: z.ZodIssue[]) => {
  const errors: FieldErrors = {}
  for (const issue of issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && field in projectSchema.shape && !(field in errors)) errors[field as keyof ProjectForm] = issue.message
  }
  return errors
}

const save = async () => {
  if (!form.value) return
  saving.value = true
  saved.value = false
  formError.value = ''
  fieldErrors.value = {}
  const parsed = projectSchema.safeParse(normalizeForm(form.value))
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
      ? await $fetch<ProjectForm>(`/api/admin/projects/${persistedId.value}`, { method: 'PUT', body: parsed.data })
      : await $fetch<ProjectForm>('/api/admin/projects', { method: 'POST', body: parsed.data })
    form.value = { ...response, tech_stack: [...response.tech_stack] }
    persistedId.value = response.id ?? persistedId.value
    isDirty.value = false
    saved.value = true
  } catch (error) {
    formError.value = getApiError(error, 'Unable to save the project. Your changes are still on this form.')
  } finally { saving.value = false }
}

const beforeUnload = (event: BeforeUnloadEvent) => { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
onMounted(() => window.addEventListener('beforeunload', beforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
onBeforeRouteLeave((_to, _from, next) => {
  if (!isDirty.value || saving.value || window.confirm('You have unsaved project changes. Leave without saving?')) next()
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
