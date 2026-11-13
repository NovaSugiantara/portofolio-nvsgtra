<template>
  <div>
    <header class="border-b border-line">
      <div class="site-container py-14 md:py-20">
        <p class="eyebrow">Portfolio</p>
        <h1 class="mt-3 max-w-[18ch] text-4xl font-semibold tracking-[-0.04em] md:text-6xl md:leading-[1.02]">Work you can open and check</h1>
        <p class="mt-5 max-w-[60ch] text-lg leading-relaxed text-secondary">Each project says who built it and what my part was. The featured work and challenge builds all have a live link.</p>
      </div>
    </header>

    <div class="site-container py-14 md:py-20">
      <div v-if="error" class="max-w-2xl rounded-lg border border-line bg-soft p-6 sm:p-8" role="alert">
        <h2 class="text-xl font-semibold">Projects could not be loaded</h2>
        <p class="mt-2 leading-relaxed text-secondary">Try again in a moment.</p>
        <button type="button" class="btn btn-primary mt-5" @click="refresh()"><Icon name="ph:arrow-clockwise" size="1.125rem" aria-hidden="true" />Try again</button>
      </div>

      <template v-else>
        <section v-if="workProjects.length" aria-labelledby="work-heading">
          <h2 id="work-heading" class="text-sm font-semibold uppercase tracking-[0.08em] text-faint">Client and product work</h2>
          <article v-for="project in workProjects" :key="project.id" class="group mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
            <NuxtLink :to="`/projects/${project.slug}`" class="block" tabindex="-1" aria-hidden="true">
              <WorkShot :src="project.cover_image_url" :alt="project.cover_alt" :url="project.project_url" eager />
            </NuxtLink>
            <div>
              <p class="text-sm font-semibold text-accent">{{ project.role }}</p>
              <h3 class="mt-2 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                <NuxtLink :to="`/projects/${project.slug}`" class="text-primary no-underline hover:text-accent">{{ project.title }}</NuxtLink>
              </h3>
              <p class="mt-4 leading-7 text-secondary">{{ project.summary }}</p>
              <TechList :items="project.tech_stack" class="mt-5" />
              <NuxtLink class="link-accent mt-5" :to="`/projects/${project.slug}`">Read the case study<span class="sr-only">: {{ project.title }}</span> <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" /></NuxtLink>
            </div>
          </article>
        </section>

        <section v-if="challengeProjects.length" aria-labelledby="challenge-heading" class="mt-20 md:mt-28">
          <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="challenge-heading" class="text-sm font-semibold uppercase tracking-[0.08em] text-faint">Challenge builds</h2>
              <p class="mt-3 max-w-[62ch] leading-7 text-secondary">Solo entries for VibeDev challenges. Everyone gets the same brief and each entry is scored out of 100. Built with AI coding tools, reviewed and finished by me.</p>
            </div>
            <a class="link-accent shrink-0" href="https://www.vibedev.id/nop" target="_blank" rel="noopener noreferrer">All 16 entries on VibeDev <Icon name="ph:arrow-up-right" size="1.125rem" aria-hidden="true" /><span class="sr-only"> (opens in a new tab)</span></a>
          </div>
          <div class="mt-8 grid gap-10 md:grid-cols-2 md:gap-8">
            <article v-for="project in challengeProjects" :key="project.id" class="group flex flex-col">
              <NuxtLink :to="`/projects/${project.slug}`" class="block" tabindex="-1" aria-hidden="true">
                <WorkShot :src="project.cover_image_url" :alt="project.cover_alt" :url="project.project_url" />
              </NuxtLink>
              <p v-if="project.challenge" class="figure mt-5 text-sm text-faint">Score {{ project.challenge.score }}/100 · #{{ project.challenge.rank }} of {{ project.challenge.entrants }} entrants</p>
              <h3 class="mt-2 text-xl font-semibold tracking-[-0.025em]">
                <NuxtLink :to="`/projects/${project.slug}`" class="text-primary no-underline hover:text-accent">{{ project.title }}</NuxtLink>
              </h3>
              <p class="mt-2 max-w-[52ch] leading-7 text-secondary">{{ project.summary }}</p>
            </article>
          </div>
        </section>

        <section v-if="earlier.length" aria-labelledby="earlier-heading" class="mt-20 border-t border-line pt-12 md:mt-28">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div>
              <h2 id="earlier-heading" class="text-2xl font-semibold tracking-[-0.03em]">Earlier projects</h2>
              <p class="mt-3 max-w-[44ch] leading-7 text-secondary">Freelance and employer projects from 2021 to 2023. They are no longer online or not public, so they are listed for context only.</p>
            </div>
            <ul class="divide-y divide-line border-y border-line" role="list">
              <li v-for="item in earlier" :key="item.id" class="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
                <div class="min-w-0">
                  <h3 class="font-semibold">{{ item.title }}</h3>
                  <p class="mt-0.5 text-sm leading-6 text-secondary">{{ item.context }}</p>
                </div>
                <p class="text-sm text-faint sm:text-right">{{ item.period }}<span class="block font-mono text-xs">{{ item.tech_stack.join(' · ') }}</span></p>
              </li>
            </ul>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: projects, error, refresh } = useProjects()
const { data: earlier } = useEarlierWork()
const toAbsolute = useSiteUrl()

const workProjects = computed(() => projects.value.filter((project) => project.kind === 'work'))
const challengeProjects = computed(() => projects.value.filter((project) => project.kind === 'challenge'))

usePageSeo({
  title: 'Portfolio · Nova Sugiantara',
  description: 'Live work by Nova Sugiantara: a hotel booking engine built with a team, and solo web app builds from VibeDev challenges, each with what I did on it.',
  path: '/projects',
  // Shared JPEG card: some social platforms do not render WebP previews.
  schema: () => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Portfolio · Nova Sugiantara',
    url: toAbsolute('/projects'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.value.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.title,
        url: toAbsolute(`/projects/${project.slug}`),
      })),
    },
  }),
})
</script>
