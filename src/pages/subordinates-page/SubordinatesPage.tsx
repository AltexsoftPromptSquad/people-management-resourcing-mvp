import { useMemo, useState, type FC } from 'react'
import { SubordinatesFilters } from '@/features/subordinates/components/subordinates-filters'
import { SubordinatesTable } from '@/features/subordinates/components/subordinates-table'
import { useSubordinatesQuery } from '@/features/subordinates/hooks/use-subordinates-query'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import type { SubordinatesFilter, SubordinatesSort } from '@/types/subordinates-query'
import type { SubordinatesPageProps } from './SubordinatesPage.types'

const defaultSort: SubordinatesSort = { field: 'fullName', direction: 'asc' }

export const SubordinatesPage: FC<SubordinatesPageProps> = () => {
  const { activePersona, isError: isPersonaError, isPending: isPersonaPending } = useActivePersona()
  const managerId = activePersona?.personId
  const [filter, setFilter] = useState<SubordinatesFilter>({})
  const [sort, setSort] = useState<SubordinatesSort>(defaultSort)

  const baselineQuery = useSubordinatesQuery(managerId, {}, defaultSort)
  const subordinatesQuery = useSubordinatesQuery(managerId, filter, sort)

  const positions = useMemo(
    () => [...new Set(baselineQuery.data?.map((person) => person.position) ?? [])].sort(),
    [baselineQuery.data],
  )

  const grades = useMemo(
    () => [...new Set(baselineQuery.data?.map((person) => person.grade) ?? [])].sort(),
    [baselineQuery.data],
  )

  if (isPersonaPending || baselineQuery.isPending || subordinatesQuery.isPending) {
    return <LoadingState label="Loading subordinates" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isPersonaError || !activePersona || baselineQuery.isError || subordinatesQuery.isError) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  const subordinates = subordinatesQuery.data ?? []

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-sky-700">{activePersona.displayName}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Subordinates</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Unit-scoped list of people with sorting, filtering, and profile navigation.
          </p>
        </header>

        <SubordinatesFilters
          filter={filter}
          positions={positions}
          grades={grades}
          onFilterChange={setFilter}
        />

        {subordinates.length === 0 ? (
          <EmptyState
            title="No subordinates match the current filters"
            description="Try clearing one or more filters to see more people in your unit."
          />
        ) : (
          <SubordinatesTable subordinates={subordinates} sort={sort} onSortChange={setSort} />
        )}
      </section>
    </main>
  )
}
