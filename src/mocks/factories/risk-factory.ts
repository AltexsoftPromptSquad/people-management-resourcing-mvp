import { faker } from '@faker-js/faker'
import type { Risk } from '@/types/risk'

type CreateRiskParams = {
  index: number
  personId: string
  managerId: string
}

export const createRisk = ({ index, personId, managerId }: CreateRiskParams): Risk => {
  return {
    id: `risk-generated-${String(index).padStart(4, '0')}`,
    personId,
    managerId,
    title: faker.helpers.arrayElement([
      'Potential delivery slippage due to overlapping commitments',
      'Insufficient backup coverage for key project role',
      'Upcoming leave may affect milestone timeline',
      'Escalating quality issues in current project stream',
      'Skill mismatch risk for incoming delivery request',
    ]),
    level: faker.helpers.arrayElement(['None', 'Low', 'Medium', 'High', 'Critical']),
    isActive: faker.datatype.boolean({ probability: 0.65 }),
  }
}
