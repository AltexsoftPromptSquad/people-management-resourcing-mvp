import { useMemo } from 'react'
import { useRoleStore } from '@/store/role-store'
import { usePersonasQuery } from './use-personas-query'

export const useActivePersona = () => {
  const activePersonaId = useRoleStore((state) => state.activePersonaId)
  const query = usePersonasQuery()

  const activePersona = useMemo(() => {
    return query.data?.find((persona) => persona.id === activePersonaId)
  }, [activePersonaId, query.data])

  return {
    ...query,
    activePersona,
  }
}
