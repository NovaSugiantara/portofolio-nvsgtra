<template>
  <div class="container mx-auto px-4 max-w-4xl py-12">
    <h1 class="text-3xl font-bold mb-4">Contact</h1>
    <p class="text-gray-600 mb-8">
      Have a question or want to collaborate? Reach out below or through any of the channels listed.
    </p>

    <!-- Contact Form (full implementation in Fase 4 — shell here) -->
    <div class="rounded-xl border p-6 mb-12 max-w-lg">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium mb-1">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Your name"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium mb-1">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="4"
            required
            class="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Your message..."
          />
        </div>
        <!-- Honeypot (invisible to humans) -->
        <input type="text" name="hp" class="hidden" autocomplete="off" tabindex="-1" />
        <button
          type="submit"
          :disabled="submitting"
          class="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {{ submitting ? 'Sending...' : 'Send Message' }}
        </button>
        <p v-if="sent" class="text-sm text-green-600">Message sent! Nova will get back to you soon.</p>
      </form>
    </div>

    <!-- Direct Contact Info -->
    <div v-if="profile" class="space-y-2 text-sm text-gray-600">
      <p v-if="profile.email">
        <span class="font-medium">Email:</span>
        <a :href="`mailto:${profile.email}`" class="ml-1 underline">{{ profile.email }}</a>
      </p>
      <p v-if="profile.linkedin_url">
        <span class="font-medium">LinkedIn:</span>
        <a :href="profile.linkedin_url" target="_blank" rel="noopener" class="ml-1 underline">linkedin.com/in/novasugiantara</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: profile } = useProfile()

const form = ref({ name: '', email: '', message: '' })
const submitting = ref(false)
const sent = ref(false)

const submitForm = async () => {
  submitting.value = true
  // ponytail: contact submission API in Fase 4 — client-side placeholder for now
  await new Promise((r) => setTimeout(r, 600))
  sent.value = true
  submitting.value = false
  form.value = { name: '', email: '', message: '' }
}

useSeoMeta({
  title: 'Contact — Nova Sugiantara',
  description: 'Get in touch with Nova Sugiantara for freelance projects and collaborations.',
})
</script>
