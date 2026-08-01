<template>
  <div class="home-page">
    <section id="home" class="home-hero" aria-labelledby="home-title">
      <div class="home-hero-media" aria-hidden="true">
        <ClientOnly>
          <video
            v-if="showDesktopHeroVideo"
            ref="heroVideo"
            class="home-hero-video"
            muted
            loop
            playsinline
            preload="metadata"
            tabindex="-1"
          >
            <source src="~/assets/video/hero-bg.webm" type="video/webm">
          </video>
        </ClientOnly>
        <div class="home-hero-media-scrim" />
      </div>

      <div class="home-container home-hero-grid">
        <div class="home-hero-copy">
          <div class="home-hero-meta">
            <span class="home-profile-pill">{{ homeFallback.profile.role }}</span>
            <span>{{ displayProfile.location }} | {{ homeFallback.profile.timezone }}</span>
          </div>
          <p class="home-role-label">{{ homeFallback.profile.role }}</p>
          <h1 id="home-title">{{ homeFallback.profile.headline }}</h1>
          <p class="home-hero-summary">{{ homeFallback.profile.summary }}</p>
          <div class="home-actions">
            <a class="home-button home-button-primary" href="#projects">View selected work</a>
            <a class="home-button home-button-secondary" :href="`mailto:${displayProfile.email}`">Contact me</a>
          </div>
        </div>

        <aside class="home-focus" aria-labelledby="home-focus-title">
          <div class="home-focus-header">
            <div>
              <p>Current focus</p>
              <h2 id="home-focus-title">Product-minded engineering</h2>
            </div>
            <span class="home-focus-mark" aria-hidden="true">NS</span>
          </div>
          <dl class="home-focus-list">
            <div v-for="item in homeFallback.focus" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
          <div class="home-social-links">
            <a :href="displayProfile.githubUrl" target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
            </a>
            <a :href="displayProfile.linkedinUrl" target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </aside>
      </div>
    </section>

    <section class="home-snapshot" aria-label="Professional snapshot">
      <dl class="home-container home-snapshot-grid">
        <div v-for="item in homeFallback.snapshot" :key="item.value">
          <dt>{{ item.value }}</dt>
          <dd>{{ item.label }}</dd>
        </div>
      </dl>
    </section>

    <section id="projects" class="home-section home-container" aria-labelledby="projects-title">
      <div class="home-section-heading home-section-heading-row">
        <div>
          <h2 id="projects-title">Selected project work</h2>
          <p>Systems and product work explained through responsibility, technical choices, and delivery context.</p>
        </div>
        <NuxtLink class="home-text-link" to="/projects">View full portfolio <span aria-hidden="true">→</span></NuxtLink>
      </div>

      <div class="home-project-grid">
        <article
          v-for="(project, index) in homeFallback.projects"
          :key="project.title"
          :class="projectCardClass(index)"
        >
          <div class="home-project-meta">
            <span>{{ project.category }}</span>
            <span v-if="project.role">{{ project.role }}</span>
          </div>
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>

          <dl v-if="index < 2" class="home-project-details">
            <div v-if="project.contribution">
              <dt>Contribution</dt>
              <dd>{{ project.contribution }}</dd>
            </div>
            <div>
              <dt>Delivery context</dt>
              <dd>{{ project.outcome }}</dd>
            </div>
          </dl>
          <p v-else class="home-project-outcome">{{ project.outcome }}</p>

          <ul class="home-tech-list" :aria-label="`${project.title} technologies`">
            <li v-for="technology in project.technologies" :key="technology">{{ technology }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section id="experience" class="home-experience" aria-labelledby="experience-title">
      <div class="home-container home-experience-grid">
        <div class="home-experience-intro">
          <h2 id="experience-title">From full stack delivery to technical coordination.</h2>
          <p>My work now spans implementation, planning, code quality, mentorship, and production responsibility.</p>
        </div>

        <ol class="home-experience-list">
          <li v-for="experience in homeFallback.experiences" :key="`${experience.company}-${experience.period}`">
            <article>
              <div class="home-experience-header">
                <div>
                  <p>{{ experience.company }}</p>
                  <h3>{{ experience.role }}</h3>
                </div>
                <p>{{ experience.period }}</p>
              </div>
              <p class="home-experience-description">{{ experience.description }}</p>
              <ul v-if="experience.contributions.length" class="home-contribution-list">
                <li v-for="contribution in experience.contributions" :key="contribution">{{ contribution }}</li>
              </ul>
            </article>
          </li>
        </ol>
      </div>
    </section>

    <section id="about" class="home-section home-container" aria-labelledby="approach-title">
      <div class="home-approach-grid">
        <div class="home-section-heading">
          <h2 id="approach-title">Practical architecture, clear ownership, calm execution.</h2>
          <p>I work where product decisions and technical constraints meet, with small changes, explicit contracts, and observable failure paths.</p>
        </div>
        <ul class="home-principles" role="list">
          <li v-for="principle in homeFallback.principles" :key="principle.title">
            <h3>{{ principle.title }}</h3>
            <p>{{ principle.description }}</p>
          </li>
        </ul>
      </div>

      <ul class="home-capabilities" role="list" aria-label="Technical capabilities">
        <li v-for="capability in capabilities" :key="capability.title">
          <h3>{{ capability.title }}</h3>
          <p>{{ capability.description }}</p>
        </li>
      </ul>
    </section>

    <section id="contact" class="home-contact" aria-labelledby="contact-title">
      <div class="home-container home-contact-grid">
        <div>
          <h2 id="contact-title">Connect product intent with production reality.</h2>
          <p>I am open to full stack, backend, product engineering, and selected freelance work where ownership and technical judgment matter.</p>
          <a class="home-button home-button-inverse" :href="`mailto:${displayProfile.email}`">{{ displayProfile.email }}</a>
        </div>
        <div class="home-contact-details">
          <dl>
            <div>
              <dt>Location</dt>
              <dd>{{ displayProfile.location }}</dd>
            </div>
            <div>
              <dt>Professional focus</dt>
              <dd>Full stack and backend product engineering</dd>
            </div>
            <div>
              <dt>Preferred contact</dt>
              <dd>Email or LinkedIn</dd>
            </div>
          </dl>
          <div class="home-contact-links">
            <a :href="displayProfile.linkedinUrl" target="_blank" rel="noopener noreferrer">LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>
            <a :href="displayProfile.githubUrl" target="_blank" rel="noopener noreferrer">GitHub<span class="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { homeFallback } from '~/data/homeFallback'

const { data: profile } = useProfile()
const { data: skills } = useSkills()

const displayProfile = computed(() => ({
  fullName: profile.value?.full_name?.trim() || homeFallback.profile.fullName,
  location: profile.value?.location?.trim() || homeFallback.profile.location,
  email: profile.value?.email?.trim() || homeFallback.profile.email,
  linkedinUrl: profile.value?.linkedin_url?.trim() || homeFallback.profile.linkedinUrl,
  githubUrl: homeFallback.profile.githubUrl,
  websiteUrl: profile.value?.website_url?.trim() || homeFallback.profile.websiteUrl,
  avatarUrl: profile.value?.avatar_url?.trim() || undefined,
}))

const capabilities = computed(() => {
  const liveCapabilities = Object.entries(skills.value ?? {})
    .filter(([, list]) => list.length)
    .map(([title, list]) => ({
      title,
      description: list.map(skill => skill.name).join(', '),
    }))

  return liveCapabilities.length ? liveCapabilities : homeFallback.capabilities
})

const projectCardClass = (index: number) => ({
  'home-project-card': true,
  'home-project-card-lead': index === 0,
  'home-project-card-inverse': index === 1,
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
