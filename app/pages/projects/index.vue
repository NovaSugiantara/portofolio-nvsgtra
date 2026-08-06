<template>
  <div class="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
    <header class="max-w-3xl">
      <h1 class="text-balance text-4xl font-extrabold tracking-tight text-[var(--foreground-primary)] md:text-5xl">Full Stack Web Developer portfolio</h1>
      <p class="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--foreground-secondary)]">Explore Nova Sugiantara’s selected projects, professional experience, and technical skills across React, Vue.js, Laravel, Ruby on Rails, AWS, and Go.</p>
    </header>

    <section aria-labelledby="projects-heading" class="mt-20 md:mt-28">
      <div class="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div class="max-w-2xl">
          <h2 id="projects-heading" class="text-3xl font-bold tracking-tight text-[var(--foreground-primary)] md:text-4xl">Selected project work</h2>
          <p class="mt-3 max-w-prose leading-relaxed text-[var(--foreground-secondary)]">Start with the featured case study, then scan the recent work list for the context, role, and stack behind each project.</p>
        </div>
        <p class="max-w-xs text-sm leading-relaxed text-[var(--foreground-muted)]">The ordering follows the published portfolio sequence.</p>
      </div>

      <div v-if="projectsLoading" class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]" aria-busy="true" aria-live="polite" aria-label="Loading published projects">
        <div class="min-h-80 animate-pulse rounded-[var(--radius-lg)] bg-[var(--background-muted)]" />
        <div class="space-y-4">
          <div v-for="slot in 3" :key="slot" class="h-28 animate-pulse rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
        </div>
      </div>

      <div v-else-if="projectsError" class="mt-8 max-w-2xl rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-muted)] p-6 sm:p-8" role="alert">
        <h3 class="text-xl font-semibold text-[var(--foreground-primary)]">Projects could not be loaded</h3>
        <p class="mt-2 max-w-prose leading-relaxed text-[var(--foreground-secondary)]">The published project list is temporarily unavailable. Try the request again or return to the homepage.</p>
        <div class="mt-5 flex flex-wrap items-center gap-4">
          <button type="button" class="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 text-sm font-semibold text-white transition-[background-color,transform] duration-180 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-muted)] motion-reduce:transition-none" @click="refreshProjects"><Icon name="ph:arrow-clockwise" size="1.125rem" aria-hidden="true" />Try again</button>
          <NuxtLink to="/" class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] underline underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"><Icon name="ph:house" size="1.125rem" aria-hidden="true" />Return home</NuxtLink>
        </div>
      </div>

      <div v-else-if="!publishedProjects.length" class="mt-8 max-w-2xl rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--background-muted)] p-6 sm:p-8" role="status">
        <h3 class="text-xl font-semibold text-[var(--foreground-primary)]">No published projects yet</h3>
        <p class="mt-2 max-w-prose leading-relaxed text-[var(--foreground-secondary)]">There are no public case studies to show at this address. Return home to continue exploring Nova Sugiantara’s portfolio.</p>
        <NuxtLink to="/" class="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] underline underline-offset-4 hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"><Icon name="ph:house" size="1.125rem" aria-hidden="true" />Return home</NuxtLink>
      </div>

      <div v-else class="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:gap-14">
        <NuxtLink
          v-if="featuredProject"
          :to="`/projects/${featuredProject.slug}`"
          class="group flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-card)] transition-[border-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-[var(--border-strong)] motion-safe:hover:shadow-[var(--shadow-md)] motion-safe:active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background-page)] motion-reduce:transition-none"
        >
          <img v-if="projectImageUrl(featuredProject.cover_image_url)" :src="projectImageUrl(featuredProject.cover_image_url)" :alt="`${featuredProject.title} cover`" width="1280" height="720" class="aspect-[16/9] w-full object-cover" loading="eager" decoding="async" />
          <div class="flex flex-1 flex-col p-6 sm:p-8">
            <p class="text-sm font-semibold text-[var(--accent-primary)]">Featured case study</p>
            <h3 class="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground-primary)] group-hover:text-[var(--accent-hover)] md:text-3xl">{{ featuredProject.title }}</h3>
            <div class="mt-6 border-t border-[var(--border-subtle)] pt-5">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Context</p>
              <p class="mt-2 max-w-prose leading-relaxed text-[var(--foreground-secondary)]">{{ featuredProject.description || 'No public project summary is available.' }}</p>
            </div>
            <dl class="mt-6 grid gap-5 border-t border-[var(--border-subtle)] pt-5 sm:grid-cols-2">
              <div v-if="featuredProject.role">
                <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Role</dt>
                <dd class="mt-2 text-sm font-medium text-[var(--foreground-primary)]">{{ featuredProject.role }}</dd>
              </div>
              <div v-if="featuredProject.tech_stack?.length">
                <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Stack</dt>
                <dd class="mt-2">
                  <ul class="flex flex-wrap gap-2" aria-label="Featured project stack">
                    <li v-for="technology in featuredProject.tech_stack.slice(0, 4)" :key="technology" class="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] px-2 py-1 font-mono text-xs text-[var(--foreground-secondary)]">{{ technology }}</li>
                  </ul>
                </dd>
              </div>
            </dl>
            <span class="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] underline underline-offset-4">Read case study <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" class="transition-transform duration-180 motion-safe:group-hover:translate-x-1 motion-reduce:transition-none" /></span>
          </div>
        </NuxtLink>

        <section v-if="recentProjects.length" aria-labelledby="recent-heading" class="min-w-0">
          <div class="flex items-baseline justify-between gap-4">
            <h3 id="recent-heading" class="text-xl font-semibold text-[var(--foreground-primary)]">Recent work</h3>
            <span class="text-sm text-[var(--foreground-muted)]">More case studies</span>
          </div>
          <ul class="mt-4 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            <li v-for="project in recentProjects" :key="project.id">
              <NuxtLink :to="`/projects/${project.slug}`" class="group flex min-w-0 items-start justify-between gap-4 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-focus)]">
                <div class="min-w-0">
                  <h4 class="break-words text-lg font-semibold text-[var(--foreground-primary)] group-hover:text-[var(--accent-hover)]">{{ project.title }}</h4>
                  <p v-if="project.role" class="mt-2 text-sm leading-relaxed text-[var(--foreground-secondary)]"><span class="font-semibold text-[var(--foreground-primary)]">Role:</span> {{ project.role }}</p>
                  <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--foreground-secondary)]"><span class="font-semibold text-[var(--foreground-primary)]">Context:</span> {{ project.description || 'No public project summary is available.' }}</p>
                  <ul v-if="project.tech_stack?.length" class="mt-3 flex flex-wrap gap-x-3 gap-y-1" aria-label="Project stack">
                    <li v-for="technology in project.tech_stack.slice(0, 3)" :key="technology" class="font-mono text-xs text-[var(--foreground-muted)]">{{ technology }}</li>
                  </ul>
                </div>
                <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" class="mt-1 shrink-0 text-[var(--accent-primary)] transition-transform duration-180 motion-safe:group-hover:translate-x-1 motion-reduce:transition-none" />
              </NuxtLink>
            </li>
          </ul>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PublicProject } from '~/composables/useProjects'

