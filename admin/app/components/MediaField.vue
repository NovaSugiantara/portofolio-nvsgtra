<template>
  <div class="field">
    <span :id="`${id}-label`" class="field-label">{{ label }}</span>
    <div class="flex flex-wrap items-start gap-4">
      <div
        class="grid shrink-0 place-items-center overflow-hidden border border-line bg-section"
        :class="[round ? 'size-24 rounded-full' : 'aspect-[16/10] w-48 rounded-md']"
      >
        <video v-if="modelValue && kind === 'video'" :src="resolved" muted playsinline class="h-full w-full object-cover" />
        <img v-else-if="modelValue" :src="resolved" alt="" class="h-full w-full object-cover">
        <Icon v-else :name="kind === 'video' ? 'ph:film-strip' : 'ph:image'" size="1.5rem" class="text-faint" aria-hidden="true" />
      </div>
      <div class="grid gap-2">
        <div class="flex flex-wrap gap-2">
          <label class="btn btn-secondary btn-sm" :class="{ 'pointer-events-none opacity-55': busy }">
            <Icon name="ph:upload-simple" size="1rem" aria-hidden="true" />
            {{ busy ? 'Uploading…' : modelValue ? 'Replace' : 'Upload' }}
            <input
              class="sr-only"
              type="file"
              :accept="kind === 'video' ? 'video/webm,video/mp4' : 'image/png,image/jpeg,image/webp,image/avif'"
              :disabled="busy"
              :aria-labelledby="`${id}-label`"
              :aria-describedby="`${id}-hint`"
              @change="onFile"
            >
          </label>
          <button v-if="modelValue && clearable" type="button" class="btn btn-secondary btn-sm" :disabled="busy" @click="emit('update:modelValue', null)">
            Remove
          </button>
        </div>
        <p :id="`${id}-hint`" class="field-hint max-w-[42ch]">{{ hint }}</p>
        <p v-if="error" class="field-error" role="alert">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MediaKind } from '#shared/media'

const props = withDefaults(defineProps<{
  modelValue: string | null
  label: string
  kind?: MediaKind
  round?: boolean
  clearable?: boolean
}>(), { kind: 'image', round: false, clearable: true })

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const id = useId()
const busy = ref(false)
const error = ref('')
const { upload } = useMediaUpload()
const { portfolioUrl } = useRuntimeConfig().public

// Seeded rows point at files in the portfolio's own /public folder.
const resolved = computed(() => props.modelValue?.startsWith('/') ? `${portfolioUrl}${props.modelValue}` : props.modelValue ?? '')
const hint = computed(() => props.kind === 'video'
  ? 'WebM or MP4, up to 8 MB. Short, silent loops work best.'
  : 'PNG, JPEG, WebP or AVIF. Converted to WebP and stripped of camera data before upload; up to 3 MB after conversion.')

const onFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  busy.value = true
  error.value = ''
  try {
    emit('update:modelValue', await upload(file, props.kind))
  } catch (uploadError) {
    error.value = uploadError instanceof Error ? uploadError.message : 'Upload failed'
  } finally {
    busy.value = false
  }
}
</script>
