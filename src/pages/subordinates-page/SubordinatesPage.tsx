import type { FC } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { getPersonProfilePagePath } from '@/app/routes'
import { SubordinatesFilters } from '@/features/subordinates/components/subordinates-filters'
import { SubordinatesTable } from '@/features/subordinates/components/subordinates-table'
import { useSubordinatesQuery } from '@/features/subordinates/hooks/use-subordinates-query'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import type { CurrentProjectStatus, RiskLevel } from '@/types/person'
import type {
  SubordinatesFilter,
  SubordinatesSort,
  SubordinatesSortField,
} from '@/types/subordinates-query'
import type { SubordinatesPageProps } from './SubordinatesPage.types'

const defaultSort: SubordinatesSort = {
  field: 'fullName',
  direction: 'asc',
}

const sortableFields: SubordinatesSortField[] = [
  'fullName',
  'position',
  'grade',
  'currentStatus',
  'riskLevel',
]

const parseFilterFromQuery = (searchParams: URLSearchParams): SubordinatesFilter => ({
  search: searchParams.get('search') || undefined,
  position: searchParams.get('position') || undefined,
  grade: searchParams.get('grade') || undefined,
  currentStatus: (searchParams.get('currentStatus') as CurrentProjectStatus | null) ?? undefined,
  riskLevel: (searchParams.get('riskLevel') as RiskLevel | null) ?? undefined,
})

const parseSortFromQuery = (searchParams: URLSearchParams): SubordinatesSort => {
  const requestedField = searchParams.get('sortField')
  const field = sortableFields.includes(requestedField as SubordinatesSortField)
    ? (requestedField as SubordinatesSortField)
    : defaultSort.field

  return {
    field,
    direction: searchParams.get('sortDirection') === 'desc' ? 'desc' : 'asc',
  }
}

export const SubordinatesPage: FC<SubordinatesPageProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { activePersona, isError, isPending } = useActivePersona()
  const managerId = activePersona?.personId ?? ''
  const filter = parseFilterFromQuery(searchParams)
  const sort = parseSortFromQuery(searchParams)
  const subordinatesQuery = useSubordinatesQuery({ managerId, filter, sort })

  const updateSearchParams = (nextFilter: SubordinatesFilter, nextSort: SubordinatesSort) => {
    const nextParams = new URLSearchParams()

    if (nextFilter.search) {
      nextParams.set('search', nextFilter.search)
    }

    if (nextFilter.position) {
      nextParams.set('position', nextFilter.position)
    }

    if (nextFilter.grade) {
      nextParams.set('grade', nextFilter.grade)
    }

    if (nextFilter.currentStatus) {
      nextParams.set('currentStatus', nextFilter.currentStatus)
    }

    if (nextFilter.riskLevel) {
      nextParams.set('riskLevel', nextFilter.riskLevel)
    }

    if (nextSort.field !== defaultSort.field || nextSort.direction !== defaultSort.direction) {
      nextParams.set('sortField', nextSort.field)
      nextParams.set('sortDirection', nextSort.direction)
    }

    setSearchParams(nextParams, { replace: true })
  }

  if (isPending) {
    return (
      <LoadingState label="Loading subordinates workspace" className="mx-auto mt-10 max-w-7xl" />
    )
  }

  if (isError || !activePersona) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  if (subordinatesQuery.isPending) {
    return <LoadingState label="Loading subordinates" className="mx-auto mt-10 max-w-7xl" />
  }

  if (subordinatesQuery.isError || !subordinatesQuery.data) {
    return (
      <ErrorState
        className="mx-auto mt-10 max-w-7xl"
        title="Could not load subordinates"
        description="Subordinates data is unavailable. Refresh and try again."
      />
    )
  }

  const positionOptions = Array.from(
    new Set(subordinatesQuery.data.map((item) => item.position)),
  ).sort((left, right) => left.localeCompare(right))

  const gradeOptions = Array.from(new Set(subordinatesQuery.data.map((item) => item.grade))).sort(
    (left, right) => left.localeCompare(right),
  )

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-sky-700">{activePersona.displayName}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Subordinates</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Filter and sort direct reports. Select a person to open the profile entry point.
          </p>
        </header>
        <SubordinatesFilters
          filter={filter}
          positionOptions={positionOptions}
          gradeOptions={gradeOptions}
          onFilterChange={(nextFilter) => updateSearchParams(nextFilter, sort)}
        />
        {subordinatesQuery.data.length > 0 ? (
          <SubordinatesTable
            rows={subordinatesQuery.data}
            sort={sort}
            onSortChange={(nextSort) => updateSearchParams(filter, nextSort)}
            onOpenProfile={(personId) => navigate(getPersonProfilePagePath(personId))}
          />
        ) : (
          <EmptyState
            title="No matching subordinates"
            description="Try resetting one or more filters to see available reports."
          />
        )}
      </section>
    </main>
  )
}
