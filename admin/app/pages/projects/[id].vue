<template>
  <div class="max-w-3xl">
    <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm font-semibold no-underline"><Icon name="ph:arrow-left" size="1rem" aria-hidden="true" />All projects</NuxtLink>
    <h1 class="mt-3 text-3xl font-semibold tracking-[-0.035em]">{{ isNew ? 'New project' : 'Edit project' }}</h1>

    <div v-if="loading" class="panel mt-8 h-96 animate-pulse" aria-busy="true" aria-label="Loading project" />
    <p v-else-if="loadError" class="notice notice-error mt-8" role="alert">{{ loadError }}</p>

    <form v-else class="mt-8 grid gap-8" novalidate @submit.prevent="save">
      <fieldset class="panel grid gap-5 p-5 md:p-6">
        <legend class="sr-only">Basics</legend>
        <FormField v-slot="f" label="Title" :error="errors.title">
          <input :id="f.id" v-model="form.title" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" @input="syncSlug">
        </FormField>
        <FormField v-slot="f" label="Slug" hint="The page address: /projects/your-slug. Changing it breaks old links." :error="errors.slug">
          <input :id="f.id" v-model="form.slug" class="input font-mono" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" @input="slugTouched = true">
        </FormField>
        <FormField v-slot="f" label="Type" :error="errors.kind">
          <select :id="f.id" v-model="form.kind" class="input" :aria-describedby="f.describedBy">
            <option value="work">Work (client or employer project)</option>
            <option value="challenge">Challenge entry (e.g. VibeDev)</option>
          </select>
        </FormField>
        <FormField v-slot="f" label="Summary" hint="One or two sentences shown on cards." :error="errors.summary">
          <textarea :id="f.id" v-model="form.summary" class="input" rows="3" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
        </FormField>
        <FormField v-slot="f" label="Description" optional :error="errors.description">
          <textarea :id="f.id" v-model="form.description" class="input" rows="5" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
        </FormField>
        <FormField v-slot="f" label="What you did" optional hint="One item per line." :error="errors.contributions">
          <textarea :id="f.id" v-model="form.contributions" class="input" rows="5" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
        </FormField>
        <div class="grid gap-5 md:grid-cols-2">
          <FormField v-slot="f" label="Role" optional :error="errors.role">
            <input :id="f.id" v-model="form.role" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Tech stack" optional hint="Comma separated." :error="errors.tech_stack">
            <input :id="f.id" v-model="form.tech_stack" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
        </div>
        <FormField v-slot="f" label="Team note" optional hint="Who else worked on it. Keeps credit honest." :error="errors.team_note">
          <input :id="f.id" v-model="form.team_note" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
        </FormField>
      </fieldset>

      <fieldset class="panel grid gap-5 p-5 md:p-6">
        <legend class="px-1 text-sm font-semibold">Links and screenshot</legend>
        <div class="grid gap-5 md:grid-cols-2">
          <FormField v-slot="f" label="Live link" optional :error="errors.project_url">
            <input :id="f.id" v-model="form.project_url" class="input" inputmode="url" placeholder="https://" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Live link text" optional :error="errors.project_url_label">
            <input :id="f.id" v-model="form.project_url_label" class="input" placeholder="Open the live app" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
        </div>
        <FormField v-slot="f" label="Repository link" optional :error="errors.repo_url">
          <input :id="f.id" v-model="form.repo_url" class="input" inputmode="url" placeholder="https://github.com/…" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
        </FormField>
        <MediaField v-model="form.cover_image_url" label="Screenshot" />
        <FormField v-slot="f" label="Screenshot description" :optional="!form.cover_image_url" hint="What the screenshot shows, for screen readers and search." :error="errors.cover_alt">
          <input :id="f.id" v-model="form.cover_alt" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
        </FormField>
      </fieldset>

      <fieldset v-if="form.kind === 'challenge'" class="panel grid gap-5 p-5 md:p-6">
        <legend class="px-1 text-sm font-semibold">Challenge result</legend>
        <div class="grid gap-5 md:grid-cols-2">
          <FormField v-slot="f" label="Platform" :error="errors.challenge_platform">
            <input :id="f.id" v-model="form.challenge_platform" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Profile link" :error="errors.challenge_profile_url">
            <input :id="f.id" v-model="form.challenge_profile_url" class="input" inputmode="url" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Format" :error="errors.challenge_format">
            <select :id="f.id" v-model="form.challenge_format" class="input" :aria-describedby="f.describedBy">
              <option value="duel">Duel</option>
              <option value="brawl">Brawl</option>
            </select>
          </FormField>
          <FormField v-slot="f" label="Submitted on" :error="errors.challenge_submitted_at">
            <input :id="f.id" v-model="form.challenge_submitted_at" class="input" type="date" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Rank" :error="errors.challenge_rank">
            <input :id="f.id" v-model="form.challenge_rank" class="input" type="number" min="1" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Entrants" :error="errors.challenge_entrants">
            <input :id="f.id" v-model="form.challenge_entrants" class="input" type="number" min="1" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Score (0–100)" :error="errors.challenge_score">
            <input :id="f.id" v-model="form.challenge_score" class="input" type="number" min="0" max="100" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
        </div>
      </fieldset>

      <label class="flex items-start gap-3">
        <input v-model="form.is_published" type="checkbox" class="mt-1 size-5 accent-[var(--accent-primary)]">
        <span><span class="font-semibold">Visible on the site</span><span class="block text-sm text-secondary">Takes effect on the next publish.</span></span>
      </label>

      <p v-if="saveError" class="notice notice-error" role="alert">{{ saveError }}</p>
      <p v-if="saved" class="notice notice-success" role="status">Saved. Press Publish site when you are ready to update the live site.</p>

      <div class="flex flex-wrap gap-3">
        <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Saving…' : isNew ? 'Create project' : 'Save changes' }}</button>
        <NuxtLink to="/" class="btn btn-secondary">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { projectFormSchema, slugify, type ProjectFormInput } from '~/utils/projectSchema'
