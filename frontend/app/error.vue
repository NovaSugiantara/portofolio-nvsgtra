<template>
  <NuxtLayout>
    <section class="site-container py-20 md:py-32" aria-labelledby="error-title">
      <p class="eyebrow">Error {{ statusCode }}</p>
      <h1 id="error-title" class="mt-4 max-w-[18ch] text-4xl font-semibold tracking-[-0.04em] md:text-6xl md:leading-[1.02]">
        {{ isNotFound ? 'This page does not exist.' : 'Something went wrong on my side.' }}
      </h1>
      <p class="mt-5 max-w-[56ch] text-lg leading-relaxed text-secondary">
        {{ isNotFound
          ? 'The link may be old or mistyped. The work and writing are still here.'
          : 'Please try again in a moment. If it keeps happening, message me and I will look into it.' }}
      </p>
      <div class="mt-9 flex flex-wrap gap-3">
        <button type="button" class="btn btn-primary" @click="goHome">Go to the homepage</button>
        <button type="button" class="btn btn-secondary" @click="goTo('/projects')">See the work</button>
        <a v-if="waUrl" class="btn btn-secondary" :href="waUrl" target="_blank" rel="noopener noreferrer">
          <Icon name="ph:whatsapp-logo" size="1.125rem" aria-hidden="true" />Chat on WhatsApp<span class="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const waUrl = useWhatsAppLink()

const statusCode = computed(() => props.error?.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)

const goTo = (path: string) => clearError({ redirect: path })
const goHome = () => goTo('/')

useHead({
  title: () => isNotFound.value ? 'Page not found · Nova Sugiantara' : 'Something went wrong · Nova Sugiantara',
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
