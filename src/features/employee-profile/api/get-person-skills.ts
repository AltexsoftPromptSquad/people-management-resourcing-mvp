import { apiGet } from '@/lib/api/api-client'
import type { Skill } from '@/types/skill'

export const getPersonSkills = (personId: string) =>
  apiGet<Skill[]>('/api/skills').then((skills) =>
    skills.filter((skill) => skill.personId === personId),
  )
