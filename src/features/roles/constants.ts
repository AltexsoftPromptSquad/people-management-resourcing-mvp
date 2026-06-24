import type { Role, RoleDefinition } from '@/types'

export const roleDefinitions: Record<Role, RoleDefinition> = {
  'unit-manager': {
    id: 'unit-manager',
    label: 'Unit Manager',
    shortLabel: 'UM',
    description: 'Manage people, risks, action items, and incoming staffing requests.',
  },
  'delivery-manager': {
    id: 'delivery-manager',
    label: 'Sales / Delivery Manager',
    shortLabel: 'DM',
    description: 'Create resourcing requests and review proposed candidates.',
  },
  employee: {
    id: 'employee',
    label: 'Employee',
    shortLabel: 'Employee',
    description: 'View and maintain personal profile information.',
  },
}

export const roles = Object.values(roleDefinitions)
