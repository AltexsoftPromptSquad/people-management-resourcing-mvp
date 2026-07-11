import { useEffect, useMemo, useState, type FC } from 'react'
import { useNavigate } from 'react-router'
import { getEmployeeProfilePagePath } from '@/app/routes'
import { SubordinatesFilters } from '@/features/people/components/subordinates-filters'
import { SubordinatesTable } from '@/features/people/components/subordinates-table'
import {
  defaultSubordinatesSort,
  useSubordinatesPageState,
} from '@/features/people/hooks/use-subordinates-page-state'
import { useSubordinatesQuery } from '@/features/people/hooks/use-subordinates-query'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PageHeader } from '@/shared/ui/page-header'
import type { SubordinatesPageProps } from './SubordinatesPage.types'

export const SubordinatesPage: FC<SubordinatesPageProps> = () => {
  const pageSize = 25
  const { activePersona, isError: isPersonaError, isPending: isPersonaPending } = useActivePersona()
  const managerId = activePersona?.personId
  const navigate = useNavigate()
  const { filter, sort, draftSearch, setDraftSearch, onFilterChange, onSortChange } =
    useSubordinatesPageState()
  const [page, setPage] = useState(1)

  const sourceQuery = useSubordinatesQuery(managerId, {}, defaultSubordinatesSort)
  const sourceSubordinates = useMemo(() => sourceQuery.data ?? [], [sourceQuery.data])

  const filteredSubordinates = useMemo(() => {
    let results = sourceSubordinates

    if (filter.search) {
      const search = filter.search.toLowerCase()
      results = results.filter((person) => person.fullName.toLowerCase().includes(search))
    }
    if (filter.position) {
      results = results.filter((person) => person.position === filter.position)
    }
    if (filter.grade) {
      results = results.filter((person) => person.grade === filter.grade)
    }
    if (filter.currentStatus) {
      results = results.filter((person) => person.currentStatus === filter.currentStatus)
    }
    if (filter.riskLevel) {
      results = results.filter((person) => person.riskLevel === filter.riskLevel)
    }

    const sorted = [...results].sort((left, right) => {
      const compared = left[sort.field].localeCompare(right[sort.field], undefined, {
        sensitivity: 'base',
      })
      return sort.direction === 'asc' ? compared : -compared
    })

    return sorted
  }, [filter, sort, sourceSubordinates])

  const totalPages = Math.max(1, Math.ceil(filteredSubordinates.length / pageSize))
  const paginatedSubordinates = useMemo(
    () => filteredSubordinates.slice((page - 1) * pageSize, page * pageSize),
    [filteredSubordinates, page],
  )

  useEffect(() => {
    setPage(1)
  }, [filter, sort])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const positions = useMemo(
    () => [...new Set(sourceSubordinates.map((person) => person.position))].sort(),
    [sourceSubordinates],
  )

  const grades = useMemo(
    () => [...new Set(sourceSubordinates.map((person) => person.grade))].sort(),
    [sourceSubordinates],
  )

  if (isPersonaPending || sourceQuery.isPending) {
    return <LoadingState label="Loading subordinates" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isPersonaError || !activePersona || sourceQuery.isError) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <PageHeader
          eyebrow={activePersona.displayName}
          title="Subordinates"
          description="Unit-scoped list of people with sorting, filtering, and profile navigation."
        />

        <SubordinatesFilters
          filter={filter}
          draftSearch={draftSearch}
          positions={positions}
          grades={grades}
          onDraftSearchChange={setDraftSearch}
          onFilterChange={onFilterChange}
        />

        {filteredSubordinates.length === 0 ? (
          <EmptyState
            title="No subordinates match the current filters"
            description="Try clearing one or more filters to see more people in your unit."
          />
        ) : (
          <div className="space-y-3">
            <SubordinatesTable
              subordinates={paginatedSubordinates}
              sort={sort}
              onSortChange={onSortChange}
              onOpenProfile={(personId) => navigate(getEmployeeProfilePagePath(personId))}
            />
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <span>
                Showing {(page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, filteredSubordinates.length)} of{' '}
                {filteredSubordinates.length}
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
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
