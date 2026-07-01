import type { RiskLevel } from './person'

export type RiskStatus = 'Open' | 'Monitoring' | 'Mitigated' | 'Closed'

export type Risk = {
  id: string
  personId: string
  level: RiskLevel
  category: string
  description: string
  ownerId: string
  dueDate: string
  status: RiskStatus
  createdAt: string
  updatedAt: string
}
