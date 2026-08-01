<template>
  <section class="mx-auto max-w-6xl space-y-6">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <NuxtLink to="/admin/blog" class="text-sm font-semibold text-[var(--accent-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">← Back to posts</NuxtLink>
        <h1 class="mt-3 text-3xl font-bold text-pretty">{{ isNew ? 'New blog post' : 'Edit blog post' }}</h1>
        <p class="mt-2 text-sm text-[var(--foreground-secondary)]">Write in Markdown. The preview strips unsafe HTML before it is rendered.</p>
      </div>
      <span v-if="isDirty" class="text-sm font-semibold text-[var(--accent-hover)]" role="status">Unsaved changes</span>
    </header>

    <div v-if="loadPending" class="space-y-4" aria-busy="true" aria-label="Loading blog post"><div v-for="n in 4" :key="n" class="h-12 animate-pulse rounded-md bg-[var(--background-muted)]" /></div>
    <div v-else-if="loadError" class="rounded-lg border border-red-700/30 bg-[var(--background-card)] p-6" role="alert"><h2 class="font-semibold">This post could not be loaded</h2><p class="mt-1 text-sm text-[var(--foreground-secondary)]">Return to the list and try again.</p><NuxtLink to="/admin/blog" class="mt-4 inline-flex min-h-11 items-center rounded-md border border-[var(--border-subtle)] px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Back to posts</NuxtLink></div>
    <form v-else-if="form" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)]" novalidate @submit.prevent="save">
      <div class="space-y-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2"><label for="blog-title" class="mb-2 block text-sm font-semibold">Title</label><input id="blog-title" v-model="form.title" name="title" autocomplete="off" maxlength="200" :aria-invalid="Boolean(fieldErrors.title)" :aria-describedby="fieldErrors.title ? 'title-error' : undefined" class="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background-page)] px-3 py-3 text-base focus:border-[var(--border-focus)] focus:outline-none" /><p v-if="fieldErrors.title" id="title-error" class="mt-2 text-sm text-red-800" role="alert">{{ fieldErrors.title }}</p></div>
          <div><label for="blog-slug" class="mb-2 block text-sm font-semibold">Slug</label><input id="blog-slug" v-model="form.slug" name="slug" autocomplete="off" spellcheck="false" maxlength="120" placeholder="my-new-post…" :aria-invalid="Boolean(fieldErrors.slug)" :aria-describedby="fieldErrors.slug ? 'slug-error' : undefined" class="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background-page)] px-3 py-3 font-mono text-sm focus:border-[var(--border-focus)] focus:outline-none" /><p v-if="fieldErrors.slug" id="slug-error" class="mt-2 text-sm text-red-800" role="alert">{{ fieldErrors.slug }}</p></div>
          <div><label for="blog-cover" class="mb-2 block text-sm font-semibold">Cover image URL <span class="font-normal text-[var(--foreground-muted)]">(optional)</span></label><input id="blog-cover" v-model="form.cover_image_url" name="cover_image_url" type="url" autocomplete="url" placeholder="https://example.com/cover.webp…" :aria-invalid="Boolean(fieldErrors.cover_image_url)" :aria-describedby="fieldErrors.cover_image_url ? 'cover-error' : undefined" class="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background-page)] px-3 py-3 text-sm focus:border-[var(--border-focus)] focus:outline-none" /><p v-if="fieldErrors.cover_image_url" id="cover-error" class="mt-2 text-sm text-red-800" role="alert">{{ fieldErrors.cover_image_url }}</p></div>
        </div>
        <div><label for="blog-excerpt" class="mb-2 block text-sm font-semibold">Excerpt <span class="font-normal text-[var(--foreground-muted)]">(optional)</span></label><textarea id="blog-excerpt" v-model="form.excerpt" name="excerpt" rows="3" maxlength="1000" class="w-full resize-y rounded-md border border-[var(--border-subtle)] bg-[var(--background-page)] px-3 py-3 text-sm leading-6 focus:border-[var(--border-focus)] focus:outline-none" /><p class="mt-1 text-right text-xs text-[var(--foreground-muted)]">{{ form.excerpt.length }}/1000</p><p v-if="fieldErrors.excerpt" class="mt-2 text-sm text-red-800" role="alert">{{ fieldErrors.excerpt }}</p></div>
        <div><label for="blog-content" class="mb-2 block text-sm font-semibold">Content (Markdown)</label><textarea id="blog-content" v-model="form.content" name="content" rows="18" maxlength="100000" spellcheck="true" :aria-invalid="Boolean(fieldErrors.content)" :aria-describedby="fieldErrors.content ? 'content-error' : undefined" class="w-full resize-y rounded-md border border-[var(--border-subtle)] bg-[var(--background-page)] px-3 py-3 font-mono text-sm leading-6 focus:border-[var(--border-focus)] focus:outline-none" placeholder="# A clear title…" /><p v-if="fieldErrors.content" id="content-error" class="mt-2 text-sm text-red-800" role="alert">{{ fieldErrors.content }}</p></div>
        <div><label for="blog-tags" class="mb-2 block text-sm font-semibold">Tags <span class="font-normal text-[var(--foreground-muted)]">(comma separated)</span></label><input id="blog-tags" :value="form.tags.join(', ')" name="tags" autocomplete="off" placeholder="Nuxt, Vue, accessibility…" class="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background-page)] px-3 py-3 text-sm focus:border-[var(--border-focus)] focus:outline-none" @input="onTags" /><p v-if="fieldErrors.tags" class="mt-2 text-sm text-red-800" role="alert">{{ fieldErrors.tags }}</p></div>
        <div class="flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-5 sm:flex-row sm:items-center sm:justify-between"><label class="flex min-h-11 items-center gap-3 text-sm font-semibold"><input v-model="form.is_published" name="is_published" type="checkbox" class="h-5 w-5 rounded border-[var(--border-subtle)] text-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--border-focus)]" /> Publish this post</label><span class="text-xs text-[var(--foreground-muted)]">Publishing makes it visible on the public blog.</span></div>
        <div v-if="formError" class="rounded-md border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">{{ formError }}</div>
        <div v-if="successMessage" class="rounded-md border border-emerald-700/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status" aria-live="polite">{{ successMessage }}</div>
        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center"><button type="submit" class="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--accent-primary)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60" :disabled="saving" :aria-busy="saving">{{ saving ? 'Saving…' : 'Save post' }}</button><NuxtLink to="/admin/blog" class="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--border-subtle)] px-5 text-sm font-semibold hover:bg-[var(--background-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Cancel</NuxtLink></div>
      </div>

      <aside class="min-w-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] sm:p-6" aria-labelledby="preview-title">
        <div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Safe preview</p><h2 id="preview-title" class="mt-1 text-xl font-semibold">How readers will see it</h2></div><div class="flex rounded-md border border-[var(--border-subtle)] p-1" role="tablist" aria-label="Editor view"><button type="button" role="tab" :aria-selected="previewMode === 'write'" class="min-h-10 rounded px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" :class="previewMode === 'write' ? 'bg-[var(--background-muted)]' : ''" @click="previewMode = 'write'">Write</button><button type="button" role="tab" :aria-selected="previewMode === 'preview'" class="min-h-10 rounded px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" :class="previewMode === 'preview' ? 'bg-[var(--background-muted)]' : ''" @click="previewMode = 'preview'">Preview</button></div></div>
        <p class="mt-4 text-sm leading-6 text-[var(--foreground-secondary)]">Raw HTML is removed before this preview is inserted into the page.</p>
        <div v-if="previewMode === 'preview' && form.content.trim()" class="mt-6 max-w-none space-y-3 break-words leading-7 text-[var(--foreground-primary)]" role="tabpanel" aria-label="Sanitized Markdown preview" v-html="safePreviewHtml" />
        <div v-else-if="previewMode === 'preview'" class="mt-6 rounded-md border border-dashed border-[var(--border-subtle)] p-6 text-sm text-[var(--foreground-secondary)]" role="status">Start writing to see a preview.</div>
        <div v-else class="mt-6 rounded-md bg-[var(--background-muted)] p-4 text-sm leading-6 text-[var(--foreground-secondary)]" role="note">Use headings, links, lists, and code fences in Markdown. Switch to Preview to check the result.</div>
      </aside>
    </form>
  </section>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const route = useRoute()
const id = computed(() => String(route.params.id))
const isNew = computed(() => id.value === 'new')
const blogFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(200, 'Title must be 200 characters or fewer.'),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase kebab-case for the slug.').max(120),
  excerpt: z.string().trim().max(1000, 'Excerpt must be 1000 characters or fewer.'),
  content: z.string().trim().min(1, 'Content is required.').max(100000, 'Content is too long.'),
  cover_image_url: z.string().trim().refine((value) => !value || /^https?:\/\//i.test(value), 'Cover URL must use HTTP or HTTPS.'),
  tags: z.array(z.string().trim().min(1).max(50)).max(50, 'Use 50 tags or fewer.'),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0).max(100000),
}).strict()
type BlogForm = z.infer<typeof blogFormSchema>
type BlogResponse = BlogForm & { id: string; published_at: string | null; updated_at: string; created_at: string }

