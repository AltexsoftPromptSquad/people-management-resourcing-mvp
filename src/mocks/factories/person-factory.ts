import { faker } from '@faker-js/faker'
import type { CurrentProjectStatus, EmploymentStatus, Person, RiskLevel } from '@/types/person'

const positions = [
  'Software Engineer',
  'Senior Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'QA Engineer',
  'DevOps Engineer',
] as const

const grades = ['J2', 'M1', 'M2', 'S1', 'S2', 'L1'] as const

const employmentStatuses: EmploymentStatus[] = ['Active', 'On Leave', 'Notice Period', 'Inactive']

const currentProjectStatuses: CurrentProjectStatus[] = [
  'Allocated',
  'Partially Allocated',
  'Bench',
  'Booked',
  'Unavailable',
]

const riskLevels: RiskLevel[] = ['None', 'Low', 'Medium', 'High', 'Critical']

type CreatePersonParams = {
  index: number
  unitId: string
  managerId: string
}

export const createPerson = ({ index, unitId, managerId }: CreatePersonParams): Person => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: `person-generated-${String(index).padStart(3, '0')}`,
    firstName,
    lastName,
    workEmail: faker.internet.email({ firstName, lastName, provider: 'pmr.example' }).toLowerCase(),
    position: faker.helpers.arrayElement(positions),
    grade: faker.helpers.arrayElement(grades),
    unitId,
    managerId,
    employmentStatus: faker.helpers.arrayElement(employmentStatuses),
    currentProjectStatus: faker.helpers.arrayElement(currentProjectStatuses),
    availabilityPercent: faker.number.int({ min: 0, max: 100 }),
    riskLevel: faker.helpers.arrayElement(riskLevels),
  }
}
