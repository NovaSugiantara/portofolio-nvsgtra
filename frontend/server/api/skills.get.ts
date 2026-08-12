import { skills, type SeedSkill } from '../data/portfolio'

export default defineEventHandler(async () => {
  const grouped: Record<string, SeedSkill[]> = {}
  for (const skill of [...skills].sort((a, b) => a.sort_order - b.sort_order)) {
    grouped[skill.category] ??= []
    grouped[skill.category].push(skill)
  }
  return grouped
})
