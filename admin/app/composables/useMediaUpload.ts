import { MEDIA_BUCKET, MEDIA_RULES, type MediaKind } from '#shared/media'

const MAX_IMAGE_EDGE = 2000

/**
 * Re-encodes an image to WebP in the browser. This strips EXIF data (camera, GPS) and
 * caps the size before anything leaves the device.
 */
const toWebp = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('This file could not be read as an image.')
  })
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.86))
  if (!blob || blob.type !== 'image/webp') throw new Error('This browser could not convert the image to WebP.')
  return blob
}

const errorMessage = (error: unknown) => {
  const data = (error as { data?: { statusMessage?: string } })?.data
  return data?.statusMessage || (error instanceof Error ? error.message : 'Upload failed')
}

/** Upload flow: server picks the path → browser uploads → server checks the bytes. */
export const useMediaUpload = () => {
  const supabase = useSupabase()
  const { authHeaders } = useOwnerSession()

  const upload = async (file: File, kind: MediaKind, site: 'portfolio' | 'forgebyte' = 'portfolio'): Promise<string> => {
    try {
      const body = kind === 'image' ? await toWebp(file) : file
      const contentType = kind === 'image' ? 'image/webp' : file.type
      if (!(contentType in MEDIA_RULES[kind].types)) throw new Error('Use a WebM or MP4 video.')
      if (body.size > MEDIA_RULES[kind].maxBytes) {
        throw new Error(`The file is ${(body.size / 1024 / 1024).toFixed(1)} MB; the limit is ${MEDIA_RULES[kind].maxBytes / 1024 / 1024} MB.`)
      }

      const headers = await authHeaders()
      const target = await $fetch<{ path: string, token: string }>('/api/media/upload-url', {
        method: 'POST', headers, body: { site, kind, contentType, size: body.size },
      })
      const { error } = await supabase.storage.from(MEDIA_BUCKET)
        .uploadToSignedUrl(target.path, target.token, body, { contentType, cacheControl: '31536000' })
      if (error) throw new Error(error.message)

      const { url } = await $fetch<{ url: string }>('/api/media/verify', {
        method: 'POST', headers, body: { path: target.path },
      })
      return url
    } catch (error) {
      throw new Error(errorMessage(error))
    }
  }

  return { upload }
}
