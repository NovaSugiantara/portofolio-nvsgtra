<template>
  <div class="site-container py-16 lg:py-24">
    <header class="max-w-3xl">
      <h1 class="text-pretty font-heading text-4xl font-bold tracking-[-0.03em] text-[var(--foreground-primary)] sm:text-5xl">
        Tell me what you want to build.
      </h1>
      <p class="mt-5 max-w-2xl text-base leading-7 text-[var(--foreground-secondary)] sm:text-lg sm:leading-8">
        A few sentences is enough: what the website or app should do, who it is for, and when you need it. I will reply with questions or a rough plan.
      </p>
    </header>

    <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-16">
      <section class="max-w-2xl" aria-labelledby="message-heading">
        <div class="border-b border-[var(--border-subtle)] pb-5">
          <h2 id="message-heading" class="font-heading text-2xl font-semibold tracking-[-0.02em] text-[var(--foreground-primary)] sm:text-3xl">Send a message</h2>
          <p id="form-instructions" class="mt-3 text-sm leading-6 text-[var(--foreground-secondary)]">
            Name, email, and message are required. Your message goes straight to my inbox.
          </p>
        </div>

        <form class="mt-8 space-y-6" novalidate :aria-busy="formStatus === 'loading'" aria-describedby="form-instructions" @submit.prevent="submitForm">
          <div class="grid gap-6 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="name" class="block text-sm font-semibold text-[var(--foreground-primary)]">
                Full name <span class="font-normal text-[var(--foreground-muted)]">(required)</span>
              </label>
              <input
                id="name"
                v-model.trim="form.name"
                name="name"
                type="text"
                autocomplete="name"
                maxlength="200"
                :aria-describedby="fieldErrors.name ? 'name-error' : undefined"
                :aria-invalid="Boolean(fieldErrors.name)"
                :class="fieldClass('name')"
                class="min-h-11 w-full rounded-md border bg-[var(--background-page)] px-3 py-2.5 text-base text-[var(--foreground-primary)] placeholder:text-[var(--foreground-muted)] focus-visible:border-[var(--border-focus)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--border-focus)]"
                placeholder="Your name…"
                required
                @input="clearFieldError('name')"
              />
              <p v-if="fieldErrors.name" id="name-error" class="text-sm leading-6 text-[var(--foreground-primary)]" aria-live="assertive">
                <span class="font-semibold">Error:</span> {{ fieldErrors.name }}
              </p>
            </div>
            <div class="space-y-2">
              <label for="email" class="block text-sm font-semibold text-[var(--foreground-primary)]">
                Email address <span class="font-normal text-[var(--foreground-muted)]">(required)</span>
              </label>
              <input
                id="email"
                v-model.trim="form.email"
                name="email"
                type="email"
                autocomplete="email"
                inputmode="email"
                maxlength="320"
                spellcheck="false"
                :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
                :aria-invalid="Boolean(fieldErrors.email)"
                :class="fieldClass('email')"
                class="min-h-11 w-full rounded-md border bg-[var(--background-page)] px-3 py-2.5 text-base text-[var(--foreground-primary)] placeholder:text-[var(--foreground-muted)] focus-visible:border-[var(--border-focus)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--border-focus)]"
                placeholder="you@example.com…"
                required
                @input="clearFieldError('email')"
              />
              <p v-if="fieldErrors.email" id="email-error" class="text-sm leading-6 text-[var(--foreground-primary)]" aria-live="assertive">
                <span class="font-semibold">Error:</span> {{ fieldErrors.email }}
              </p>
            </div>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="project_type" class="block text-sm font-semibold text-[var(--foreground-primary)]">
                What kind of project? <span class="font-normal text-[var(--foreground-muted)]">(optional)</span>
              </label>
              <div class="relative">
                <select id="project_type" v-model="form.project_type" name="project_type" class="min-h-11 w-full appearance-none rounded-md border border-[var(--border-subtle)] bg-[var(--background-page)] px-3 py-2.5 pr-10 text-base text-[var(--foreground-primary)] focus-visible:border-[var(--border-focus)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--border-focus)]">
                  <option value="">Choose one…</option>
                  <option v-for="option in PROJECT_TYPES" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
                <Icon name="ph:caret-down" size="1rem" aria-hidden="true" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              </div>
            </div>
            <div class="space-y-2">
              <label for="start_time" class="block text-sm font-semibold text-[var(--foreground-primary)]">
                When do you want to start? <span class="font-normal text-[var(--foreground-muted)]">(optional)</span>
              </label>
              <div class="relative">
                <select id="start_time" v-model="form.start_time" name="start_time" class="min-h-11 w-full appearance-none rounded-md border border-[var(--border-subtle)] bg-[var(--background-page)] px-3 py-2.5 pr-10 text-base text-[var(--foreground-primary)] focus-visible:border-[var(--border-focus)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--border-focus)]">
                  <option value="">Choose one…</option>
                  <option v-for="option in START_TIMES" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
                <Icon name="ph:caret-down" size="1rem" aria-hidden="true" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="message" class="block text-sm font-semibold text-[var(--foreground-primary)]">
              What do you need? <span class="font-normal text-[var(--foreground-muted)]">(required)</span>
            </label>
            <textarea
              id="message"
              v-model.trim="form.message"
              name="message"
              rows="7"
              maxlength="5000"
              :aria-describedby="fieldErrors.message ? 'message-error' : undefined"
              :aria-invalid="Boolean(fieldErrors.message)"
              :class="fieldClass('message')"
              class="w-full resize-y rounded-md border bg-[var(--background-page)] px-3 py-2.5 text-base leading-7 text-[var(--foreground-primary)] placeholder:text-[var(--foreground-muted)] focus-visible:border-[var(--border-focus)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--border-focus)]"
              placeholder="For example: a company website with 5 pages and a booking form, live by March…"
              required
              @input="clearFieldError('message')"
            />
            <p v-if="fieldErrors.message" id="message-error" class="text-sm leading-6 text-[var(--foreground-primary)]" aria-live="assertive">
              <span class="font-semibold">Error:</span> {{ fieldErrors.message }}
            </p>
          </div>

          <div class="sr-only" aria-hidden="true">
            <label for="hp">Leave this field empty</label>
            <input id="hp" v-model="form.hp" type="text" name="hp" tabindex="-1" autocomplete="off" />
          </div>

          <div v-if="hasValidationErrors" id="form-errors" class="border border-[var(--border-strong)] bg-[var(--background-muted)] px-4 py-3 text-sm leading-6 text-[var(--foreground-primary)]" role="alert" aria-live="assertive">
            Please review the highlighted fields before sending your message.
          </div>

          <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              :disabled="formStatus === 'loading'"
              class="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--accent-primary)] px-5 text-sm font-semibold text-page transition-[background-color,transform,opacity] duration-180 hover:-translate-y-px hover:bg-[var(--accent-hover)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <Icon name="ph:paper-plane-tilt" size="1.125rem" aria-hidden="true" class="mr-2" />
              {{ formStatus === 'loading' ? 'Sending…' : formStatus === 'error' ? 'Try again' : 'Send message' }}
            </button>

            <p v-if="formStatus === 'success'" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)]" role="status" aria-live="polite">
              <Icon name="ph:check-circle" size="1.125rem" aria-hidden="true" />Sent. I will reply to the email address you gave.
            </p>
            <p v-else-if="formStatus === 'error'" class="flex items-start gap-2 border border-[var(--border-strong)] bg-[var(--background-muted)] px-3 py-2 text-sm leading-6 text-[var(--foreground-primary)]" role="alert" aria-live="assertive">
              <Icon name="ph:warning-circle" size="1.125rem" aria-hidden="true" class="mt-1 shrink-0" /><span><span class="font-semibold">Error:</span> {{ errorMessage }}</span>
            </p>
          </div>
        </form>
      </section>

      <aside class="border-t border-[var(--border-subtle)] pt-6 lg:border-t-0 lg:border-l lg:pl-6" data-wa-cta aria-labelledby="direct-contact-heading">
        <h2 id="direct-contact-heading" class="font-heading text-xl font-semibold tracking-[-0.02em] text-[var(--foreground-primary)]">Prefer to chat?</h2>
        <p class="mt-3 text-sm leading-6 text-[var(--foreground-secondary)]">WhatsApp is usually the fastest way to reach me.</p>
        <a v-if="waUrl" :href="waUrl" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp mt-5 w-full">
          <Icon name="ph:whatsapp-logo" size="1.25rem" aria-hidden="true" />Chat on WhatsApp<span class="sr-only"> (opens in a new tab)</span>
        </a>

        <div v-if="isProfileLoading" class="mt-6 space-y-3" aria-busy="true" aria-label="Loading contact details">
          <div class="h-4 w-4/5 animate-pulse rounded bg-[var(--background-muted)]" />
          <div class="h-4 w-3/5 animate-pulse rounded bg-[var(--background-muted)]" />
        </div>
        <p v-else-if="profileError" class="mt-6 border border-[var(--border-strong)] bg-[var(--background-muted)] px-3 py-2 text-sm leading-6 text-[var(--foreground-primary)]" role="alert">
          Direct contact details are temporarily unavailable. The message form is still available.
        </p>
        <p v-else-if="!hasContactDetails" class="mt-6 text-sm leading-6 text-[var(--foreground-secondary)]" role="status">
          Please use the message form to get in touch.
        </p>
        <dl v-else class="mt-6 space-y-5 text-sm leading-6 text-[var(--foreground-secondary)]">
          <div v-if="profile?.email">
            <dt class="flex items-center gap-2 font-semibold text-[var(--foreground-primary)]"><Icon name="ph:envelope-simple" size="1.125rem" aria-hidden="true" />Email</dt>
            <dd class="mt-1 break-words">
              <a :href="`mailto:${profile.email}`" class="underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)]">
                {{ profile.email }}
              </a>
            </dd>
          </div>
          <div v-if="profile?.linkedin_url">
            <dt class="flex items-center gap-2 font-semibold text-[var(--foreground-primary)]"><Icon name="ph:linkedin-logo" size="1.125rem" aria-hidden="true" />LinkedIn</dt>
            <dd class="mt-1 break-words">
              <a :href="profile.linkedin_url" target="_blank" rel="noopener noreferrer" aria-label="Open LinkedIn profile in a new tab" class="underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)]">
                Open LinkedIn profile <Icon name="ph:arrow-up-right" size="1rem" aria-hidden="true" class="inline-block" />
              </a>
            </dd>
          </div>
          <div v-if="profile?.phone">
            <dt class="flex items-center gap-2 font-semibold text-[var(--foreground-primary)]"><Icon name="ph:phone" size="1.125rem" aria-hidden="true" />Phone</dt>
            <dd class="mt-1 break-words">
              <a :href="`tel:${profile.phone}`" class="underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)]">
                {{ profile.phone }}
              </a>
            </dd>
          </div>
          <div v-if="profile?.location">
            <dt class="flex items-center gap-2 font-semibold text-[var(--foreground-primary)]"><Icon name="ph:map-pin" size="1.125rem" aria-hidden="true" />Location</dt>
            <dd class="mt-1">{{ profile.location }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { PROJECT_TYPES, START_TIMES } from '#shared/contactOptions'

const { data: profile, status: profileStatus, error: profileError } = useProfile()
const waUrl = useWhatsAppLink()
const formStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')
const form = reactive({ name: '', email: '', message: '', project_type: '', start_time: '', hp: '' })

const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(200, 'Keep your name under 200 characters.'),
  email: z.string().trim().email('Enter a valid email address.').max(320, 'Keep your email under 320 characters.'),
  message: z.string().trim().min(1, 'Enter a message.').max(5000, 'Keep your message under 5,000 characters.'),
})

