import { faker } from '@faker-js/faker'
import { createPerson } from '../factories/person-factory'
import { units } from './units'

faker.seed(20260624)

const managers = [
  createPerson({
    id: 'person-olena-kovalenko',
    unitId: 'unit-platform',
    firstName: 'Olena',
    lastName: 'Kovalenko',
    position: 'Unit Manager',
  }),
  createPerson({
    id: 'person-maksym-bondar',
    unitId: 'unit-product',
    firstName: 'Maksym',
    lastName: 'Bondar',
    position: 'Unit Manager',
  }),
  createPerson({
    id: 'person-iryna-melnyk',
    unitId: 'unit-data',
    firstName: 'Iryna',
    lastName: 'Melnyk',
    position: 'Unit Manager',
  }),
]

const deliveryManager = createPerson({
  id: 'person-dmytro-shevchenko',
  unitId: 'unit-product',
  firstName: 'Dmytro',
  lastName: 'Shevchenko',
  position: 'Delivery Manager',
})

const employeePersona = createPerson({
  id: 'person-anna-melnyk',
  unitId: 'unit-platform',
  managerId: 'person-olena-kovalenko',
  firstName: 'Anna',
  lastName: 'Melnyk',
  position: 'Frontend Engineer',
})

const sampleEmployees = Array.from({ length: 72 }, (_, index) => {
  const unit = units[index % units.length]

  return createPerson({
    id: `person-seed-${String(index + 1).padStart(3, '0')}`,
    unitId: unit.id,
    managerId: unit.managerId,
  })
})

export const people = [...managers, deliveryManager, employeePersona, ...sampleEmployees]
