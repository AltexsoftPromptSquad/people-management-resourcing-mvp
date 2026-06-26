import type { FC } from 'react'
import type { DashboardSummary } from '../../types/dashboard-summary'

type DashboardSummaryCardsProps = {
  summary: DashboardSummary
}

const summaryCards = [
  { label: 'Subordinates', key: 'subordinateCount' },
  { label: 'Active Risks', key: 'activeRisksCount' },
  { label: 'Open Action Items', key: 'openActionItemsCount' },
  { label: 'Active Resourcing Requests', key: 'activeResourcingRequestsCount' },
] as const satisfies Array<{ label: string; key: keyof DashboardSummary }>

export const DashboardSummaryCards: FC<DashboardSummaryCardsProps> = ({ summary }) => {
  return (
    <section
      aria-label="Dashboard summary widgets"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {summaryCards.map((item) => (
        <article key={item.key} className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-600">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary[item.key]}</p>
        </article>
      ))}
    </section>
  )
}
