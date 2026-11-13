/** Media rules shared by the browser (pre-checks) and the server (enforcement). */
export const MEDIA_BUCKET = 'media'

export const MEDIA_RULES = {
  image: { maxBytes: 3 * 1024 * 1024, types: { 'image/webp': 'webp' } },
  video: { maxBytes: 8 * 1024 * 1024, types: { 'video/webm': 'webm', 'video/mp4': 'mp4' } },
} as const

export type MediaKind = keyof typeof MEDIA_RULES
