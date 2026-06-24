export type Role = 'unit-manager' | 'delivery-manager' | 'employee'

export type RoleDefinition = {
  id: Role
  label: string
  shortLabel: string
  description: string
}
