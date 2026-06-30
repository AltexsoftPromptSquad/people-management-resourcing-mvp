import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getSubordinates } from '../api/get-subordinates'
import { queryKeys } from '@/lib/query/query-keys'
import type { SubordinatesFilter, SubordinatesSort } from '@/types/subordinates-query'

export const useSubordinatesQuery = (
  managerId: string | undefined,
  filter: SubordinatesFilter,
  sort: SubordinatesSort,
) => {
  return useQuery({
    queryKey: queryKeys.subordinates(managerId ?? 'unknown', filter, sort),
    queryFn: () =>
      getSubordinates({
        managerId: managerId ?? '',
        ...filter,
        ...sort,
      }),
    enabled: Boolean(managerId),
    placeholderData: keepPreviousData,
  })
}
