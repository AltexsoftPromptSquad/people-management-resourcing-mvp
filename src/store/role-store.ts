import { create } from 'zustand'
import type { Role } from '@/types/role'

const defaultPersonaByRole: Record<Role, string> = {
  'unit-manager': 'persona-um-001',
  'delivery-manager': 'persona-dm-001',
  employee: 'persona-employee-001',
}

type RoleStore = {
  activeRole: Role
  activePersonaId: string
  setActiveRole: (role: Role) => void
  setActivePersona: (personaId: string) => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  activeRole: 'unit-manager',
  activePersonaId: defaultPersonaByRole['unit-manager'],
  setActiveRole: (role) => set({ activeRole: role, activePersonaId: defaultPersonaByRole[role] }),
  setActivePersona: (personaId) => set({ activePersonaId: personaId }),
}))

export const getDefaultPersonaIdForRole = (role: Role) => defaultPersonaByRole[role]
