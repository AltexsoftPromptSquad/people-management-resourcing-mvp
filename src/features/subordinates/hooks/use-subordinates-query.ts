import { useQuery } from '@tanstack/react-query'
import { getSubordinates } from '../api/get-subordinates'
import type { SubordinatesFilter, SubordinatesSort } from '@/types/subordinates-query'
import { queryKeys } from '@/lib/query/query-keys'

type UseSubordinatesQueryParams = {
  managerId: string
  filter: SubordinatesFilter
  sort: SubordinatesSort
}

export const useSubordinatesQuery = ({ managerId, filter, sort }: UseSubordinatesQueryParams) => {
  return useQuery({
    queryKey: queryKeys.subordinates(managerId, {
      ...filter,
      sortField: sort.field,
      sortDirection: sort.direction,
    }),
    queryFn: () =>
      getSubordinates({
        managerId,
        filter,
        sort,
      }),
    enabled: managerId.length > 0,
  })
}
