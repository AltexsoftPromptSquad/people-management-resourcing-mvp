import type { FC } from 'react'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { DashboardActionItemsList } from '@/features/dashboard/components/dashboard-action-items-list'
import { DashboardQuickLinks } from '@/features/dashboard/components/dashboard-quick-links'
import { DashboardSummaryCards } from '@/features/dashboard/components/dashboard-summary-cards'
import { useDashboardActionItemsQuery } from '@/features/dashboard/hooks/use-dashboard-action-items-query'
import { useDashboardStatsQuery } from '@/features/dashboard/hooks/use-dashboard-stats-query'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PageHeader } from '@/shared/ui/page-header'
import type { DashboardPageProps } from './DashboardPage.types'

export const DashboardPage: FC<DashboardPageProps> = () => {
  const { activePersona, isError: isPersonaError, isPending: isPersonaPending } = useActivePersona()
  const managerId = activePersona?.personId

  const summaryQuery = useDashboardStatsQuery(managerId)
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
        <PageHeader
          eyebrow={activePersona.displayName}
          title="Manager Dashboard"
          description="Operational overview of subordinates, risks, action items, and active resourcing requests."
        />

        <DashboardSummaryCards summary={summaryQuery.data} />
        <DashboardQuickLinks />
        <DashboardActionItemsList actionItems={actionItemsQuery.data} />
      </section>
    </main>
  )
}
