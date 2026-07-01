import { faker } from '@faker-js/faker'
import type { Risk, RiskStatus } from '@/types/risk'
import type { RiskLevel } from '@/types/person'

const categories = ['Retention', 'Performance', 'Engagement', 'Delivery', 'Skills Gap'] as const
const riskLevels: RiskLevel[] = ['None', 'Low', 'Medium', 'High', 'Critical']
const statuses: RiskStatus[] = ['Open', 'Monitoring', 'Mitigated', 'Closed']

type CreateRiskParams = {
  index: number
  personId: string
  ownerId: string
  status?: RiskStatus
}

export const createRisk = ({ index, personId, ownerId, status }: CreateRiskParams): Risk => ({
  id: `risk-${String(index).padStart(3, '0')}`,
  personId,
  level: faker.helpers.arrayElement(riskLevels.filter((level) => level !== 'None')),
  category: faker.helpers.arrayElement(categories),
  description: faker.lorem.sentence(),
  ownerId,
  dueDate: faker.date.soon({ days: 30 }).toISOString(),
  status: status ?? faker.helpers.arrayElement(statuses),
  createdAt: faker.date.recent({ days: 60 }).toISOString(),
  updatedAt: faker.date.recent({ days: 14 }).toISOString(),
})
