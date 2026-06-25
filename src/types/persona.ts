import type { Role } from './role'

export type Persona = {
  id: string
  role: Role
  personId: string
  displayName: string
  title: string
  unitId?: string
  isDefault: boolean
}
