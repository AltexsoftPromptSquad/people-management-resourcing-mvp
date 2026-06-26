import type { FC } from 'react'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { DashboardActionItemsList } from '@/features/dashboard/components/dashboard-action-items-list'
import { DashboardQuickLinks } from '@/features/dashboard/components/dashboard-quick-links'
import { DashboardSummaryCards } from '@/features/dashboard/components/dashboard-summary-cards'
import { useDashboardActionItemsQuery } from '@/features/dashboard/hooks/use-dashboard-action-items-query'
import { useDashboardSummaryQuery } from '@/features/dashboard/hooks/use-dashboard-summary-query'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import type { DashboardPageProps } from './DashboardPage.types'

export const DashboardPage: FC<DashboardPageProps> = () => {
  const { activePersona, isError: isPersonaError, isPending: isPersonaPending } = useActivePersona()
  const managerId = activePersona?.personId

  const summaryQuery = useDashboardSummaryQuery(managerId)
  const actionItemsQuery = useDashboardActionItemsQuery(managerId)

  if (isPersonaPending || summaryQuery.isPending || actionItemsQuery.isPending) {
    return <LoadingState label="Loading manager dashboard" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isPersonaError || !activePersona || summaryQuery.isError || actionItemsQuery.isError) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  if (!summaryQuery.data || !actionItemsQuery.data) {
    return (
      <EmptyState
        className="mx-auto mt-10 max-w-7xl"
        title="Dashboard data unavailable"
        description="Summary and action item data could not be loaded for this manager."
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
            Operational overview of subordinates, risks, action items, and active resourcing
            requests.
          </p>
        </header>

        <DashboardSummaryCards summary={summaryQuery.data} />
        <DashboardQuickLinks />
        <DashboardActionItemsList actionItems={actionItemsQuery.data} />
      </section>
    </main>
  )
}