const { data: projects, status: projectsStatus, error: projectsError, refresh: refreshProjects } = useProjects()
const requestUrl = useRequestURL()

const projectsLoading = computed(() => projectsStatus.value === 'idle' || projectsStatus.value === 'pending')
const publishedProjects = computed(() => projects.value ?? [])
const featuredProject = computed<PublicProject | null>(() => publishedProjects.value[0] ?? null)
const recentProjects = computed(() => publishedProjects.value.slice(1))

const projectImageUrl = (value: string | null | undefined) => {
  if (!value) return undefined

  try {
    const url = new URL(value, requestUrl.origin)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined
  } catch {
    return undefined
  }
}

const canonicalUrl = computed(() => new URL('/projects', requestUrl.origin).toString())
const portfolioImageUrl = computed(() => projectImageUrl(publishedProjects.value.find((project) => project.cover_image_url)?.cover_image_url))
const portfolioSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Full Stack Web Developer portfolio - Nova Sugiantara',
  url: canonicalUrl.value,
  ...(publishedProjects.value.length ? {
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: publishedProjects.value.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.title,
        url: new URL(`/projects/${project.slug}`, requestUrl.origin).toString(),
      })),
    },
  } : {}),
}))

const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')

useSeoMeta({
  title: 'Full Stack Web Developer portfolio - Nova Sugiantara',
  description: 'Explore Nova Sugiantara’s selected projects, professional experience, and technical skills across React, Vue.js, Laravel, Ruby on Rails, AWS, and Go.',
  ogTitle: 'Full Stack Web Developer portfolio - Nova Sugiantara',
  ogDescription: 'Explore Nova Sugiantara’s selected projects, professional experience, and technical skills across React, Vue.js, Laravel, Ruby on Rails, AWS, and Go.',
  ogUrl: canonicalUrl,
  ogType: 'website',
  ogImage: portfolioImageUrl,
  ogImageAlt: 'Selected portfolio project',
  twitterTitle: 'Full Stack Web Developer portfolio - Nova Sugiantara',
  twitterDescription: 'Explore Nova Sugiantara’s selected projects, professional experience, and technical skills across React, Vue.js, Laravel, Ruby on Rails, AWS, and Go.',
  twitterImage: portfolioImageUrl,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{
    key: 'portfolio-collection-jsonld',
    type: 'application/ld+json',
    children: () => serializeJsonLd(portfolioSchema.value),
  }],
})
</script>