type ContactField = 'name' | 'email' | 'message'
const fieldErrors = reactive<Record<ContactField, string>>({ name: '', email: '', message: '' })
const isProfileLoading = computed(() => profileStatus.value === 'idle' || profileStatus.value === 'pending')
const hasContactDetails = computed(() => Boolean(profile.value?.email || profile.value?.phone || profile.value?.linkedin_url))
const hasValidationErrors = computed(() => Object.values(fieldErrors).some(Boolean))

const clearFieldError = (field: ContactField) => {
  fieldErrors[field] = ''
}

const fieldClass = (field: ContactField) => fieldErrors[field] ? 'border-[var(--border-strong)]' : 'border-[var(--border-subtle)]'

const validateForm = () => {
  Object.keys(fieldErrors).forEach((field) => {
    fieldErrors[field as ContactField] = ''
  })

  const result = contactFormSchema.safeParse({
    name: form.name,
    email: form.email,
    message: form.message,
  })

  if (result.success) return result.data

  result.error.issues.forEach((issue) => {
    const field = issue.path[0]
    if ((field === 'name' || field === 'email' || field === 'message') && !fieldErrors[field]) {
      fieldErrors[field] = issue.message
    }
  })

  return null
}

const submitForm = async () => {
  formStatus.value = 'idle'
  const payload = validateForm()
  if (!payload) {
    await nextTick()
    const firstInvalidField = (Object.keys(fieldErrors) as ContactField[]).find((field) => fieldErrors[field])
    if (firstInvalidField) document.getElementById(firstInvalidField)?.focus()
    return
  }

  formStatus.value = 'loading'
  errorMessage.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        ...payload,
        project_type: form.project_type,
        start_time: form.start_time,
        hp: form.hp,
      },
    })

    formStatus.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
    form.project_type = ''
    form.start_time = ''
    form.hp = ''
  } catch (error: unknown) {
    formStatus.value = 'error'
    const statusCode = (error as { statusCode?: number })?.statusCode
    errorMessage.value = statusCode === 429
      ? 'Too many messages from this connection. Please wait a few minutes, or use WhatsApp or email.'
      : statusCode === 503
        ? 'The form is not available right now. Please use WhatsApp or email instead.'
        : 'Your message could not be sent. Please try again, or use WhatsApp or email.'
  }
}

usePageSeo({
  title: 'Contact · Nova Sugiantara',
  description: 'Get in touch with Nova Sugiantara about a custom website or web app. Message on WhatsApp, by email, or through the form.',
  path: '/contact',
})
</script>
