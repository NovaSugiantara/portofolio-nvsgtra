<template>
  <section class="mx-auto max-w-6xl space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent-hover)]">Publishing</p>
        <h1 class="mt-2 text-3xl font-bold text-pretty">Blog posts</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">Draft, preview, and publish Markdown content without leaving the owner console.</p>
      </div>
      <NuxtLink to="/admin/blog/new" class="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">New post</NuxtLink>
    </header>

    <div v-if="successMessage" class="rounded-md border border-emerald-700/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status" aria-live="polite">{{ successMessage }}</div>
    <div v-if="actionError" class="rounded-md border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">{{ actionError }}</div>

    <div v-if="pending" class="space-y-3" aria-busy="true" aria-label="Loading blog posts">
      <div v-for="n in 3" :key="n" class="h-24 animate-pulse rounded-lg bg-[var(--background-muted)]" />
    </div>
    <div v-else-if="loadError" class="rounded-lg border border-red-700/30 bg-[var(--background-card)] p-6" role="alert">
      <h2 class="font-semibold">Blog posts could not be loaded</h2>
      <p class="mt-1 text-sm text-[var(--foreground-secondary)]">Check your connection, then try again.</p>
      <button type="button" class="mt-4 min-h-11 rounded-md border border-[var(--border-subtle)] px-4 text-sm font-semibold hover:border-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" @click="retry">Try again</button>
    </div>
    <div v-else-if="!posts.length" class="rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--background-card)] p-10 text-center">
      <h2 class="font-semibold">No blog posts yet</h2>
      <p class="mt-2 text-sm text-[var(--foreground-secondary)]">Create a draft when you are ready to publish your first article.</p>
      <NuxtLink to="/admin/blog/new" class="mt-5 inline-flex min-h-11 items-center rounded-md border border-[var(--accent-primary)] px-4 text-sm font-semibold text-[var(--accent-hover)] hover:bg-[var(--background-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Create a draft</NuxtLink>
    </div>
    <div v-else class="grid gap-3" aria-label="Blog posts">
      <article v-for="post in posts" :key="post.id" class="min-w-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-4 shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="min-w-0 break-words text-lg font-semibold">{{ post.title }}</h2>
              <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="post.is_published ? 'bg-emerald-100 text-emerald-900' : 'bg-[var(--background-muted)] text-[var(--foreground-secondary)]'">{{ post.is_published ? 'Published' : 'Draft' }}</span>
            </div>
            <p class="mt-2 break-all font-mono text-xs text-[var(--foreground-muted)]">/blog/{{ post.slug }}</p>
            <p class="mt-2 text-xs text-[var(--foreground-muted)]">{{ formatDate(post.published_at || post.updated_at) }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-sm">
            <NuxtLink :to="`/admin/blog/${post.id}`" class="inline-flex min-h-11 items-center rounded-md border border-[var(--border-subtle)] px-3 font-semibold hover:border-[var(--accent-primary)] hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Edit</NuxtLink>
            <button type="button" class="inline-flex min-h-11 items-center rounded-md border border-[var(--border-subtle)] px-3 font-semibold hover:border-[var(--accent-primary)] hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:cursor-not-allowed disabled:opacity-60" :disabled="publishingId === post.id" :aria-busy="publishingId === post.id" @click="togglePublished(post)">{{ publishingId === post.id ? 'Updating…' : post.is_published ? 'Unpublish' : 'Publish' }}</button>
            <button type="button" class="inline-flex min-h-11 items-center rounded-md border border-red-700/40 px-3 font-semibold text-red-800 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="deletingId === post.id" @click="openDelete(post)">Delete</button>
          </div>
        </div>
      </article>
    </div>

    <dialog ref="deleteDialog" class="w-[min(100%-2rem,32rem)] rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-0 text-[var(--foreground-primary)] shadow-[var(--shadow-lg)] backdrop:bg-[var(--color-obsidian)]/50" aria-labelledby="delete-title">
      <div class="p-6">
        <h2 id="delete-title" class="text-xl font-semibold">Delete this post?</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">“{{ deleteTarget?.title }}” will be permanently removed. This cannot be undone.</p>
        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref="cancelDeleteButton" type="button" class="min-h-11 rounded-md border border-[var(--border-subtle)] px-4 text-sm font-semibold hover:bg-[var(--background-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" @click="closeDelete">Cancel</button>
          <button type="button" class="min-h-11 rounded-md bg-red-800 px-4 text-sm font-semibold text-white hover:bg-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 disabled:opacity-60" :disabled="Boolean(deletingId)" @click="confirmDelete">{{ deletingId ? 'Deleting…' : 'Delete post' }}</button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface Post { id: string; title: string; slug: string; is_published: boolean; published_at: string | null; updated_at: string }

const { data, pending, error: loadError, refresh } = await useFetch<Post[]>('/api/admin/blog-posts')
const posts = computed(() => data.value ?? [])
const deleteDialog = ref<HTMLDialogElement | null>(null)
const cancelDeleteButton = ref<HTMLButtonElement | null>(null)
const deleteTarget = ref<Post | null>(null)
const deletingId = ref('')
const publishingId = ref('')
const actionError = ref('')
const successMessage = ref('')

const formatDate = (value: string) => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
const retry = async () => { actionError.value = ''; await refresh() }

const togglePublished = async (post: Post) => {
  publishingId.value = post.id; actionError.value = ''; successMessage.value = ''
  try {
    await $fetch(`/api/admin/blog-posts/${post.id}`, { method: 'PUT', body: { is_published: !post.is_published } })
    successMessage.value = post.is_published ? 'Post unpublished.' : 'Post published.'
    await refresh()
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Unable to update publication status. Try again.'
  } finally { publishingId.value = '' }
}

const openDelete = (post: Post) => {
  deleteTarget.value = post; deleteDialog.value?.showModal(); nextTick(() => cancelDeleteButton.value?.focus())
}
const closeDelete = () => { deleteDialog.value?.close(); deleteTarget.value = null }
const confirmDelete = async () => {
  if (!deleteTarget.value) return
  deletingId.value = deleteTarget.value.id; actionError.value = ''; successMessage.value = ''
  try {
    await $fetch(`/api/admin/blog-posts/${deleteTarget.value.id}`, { method: 'DELETE' })
    successMessage.value = 'Post deleted.'; closeDelete(); await refresh()
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Unable to delete the post. Try again.'
  } finally { deletingId.value = '' }
}
</script>
