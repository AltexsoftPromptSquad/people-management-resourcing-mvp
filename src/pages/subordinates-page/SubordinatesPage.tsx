import { useMemo, type FC } from 'react'
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
  const { activePersona, isError: isPersonaError, isPending: isPersonaPending } = useActivePersona()
  const managerId = activePersona?.personId
  const navigate = useNavigate()
  const { filter, sort, draftSearch, setDraftSearch, onFilterChange, onSortChange } =
    useSubordinatesPageState()

  const baselineQuery = useSubordinatesQuery(managerId, {}, defaultSubordinatesSort)
  const subordinatesQuery = useSubordinatesQuery(managerId, filter, sort)

  const positions = useMemo(
    () => [...new Set(baselineQuery.data?.map((person) => person.position) ?? [])].sort(),
    [baselineQuery.data],
  )

  const grades = useMemo(
    () => [...new Set(baselineQuery.data?.map((person) => person.grade) ?? [])].sort(),
    [baselineQuery.data],
  )

  const isTableInitialLoading = subordinatesQuery.isPending && subordinatesQuery.data === undefined
  const isTableRefreshing = subordinatesQuery.isFetching && subordinatesQuery.data !== undefined

  if (isPersonaPending || baselineQuery.isPending) {
    return <LoadingState label="Loading subordinates" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isPersonaError || !activePersona || baselineQuery.isError) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  const subordinates = subordinatesQuery.data ?? []

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

        {subordinatesQuery.isError && subordinatesQuery.data === undefined ? (
          <ErrorState
            title="Could not load subordinates"
            description="Subordinates data is unavailable. Refresh and try again."
          />
        ) : isTableInitialLoading ? (
          <LoadingState label="Loading subordinates" />
        ) : subordinates.length === 0 ? (
          <EmptyState
            title="No subordinates match the current filters"
            description="Try clearing one or more filters to see more people in your unit."
          />
        ) : (
          <div className="relative">
            {isTableRefreshing ? (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70"
                aria-busy="true"
                aria-live="polite"
              >
                <span className="text-sm font-medium text-slate-600">Updating results...</span>
              </div>
            ) : null}
            <SubordinatesTable
              subordinates={subordinates}
              sort={sort}
              onSortChange={onSortChange}
              onOpenProfile={(personId) => navigate(getEmployeeProfilePagePath(personId))}
            />
          </div>
        )}
      </section>
    </main>
  )
}
