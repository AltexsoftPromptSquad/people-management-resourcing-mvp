import type { RiskLevel } from './person'

export type Risk = {
  id: string
  personId: string
  managerId: string
  title: string
  level: RiskLevel
  isActive: boolean
}
