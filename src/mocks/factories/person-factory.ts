import { faker } from '@faker-js/faker'
import type { CurrentProjectStatus, EnglishLevel, GradeLevel, Person, RiskLevel } from '@/types'

const grades: GradeLevel[] = ['Junior', 'Middle', 'Senior', 'Lead', 'Principal']
const englishLevels: EnglishLevel[] = ['B1', 'B2', 'C1', 'C2']
const projectStatuses: CurrentProjectStatus[] = [
  'Allocated',
  'Partially Allocated',
  'Bench',
  'Booked',
  'Unavailable',
]
const riskLevels: RiskLevel[] = ['None', 'Low', 'Medium', 'High']
const positions = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'QA Engineer',
  'DevOps Engineer',
  'Data Engineer',
]

type CreatePersonOptions = {
  id: string
  unitId: string
  managerId?: string
  firstName?: string
  lastName?: string
  position?: string
}

export const createPerson = ({
  id,
  unitId,
  managerId,
  firstName = faker.person.firstName(),
  lastName = faker.person.lastName(),
  position = faker.helpers.arrayElement(positions),
}: CreatePersonOptions): Person => {
  const emailName = `${firstName}.${lastName}`.toLowerCase()

  return {
    id,
    firstName,
    lastName,
    workEmail: `${emailName}@pmr.example`,
    personalEmail: `${emailName}@example.com`,
    workPhone: faker.phone.number(),
    personalPhone: faker.phone.number(),
    position,
    grade: faker.helpers.arrayElement(grades),
    unitId,
    managerId,
    employmentType: faker.helpers.arrayElement(['FTE', 'Subcontractor']),
    employmentStatus: faker.helpers.arrayElement(['Active', 'Active', 'Active', 'On Leave']),
    hireDate: faker.date.past({ years: 8 }).toISOString().slice(0, 10),
    workLocation: faker.helpers.arrayElement(['Kyiv', 'Lviv', 'Warsaw', 'Remote']),
    englishLevel: faker.helpers.arrayElement(englishLevels),
    currentProjectStatus: faker.helpers.arrayElement(projectStatuses),
    availabilityPercent: faker.number.int({ min: 0, max: 100 }),
    riskLevel: faker.helpers.arrayElement(riskLevels),
  }
}
