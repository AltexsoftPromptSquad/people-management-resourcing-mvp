import type { FC } from 'react'
import { AlertTriangle, CalendarClock } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import type { DashboardActionItem } from '../../types/dashboard-action-item'

type DashboardActionItemsListProps = {
  actionItems: DashboardActionItem[]
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const DashboardActionItemsList: FC<DashboardActionItemsListProps> = ({ actionItems }) => {
  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-5"
      aria-label="Manager action items"
    >
      <h2 className="text-lg font-semibold text-slate-950">Manager Action Items</h2>
      <p className="mt-1 text-sm text-slate-600">Sorted by due date (earliest first).</p>
      <ul className="mt-4 space-y-3">
        {actionItems.map((item) => (
          <li
            key={item.id}
            className={`rounded-md border p-4 ${
              item.isOverdue ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">Assignee: {item.assigneeName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={item.isOverdue ? 'danger' : 'warning'}>{item.priority}</Badge>
                <Badge tone={item.status === 'Blocked' ? 'danger' : 'neutral'}>{item.status}</Badge>
              </div>
            </div>
            <div
              className={`mt-3 flex items-center gap-2 text-sm ${
                item.isOverdue ? 'text-red-700' : 'text-slate-600'
              }`}
            >
              {item.isOverdue ? (
                <AlertTriangle className="size-4" aria-hidden="true" />
              ) : (
                <CalendarClock className="size-4" aria-hidden="true" />
              )}
              <span>Due: {dateFormatter.format(new Date(item.dueDate))}</span>
              {item.isOverdue ? <span className="font-semibold">(Overdue)</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