import { describeDbError, type ProjectInsert, type ProjectRow } from '~/composables/useProjectsAdmin'

const route = useRoute()
const supabase = useSupabase()
const id = computed(() => String(route.params.id))
const isNew = computed(() => id.value === 'new')
useHead({ title: () => `${isNew.value ? 'New project' : 'Edit project'} · Admin` })

const empty = (): ProjectFormInput => ({
  title: '', slug: '', kind: 'work', summary: '', description: '', contributions: '', team_note: '',
  tech_stack: '', role: '', project_url: '', project_url_label: '', repo_url: '', cover_image_url: null,
  cover_alt: '', is_published: false, challenge_platform: 'VibeDev', challenge_profile_url: '',
  challenge_format: 'duel', challenge_rank: 1, challenge_entrants: 2, challenge_score: 0, challenge_submitted_at: '',
})

const form = reactive<ProjectFormInput>(empty())
const errors = ref<Partial<Record<keyof ProjectFormInput, string>>>({})
const loading = ref(!isNew.value)
const loadError = ref('')
const saving = ref(false)
const saveError = ref('')
const saved = ref(false)
const slugTouched = ref(!isNew.value)

const syncSlug = () => {
  if (!slugTouched.value) form.slug = slugify(form.title)
}

const fromRow = (row: ProjectRow): ProjectFormInput => {
  const challenge = (row.challenge ?? {}) as Record<string, unknown>
  return {
    title: row.title, slug: row.slug, kind: row.kind as 'work' | 'challenge', summary: row.summary,
    description: row.description ?? '', contributions: row.contributions.join('\n'), team_note: row.team_note ?? '',
    tech_stack: row.tech_stack.join(', '), role: row.role ?? '', project_url: row.project_url ?? '',
    project_url_label: row.project_url_label ?? '', repo_url: row.repo_url ?? '', cover_image_url: row.cover_image_url,
    cover_alt: row.cover_alt ?? '', is_published: row.is_published,
    challenge_platform: String(challenge.platform ?? 'VibeDev'), challenge_profile_url: String(challenge.profile_url ?? ''),
    challenge_format: challenge.format === 'brawl' ? 'brawl' : 'duel', challenge_rank: Number(challenge.rank ?? 1),
    challenge_entrants: Number(challenge.entrants ?? 2), challenge_score: Number(challenge.score ?? 0),
    challenge_submitted_at: String(challenge.submitted_at ?? ''),
  }
}

const nullable = (value: string) => value || null

const save = async () => {
  saved.value = false
  saveError.value = ''
  const result = projectFormSchema.safeParse(form)
  if (!result.success) {
    errors.value = Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))
    saveError.value = 'Some fields need attention.'
    await nextTick()
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  errors.value = {}
  const value = result.data
  const row: ProjectInsert = {
    site: 'portfolio', title: value.title, slug: value.slug, kind: value.kind, summary: value.summary,
    description: nullable(value.description), contributions: value.contributions, team_note: nullable(value.team_note),
    tech_stack: value.tech_stack, role: nullable(value.role), project_url: nullable(value.project_url),
    project_url_label: nullable(value.project_url_label), repo_url: nullable(value.repo_url),
    cover_image_url: value.cover_image_url, cover_alt: nullable(value.cover_alt), is_published: value.is_published,
    challenge: value.kind === 'challenge'
      ? {
          platform: value.challenge_platform, profile_url: value.challenge_profile_url, format: value.challenge_format,
          rank: value.challenge_rank, entrants: value.challenge_entrants, score: value.challenge_score,
          submitted_at: value.challenge_submitted_at,
        }
      : null,
  }

  saving.value = true
  if (isNew.value) {
    const { data: last } = await supabase.from('projects').select('sort_order').eq('site', 'portfolio')
      .order('sort_order', { ascending: false }).limit(1).maybeSingle()
    const { data, error } = await supabase.from('projects').insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 }).select('id').single()
    saving.value = false
    if (error) return (saveError.value = describeDbError(error))
    // The edit page mounts fresh, so the confirmation travels in the URL.
    await navigateTo({ path: `/projects/${data.id}`, query: { created: '1' } }, { replace: true })
    return
  }
  const { error } = await supabase.from('projects').update(row).eq('id', id.value)
  saving.value = false
  if (error) return (saveError.value = describeDbError(error))
  saved.value = true
}

onMounted(async () => {
  if (isNew.value) return
  saved.value = route.query.created === '1'
  const { data, error } = await supabase.from('projects').select('*').eq('id', id.value).maybeSingle()
  loading.value = false
  if (error || !data) {
    loadError.value = 'This project does not exist or could not be loaded.'
    return
  }
  Object.assign(form, fromRow(data))
})
</script>
