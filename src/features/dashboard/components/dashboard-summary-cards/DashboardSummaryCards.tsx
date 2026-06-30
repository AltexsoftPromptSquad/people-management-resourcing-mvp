import type { FC } from 'react'
import type { DashboardSummary } from '@/types/dashboard'

export type DashboardSummaryCardsProps = {
  summary: DashboardSummary
}

const widgets = [
  { key: 'subordinateCount', label: 'Subordinates' },
  { key: 'activeRisksCount', label: 'Active Risks' },
  { key: 'openActionItemsCount', label: 'Open Action Items' },
  { key: 'activeResourcingRequestsCount', label: 'Active Requests' },
] as const

export const DashboardSummaryCards: FC<DashboardSummaryCardsProps> = ({ summary }) => {
  return (
    <section aria-label="Dashboard summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {widgets.map((widget) => (
        <article
          key={widget.key}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
        >
          <h2 className="text-sm font-medium text-slate-600">{widget.label}</h2>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{summary[widget.key]}</p>
        </article>
      ))}
    </section>
  )
}
