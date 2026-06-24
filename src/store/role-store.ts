import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/types'

type RoleState = {
  activeRole: Role
  activePersonaId: string
  setActiveRole: (role: Role, personaId: string) => void
  setActivePersonaId: (personaId: string) => void
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      activeRole: 'unit-manager',
      activePersonaId: 'persona-um-olena',
      setActiveRole: (activeRole, activePersonaId) => set({ activeRole, activePersonaId }),
      setActivePersonaId: (activePersonaId) => set({ activePersonaId }),
    }),
    {
      name: 'pmr-role-store',
    },
  ),
)
