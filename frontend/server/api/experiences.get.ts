import { experiences } from '../data/portfolio'

export default defineEventHandler(async () => {
  return [...experiences].sort((a, b) => a.sort_order - b.sort_order)
})
