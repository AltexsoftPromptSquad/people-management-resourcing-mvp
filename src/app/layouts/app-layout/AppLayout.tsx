import type { FC } from 'react'
import { UsersRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { navigationItemsByRole } from '@/app/navigation'
import { RoleSwitcher } from '@/features/roles/components/role-switcher'
import { cn } from '@/lib/utils'
import { useRoleStore } from '@/store/role-store'

export const AppLayout: FC = () => {
  const activeRole = useRoleStore((state) => state.activeRole)
  const navigationItems = navigationItemsByRole[activeRole]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="h-1 bg-slate-800" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-sky-200"
              aria-hidden="true"
            >
              <UsersRound className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-sky-700">People Operations</p>
              <p className="truncate text-lg font-semibold text-slate-950">
                People Management & Resourcing
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <RoleSwitcher />
            <nav
              aria-label="Primary navigation"
              className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-1"
            >
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-slate-950 text-white shadow-sm hover:bg-slate-900'
                        : 'text-slate-700 hover:bg-white hover:text-slate-950',
                    )
                  }
                >
                  <item.Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
