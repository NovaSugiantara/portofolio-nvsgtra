<template>
  <div v-if="project">
    <header class="border-b border-line">
      <div class="site-container py-10 md:py-16">
        <nav aria-label="Breadcrumb" class="text-sm text-faint">
          <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><NuxtLink to="/projects" class="text-secondary underline underline-offset-4 hover:text-accent">Portfolio</NuxtLink></li>
            <li aria-hidden="true"><Icon name="ph:caret-right" size="0.875rem" /></li>
            <li aria-current="page" class="min-w-0 break-words">{{ project.title }}</li>
          </ol>
        </nav>
        <p class="eyebrow mt-8">{{ project.kind === 'work' ? 'Product work' : 'Challenge build' }}</p>
        <h1 id="project-title" class="mt-3 max-w-[20ch] text-4xl font-semibold tracking-[-0.04em] md:text-6xl md:leading-[1.02]">{{ project.title }}</h1>
        <p class="mt-5 max-w-[60ch] text-lg leading-relaxed text-secondary">{{ project.summary }}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a v-if="liveUrl" class="btn btn-primary" :href="liveUrl" target="_blank" rel="noopener noreferrer">{{ project.project_url_label || 'Open the project' }} <Icon name="ph:arrow-up-right" size="1.125rem" aria-hidden="true" /><span class="sr-only"> (opens in a new tab)</span></a>
          <NuxtLink class="btn btn-secondary" to="/contact">Talk about a similar project</NuxtLink>
        </div>
      </div>
    </header>

    <article class="site-container grid min-w-0 gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16" aria-labelledby="project-title">
      <div class="min-w-0">
        <WorkShot :src="project.cover_image_url" :alt="project.cover_alt" :url="project.project_url" eager />

        <section v-if="project.description" aria-labelledby="context-heading" class="mt-12 max-w-[65ch]">
          <h2 id="context-heading" class="text-2xl font-semibold tracking-[-0.03em]">Context</h2>
          <p class="mt-3 text-lg leading-8 text-secondary">{{ project.description }}</p>
        </section>

        <section v-if="project.contributions.length" aria-labelledby="part-heading" class="mt-10 max-w-[65ch]">
          <h2 id="part-heading" class="text-2xl font-semibold tracking-[-0.03em]">My part</h2>
          <ul class="mt-4 grid gap-3">
            <li v-for="item in project.contributions" :key="item" class="flex gap-3 leading-7 text-secondary">
              <Icon name="ph:check" size="1.125rem" aria-hidden="true" class="mt-1 shrink-0 text-accent" />{{ item }}
            </li>
          </ul>
          <p v-if="project.team_note" class="mt-6 rounded-md border border-line bg-soft px-4 py-3 text-sm leading-6 text-secondary">{{ project.team_note }}</p>
        </section>
      </div>

      <aside aria-label="Project facts" class="min-w-0">
        <dl class="divide-y divide-line border-y border-line text-sm">
          <div v-if="project.role" class="py-4">
            <dt class="text-faint">Role</dt>
            <dd class="mt-1 font-semibold">{{ project.role }}</dd>
          </div>
          <div v-if="project.challenge" class="py-4">
            <dt class="text-faint">Result</dt>
            <dd class="figure mt-1 font-semibold">{{ project.challenge.score }}/100 · #{{ project.challenge.rank }} of {{ project.challenge.entrants }}</dd>
            <dd class="mt-1 text-faint">{{ project.challenge.platform }} {{ project.challenge.format }}, {{ formatDate(project.challenge.submitted_at) }}</dd>
            <dd class="mt-2"><a :href="project.challenge.profile_url" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-4">Check on VibeDev<span class="sr-only"> (opens in a new tab)</span></a></dd>
          </div>
          <div v-if="project.tech_stack.length" class="py-4">
            <dt class="text-faint">Stack</dt>
            <dd class="mt-2"><TechList :items="project.tech_stack" /></dd>
          </div>
          <div v-if="liveUrl" class="py-4">
            <dt class="text-faint">Live link</dt>
            <dd class="mt-1 break-all"><a :href="liveUrl" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-4">{{ hostOf(liveUrl) }}<span class="sr-only"> (opens in a new tab)</span></a></dd>
          </div>
        </dl>
        <NuxtLink to="/projects" class="link-accent mt-6"><Icon name="ph:arrow-left" size="1.125rem" aria-hidden="true" />All work</NuxtLink>
      </aside>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)
const { data: project } = await useProjectBySlug(slug)
const toAbsolute = useSiteUrl()

// A missing project is a real 404, not a 200 page that says "not found" (a soft 404 for search engines).
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const isSafeUrl = (value: string | null | undefined) => {
  if (!value) return false
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

const liveUrl = computed(() => isSafeUrl(project.value?.project_url) ? project.value!.project_url! : '')
const hostOf = (value: string) => new URL(value).host
const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))

usePageSeo({
  title: () => `${project.value?.title} · Nova Sugiantara`,
  description: () => project.value?.summary ?? '',
  path: `/projects/${slug}`,
  // Shared JPEG card: some social platforms do not render WebP previews.
  schema: () => project.value
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.value.title,
        description: project.value.summary,
        url: toAbsolute(`/projects/${slug}`),
        image: project.value.cover_image_url ? toAbsolute(project.value.cover_image_url) : undefined,
        ...(liveUrl.value ? { sameAs: liveUrl.value } : {}),
        ...(project.value.challenge ? { dateCreated: project.value.challenge.submitted_at } : {}),
        creator: { '@type': 'Person', name: 'Nova Sugiantara', url: toAbsolute('/') },
      }
    : null,
})
</script>