const form = ref<BlogForm>({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', tags: [], is_published: false, sort_order: 0 })
const loadPending = ref(!isNew.value)
const loadError = ref<unknown>(null)
const saving = ref(false)
const formError = ref('')
const successMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})
const previewMode = ref<'write' | 'preview'>('write')
const initialSnapshot = ref('')
const ignoreLeavePrompt = ref(false)

const toForm = (value: Partial<BlogResponse>): BlogForm => ({ title: value.title ?? '', slug: value.slug ?? '', excerpt: value.excerpt ?? '', content: value.content ?? '', cover_image_url: value.cover_image_url ?? '', tags: value.tags ?? [], is_published: value.is_published ?? false, sort_order: value.sort_order ?? 0 })
if (!isNew.value) {
  const { data, pending, error } = await useFetch<BlogResponse>(`/api/admin/blog-posts/${id.value}`)
  loadPending.value = pending.value; loadError.value = error.value
  if (data.value) form.value = toForm(data.value)
}
initialSnapshot.value = JSON.stringify(form.value)
const isDirty = computed(() => JSON.stringify(form.value) !== initialSnapshot.value)
const safePreviewHtml = computed(() => sanitizeHtml(String(marked.parse(form.value.content, { async: false })), { allowedTags: ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'code', 'pre', 'hr', 'br'], allowedAttributes: { a: ['href', 'title', 'rel'] }, allowedSchemes: ['http', 'https', 'mailto'] }))

