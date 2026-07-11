import type { FC } from 'react'
import { useMemo } from 'react'
import { UserCog, UserRoundCheck, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { usePersonasQuery } from '../../hooks/use-personas-query'
import { getRoleLandingPagePath } from '@/app/routes'
import { cn } from '@/lib/utils'
import { useRoleStore } from '@/store/role-store'
import { Button } from '@/shared/ui/button'
import { Select } from '@/shared/ui/select'
import type { Persona } from '@/types/persona'
import type { Role } from '@/types/role'
import type { RoleSwitcherProps } from './RoleSwitcher.types'

const roleOptions: Array<{ Icon: LucideIcon; label: string; value: Role }> = [
  { Icon: UsersRound, label: 'Unit Manager', value: 'unit-manager' },
  { Icon: UserCog, label: 'Sales / Delivery Manager', value: 'delivery-manager' },
  { Icon: UserRoundCheck, label: 'Employee', value: 'employee' },
]

export const RoleSwitcher: FC<RoleSwitcherProps> = () => {
  const navigate = useNavigate()
  const personasQuery = usePersonasQuery()
  const activeRole = useRoleStore((state) => state.activeRole)
  const activePersonaId = useRoleStore((state) => state.activePersonaId)
  const setActiveRole = useRoleStore((state) => state.setActiveRole)
  const setActivePersona = useRoleStore((state) => state.setActivePersona)

  const handleRoleChange = (role: Role) => {
    setActiveRole(role)
    navigate(getRoleLandingPagePath(role))
  }

  const rolePersonas = useMemo(
    () =>
      (personasQuery.data ?? [])
        .filter((persona) => persona.role === activeRole)
        .sort((left, right) => Number(right.isDefault) - Number(left.isDefault)),
    [activeRole, personasQuery.data],
  )

  const activePersonaForRole = rolePersonas.find((persona) => persona.id === activePersonaId)

  const handlePersonaChange = (personaId: string) => {
    const persona = rolePersonas.find((item) => item.id === personaId)
    if (!persona) {
      return
    }

    setActivePersona(persona.id)
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-xs">
      <span className="px-2 text-xs font-medium text-slate-500">View as</span>
      <div className="flex flex-wrap items-center gap-1" aria-label="Active role" role="group">
        {roleOptions.map((role) => {
          const isActive = role.value === activeRole

          return (
            <Button
              key={role.value}
              type="button"
              size="sm"
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'h-8 px-2.5',
                isActive
                  ? 'bg-slate-800 text-white shadow-sm hover:bg-slate-900 focus-visible:ring-slate-700/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
              )}
              aria-pressed={isActive}
              onClick={() => handleRoleChange(role.value)}
            >
              <role.Icon className="size-4" aria-hidden="true" />
              {role.label}
              {isActive ? <span className="sr-only"> selected</span> : null}
            </Button>
          )
        })}
      </div>
      {rolePersonas.length > 1 ? (
        <label className="flex items-center gap-2 border-l border-slate-200 pl-2 text-xs text-slate-600">
          Persona
          <Select
            aria-label="Active persona"
            className="h-8 min-w-44"
            value={activePersonaForRole?.id ?? rolePersonas[0]?.id ?? ''}
            onChange={(event) => handlePersonaChange(event.target.value)}
          >
            {rolePersonas.map((persona: Persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.displayName}
              </option>
            ))}
          </Select>
        </label>
      ) : null}
    </div>
  )
}
