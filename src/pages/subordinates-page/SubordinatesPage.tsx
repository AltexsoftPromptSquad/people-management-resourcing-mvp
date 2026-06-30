import { useEffect, useMemo, useState, type FC } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { getEmployeeProfilePagePath } from '@/app/routes'
import { SubordinatesFilters } from '@/features/people/components/subordinates-filters'
import { SubordinatesTable } from '@/features/people/components/subordinates-table'
import { useSubordinatesQuery } from '@/features/people/hooks/use-subordinates-query'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PageHeader } from '@/shared/ui/page-header'
import type { SubordinatesFilter, SubordinatesSort } from '@/types/subordinates-query'
import type { SubordinatesPageProps } from './SubordinatesPage.types'

const defaultSort: SubordinatesSort = { field: 'fullName', direction: 'asc' }
const searchDebounceMs = 350

const parseFilter = (searchParams: URLSearchParams): SubordinatesFilter => ({
  search: searchParams.get('search') ?? undefined,
  position: searchParams.get('position') ?? undefined,
  grade: searchParams.get('grade') ?? undefined,
  currentStatus:
    (searchParams.get('currentStatus') as SubordinatesFilter['currentStatus']) ?? undefined,
  riskLevel: (searchParams.get('riskLevel') as SubordinatesFilter['riskLevel']) ?? undefined,
})

const parseSort = (searchParams: URLSearchParams): SubordinatesSort => ({
  field: (searchParams.get('sortField') as SubordinatesSort['field']) ?? defaultSort.field,
  direction:
    (searchParams.get('sortDirection') as SubordinatesSort['direction']) ?? defaultSort.direction,
})

const buildSearchParams = (filter: SubordinatesFilter, sort: SubordinatesSort) => {
  const params = new URLSearchParams()

  if (filter.search) params.set('search', filter.search)
  if (filter.position) params.set('position', filter.position)
  if (filter.grade) params.set('grade', filter.grade)
  if (filter.currentStatus) params.set('currentStatus', filter.currentStatus)
  if (filter.riskLevel) params.set('riskLevel', filter.riskLevel)
  if (sort.field !== defaultSort.field) params.set('sortField', sort.field)
  if (sort.direction !== defaultSort.direction) params.set('sortDirection', sort.direction)

  return params
}

export const SubordinatesPage: FC<SubordinatesPageProps> = () => {
  const { activePersona, isError: isPersonaError, isPending: isPersonaPending } = useActivePersona()
  const managerId = activePersona?.personId
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = useMemo(() => parseFilter(searchParams), [searchParams])
  const sort = useMemo(() => parseSort(searchParams), [searchParams])
  const [draftSearch, setDraftSearch] = useState(filter.search ?? '')

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

  useEffect(() => {
    setDraftSearch(filter.search ?? '')
  }, [filter.search])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = draftSearch.trim() || undefined

      if (nextSearch === filter.search) {
        return
      }

      const nextFilter = { ...filter, search: nextSearch }
      setSearchParams(buildSearchParams(nextFilter, sort))
    }, searchDebounceMs)

    return () => window.clearTimeout(timeoutId)
  }, [draftSearch, filter, sort, setSearchParams])

  const updateSearchParams = (nextFilter: SubordinatesFilter, nextSort: SubordinatesSort) => {
    setSearchParams(buildSearchParams(nextFilter, nextSort))
  }

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
          onFilterChange={(nextFilter) => updateSearchParams(nextFilter, sort)}
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
              onSortChange={(nextSort) => updateSearchParams(filter, nextSort)}
              onOpenProfile={(personId) => navigate(getEmployeeProfilePagePath(personId))}
            />
          </div>
        )}
      </section>
    </main>
  )
}
