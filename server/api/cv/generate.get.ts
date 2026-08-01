import type { H3Event } from 'h3'
import { setHeader } from 'h3'
import { generateCvPdf, parseCvVariantQuery } from '../../utils/cvPdfRoute'

// GET /api/cv/generate?variant=<id OR 'default'>
export default defineEventHandler(async (event: H3Event) => {
  const variantId = parseCvVariantQuery(event)
  const pdfBytes = await generateCvPdf(event, variantId)

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="CV-NovaSugiantara.pdf"`)
  setHeader(event, 'Cache-Control', 'private, no-store')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  return pdfBytes
})
