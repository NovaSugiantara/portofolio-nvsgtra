<template>
  <div class="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14 lg:px-12 lg:py-20">
    <nav aria-label="Breadcrumb" class="mb-10 text-sm text-[var(--foreground-muted)]">
      <ol class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <li><NuxtLink to="/" class="underline decoration-[var(--accent-primary)] underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Home</NuxtLink></li>
        <li aria-hidden="true">/</li>
        <li><NuxtLink to="/projects" class="underline decoration-[var(--accent-primary)] underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">Portofolio</NuxtLink></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" class="min-w-0 max-w-full break-words text-[var(--foreground-secondary)]">{{ project?.title ?? 'Project details' }}</li>
      </ol>
    </nav>

    <section v-if="isLoading" class="max-w-3xl space-y-6" aria-busy="true" aria-live="polite" aria-label="Loading project details">
      <div class="h-5 w-32 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
      <div class="h-14 max-w-2xl animate-pulse rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
      <div class="h-24 max-w-3xl animate-pulse rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
      <p class="text-sm text-[var(--foreground-muted)]">Loading project…</p>
    </section>

    <section v-else-if="projectError" class="max-w-2xl rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-muted)] p-6 sm:p-8" role="alert">
      <h1 class="text-2xl font-bold text-[var(--foreground-primary)]">Project details unavailable</h1>
      <p class="mt-2 max-w-prose leading-relaxed text-[var(--foreground-secondary)]">This project could not be loaded right now. Try the request again or return to the project index.</p>
      <div class="mt-5 flex flex-wrap items-center gap-4">
        <button type="button" class="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 text-sm font-semibold text-white transition-[background-color,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-muted)] motion-reduce:transition-none" @click="refreshProject">Try again</button>
        <NuxtLink to="/projects" class="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent-primary)] underline underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">View all project work</NuxtLink>
      </div>
    </section>

    <section v-else-if="!project" class="max-w-2xl rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--background-muted)] p-6 sm:p-8" role="status">
      <h1 class="text-2xl font-bold text-[var(--foreground-primary)]">Project not found</h1>
      <p class="mt-2 max-w-prose leading-relaxed text-[var(--foreground-secondary)]">This project is not published or the address is incorrect. Browse the published project index to choose another case study.</p>
      <NuxtLink to="/projects" class="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent-primary)] underline underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">View all project work</NuxtLink>
    </section>

    <article v-else class="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16" aria-labelledby="project-title">
      <div class="min-w-0">
        <header class="max-w-3xl">
          <p v-if="project.role" class="text-sm font-semibold text-[var(--accent-primary)]"><span class="text-[var(--foreground-muted)]">Role:</span> {{ project.role }}</p>
          <h1 id="project-title" class="mt-3 text-balance text-4xl font-extrabold tracking-tight text-[var(--foreground-primary)] md:text-5xl">{{ project.title }}</h1>
        </header>

        <section aria-labelledby="context-heading" class="mt-10 max-w-3xl border-y border-[var(--border-subtle)] py-6 sm:py-8">
          <h2 id="context-heading" class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Context</h2>
          <p class="mt-3 max-w-prose text-lg leading-relaxed text-[var(--foreground-secondary)]">{{ project.description || 'No public project summary is available.' }}</p>
        </section>

        <figure v-if="projectImageUrl" class="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-muted)]">
          <img :src="projectImageUrl" :alt="`${project.title} cover`" width="1280" height="720" class="max-h-[36rem] w-full object-cover" loading="eager" decoding="async" />
          <figcaption class="sr-only">Cover image for {{ project.title }}</figcaption>
        </figure>
        <p v-else class="mt-10 max-w-3xl rounded-[var(--radius-md)] border border-dashed border-[var(--border-subtle)] p-4 text-sm text-[var(--foreground-muted)]" role="status">Project cover image is not available.</p>
      </div>

      <aside aria-label="Project details" class="min-w-0 lg:pt-1">
        <h2 class="text-xl font-semibold text-[var(--foreground-primary)]">Project details</h2>
        <dl class="mt-5 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          <div v-if="project.role" class="py-4">
            <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Role</dt>
            <dd class="mt-2 text-sm leading-relaxed text-[var(--foreground-secondary)]">{{ project.role }}</dd>
          </div>
          <div v-if="project.tech_stack?.length" class="py-4">
            <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Stack</dt>
            <dd class="mt-3">
              <ul class="flex flex-wrap gap-2" aria-label="Technologies used">
                <li v-for="technology in project.tech_stack" :key="technology" class="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] px-2 py-1 font-mono text-xs text-[var(--foreground-secondary)]">{{ technology }}</li>
              </ul>
            </dd>
          </div>
          <div v-if="isSafeExternalUrl(project.project_url) || isSafeExternalUrl(project.repo_url)" class="space-y-4 py-4">
            <div v-if="isSafeExternalUrl(project.project_url)">
              <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Project link</dt>
              <dd class="mt-2"><a :href="project.project_url!" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" :aria-label="`Open ${project.title} project link in a new tab`" class="text-sm font-semibold text-[var(--accent-primary)] underline underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">View project <span aria-hidden="true">↗</span></a></dd>
            </div>
            <div v-if="isSafeExternalUrl(project.repo_url)">
              <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Repository</dt>
              <dd class="mt-2"><a :href="project.repo_url!" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" :aria-label="`Open ${project.title} repository in a new tab`" class="text-sm font-semibold text-[var(--accent-primary)] underline underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">View repository <span aria-hidden="true">↗</span></a></dd>
            </div>
          </div>
        </dl>
      </aside>
    </article>

    <footer class="mt-14 border-t border-[var(--border-subtle)] pt-6 lg:mt-20">
      <NuxtLink to="/projects" class="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent-primary)] underline underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">← Back to Portofolio</NuxtLink>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: project, status, error: projectError, refresh: refreshProject } = useProjectBySlug(String(route.params.slug))
