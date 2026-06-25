import type { FC } from 'react'
import { UserCog, UserRoundCheck, UsersRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { getRoleLandingPagePath } from '@/app/routes'
import { cn } from '@/lib/utils'
import { useRoleStore } from '@/store/role-store'
import { Button } from '@/shared/ui/button'
import type { Role } from '@/types/role'
import type { RoleSwitcherProps } from './RoleSwitcher.types'

const roleOptions: Array<{ Icon: LucideIcon; label: string; value: Role }> = [
  { Icon: UsersRound, label: 'Unit Manager', value: 'unit-manager' },
  { Icon: UserCog, label: 'Sales / Delivery Manager', value: 'delivery-manager' },
  { Icon: UserRoundCheck, label: 'Employee', value: 'employee' },
]

export const RoleSwitcher: FC<RoleSwitcherProps> = () => {
  const navigate = useNavigate()
  const activeRole = useRoleStore((state) => state.activeRole)
  const setActiveRole = useRoleStore((state) => state.setActiveRole)

  const handleRoleChange = (role: Role) => {
    setActiveRole(role)
    navigate(getRoleLandingPagePath(role))
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
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
    </div>
  )
}
