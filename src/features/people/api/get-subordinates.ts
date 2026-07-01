import { apiClient } from '@/lib/api/api-client'
import type {
  SubordinateListItem,
  SubordinatesFilter,
  SubordinatesSort,
} from '@/types/subordinates-query'

type GetSubordinatesParams = SubordinatesFilter &
  SubordinatesSort & {
    managerId: string
  }

export const getSubordinates = ({
  managerId,
  search,
  position,
  grade,
  currentStatus,
  riskLevel,
  field,
  direction,
}: GetSubordinatesParams) =>
  apiClient<SubordinateListItem[]>('/api/subordinates', {
    managerId,
    search,
    position,
    grade,
    currentStatus,
    riskLevel,
    sortField: field,
    sortDirection: direction,
  })
