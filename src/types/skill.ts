export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export type Skill = {
  id: string
  personId: string
  name: string
  category: string
  level: SkillLevel
  yearsExperience: number
}
