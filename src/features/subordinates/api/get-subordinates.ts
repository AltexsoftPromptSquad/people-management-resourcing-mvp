import { apiClient } from '@/lib/api/api-client'
import type {
  SubordinateListItem,
  SubordinatesFilter,
  SubordinatesSort,
} from '@/types/subordinates-query'

type GetSubordinatesParams = {
  managerId: string
  filter: SubordinatesFilter
  sort: SubordinatesSort
}

export const getSubordinates = ({ managerId, filter, sort }: GetSubordinatesParams) => {
  const searchParams = new URLSearchParams({
    managerId,
    sortField: sort.field,
    sortDirection: sort.direction,
  })

  if (filter.position) {
    searchParams.set('position', filter.position)
  }

  if (filter.grade) {
    searchParams.set('grade', filter.grade)
  }

  if (filter.currentStatus) {
    searchParams.set('currentStatus', filter.currentStatus)
  }

  if (filter.riskLevel) {
    searchParams.set('riskLevel', filter.riskLevel)
  }

  if (filter.search) {
    searchParams.set('search', filter.search)
  }

  return apiClient<SubordinateListItem[]>(`/api/subordinates?${searchParams.toString()}`)
}