const requestUrl = useRequestURL()

const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')
const projectImageUrl = computed(() => {
  const value = project.value?.cover_image_url
  if (!value) return undefined

  try {
    const url = new URL(value, requestUrl.origin)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined
  } catch {
    return undefined
  }
})

const isSafeExternalUrl = (value: string | null | undefined) => {
  if (!value) return false

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const canonicalUrl = computed(() => new URL(route.path, requestUrl.origin).toString())
const fallbackSeoTitle = computed(() => projectError.value ? 'Project details unavailable - Nova Sugiantara' : 'Project not found - Nova Sugiantara')
const fallbackSeoDescription = computed(() => projectError.value ? 'Project details are temporarily unavailable.' : 'This portfolio project is not published or the address is incorrect.')
const projectSchema = computed(() => {
  if (!project.value) return undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.value.title,
    ...(project.value.description ? { description: project.value.description } : {}),
    ...(projectImageUrl.value ? { image: [projectImageUrl.value] } : {}),
    ...(isSafeExternalUrl(project.value.project_url) ? { url: project.value.project_url } : { url: canonicalUrl.value }),
    ...(isSafeExternalUrl(project.value.repo_url) ? { codeRepository: project.value.repo_url } : {}),
    author: {
      '@type': 'Person',
      name: 'Nova Sugiantara',
      url: requestUrl.origin,
    },
  }
})

const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')

useSeoMeta({
  title: () => project.value ? `${project.value.title} - Nova Sugiantara` : fallbackSeoTitle.value,
  description: () => project.value?.description?.slice(0, 160) ?? fallbackSeoDescription.value,
  ogTitle: () => project.value?.title ? `${project.value.title} - Nova Sugiantara` : fallbackSeoTitle.value,
  ogDescription: () => project.value?.description?.slice(0, 160) ?? fallbackSeoDescription.value,
  ogUrl: canonicalUrl,
  ogType: 'website',
  ogSiteName: 'Nova Sugiantara Portfolio',
  ogImage: projectImageUrl,
  ogImageAlt: () => project.value ? `${project.value.title} cover` : undefined,
  twitterTitle: () => project.value?.title ? `${project.value.title} - Nova Sugiantara` : fallbackSeoTitle.value,
  twitterDescription: () => project.value?.description?.slice(0, 160) ?? fallbackSeoDescription.value,
  twitterImage: projectImageUrl,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{
    key: 'project-creative-work-jsonld',
    type: 'application/ld+json',
    children: () => (projectSchema.value ? serializeJsonLd(projectSchema.value) : ''),
  }],
})
</script>
