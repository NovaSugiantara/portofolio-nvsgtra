/**
 * Detects the real file type from its first bytes, so a renamed file cannot pass as media.
 * Only the formats the bucket accepts are recognised; anything else returns null.
 */
export const sniffMedia = (bytes: Uint8Array): string | null => {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end))
  if (bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp'
  if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return 'video/webm'
  if (bytes.length >= 12 && ascii(4, 8) === 'ftyp') {
    const brand = ascii(8, 12)
    if (['isom', 'iso2', 'mp41', 'mp42', 'avc1', 'M4V '].includes(brand)) return 'video/mp4'
  }
  return null
}