const onTags = (event: Event) => { form.value.tags = (event.target as HTMLInputElement).value.split(',').map((tag) => tag.trim()).filter(Boolean) }
const validate = () => {
  fieldErrors.value = {}
  const result = blogFormSchema.safeParse({ ...form.value, excerpt: form.value.excerpt.trim(), cover_image_url: form.value.cover_image_url.trim() })
  if (result.success) { form.value = result.data; return true }
  for (const issue of result.error.issues) { const key = String(issue.path[0] ?? 'form'); if (!fieldErrors.value[key]) fieldErrors.value[key] = issue.message }
  nextTick(() => document.getElementById(Object.keys(fieldErrors.value)[0] === 'title' ? 'blog-title' : Object.keys(fieldErrors.value)[0] === 'slug' ? 'blog-slug' : Object.keys(fieldErrors.value)[0] === 'content' ? 'blog-content' : 'blog-title')?.focus())
  return false
}
const save = async () => {
  if (!validate()) { formError.value = 'Review the highlighted fields before saving.'; return }
  saving.value = true; formError.value = ''; successMessage.value = ''
  try {
    const response = await $fetch<BlogResponse>(isNew.value ? '/api/admin/blog-posts' : `/api/admin/blog-posts/${id.value}`, { method: isNew.value ? 'POST' : 'PUT', body: { ...form.value, excerpt: form.value.excerpt || null, cover_image_url: form.value.cover_image_url || null } })
    form.value = toForm(response); initialSnapshot.value = JSON.stringify(form.value); ignoreLeavePrompt.value = true; successMessage.value = 'Post saved successfully.'
    if (isNew.value && response.id) await navigateTo(`/admin/blog/${response.id}`, { replace: true })
  } catch (error) { formError.value = error instanceof Error ? error.message : 'Unable to save this post. Try again.' } finally { saving.value = false }
}

onBeforeRouteLeave(() => {
  if (ignoreLeavePrompt.value || !isDirty.value || saving.value || !import.meta.client) return true
  return window.confirm('You have unsaved changes. Leave without saving?')
})
if (import.meta.client) {
  const warn = (event: BeforeUnloadEvent) => { if (!isDirty.value || saving.value) return; event.preventDefault(); event.returnValue = '' }
  onMounted(() => window.addEventListener('beforeunload', warn))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warn))
}
</script>
