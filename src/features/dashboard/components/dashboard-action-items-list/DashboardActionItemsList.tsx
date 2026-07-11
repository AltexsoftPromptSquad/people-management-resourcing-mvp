import { useEffect, useMemo, useState, type FC } from 'react'
import { EmptyState } from '@/shared/ui/empty-state'
import { Input } from '@/shared/ui/input'
import { StatusPill } from '@/shared/ui/status-pill'
import type { DashboardActionItem } from '@/types/dashboard'

export type DashboardActionItemsListProps = {
  actionItems: DashboardActionItem[]
  onResolve?: (actionItemId: string) => void
}

const statusTone = (item: DashboardActionItem) => {
  if (item.isOverdue) {
    return 'danger' as const
  }

  if (item.status === 'In Progress') {
    return 'info' as const
  }

  if (item.status === 'Blocked') {
    return 'warning' as const
  }

  if (item.status === 'Done') {
    return 'success' as const
  }

  return 'neutral' as const
}

const formatDueDate = (dueDate: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(dueDate),
  )

export const DashboardActionItemsList: FC<DashboardActionItemsListProps> = ({
  actionItems,
  onResolve,
}) => {
  const pageSize = 10
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return actionItems
    }

    return actionItems.filter((item) => item.title.toLowerCase().includes(query))
  }, [actionItems, search])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const pageItems = useMemo(
    () => filteredItems.slice((page - 1) * pageSize, page * pageSize),
    [filteredItems, page],
  )

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return (
    <section
      aria-label="Manager action items"
      className="rounded-xl border border-slate-200 bg-white shadow-xs"
    >
      <header className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">My Action Items</h2>
        <p className="mt-1 text-sm text-slate-600">Sorted by due date, earliest first.</p>
        <Input
          className="mt-3"
          placeholder="Search action items"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </header>

      {filteredItems.length === 0 ? (
        <EmptyState
          className="m-5"
          title={search ? 'No matching action items' : 'No open action items'}
          description={
            search
              ? 'Try a different search query.'
              : 'Your manager action list is currently clear.'
          }
        />
      ) : (
        <>
          <ul className="divide-y divide-slate-200">
            {pageItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-950">{item.title}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone={statusTone(item)}>
                    {item.isOverdue ? 'Overdue' : item.status}
                  </StatusPill>
                  <span className="text-sm text-slate-600">Due {formatDueDate(item.dueDate)}</span>
                  {item.status !== 'Done' && onResolve ? (
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100"
                      onClick={() => onResolve(item.id)}
                    >
                      Resolve
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
            <span>
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredItems.length)}{' '}
              of {filteredItems.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 disabled:opacity-50"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 disabled:opacity-50"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </footer>
        </>
      )}
    </section>
  )
}
