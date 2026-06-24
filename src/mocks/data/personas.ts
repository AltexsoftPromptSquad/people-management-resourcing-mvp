import type { Persona } from '@/types'

export const personas: Persona[] = [
  {
    id: 'persona-um-olena',
    role: 'unit-manager',
    personId: 'person-olena-kovalenko',
    displayName: 'Olena Kovalenko',
    title: 'Unit Manager, Platform Engineering',
    unitId: 'unit-platform',
  },
  {
    id: 'persona-dm-dmytro',
    role: 'delivery-manager',
    personId: 'person-dmytro-shevchenko',
    displayName: 'Dmytro Shevchenko',
    title: 'Sales / Delivery Manager',
  },
  {
    id: 'persona-employee-anna',
    role: 'employee',
    personId: 'person-anna-melnyk',
    displayName: 'Anna Melnyk',
    title: 'Frontend Engineer',
    unitId: 'unit-platform',
  },
]
