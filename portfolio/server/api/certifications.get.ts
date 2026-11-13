import { certifications } from '../data/portfolio'

export default defineEventHandler(async () => {
  return [...certifications].sort((a, b) => a.sort_order - b.sort_order)
})
