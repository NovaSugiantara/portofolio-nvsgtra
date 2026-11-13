<template>
  <div class="max-w-3xl">
    <h1 class="text-3xl font-semibold tracking-[-0.035em]">Profile & hero</h1>
    <p class="mt-2 max-w-[60ch] text-secondary">The text and media at the top of the homepage. Saved changes go live on the next publish.</p>

    <div v-if="loading" class="panel mt-8 h-96 animate-pulse" aria-busy="true" aria-label="Loading profile" />
    <p v-else-if="loadError" class="notice notice-error mt-8" role="alert">{{ loadError }}</p>

    <form v-else class="mt-8 grid gap-8" novalidate @submit.prevent="save">
      <fieldset class="panel grid gap-5 p-5 md:p-6">
        <legend class="px-1 text-sm font-semibold">Hero text</legend>
        <FormField v-slot="f" label="Headline" hint="The big line. Keep it under about 60 characters." :error="errors.headline">
          <input :id="f.id" v-model="form.headline" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
        </FormField>
        <FormField v-slot="f" label="Summary" :error="errors.summary">
          <textarea :id="f.id" v-model="form.summary" class="input" rows="4" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
        </FormField>
        <div class="grid gap-5 md:grid-cols-2">
          <FormField v-slot="f" label="Name" :error="errors.full_name">
            <input :id="f.id" v-model="form.full_name" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Location" optional :error="errors.location">
            <input :id="f.id" v-model="form.location" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="Public email" optional :error="errors.email">
            <input :id="f.id" v-model="form.email" class="input" type="email" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
          <FormField v-slot="f" label="LinkedIn" optional :error="errors.linkedin_url">
            <input :id="f.id" v-model="form.linkedin_url" class="input" inputmode="url" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
        </div>
      </fieldset>

      <fieldset class="panel grid gap-5 p-5 md:p-6">
        <legend class="px-1 text-sm font-semibold">Hero media</legend>
        <div class="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Hero media">
          <label v-for="option in mediaOptions" :key="option.value" class="flex cursor-pointer items-start gap-3 rounded-md border p-4" :class="form.hero_media === option.value ? 'border-accent bg-section' : 'border-line'">
            <input v-model="form.hero_media" type="radio" name="hero_media" :value="option.value" class="mt-1 size-4 accent-[var(--accent-primary)]">
            <span><span class="font-semibold">{{ option.label }}</span><span class="block text-sm text-secondary">{{ option.description }}</span></span>
          </label>
        </div>

        <template v-if="form.hero_media === 'video'">
          <MediaField v-model="form.hero_video_url" kind="video" label="Hero video" :clearable="false" />
          <MediaField v-model="form.hero_poster_url" label="Video poster (first frame)" :clearable="false" />
        </template>
        <template v-else>
          <MediaField v-model="form.avatar_url" label="Photo" round />
          <p v-if="errors.avatar_url" class="field-error">{{ errors.avatar_url }}</p>
          <FormField v-slot="f" label="Photo description" optional hint="Defaults to “Portrait of {name}”." :error="errors.avatar_alt">
            <input :id="f.id" v-model="form.avatar_alt" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy">
          </FormField>
        </template>
      </fieldset>

      <p v-if="saveError" class="notice notice-error" role="alert">{{ saveError }}</p>
      <p v-if="saved" class="notice notice-success" role="status">Saved. Press Publish site to update the live homepage.</p>
      <div><button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save profile' }}</button></div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { describeDbError } from '~/composables/useProjectsAdmin'

useHead({ title: 'Profile & hero · Admin' })

const supabase = useSupabase()
const safeUrl = z.string().trim().max(2048)
  .refine((value) => value === '' || /^https:\/\/\S+$/.test(value), 'Use an https:// link')

const schema = z.object({
  full_name: z.string().trim().min(1, 'Required').max(120),
  headline: z.string().trim().min(1, 'Required').max(160),
  summary: z.string().trim().max(1200),
  location: z.string().trim().max(120),
  email: z.union([z.literal(''), z.email('Enter a valid email')]),
  linkedin_url: safeUrl,
  hero_media: z.enum(['video', 'photo']),
  hero_video_url: z.string().nullable(),
  hero_poster_url: z.string().nullable(),
  avatar_url: z.string().nullable(),
  avatar_alt: z.string().trim().max(200),
}).refine((value) => value.hero_media !== 'photo' || Boolean(value.avatar_url), { path: ['avatar_url'], message: 'Upload a photo first, or switch back to video' })

type Form = z.input<typeof schema>

const mediaOptions = [
  { value: 'video', label: 'Video panel', description: 'A muted loop beside the headline on wide screens.' },
  { value: 'photo', label: 'Round photo', description: 'A circular portrait; also shown small on phones.' },
] as const

const form = reactive<Form>({
  full_name: '', headline: '', summary: '', location: '', email: '', linkedin_url: '',
  hero_media: 'video', hero_video_url: null, hero_poster_url: null, avatar_url: null, avatar_alt: '',
})
const errors = ref<Partial<Record<keyof Form, string>>>({})
const loading = ref(true)
const loadError = ref('')
const saving = ref(false)
const saveError = ref('')
const saved = ref(false)

const save = async () => {
  saved.value = false
  saveError.value = ''
  const result = schema.safeParse(form)
  if (!result.success) {
    errors.value = Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))
    saveError.value = 'Some fields need attention.'
    return
  }
  errors.value = {}
  const value = result.data
  saving.value = true
  const { error } = await supabase.from('site_profiles').update({
    ...value,
    summary: value.summary || null,
    location: value.location || null,
    email: value.email || null,
    linkedin_url: value.linkedin_url || null,
    avatar_alt: value.avatar_alt || null,
  }).eq('site', 'portfolio')
  saving.value = false
  if (error) return (saveError.value = describeDbError(error))
  saved.value = true
}

onMounted(async () => {
  const { data, error } = await supabase.from('site_profiles').select('*').eq('site', 'portfolio').maybeSingle()
  loading.value = false
  if (error || !data) {
    loadError.value = 'The portfolio profile could not be loaded. Has the database been seeded?'
    return
  }
  Object.assign(form, {
    full_name: data.full_name, headline: data.headline, summary: data.summary ?? '', location: data.location ?? '',
    email: data.email ?? '', linkedin_url: data.linkedin_url ?? '', hero_media: data.hero_media as 'video' | 'photo',
    hero_video_url: data.hero_video_url, hero_poster_url: data.hero_poster_url, avatar_url: data.avatar_url,
    avatar_alt: data.avatar_alt ?? '',
  })
})
</script>
