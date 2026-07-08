import type { Persona } from '@/types/persona'

export const personas: Persona[] = [
  {
    id: 'persona-um-001',
    role: 'unit-manager',
    personId: 'person-um-001',
    displayName: 'Olena Kovalenko',
    title: 'Unit Manager',
    unitId: 'unit-platform',
    isDefault: true,
  },
  {
    id: 'persona-um-002',
    role: 'unit-manager',
    personId: 'person-um-002',
    displayName: 'Ihor Melnyk',
    title: 'Unit Manager',
    unitId: 'unit-product',
    isDefault: false,
  },
  {
    id: 'persona-dm-001',
    role: 'delivery-manager',
    personId: 'person-dm-001',
    displayName: 'Marcus Reed',
    title: 'Delivery Manager',
    isDefault: true,
  },
  {
    id: 'persona-employee-001',
    role: 'employee',
    personId: 'person-employee-001',
    displayName: 'Nazar Petrenko',
    title: 'Software Engineer',
    unitId: 'unit-platform',
    isDefault: true,
  },
]
