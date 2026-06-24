import type { FC } from 'react'
import { NavLink, Outlet } from 'react-router'
import { RoleSwitcher } from '@/features/roles/components/role-switcher'
import { getNavigationItemsForRole } from '@/features/roles/utils/get-navigation-items-for-role'
import { cn } from '@/lib/utils'
import { useRoleStore } from '@/store/role-store'

export const AppLayout: FC = () => {
  const activeRole = useRoleStore((state) => state.activeRole)
  const navigationItems = getNavigationItemsForRole(activeRole)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-700">People Operations</p>
            <p className="text-lg font-semibold">People Management & Resourcing</p>
          </div>
          <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2',
                    isActive ? 'bg-slate-900 text-white hover:bg-slate-900' : 'text-slate-700',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <RoleSwitcher />
        </div>
      </header>
      <Outlet />
    </div>
  )
}
