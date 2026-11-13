<template>
  <div class="field">
    <label :for="id" class="field-label">{{ label }}<span v-if="optional" class="font-normal text-faint"> (optional)</span></label>
    <slot :id="id" :described-by="describedBy" :invalid="Boolean(error)" />
    <p v-if="hint" :id="`${id}-hint`" class="field-hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string, hint?: string, error?: string, optional?: boolean }>()
const id = useId()
const describedBy = computed(() => [props.hint && `${id}-hint`, props.error && `${id}-error`].filter(Boolean).join(' ') || undefined)
</script>
