import type { FC } from 'react'
import { DashboardActionItemsList } from '@/features/dashboard/components/dashboard-action-items-list'
import { DashboardQuickLinks } from '@/features/dashboard/components/dashboard-quick-links'
import { DashboardSummaryCards } from '@/features/dashboard/components/dashboard-summary-cards'
import { useDashboardActionItemsQuery } from '@/features/dashboard/hooks/use-dashboard-action-items-query'
import { useDashboardSummaryQuery } from '@/features/dashboard/hooks/use-dashboard-summary-query'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import type { DashboardPageProps } from './DashboardPage.types'

export const DashboardPage: FC<DashboardPageProps> = () => {
  const { activePersona, isError, isPending } = useActivePersona()
  const managerId = activePersona?.personId ?? ''
  const dashboardSummaryQuery = useDashboardSummaryQuery(managerId)
  const dashboardActionItemsQuery = useDashboardActionItemsQuery(managerId)

  if (isPending) {
    return <LoadingState label="Loading manager workspace" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isError || !activePersona) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  if (dashboardSummaryQuery.isPending || dashboardActionItemsQuery.isPending) {
    return <LoadingState label="Loading dashboard data" className="mx-auto mt-10 max-w-7xl" />
  }

  if (
    dashboardSummaryQuery.isError ||
    dashboardActionItemsQuery.isError ||
    !dashboardSummaryQuery.data ||
    !dashboardActionItemsQuery.data
  ) {
    return (
      <ErrorState
        className="mx-auto mt-10 max-w-7xl"
        title="Could not load dashboard"
        description="Manager dashboard data is unavailable. Refresh and try again."
      />
    )
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-sky-700">{activePersona.displayName}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Manager Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Operational overview of subordinates, staffing risks, and manager action items.
          </p>
        </header>
        <DashboardSummaryCards summary={dashboardSummaryQuery.data} />
        {dashboardActionItemsQuery.data.length > 0 ? (
          <DashboardActionItemsList actionItems={dashboardActionItemsQuery.data} />
        ) : (
          <EmptyState
            title="No action items"
            description="There are no open manager action items for the active persona."
          />
        )}
        <DashboardQuickLinks />
      </section>
    </main>
  )
}
