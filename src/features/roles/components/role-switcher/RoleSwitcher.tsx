import type { FC } from 'react'
import { useNavigate } from 'react-router'
import { roleDefinitions, roles } from '@/features/roles/constants'
import { usePersonasQuery } from '@/features/roles/hooks/use-personas-query'
import { getRoleLandingPath } from '@/features/roles/utils/get-role-landing-path'
import { cn } from '@/lib/utils'
import { useRoleStore } from '@/store/role-store'
import type { Role } from '@/types'
import type { RoleSwitcherProps } from './RoleSwitcher.types'

export const RoleSwitcher: FC<RoleSwitcherProps> = () => {
  const navigate = useNavigate()
  const activeRole = useRoleStore((state) => state.activeRole)
  const activePersonaId = useRoleStore((state) => state.activePersonaId)
  const setActiveRole = useRoleStore((state) => state.setActiveRole)
  const { data: personas = [], isError, isPending } = usePersonasQuery()

  const handleRoleChange = (role: Role) => {
    const persona = personas.find((item) => item.role === role)

    if (!persona) {
      return
    }

    setActiveRole(role, persona.id)
    navigate(getRoleLandingPath(role))
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600" htmlFor="role-switcher">
        Active role
      </label>
      <select
        id="role-switcher"
        aria-label="Switch active role"
        className={cn(
          'h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-xs outline-none transition-colors focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-700/25 disabled:cursor-not-allowed disabled:opacity-60',
          isError && 'border-red-300 text-red-700',
        )}
        disabled={isPending || isError}
        value={isPending || isError ? activeRole : activePersonaId}
        onChange={(event) => {
          const persona = personas.find((item) => item.id === event.target.value)

          if (persona) {
            handleRoleChange(persona.role)
          }
        }}
      >
        {roles.map((role) => {
          const persona = personas.find((item) => item.role === role.id)

          return (
            <option key={role.id} value={persona?.id ?? role.id}>
              {roleDefinitions[role.id].shortLabel}
              {persona ? ` - ${persona.displayName}` : ''}
            </option>
          )
        })}
      </select>
    </div>
  )
}
