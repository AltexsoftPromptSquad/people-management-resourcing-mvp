import { useEffect, useMemo, useState } from 'react'
import { useDebouncedValue, useSearchParamState } from '@/shared/hooks'
import type {
  SubordinatesFilter,
  SubordinatesSort,
  SubordinatesSortField,
} from '@/types/subordinates-query'

const SEARCH_DEBOUNCE_MS = 350

export const defaultSubordinatesSort: SubordinatesSort = {
  field: 'fullName',
  direction: 'asc',
}

const defaultSubordinatesSearchParams = {
  search: '',
  position: '',
  grade: '',
  currentStatus: '',
  riskLevel: '',
  sortField: defaultSubordinatesSort.field,
  sortDirection: defaultSubordinatesSort.direction,
}

type SubordinatesSearchParams = typeof defaultSubordinatesSearchParams

const sortFields: SubordinatesSortField[] = [
  'fullName',
  'position',
  'grade',
  'currentStatus',
  'riskLevel',
]

const toFilter = (params: SubordinatesSearchParams): SubordinatesFilter => ({
  search: params.search || undefined,
  position: params.position || undefined,
  grade: params.grade || undefined,
  currentStatus: (params.currentStatus as SubordinatesFilter['currentStatus']) || undefined,
  riskLevel: (params.riskLevel as SubordinatesFilter['riskLevel']) || undefined,
})

const toSort = (params: SubordinatesSearchParams): SubordinatesSort => {
  const field = sortFields.includes(params.sortField as SubordinatesSortField)
    ? (params.sortField as SubordinatesSortField)
    : defaultSubordinatesSort.field

  return {
    field,
    direction: params.sortDirection === 'desc' ? 'desc' : 'asc',
  }
}

const filterToParams = (filter: SubordinatesFilter): Partial<SubordinatesSearchParams> => ({
  search: filter.search ?? '',
  position: filter.position ?? '',
  grade: filter.grade ?? '',
  currentStatus: filter.currentStatus ?? '',
  riskLevel: filter.riskLevel ?? '',
})

export const useSubordinatesPageState = () => {
  const { params, setParams } = useSearchParamState(defaultSubordinatesSearchParams)
  const [draftSearch, setDraftSearch] = useState(params.search)
  const debouncedSearch = useDebouncedValue(draftSearch, SEARCH_DEBOUNCE_MS)

  const filter = useMemo(() => toFilter(params), [params])
  const sort = useMemo(() => toSort(params), [params])

  useEffect(() => {
    setDraftSearch(params.search)
  }, [params.search])

  useEffect(() => {
    const nextSearch = debouncedSearch.trim()

    if (nextSearch === params.search) {
      return
    }

    setParams({ search: nextSearch })
  }, [debouncedSearch, params.search, setParams])

  const onFilterChange = (nextFilter: SubordinatesFilter) => {
    setParams(filterToParams(nextFilter))
  }

  const onSortChange = (nextSort: SubordinatesSort) => {
    setParams({
      sortField: nextSort.field,
      sortDirection: nextSort.direction,
    })
  }

  return {
    filter,
    sort,
    draftSearch,
    setDraftSearch,
    onFilterChange,
    onSortChange,
  }
}
