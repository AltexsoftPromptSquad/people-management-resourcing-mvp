import type { FC } from 'react'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import type { DashboardPageProps } from './DashboardPage.types'

export const DashboardPage: FC<DashboardPageProps> = () => {
  const { activePersona, isError, isPending } = useActivePersona()

  if (isPending) {
    return <LoadingState label="Loading manager workspace" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isError || !activePersona) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-sky-700">{activePersona.displayName}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Manager Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Foundation route for Unit Manager work. Dashboard widgets, action items, and subordinate
            views are scheduled for Phase 2.
          </p>
        </header>
        <EmptyState
          title="Dashboard foundation is ready"
          description="Role-aware routing, persona context, and mock data access are connected for this page."
        />
      </section>
    </main>
  )
}
