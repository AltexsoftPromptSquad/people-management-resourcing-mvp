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
    personalEmail: 'olena.kovalenko@mail.example',
    workPhone: '+380440000001',
    personalPhone: '+380670000001',
    dateOfBirth: '1987-03-12',
    address: {
      addressLine: '12 Khreshchatyk St',
      city: 'Kyiv',
      country: 'Ukraine',
    },
    emergencyContact: {
      name: 'Andriy Kovalenko',
      phone: '+380670000101',
    },
    position: 'Unit Manager',
    grade: 'L2',
    unitId: 'unit-platform',
    employmentType: 'FTE',
    employmentStatus: 'Active',
    englishLevel: 'C1',
    hireDate: '2016-04-01',
    workLocation: 'Kyiv',
    currentProjectStatus: 'Allocated',
    availabilityPercent: 20,
    riskLevel: 'Low',
    customFieldValues: {
      'field-bench-status-001': 'On Hold',
      'field-bench-readiness-002': false,
      'field-last-conversation-003': '2026-06-20',
      'field-booking-notes-004': 'Tracks platform staffing for Q3',
    },
  },
  {
    id: 'person-um-002',
    firstName: 'Ihor',
    lastName: 'Melnyk',
    workEmail: 'ihor.melnyk@pmr.example',
    personalEmail: 'ihor.melnyk@mail.example',
    workPhone: '+380440000002',
    personalPhone: '+380670000002',
    dateOfBirth: '1989-09-03',
    address: {
      addressLine: '5 Volodymyrska St',
      city: 'Kyiv',
      country: 'Ukraine',
    },
    emergencyContact: {
      name: 'Tetiana Melnyk',
      phone: '+380670000102',
    },
    position: 'Unit Manager',
    grade: 'L2',
    unitId: 'unit-product',
    employmentType: 'FTE',
    employmentStatus: 'Active',
    englishLevel: 'C1',
    hireDate: '2018-01-10',
    workLocation: 'Kyiv',
    currentProjectStatus: 'Allocated',
    availabilityPercent: 10,
    riskLevel: 'Low',
    customFieldValues: {
      'field-bench-status-001': 'Interviewing',
      'field-bench-readiness-002': false,
      'field-last-conversation-003': '2026-06-18',
      'field-booking-notes-004': 'Coordinates product unit staffing pipeline',
    },
  },
  {
    id: 'person-dm-001',
    firstName: 'Marcus',
    lastName: 'Reed',
    workEmail: 'marcus.reed@pmr.example',
    personalEmail: 'marcus.reed@mail.example',
    workPhone: '+447700000001',
    personalPhone: '+447700000101',
    dateOfBirth: '1985-11-24',
    address: {
      addressLine: '24 Baker St',
      city: 'London',
      country: 'United Kingdom',
    },
    emergencyContact: {
      name: 'Emma Reed',
      phone: '+447700000201',
    },
    position: 'Delivery Manager',
    grade: 'L1',
    unitId: 'unit-product',
    employmentType: 'FTE',
    employmentStatus: 'Active',
    englishLevel: 'C2',
    hireDate: '2017-09-01',
    workLocation: 'Remote',
    currentProjectStatus: 'Allocated',
    availabilityPercent: 15,
    riskLevel: 'None',
    customFieldValues: {
      'field-bench-status-001': 'On Hold',
      'field-bench-readiness-002': false,
      'field-last-conversation-003': '2026-06-14',
      'field-booking-notes-004': 'Delivery approvals and pipeline alignment',
    },
  },
  {
    id: 'person-employee-001',
    firstName: 'Nazar',
    lastName: 'Petrenko',
    workEmail: 'nazar.petrenko@pmr.example',
    personalEmail: 'nazar.petrenko@mail.example',
    workPhone: '+380440000401',
    personalPhone: '+380670000401',
    dateOfBirth: '1996-08-15',
    address: {
      addressLine: '88 Shevchenko Ave',
      city: 'Lviv',
      country: 'Ukraine',
    },
    emergencyContact: {
      name: 'Yuliia Petrenko',
      phone: '+380670000402',
    },
    position: 'Software Engineer',
    grade: 'M2',
    unitId: 'unit-platform',
    managerId: 'person-um-001',
    employmentType: 'FTE',
    employmentStatus: 'Active',
    englishLevel: 'B2',
    hireDate: '2022-02-14',
    workLocation: 'Lviv',
    currentProjectStatus: 'Bench',
    availabilityPercent: 40,
    riskLevel: 'High',
    customFieldValues: {
      'field-bench-status-001': 'Available',
      'field-bench-readiness-002': true,
      'field-last-conversation-003': '2026-05-16',
      'field-booking-notes-004': 'Open to backend-heavy opportunities',
    },
  },
]

const unitAssignments = [
  { unitId: 'unit-platform', managerId: 'person-um-001' },
  { unitId: 'unit-product', managerId: 'person-um-002' },
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
