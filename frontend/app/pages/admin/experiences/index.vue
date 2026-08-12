<template>
  <section class="mx-auto max-w-5xl space-y-6">
    <header class="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">Owner console / timeline</p>
        <h1 class="mt-2 font-heading text-3xl font-bold tracking-tight">Experience</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">Keep the career timeline ordered, accurate, and ready for publication.</p>
      </div>
      <NuxtLink to="/admin/experiences/new" class="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">New experience</NuxtLink>
    </header>

    <div v-if="pending" class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] p-6" role="status" aria-busy="true">
      <div class="h-40 animate-pulse rounded bg-[var(--background-muted)]" />
      <span class="sr-only">Loading experience</span>
    </div>

    <div v-else-if="fetchError" class="rounded-lg border border-red-300 bg-[var(--background-card)] p-6" role="alert">
      <h2 class="font-heading text-lg font-semibold">Experience could not be loaded</h2>
      <p class="mt-2 text-sm text-[var(--foreground-secondary)]">{{ getApiError(fetchError, 'Unable to load experience records.') }}</p>
      <button type="button" class="mt-4 min-h-11 rounded-md bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]" @click="refresh">Try again</button>
    </div>

    <div v-else class="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-card)] shadow-[var(--shadow-sm)]">
      <div v-if="!items.length" class="p-8 text-center" role="status">
        <h2 class="font-heading text-lg font-semibold">No experience records yet</h2>
        <p class="mt-2 text-sm text-[var(--foreground-secondary)]">Add a role to start the public career timeline.</p>
        <NuxtLink to="/admin/experiences/new" class="mt-4 inline-flex min-h-11 items-center rounded-md border border-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Add experience</NuxtLink>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-[40rem] w-full border-collapse text-left text-sm">
          <caption class="sr-only">Experience records owned by the current account</caption>
          <thead class="bg-[var(--background-muted)] text-xs uppercase tracking-[0.12em] text-[var(--foreground-secondary)]">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Role</th>
              <th scope="col" class="px-4 py-3 font-semibold">Company</th>
              <th scope="col" class="px-4 py-3 font-semibold">Visibility</th>
              <th scope="col" class="px-4 py-3 text-right font-semibold"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="experience in items" :key="experience.id" class="border-t border-[var(--border-subtle)] align-top transition-colors hover:bg-[var(--background-muted)]">
              <th scope="row" class="max-w-xs px-4 py-4 font-semibold text-[var(--foreground-primary)]">{{ experience.role }}</th>
              <td class="px-4 py-4 text-[var(--foreground-secondary)]">{{ experience.company }}</td>
              <td class="px-4 py-4"><span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold" :class="experience.is_published ? 'border-teal-400 text-[var(--accent-hover)]' : 'border-[var(--border-subtle)] text-[var(--foreground-muted)]'">{{ experience.is_published ? 'Published' : 'Draft' }}</span></td>
              <td class="px-4 py-4"><div class="flex flex-wrap justify-end gap-2"><NuxtLink :to="`/admin/experiences/${experience.id}`" class="inline-flex min-h-10 items-center rounded-md border border-[var(--border-subtle)] px-3 py-2 text-sm font-semibold hover:border-[var(--accent-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Edit</NuxtLink><button type="button" class="inline-flex min-h-10 items-center rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-60" :disabled="deletingId === experience.id" @click="remove(experience)">{{ deletingId === experience.id ? 'Deleting…' : 'Delete' }}</button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="actionError" class="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">{{ actionError }}</div>
    <p v-if="deletedLabel" class="rounded-md border border-teal-300 bg-[var(--background-muted)] px-4 py-3 text-sm" role="status" aria-live="polite">{{ deletedLabel }}</p>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface ExperienceListItem { id: string; role: string; company: string; is_published: boolean }
type ApiErrorLike = { data?: unknown; statusMessage?: unknown }

const getApiError = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback
  const candidate = error as ApiErrorLike
  const data = candidate.data && typeof candidate.data === 'object' ? candidate.data as Record<string, unknown> : null
  const message = data?.statusMessage ?? candidate.statusMessage
  return typeof message === 'string' && message.length > 0 ? message : fallback
}

const { data, pending, error: fetchError, refresh } = await useFetch<ExperienceListItem[]>('/api/admin/experiences')
const items = ref<ExperienceListItem[]>(data.value ?? [])
const deletingId = ref<string | null>(null)
const actionError = ref('')
const deletedLabel = ref('')

watch(data, (value) => { items.value = value ?? [] })

const remove = async (experience: ExperienceListItem) => {
  if (!window.confirm(`Delete “${experience.role}”? This cannot be undone.`)) return
  deletingId.value = experience.id
  actionError.value = ''
  deletedLabel.value = ''
  try {
    await $fetch(`/api/admin/experiences/${experience.id}`, { method: 'DELETE' })
    items.value = items.value.filter((item) => item.id !== experience.id)
    deletedLabel.value = `${experience.role} deleted.`
  } catch (error) {
    actionError.value = getApiError(error, 'Unable to delete the experience record. It remains in the list.')
  } finally { deletingId.value = null }
}
</script>
