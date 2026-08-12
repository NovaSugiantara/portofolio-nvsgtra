<template>
  <div class="bg-page text-primary">
    <section id="home" aria-labelledby="home-title" class="relative overflow-clip border-b border-line">
      <div class="absolute inset-y-0 right-0 hidden w-[58%] bg-soft md:block" aria-hidden="true">
        <ClientOnly>
          <video
            v-if="showDesktopHeroVideo"
            ref="heroVideo"
            class="h-full w-full object-cover [object-position:72%_center]"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            tabindex="-1"
          >
            <source src="~/assets/video/hero-bg.webm" type="video/webm">
          </video>
        </ClientOnly>
        <div class="hero-scrim" />
      </div>

      <div class="site-container relative">
        <div class="max-w-[50rem] py-16 motion-safe:animate-first-view md:py-24">
          <p class="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-accent">{{ homeFallback.profile.role }}</p>
          <h1 id="home-title" class="mt-4 max-w-[18ch] text-display leading-[1.08] tracking-[-0.035em]">{{ homeFallback.profile.headline }}</h1>
          <p class="mt-6 max-w-[62ch] text-lg leading-relaxed text-secondary">{{ homeFallback.profile.summary }}</p>
          <div class="mt-10 flex flex-wrap gap-3">
            <a class="btn btn-primary" href="#projects">View selected work <Icon name="ph:arrow-down-right" size="1.125rem" aria-hidden="true" /></a>
            <NuxtLink class="btn btn-secondary" to="/contact">Contact me <Icon name="ph:envelope-simple" size="1.125rem" aria-hidden="true" /></NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section aria-label="Professional snapshot" class="border-b border-line bg-section">
      <div class="site-container">
        <dl class="grid grid-cols-2 gap-px border-x border-line bg-line sm:grid-cols-4">
          <div v-for="item in homeFallback.snapshot" :key="item.value" class="bg-section p-5 sm:p-8">
            <dt class="text-xl font-bold tracking-[-0.03em] sm:text-3xl">{{ item.value }}</dt>
            <dd class="mt-2 max-w-[24ch] text-sm leading-normal text-faint">{{ item.label }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section id="projects" aria-labelledby="projects-title" class="site-container py-16 md:py-24">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="max-w-[46rem]">
          <h2 id="projects-title" class="text-3xl tracking-[-0.035em] md:text-4xl">Selected project work</h2>
          <p class="mt-4 max-w-[65ch] text-lg leading-relaxed text-secondary">I present each project through its context, my contribution, and the decisions behind the delivery.</p>
        </div>
        <NuxtLink class="link-accent shrink-0" to="/projects">View full portfolio <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" /></NuxtLink>
      </div>

      <div class="mt-10 grid gap-4 md:grid-cols-2">
        <article
          v-for="(project, index) in homeProjects"
          :key="project.key"
          class="rounded-lg border border-line bg-card p-5 sm:p-8"
          :class="index === 0 ? 'md:col-span-2' : ''"
        >
          <p class="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-faint">{{ project.meta }}</p>
          <h3 class="mt-4 text-2xl tracking-[-0.025em]">{{ project.title }}</h3>
          <p class="mt-4 max-w-[65ch] leading-7 text-secondary">{{ project.description }}</p>

          <dl v-if="project.contribution || project.outcome" class="mt-6 grid gap-6 border-y border-line py-6 sm:grid-cols-2">
            <div v-if="project.contribution">
              <dt class="text-sm text-faint">Contribution</dt>
              <dd class="mt-2 font-semibold leading-6">{{ project.contribution }}</dd>
            </div>
            <div v-if="project.outcome">
              <dt class="text-sm text-faint">Delivery context</dt>
              <dd class="mt-2 font-semibold leading-6">{{ project.outcome }}</dd>
            </div>
          </dl>

          <ul class="mt-6 flex flex-wrap gap-2" :aria-label="`${project.title} technologies`">
            <li v-for="technology in project.technologies" :key="technology" class="rounded-sm border border-line bg-soft px-2.5 py-1 text-sm text-secondary">{{ technology }}</li>
          </ul>

          <NuxtLink :to="project.href" class="link-accent mt-6">{{ project.cta }}<span v-if="project.href === '/projects'" class="sr-only"> for {{ project.title }}</span> <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" /></NuxtLink>
        </article>
      </div>
    </section>

    <section aria-labelledby="experience-title" class="border-y border-line bg-section">
      <div class="site-container grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)]">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <h2 id="experience-title" class="text-3xl tracking-[-0.035em] md:text-4xl">From full stack delivery to technical coordination.</h2>
          <p class="mt-4 max-w-[65ch] text-lg leading-relaxed text-secondary">My work now spans implementation, planning, code quality, mentorship, and production responsibility.</p>
        </div>

        <ol class="grid gap-4">
          <li v-for="experience in homeFallback.experiences" :key="`${experience.company}-${experience.period}`">
            <article class="rounded-lg border border-line bg-card p-5 sm:p-8">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p class="text-sm font-semibold text-faint">{{ experience.company }}</p>
                  <h3 class="mt-1 text-lg leading-snug">{{ experience.role }}</h3>
                </div>
                <p class="shrink-0 font-mono text-sm text-faint">{{ experience.period }}</p>
              </div>
              <p class="mt-4 leading-7 text-secondary">{{ experience.description }}</p>
              <ul v-if="experience.contributions.length" class="mt-4 grid gap-2">
                <li
                  v-for="contribution in experience.contributions"
                  :key="contribution"
                  class="relative pl-6 leading-6 before:absolute before:left-0 before:font-bold before:text-accent before:content-['✓']"
                >
                  {{ contribution }}
                </li>
              </ul>
            </article>
          </li>
        </ol>
      </div>
    </section>

    <section id="about" aria-labelledby="approach-title" class="site-container py-16 md:py-24">
      <div class="max-w-[46rem]">
        <h2 id="approach-title" class="text-3xl tracking-[-0.035em] md:text-4xl">Practical architecture, clear ownership, calm execution.</h2>
        <p class="mt-4 max-w-[65ch] text-lg leading-relaxed text-secondary">I work where product decisions and technical constraints meet, with small changes, explicit contracts, and observable failure paths.</p>
      </div>

      <ul class="mt-10 grid gap-6 sm:grid-cols-2" role="list">
        <li v-for="principle in homeFallback.principles" :key="principle.title" class="border-t border-line-strong pt-4">
          <h3 class="text-lg tracking-[-0.015em]">{{ principle.title }}</h3>
          <p class="mt-1 leading-7 text-secondary">{{ principle.description }}</p>
        </li>
      </ul>

      <ul class="mt-16 grid gap-4 md:grid-cols-3" role="list" aria-label="Technical capabilities">
        <li v-for="capability in capabilities" :key="capability.title" class="rounded-lg bg-soft p-6">
          <h3 class="text-lg tracking-[-0.015em]">{{ capability.title }}</h3>
          <p class="mt-1 text-sm leading-6 text-secondary">{{ capability.description }}</p>
        </li>
      </ul>
    </section>

    <section id="contact" aria-labelledby="contact-title" class="bg-obsidian text-mint">
      <div class="site-container grid gap-10 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <h2 id="contact-title" class="text-3xl tracking-[-0.035em] text-mint md:text-4xl">Connect product intent with production reality.</h2>
          <p class="mt-4 max-w-[65ch] text-lg leading-relaxed text-mint/80">I am open to full stack, backend, product engineering, and selected freelance work where ownership and technical judgment matter.</p>
          <NuxtLink class="btn btn-inverse mt-10" to="/contact">Contact me <Icon name="ph:paper-plane-tilt" size="1.125rem" aria-hidden="true" /></NuxtLink>
        </div>

        <div class="rounded-lg border border-mint/20 bg-mint/5 p-5 sm:p-8">
          <dl class="grid gap-6">
            <div>
              <dt class="text-sm text-mint/60">Location</dt>
              <dd class="mt-2 font-semibold leading-6">{{ displayProfile.location }}</dd>
            </div>
            <div>
              <dt class="text-sm text-mint/60">Professional focus</dt>
              <dd class="mt-2 font-semibold leading-6">Full stack and backend product engineering</dd>
            </div>
            <div>
              <dt class="text-sm text-mint/60">Direct email</dt>
              <dd class="mt-2 font-semibold leading-6">
                <a :href="`mailto:${displayProfile.email}`" class="text-mint underline underline-offset-4">{{ displayProfile.email }}</a>
              </dd>
            </div>
          </dl>
          <div class="mt-6 flex flex-wrap gap-4 border-t border-mint/20 pt-6">
            <a :href="displayProfile.linkedinUrl" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 font-semibold text-mint underline underline-offset-4"><Icon name="ph:linkedin-logo" size="1.125rem" aria-hidden="true" />LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>
            <a :href="displayProfile.githubUrl" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 font-semibold text-mint underline underline-offset-4"><Icon name="ph:github-logo" size="1.125rem" aria-hidden="true" />GitHub<span class="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { homeFallback } from '~/data/homeFallback'

interface HomeProjectCard {
  key: string
  title: string
  meta: string
  description: string
  contribution?: string
  outcome?: string
  technologies: string[]
  href: string
  cta: string
}

const { data: profile } = useProfile()
const { data: skills } = useSkills()
const { data: projects } = useProjects()

const displayProfile = computed(() => ({
  fullName: profile.value?.full_name?.trim() || homeFallback.profile.fullName,
  location: profile.value?.location?.trim() || homeFallback.profile.location,
  email: profile.value?.email?.trim() || homeFallback.profile.email,
  linkedinUrl: profile.value?.linkedin_url?.trim() || homeFallback.profile.linkedinUrl,
  githubUrl: homeFallback.profile.githubUrl,
  websiteUrl: profile.value?.website_url?.trim() || homeFallback.profile.websiteUrl,
  avatarUrl: profile.value?.avatar_url?.trim() || undefined,
}))

const homeProjects = computed<HomeProjectCard[]>(() => {
  const liveProjects = (projects.value ?? []).slice(0, 3).map((project) => ({
    key: String(project.id),
    title: project.title,
    meta: project.role?.trim() || 'Project work',
    description: project.description?.trim() || 'No public project summary is available.',
    technologies: (project.tech_stack ?? []).slice(0, 4),
    href: `/projects/${project.slug}`,
    cta: 'Read case study',
  }))

  if (liveProjects.length) return liveProjects

  return homeFallback.projects.slice(0, 3).map((project) => ({
    key: project.title,
    title: project.title,
    meta: project.role ?? project.category,
    description: project.description,
    contribution: project.contribution,
    outcome: project.outcome,
    technologies: project.technologies.slice(0, 4),
    href: '/projects',
    cta: 'View portfolio',
  }))
})

const capabilities = computed(() => {
  const liveCapabilities = Object.entries(skills.value ?? {})
    .filter(([, list]) => list.length)
    .map(([title, list]) => ({
      title,
      description: list.map(skill => skill.name).join(', '),
    }))

  return liveCapabilities.length ? liveCapabilities : homeFallback.capabilities
})

const heroVideo = ref<HTMLVideoElement | null>(null)
const isDesktopViewport = ref(false)
const prefersReducedMotion = ref(false)
let viewportQuery: MediaQueryList | undefined
let motionQuery: MediaQueryList | undefined

const updateHeroMediaState = () => {
  isDesktopViewport.value = viewportQuery?.matches ?? false
  prefersReducedMotion.value = motionQuery?.matches ?? false
}

const showDesktopHeroVideo = computed(() => isDesktopViewport.value && !prefersReducedMotion.value)

onMounted(() => {
  viewportQuery = window.matchMedia('(min-width: 768px)')
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateHeroMediaState()
  viewportQuery.addEventListener('change', updateHeroMediaState)
  motionQuery.addEventListener('change', updateHeroMediaState)
})

onBeforeUnmount(() => {
  viewportQuery?.removeEventListener('change', updateHeroMediaState)
  motionQuery?.removeEventListener('change', updateHeroMediaState)
})

watch(showDesktopHeroVideo, async (shouldPlay) => {
  if (!shouldPlay) return

  await nextTick()
  await heroVideo.value?.play().catch(() => undefined)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => new URL('/', requestUrl.origin).toString())
const profileImageUrl = computed(() => displayProfile.value.avatarUrl
  ? new URL(displayProfile.value.avatarUrl, requestUrl.origin).toString()
  : undefined)
const seoTitle = computed(() => `${displayProfile.value.fullName} - ${homeFallback.profile.role}`)
const seoDescription = homeFallback.profile.summary
const personSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: displayProfile.value.fullName,
  jobTitle: homeFallback.profile.role,
  url: canonicalUrl.value,
  email: `mailto:${displayProfile.value.email}`,
  sameAs: [
    displayProfile.value.linkedinUrl,
    displayProfile.value.githubUrl,
    displayProfile.value.websiteUrl,
  ],
}))

const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')

useSeoMeta({
  title: () => seoTitle.value,
  description: seoDescription,
  ogTitle: () => seoTitle.value,
  ogDescription: seoDescription,
  ogUrl: canonicalUrl,
  ogType: 'website',
  ogImage: profileImageUrl,
  ogImageAlt: () => profileImageUrl.value ? `${displayProfile.value.fullName} portrait` : undefined,
  twitterTitle: () => seoTitle.value,
  twitterDescription: seoDescription,
  twitterImage: profileImageUrl,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{
    key: 'home-person-jsonld',
    type: 'application/ld+json',
    children: () => serializeJsonLd(personSchema.value),
  }],
})
</script>
