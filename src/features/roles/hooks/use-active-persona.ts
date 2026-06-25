import { usePersonasQuery } from './use-personas-query'
import { useRoleStore } from '@/store/role-store'

export const useActivePersona = () => {
  const activePersonaId = useRoleStore((state) => state.activePersonaId)
  const personasQuery = usePersonasQuery()
  const activePersona = personasQuery.data?.find((persona) => persona.id === activePersonaId)

  return {
    ...personasQuery,
    activePersona,
  }
}
