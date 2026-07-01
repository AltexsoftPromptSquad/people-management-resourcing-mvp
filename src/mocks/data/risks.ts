import { faker } from '@faker-js/faker'
import { createRisk } from '../factories/risk-factory'
import { people } from './people'
import type { Risk } from '@/types/risk'

faker.seed(20260625)

const platformPeople = people.filter(
  (person) => person.unitId === 'unit-platform' && person.id !== 'person-um-001',
)

export const risks: Risk[] = platformPeople.slice(0, 20).map((person, index) =>
  createRisk({
    index: index + 1,
    personId: person.id,
    ownerId: 'person-um-001',
    status: index < 14 ? 'Open' : 'Monitoring',
  }),
)
