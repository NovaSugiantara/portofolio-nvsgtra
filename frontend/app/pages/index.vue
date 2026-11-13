<template>
  <div class="bg-page text-primary">
    <!-- Hero -->
    <section id="home" aria-labelledby="home-title" class="relative overflow-clip border-b border-line">
      <div class="absolute inset-y-0 right-0 hidden w-[50%] bg-soft lg:block" aria-hidden="true">
        <img src="/video/hero-poster.webp" alt="" width="1280" height="720" class="absolute inset-0 h-full w-full object-cover [object-position:72%_center]" fetchpriority="low" decoding="async">
        <ClientOnly>
          <video
            v-if="shouldLoadVideo"
            ref="heroVideo"
            class="absolute inset-0 h-full w-full object-cover [object-position:72%_center]"
            src="/video/hero-bg.webm"
            poster="/video/hero-poster.webp"
            muted
            loop
            playsinline
            preload="none"
            tabindex="-1"
          />
        </ClientOnly>
        <div class="hero-scrim" />
      </div>

      <div class="site-container relative">
        <div class="max-w-[46rem] pb-16 pt-14 motion-safe:animate-first-view md:pb-28 md:pt-24">
          <p class="eyebrow">Nova Sugiantara · Full stack web developer</p>
          <h1 id="home-title" class="mt-5 max-w-[16ch] text-display font-[650] leading-[1.02] tracking-[-0.045em]">{{ profile?.headline }}</h1>
          <p class="mt-6 max-w-[56ch] text-lg leading-relaxed text-secondary">{{ profile?.summary }}</p>
          <div class="mt-9 flex flex-wrap items-center gap-3">
            <a v-if="waUrl" class="btn btn-whatsapp" :href="waUrl" target="_blank" rel="noopener noreferrer">
              <Icon name="ph:whatsapp-logo" size="1.25rem" aria-hidden="true" />Chat on WhatsApp<span class="sr-only"> (opens in a new tab)</span>
            </a>
            <NuxtLink v-else class="btn btn-primary" to="/contact">Start a conversation <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" /></NuxtLink>
            <a class="btn btn-secondary" href="#work">See the work <Icon name="ph:arrow-down" size="1.125rem" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>

    <!-- Verifiable facts. Every item links or maps to something a visitor can check. -->
    <section aria-label="At a glance" class="border-b border-line bg-section">
      <div class="site-container">
        <dl class="grid grid-cols-2 gap-px border-x border-line bg-line lg:grid-cols-4">
          <div v-for="fact in facts" :key="fact.label" class="bg-section px-5 py-6 sm:px-8 sm:py-8">
            <dt class="text-sm leading-snug text-faint">{{ fact.label }}</dt>
            <dd class="mt-2 text-xl font-semibold tracking-[-0.025em] text-primary [font-variant-numeric:tabular-nums] sm:text-2xl">{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Work -->
    <section id="work" aria-labelledby="work-title" class="site-container scroll-mt-20 py-16 md:py-24">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="max-w-[44rem]">
          <p class="eyebrow">Work</p>
          <h2 id="work-title" class="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-[2.75rem] md:leading-[1.08]">What I have built, and what I did on it</h2>
          <p class="mt-4 max-w-[60ch] text-lg leading-relaxed text-secondary">One product from my day job, built with a team, and two solo builds from VibeDev challenges. Each has a live link you can open.</p>
        </div>
        <NuxtLink class="link-accent shrink-0" to="/projects">All work <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" /></NuxtLink>
      </div>

      <article v-if="featured" class="group mt-12 grid items-center gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
        <NuxtLink :to="`/projects/${featured.slug}`" class="block" tabindex="-1" aria-hidden="true">
          <WorkShot :src="featured.cover_image_url" :alt="featured.cover_alt" :url="featured.project_url" eager />
        </NuxtLink>
        <div>
          <p class="text-sm font-semibold text-accent">{{ featured.role }}</p>
          <h3 class="mt-2 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
            <NuxtLink :to="`/projects/${featured.slug}`" class="text-primary no-underline hover:text-accent">{{ featured.title }}</NuxtLink>
          </h3>
          <p class="mt-4 leading-7 text-secondary">{{ featured.summary }}</p>
          <ul class="mt-6 grid gap-2.5 border-t border-line pt-6" aria-label="My part">
            <li v-for="item in featured.contributions.slice(0, 3)" :key="item" class="flex gap-3 leading-6">
              <Icon name="ph:check" size="1.125rem" aria-hidden="true" class="mt-0.5 shrink-0 text-accent" />{{ item }}
            </li>
          </ul>
          <p v-if="featured.team_note" class="mt-5 text-sm leading-6 text-faint">{{ featured.team_note }}</p>
          <div class="mt-6 flex flex-wrap gap-x-6 gap-y-1">
            <NuxtLink class="link-accent" :to="`/projects/${featured.slug}`">Read the case study <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" /></NuxtLink>
          </div>
        </div>
      </article>

      <div class="mt-16 grid gap-10 md:grid-cols-2 md:gap-8">
        <article v-for="project in challengeProjects" :key="project.id" class="group flex flex-col">
          <NuxtLink :to="`/projects/${project.slug}`" class="block" tabindex="-1" aria-hidden="true">
            <WorkShot :src="project.cover_image_url" :alt="project.cover_alt" :url="project.project_url" />
          </NuxtLink>
          <div class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-faint">
            <span v-if="project.challenge" class="figure">{{ project.challenge.platform }} · {{ project.challenge.score }}/100 · #{{ project.challenge.rank }} of {{ project.challenge.entrants }}</span>
          </div>
          <h3 class="mt-2 text-xl font-semibold tracking-[-0.025em]">
            <NuxtLink :to="`/projects/${project.slug}`" class="text-primary no-underline hover:text-accent">{{ project.title }}</NuxtLink>
          </h3>
          <p class="mt-2 max-w-[52ch] leading-7 text-secondary">{{ project.summary }}</p>
        </article>
      </div>
    </section>

    <!-- Services -->
    <section aria-labelledby="services-title" class="border-y border-line bg-section">
      <div class="site-container grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <p class="eyebrow">For clients</p>
          <h2 id="services-title" class="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-[2.75rem] md:leading-[1.08]">What I can build for you</h2>
          <p class="mt-4 max-w-[48ch] text-lg leading-relaxed text-secondary">Custom work, written from scratch for your business. No page builders, no theme you have to fight later.</p>
        </div>
        <ol class="grid gap-px overflow-hidden rounded-lg border border-line bg-line" role="list">
          <li v-for="(service, index) in services" :key="service.title" class="grid gap-2 bg-card p-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:p-8">
            <span class="figure text-sm text-faint" aria-hidden="true">0{{ index + 1 }}</span>
            <div>
              <h3 class="text-lg font-semibold tracking-[-0.015em]">{{ service.title }}</h3>
              <p class="mt-1.5 leading-7 text-secondary">{{ service.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Process + AI stance -->
    <section aria-labelledby="process-title" class="site-container py-16 md:py-24">
      <div class="max-w-[44rem]">
        <p class="eyebrow">How a project runs</p>
        <h2 id="process-title" class="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-[2.75rem] md:leading-[1.08]">Four steps, and you see progress every week</h2>
      </div>
      <ol class="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" role="list">
        <li v-for="(step, index) in steps" :key="step.title" class="border-t-2 border-line-strong pt-5">
          <p class="figure text-sm text-accent">Step {{ index + 1 }}</p>
          <h3 class="mt-2 text-lg font-semibold tracking-[-0.015em]">{{ step.title }}</h3>
          <p class="mt-2 leading-7 text-secondary">{{ step.description }}</p>
        </li>
      </ol>

      <aside class="mt-16 grid gap-6 rounded-lg border border-line bg-soft p-6 sm:p-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8" aria-labelledby="ai-title">
        <Icon name="ph:sparkle" size="2rem" aria-hidden="true" class="text-accent" />
        <div>
          <h3 id="ai-title" class="text-lg font-semibold tracking-[-0.015em]">How I use AI</h3>
          <p class="mt-2 max-w-[70ch] leading-7 text-secondary">I use AI coding tools to work faster, and I say so openly. Speed is the easy part. What you are paying for is judgement: I review every change, test it, and hold it to the same standard as the production code I ship at my day job. The VibeDev entries above were built this way and scored by the platform.</p>
        </div>
      </aside>
    </section>

    <!-- Experience, condensed -->
    <section aria-labelledby="experience-title" class="border-t border-line bg-section">
      <div class="site-container grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <p class="eyebrow">Background</p>
          <h2 id="experience-title" class="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-[2.75rem] md:leading-[1.08]">Experience</h2>
          <p class="mt-4 max-w-[48ch] text-lg leading-relaxed text-secondary">Web development since 2021: freelance clients, a blockchain team, and now hotel software.</p>
          <a class="link-accent mt-4" href="/api/cv/generate?variant=default" target="_blank" rel="noopener noreferrer">Download the full CV <Icon name="ph:file-arrow-down" size="1.125rem" aria-hidden="true" /><span class="sr-only"> (PDF, opens in a new tab)</span></a>
        </div>
        <ol class="divide-y divide-line border-y border-line" role="list">
          <li v-for="item in experienceRows" :key="item.key" class="grid gap-1 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
            <div class="min-w-0">
              <h3 class="text-base font-semibold leading-snug">{{ item.role }}</h3>
              <p class="mt-0.5 text-secondary">{{ item.company }}</p>
            </div>
            <p class="figure text-sm text-faint sm:pt-0.5 sm:text-right">{{ item.period }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" aria-labelledby="contact-title" class="border-t border-line" data-wa-cta>
      <div class="site-container grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
        <div>
          <h2 id="contact-title" class="max-w-[18ch] text-3xl font-semibold tracking-[-0.035em] md:text-5xl md:leading-[1.04]">Have a website or web app in mind?</h2>
          <p class="mt-5 max-w-[56ch] text-lg leading-relaxed text-secondary">Send a short description of what you need and when you need it. I will reply with questions or a rough plan.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a v-if="waUrl" class="btn btn-whatsapp" :href="waUrl" target="_blank" rel="noopener noreferrer"><Icon name="ph:whatsapp-logo" size="1.25rem" aria-hidden="true" />Chat on WhatsApp<span class="sr-only"> (opens in a new tab)</span></a>
            <NuxtLink class="btn" :class="waUrl ? 'btn-secondary' : 'btn-primary'" to="/contact">Send a message <Icon name="ph:paper-plane-tilt" size="1.125rem" aria-hidden="true" /></NuxtLink>
          </div>
        </div>
        <dl class="grid gap-5 border-t border-line pt-6 text-sm lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div v-if="profile?.email">
            <dt class="text-faint">Email</dt>
            <dd class="mt-1 break-words text-base font-semibold"><a :href="`mailto:${profile.email}`" class="text-primary underline decoration-line-strong underline-offset-4 hover:text-accent">{{ profile.email }}</a></dd>
          </div>
          <div>
            <dt class="text-faint">Based in</dt>
            <dd class="mt-1 text-base font-semibold">{{ profile?.location }} · UTC+8</dd>
          </div>
          <div>
            <dt class="text-faint">Works with</dt>
            <dd class="mt-1 text-base font-semibold">Clients across Indonesia and abroad, remotely</dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: profile } = useProfile()
const { data: projects } = useProjects()
const { data: experiences } = useExperiences()
const waUrl = useWhatsAppLink()
const toAbsolute = useSiteUrl()

const featured = computed(() => projects.value.find((project) => project.kind === 'work') ?? null)
const challengeProjects = computed(() => projects.value.filter((project) => project.kind === 'challenge').slice(0, 2))

const facts = [
  { label: 'Building for the web since', value: '2021' },
  { label: 'Current role', value: 'Lead developer' },
  { label: 'VibeDev challenge entries', value: '16' },
  { label: 'Location and time zone', value: 'Bali · UTC+8' },
] as const

const services = [
  {
    title: 'Business and company websites',
    description: 'Fast, mobile friendly sites that are set up properly for Google and that you can update without calling me.',
  },
  {
    title: 'Web apps and internal tools',
    description: 'Dashboards, admin panels, customer portals, and workflow tools that replace spreadsheets and manual steps.',
  },
  {
    title: 'Fixing and improving an existing site',
    description: 'Speed and SEO fixes, moving off a slow template or WordPress setup, or picking up a project another developer left unfinished.',
  },
] as const

const steps = [
  { title: 'Talk it through', description: 'A short chat on WhatsApp or a call about what you need, who it is for, and your deadline.' },
  { title: 'Scope and quote', description: 'A written scope with what is included, what is not, the timeline, and the price, before any work starts.' },
  { title: 'Build with previews', description: 'You get a live preview link and an update every week, so feedback happens early instead of at the end.' },
  { title: 'Launch and hand over', description: 'I deploy it, then hand over the code, accounts, and a short guide so you are never locked in.' },
] as const

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
const formatMonth = (value: string | null) => value ? monthYear.format(new Date(value)) : 'Present'

const experienceRows = computed(() => (experiences.value ?? []).map((item) => ({
  key: item.id,
  role: item.role,
  company: item.company,
  period: `${formatMonth(item.start_date)} – ${formatMonth(item.end_date)}`,
})))

usePageSeo({
  title: 'Nova Sugiantara · Full stack web developer for custom websites and web apps',
  description: 'Full stack web developer in Bali building custom websites and web apps for businesses in Indonesia and abroad. Lead developer on a hotel booking engine; live work you can open.',
  path: '/',
  type: 'profile',
  schema: () => [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Nova Sugiantara',
      url: toAbsolute('/'),
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': toAbsolute('/#person'),
      name: 'Nova Sugiantara',
      jobTitle: 'Full stack web developer',
      description: profile.value?.summary,
      url: toAbsolute('/'),
      image: toAbsolute('/og.jpg'),
      email: profile.value?.email ? `mailto:${profile.value.email}` : undefined,
      address: { '@type': 'PostalAddress', addressLocality: 'Batubulan', addressRegion: 'Bali', addressCountry: 'ID' },
      worksFor: { '@type': 'Organization', name: 'PT. Omni Hotelier International' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universitas Pendidikan Ganesha' },
      knowsAbout: ['Web development', 'Laravel', 'Vue.js', 'Nuxt', 'React', 'Ruby on Rails', 'Booking systems', 'Payment integration'],
      sameAs: [
        'https://linkedin.com/in/novasugiantara',
        'https://github.com/NovaSugiantara',
        'https://www.vibedev.id/nop',
      ],
    },
  ],
})

// The hero video is decoration. It only loads on wide screens, after the page is idle,
// and never when the visitor prefers reduced motion, so it cannot delay the first paint.
const heroVideo = ref<HTMLVideoElement | null>(null)
const shouldLoadVideo = ref(false)

onMounted(() => {
  const isWide = window.matchMedia('(min-width: 1024px)').matches
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  if (!isWide || reduceMotion || saveData) return

  const start = () => {
    shouldLoadVideo.value = true
    nextTick(() => heroVideo.value?.play().catch(() => undefined))
  }
  const scheduleAfterLoad = () => setTimeout(() => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 3000 })
    else start()
  }, 2000)
  if (document.readyState === 'complete') scheduleAfterLoad()
  else window.addEventListener('load', scheduleAfterLoad, { once: true })
})
</script>
