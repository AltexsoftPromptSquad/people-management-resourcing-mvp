import { faker } from '@faker-js/faker'
import { createRisk } from '../factories/risk-factory'
import { people } from './people'
import type { Risk } from '@/types/risk'

faker.seed(20260625)

const baselineRisks: Risk[] = [
  {
    id: 'risk-001',
    personId: 'person-employee-001',
    managerId: 'person-um-001',
    title: 'Critical skill concentration in one team member',
    level: 'High',
    isActive: true,
  },
  {
    id: 'risk-002',
    personId: 'person-generated-003',
    managerId: 'person-um-001',
    title: 'Upcoming leave overlaps with release window',
    level: 'Medium',
    isActive: true,
  },
]

const generatedRisks: Risk[] = people
  .filter((person) => person.managerId)
  .slice(0, 240)
  .map((person, index) =>
    createRisk({
      index: index + 1,
      personId: person.id,
      managerId: person.managerId ?? 'person-um-001',
    }),
  )

export const risks: Risk[] = [...baselineRisks, ...generatedRisks]
