import { education } from '../data/portfolio'

export default defineEventHandler(async () => {
  return [...education].sort((a, b) => a.sort_order - b.sort_order)
})
