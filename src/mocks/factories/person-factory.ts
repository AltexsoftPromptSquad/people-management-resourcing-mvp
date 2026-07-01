import { faker } from '@faker-js/faker'
import type {
  CurrentProjectStatus,
  EmergencyContact,
  EmploymentStatus,
  EmploymentType,
  EnglishLevel,
  Person,
  PersonAddress,
  RiskLevel,
} from '@/types/person'

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
const employmentTypes: EmploymentType[] = ['FTE', 'Subcontractor']
const englishLevels: EnglishLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const currentProjectStatuses: CurrentProjectStatus[] = [
  'Allocated',
  'Partially Allocated',
  'Bench',
  'Booked',
  'Unavailable',
]

const riskLevels: RiskLevel[] = ['None', 'Low', 'Medium', 'High', 'Critical']
const workLocations = ['Remote', 'Kyiv', 'Lviv', 'Warsaw', 'Tallinn'] as const

type CreatePersonParams = {
  index: number
  unitId: string
  managerId: string
}

export const createPerson = ({ index, unitId, managerId }: CreatePersonParams): Person => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const address: PersonAddress = {
    addressLine: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
  }
  const emergencyContact: EmergencyContact = {
    name: faker.person.fullName(),
    phone: faker.phone.number(),
  }

  return {
    id: `person-generated-${String(index).padStart(3, '0')}`,
    firstName,
    lastName,
    workEmail: faker.internet.email({ firstName, lastName, provider: 'pmr.example' }).toLowerCase(),
    personalEmail: faker.internet
      .email({ firstName, lastName, provider: 'mail.example' })
      .toLowerCase(),
    workPhone: faker.phone.number(),
    personalPhone: faker.phone.number(),
    dateOfBirth: faker.date
      .birthdate({ min: 1980, max: 2002, mode: 'year' })
      .toISOString()
      .slice(0, 10),
    address,
    emergencyContact,
    position: faker.helpers.arrayElement(positions),
    grade: faker.helpers.arrayElement(grades),
    unitId,
    managerId,
    employmentType: faker.helpers.arrayElement(employmentTypes),
    employmentStatus: faker.helpers.arrayElement(employmentStatuses),
    englishLevel: faker.helpers.arrayElement(englishLevels),
    hireDate: faker.date.past({ years: 12 }).toISOString().slice(0, 10),
    workLocation: faker.helpers.arrayElement(workLocations),
    currentProjectStatus: faker.helpers.arrayElement(currentProjectStatuses),
    availabilityPercent: faker.number.int({ min: 0, max: 100 }),
    riskLevel: faker.helpers.arrayElement(riskLevels),
    customFieldValues: {
      benchReadiness: faker.datatype.boolean(),
      lastConversationDate: faker.date.recent({ days: 120 }).toISOString().slice(0, 10),
    },
  }
}
