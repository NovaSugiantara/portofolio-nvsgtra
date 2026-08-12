import { projects } from '../data/portfolio'

export default defineEventHandler(async () => {
  return [...projects].sort((a, b) => a.sort_order - b.sort_order)
})
