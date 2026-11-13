/**
 * wa.me link built from runtime config. Empty string when no number is configured,
 * so callers can hide WhatsApp actions instead of rendering a dead link.
 */
export const useWhatsAppLink = (message?: string) => {
  const { public: { whatsappNumber, whatsappGreeting } } = useRuntimeConfig()

  return computed(() => {
    const digits = String(whatsappNumber || '').replace(/\D/g, '')
    if (!digits) return ''
    const text = message || whatsappGreeting || ''
    return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`
  })
}
