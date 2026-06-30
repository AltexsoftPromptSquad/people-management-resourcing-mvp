import type { FC } from 'react'
import { EmptyState } from '@/shared/ui/empty-state'
import { StatusPill } from '@/shared/ui/status-pill'
import type { DashboardActionItem } from '@/types/dashboard'

export type DashboardActionItemsListProps = {
  actionItems: DashboardActionItem[]
}

const formatDueDate = (dueDate: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(dueDate),
  )

export const DashboardActionItemsList: FC<DashboardActionItemsListProps> = ({ actionItems }) => {
  return (
    <section
      aria-label="Manager action items"
      className="rounded-xl border border-slate-200 bg-white shadow-xs"
    >
      <header className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">My Action Items</h2>
        <p className="mt-1 text-sm text-slate-600">Sorted by due date, earliest first.</p>
      </header>

      {actionItems.length === 0 ? (
        <EmptyState
          className="m-5"
          title="No open action items"
          description="Your manager action list is currently clear."
        />
      ) : (
        <ul className="divide-y divide-slate-200">
          {actionItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">Assignee: {item.assigneeName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={item.isOverdue ? 'danger' : 'neutral'}>
                  {item.isOverdue ? 'Overdue' : item.status}
                </StatusPill>
                <span className="text-sm text-slate-600">Due {formatDueDate(item.dueDate)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
