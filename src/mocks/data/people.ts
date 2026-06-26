import { faker } from '@faker-js/faker'
import { createPerson } from '../factories/person-factory'
import type { Person } from '@/types/person'

faker.seed(20260625)

const personaPeople: Person[] = [
  {
    id: 'person-um-001',
    firstName: 'Olena',
    lastName: 'Kovalenko',
    workEmail: 'olena.kovalenko@pmr.example',
    position: 'Unit Manager',
    grade: 'L2',
    unitId: 'unit-platform',
    employmentStatus: 'Active',
    currentProjectStatus: 'Allocated',
    availabilityPercent: 20,
    riskLevel: 'Low',
  },
  {
    id: 'person-dm-001',
    firstName: 'Marcus',
    lastName: 'Reed',
    workEmail: 'marcus.reed@pmr.example',
    position: 'Delivery Manager',
    grade: 'L1',
    unitId: 'unit-product',
    employmentStatus: 'Active',
    currentProjectStatus: 'Allocated',
    availabilityPercent: 15,
    riskLevel: 'None',
  },
  {
    id: 'person-employee-001',
    firstName: 'Nazar',
    lastName: 'Petrenko',
    workEmail: 'nazar.petrenko@pmr.example',
    position: 'Software Engineer',
    grade: 'M2',
    unitId: 'unit-platform',
    managerId: 'person-um-001',
    employmentStatus: 'Active',
    currentProjectStatus: 'Partially Allocated',
    availabilityPercent: 40,
    riskLevel: 'Medium',
  },
]

const unitAssignments = [
  { unitId: 'unit-platform', managerId: 'person-um-001' },
  { unitId: 'unit-product', managerId: 'person-manager-002' },
  { unitId: 'unit-data', managerId: 'person-manager-003' },
]

const generatedPeople = Array.from({ length: 537 }, (_, index) => {
  const assignment = unitAssignments[index % unitAssignments.length]

  return createPerson({
    index: index + 1,
    unitId: assignment.unitId,
    managerId: assignment.managerId,
  })
})

export const people: Person[] = [...personaPeople, ...generatedPeople]
