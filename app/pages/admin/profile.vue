<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <header class="flex flex-col gap-2 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Owner console / identity</p>
        <h1 class="mt-2 font-heading text-3xl font-bold tracking-tight">Profile</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">Keep the public introduction, contact details, and visibility setting current.</p>
      </div>
      <span class="inline-flex w-fit items-center rounded-full border border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-1 text-xs font-semibold text-[var(--foreground-secondary)]">Owner only</span>
    </header>

    <div v-if="pending" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-6" role="status" aria-busy="true">
      <div class="space-y-3 animate-pulse">
        <div class="h-4 w-1/3 rounded bg-[var(--background-muted)]" />
        <div class="h-11 rounded bg-[var(--background-muted)]" />
        <div class="h-11 rounded bg-[var(--background-muted)]" />
        <div class="h-24 rounded bg-[var(--background-muted)]" />
      </div>
      <span class="sr-only">Loading profile</span>
    </div>

    <div v-else-if="fetchError" class="rounded-lg border border-red-300 bg-[var(--background-card)] p-6" role="alert">
      <h2 class="font-heading text-lg font-semibold">Profile could not be loaded</h2>
      <p class="mt-2 text-sm text-[var(--foreground-secondary)]">{{ getApiError(fetchError, 'Unable to load the profile.') }}</p>
      <button type="button" class="mt-4 min-h-11 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" @click="refresh">
        Try again
      </button>
    </div>

    <div v-else-if="!form" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-6" role="status">
      <h2 class="font-heading text-lg font-semibold">No profile record yet</h2>
      <p class="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">The profile record is not available for this owner account. Refresh after the record has been provisioned.</p>
    </div>

    <form v-else class="space-y-6" novalidate @input="markDirty" @submit.prevent="save">
      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div class="grid gap-5 md:grid-cols-2">
          <div class="md:col-span-2">
            <label for="profile-full-name" class="field-label">Full name</label>
            <input id="profile-full-name" v-model="form.full_name" name="full_name" class="field-input" :class="fieldClass('full_name')" :aria-invalid="Boolean(fieldErrors.full_name)" aria-describedby="profile-full-name-error" autocomplete="name" />
            <p v-if="fieldErrors.full_name" id="profile-full-name-error" class="field-error">{{ fieldErrors.full_name }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="profile-headline" class="field-label">Headline</label>
            <input id="profile-headline" v-model="form.headline" name="headline" class="field-input" :class="fieldClass('headline')" :aria-invalid="Boolean(fieldErrors.headline)" aria-describedby="profile-headline-error" />
            <p v-if="fieldErrors.headline" id="profile-headline-error" class="field-error">{{ fieldErrors.headline }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="profile-summary" class="field-label">Summary <span class="font-normal text-[var(--foreground-muted)]">(optional)</span></label>
            <textarea id="profile-summary" v-model="form.summary" name="summary" rows="5" class="field-input resize-y" :class="fieldClass('summary')" :aria-invalid="Boolean(fieldErrors.summary)" aria-describedby="profile-summary-help profile-summary-error" />
            <p id="profile-summary-help" class="field-help">A concise introduction for the public profile.</p>
            <p v-if="fieldErrors.summary" id="profile-summary-error" class="field-error">{{ fieldErrors.summary }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div class="mb-5">
          <h2 class="font-heading text-xl font-semibold">Contact and links</h2>
          <p class="mt-1 text-sm text-[var(--foreground-secondary)]">Optional details used by the public contact surfaces.</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="profile-location" class="field-label">Location</label>
            <input id="profile-location" v-model="form.location" name="location" class="field-input" :class="fieldClass('location')" :aria-invalid="Boolean(fieldErrors.location)" aria-describedby="profile-location-error" autocomplete="address-level2" />
            <p v-if="fieldErrors.location" id="profile-location-error" class="field-error">{{ fieldErrors.location }}</p>
          </div>
          <div>
            <label for="profile-email" class="field-label">Email</label>
            <input id="profile-email" v-model="form.email" name="email" type="email" class="field-input" :class="fieldClass('email')" :aria-invalid="Boolean(fieldErrors.email)" aria-describedby="profile-email-error" autocomplete="email" />
            <p v-if="fieldErrors.email" id="profile-email-error" class="field-error">{{ fieldErrors.email }}</p>
          </div>
          <div>
            <label for="profile-phone" class="field-label">Phone</label>
            <input id="profile-phone" v-model="form.phone" name="phone" type="tel" class="field-input" :class="fieldClass('phone')" :aria-invalid="Boolean(fieldErrors.phone)" aria-describedby="profile-phone-error" autocomplete="tel" />
            <p v-if="fieldErrors.phone" id="profile-phone-error" class="field-error">{{ fieldErrors.phone }}</p>
          </div>
          <div>
            <label for="profile-linkedin" class="field-label">LinkedIn URL</label>
            <input id="profile-linkedin" v-model="form.linkedin_url" name="linkedin_url" type="url" class="field-input" :class="fieldClass('linkedin_url')" :aria-invalid="Boolean(fieldErrors.linkedin_url)" aria-describedby="profile-linkedin-error" inputmode="url" autocomplete="url" />
            <p v-if="fieldErrors.linkedin_url" id="profile-linkedin-error" class="field-error">{{ fieldErrors.linkedin_url }}</p>
          </div>
          <div>
            <label for="profile-website" class="field-label">Website URL</label>
            <input id="profile-website" v-model="form.website_url" name="website_url" type="url" class="field-input" :class="fieldClass('website_url')" :aria-invalid="Boolean(fieldErrors.website_url)" aria-describedby="profile-website-error" inputmode="url" autocomplete="url" />
            <p v-if="fieldErrors.website_url" id="profile-website-error" class="field-error">{{ fieldErrors.website_url }}</p>
          </div>
          <div>
            <label for="profile-avatar" class="field-label">Avatar URL</label>
            <input id="profile-avatar" v-model="form.avatar_url" name="avatar_url" type="url" class="field-input" :class="fieldClass('avatar_url')" :aria-invalid="Boolean(fieldErrors.avatar_url)" aria-describedby="profile-avatar-error" inputmode="url" autocomplete="url" />
            <p v-if="fieldErrors.avatar_url" id="profile-avatar-error" class="field-error">{{ fieldErrors.avatar_url }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <label class="flex min-h-11 items-start gap-3 text-sm font-semibold" for="profile-published">
          <input id="profile-published" v-model="form.is_published" type="checkbox" class="mt-1 h-5 w-5 rounded border-[var(--border-subtle)] text-[var(--accent-primary)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" />
          <span>
            Publish profile
            <span class="mt-1 block font-normal leading-6 text-[var(--foreground-secondary)]">When enabled, this profile can be shown on the public site.</span>
          </span>
        </label>
      </div>

      <div v-if="formError" class="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">{{ formError }}</div>
      <p v-if="saved" class="rounded-md border border-teal-300 bg-[var(--background-muted)] px-4 py-3 text-sm font-semibold text-[var(--foreground-primary)]" role="status" aria-live="polite">Profile saved successfully.</p>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" :disabled="saving" :aria-busy="saving" class="min-h-11 rounded-md bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60">
          {{ saving ? 'Saving…' : 'Save profile' }}
        </button>
        <span v-if="isDirty && !saving" class="text-sm text-[var(--foreground-muted)]">Unsaved changes</span>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { onBeforeRouteLeave } from 'vue-router'

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

type ApiErrorLike = { data?: unknown; statusMessage?: unknown }
type FieldErrors = Partial<Record<keyof ProfileForm, string>>

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional()
const httpUrl = z.string().trim().max(2048).url().refine((value) => {
  try {
    const protocol = new URL(value).protocol
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}, 'URL must use HTTP or HTTPS')

const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(200),
  headline: z.string().trim().min(1).max(300),
  summary: optionalText(5000),
  location: optionalText(200),
  email: z.string().trim().email().max(320).nullable().optional(),
  phone: optionalText(50),
  linkedin_url: httpUrl.nullable().optional(),
  website_url: httpUrl.nullable().optional(),
  avatar_url: httpUrl.nullable().optional(),
  is_published: z.boolean().optional(),
}).strict()

const normalize = (value: string | null) => value?.trim() ? value.trim() : null
const normalizeForm = (value: ProfileForm): ProfileForm => ({
  ...value,
  full_name: value.full_name.trim(),
  headline: value.headline.trim(),
  summary: normalize(value.summary),
  location: normalize(value.location),
  email: normalize(value.email),
  phone: normalize(value.phone),
  linkedin_url: normalize(value.linkedin_url),
  website_url: normalize(value.website_url),
  avatar_url: normalize(value.avatar_url),
})

const getApiError = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback
  const candidate = error as ApiErrorLike
  const data = candidate.data && typeof candidate.data === 'object' ? candidate.data as Record<string, unknown> : null
  const message = data?.statusMessage ?? candidate.statusMessage
  return typeof message === 'string' && message.length > 0 ? message : fallback
}

const { data, pending, error: fetchError, refresh } = await useFetch<ProfileForm[]>('/api/admin/profile')
const form = ref<ProfileForm | null>(data.value?.[0] ? { ...data.value[0] } : null)
const saving = ref(false)
const saved = ref(false)
const formError = ref('')
const fieldErrors = ref<FieldErrors>({})
const isDirty = ref(false)

const markDirty = () => {
  isDirty.value = true
  saved.value = false
}

const fieldClass = (field: keyof ProfileForm) => fieldErrors.value[field] ? 'border-red-600 focus-visible:ring-red-600' : ''

const collectErrors = (issues: z.ZodIssue[]): FieldErrors => {
  const errors: FieldErrors = {}
  for (const issue of issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && field in profileSchema.shape && !(field in errors)) {
      errors[field as keyof ProfileForm] = issue.message
    }
  }
  return errors
}

const save = async () => {
  if (!form.value) return
  saving.value = true
  saved.value = false
  formError.value = ''
  fieldErrors.value = {}
  const parsed = profileSchema.safeParse(normalizeForm(form.value))
  if (!parsed.success) {
    fieldErrors.value = collectErrors(parsed.error.issues)
    formError.value = 'Review the highlighted fields before saving.'
    await nextTick()
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    saving.value = false
    return
  }

  try {
    const response = await $fetch<ProfileForm>('/api/admin/profile', { method: 'PUT', body: parsed.data })
    form.value = { ...response }
    isDirty.value = false
    saved.value = true
  } catch (error) {
    formError.value = getApiError(error, 'Unable to save the profile. Your changes are still on this form.')
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
  if (!isDirty.value || saving.value || window.confirm('You have unsaved profile changes. Leave without saving?')) next()
  else next(false)
})
</script>

<style scoped>
.field-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; }
.field-input { min-height: 2.75rem; width: 100%; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--background-page); padding: 0.625rem 0.75rem; color: var(--foreground-primary); transition: var(--transition-smooth); }
.field-input::placeholder { color: var(--foreground-muted); }
.field-input:focus-visible { border-color: var(--border-focus); outline: 2px solid var(--border-focus); outline-offset: 2px; }
.field-input:disabled { cursor: not-allowed; opacity: 0.6; }
.field-help { margin-top: 0.375rem; font-size: 0.75rem; line-height: 1.25rem; color: var(--foreground-muted); }
.field-error { margin-top: 0.375rem; font-size: 0.75rem; font-weight: 600; color: #991b1b; }
</style>
