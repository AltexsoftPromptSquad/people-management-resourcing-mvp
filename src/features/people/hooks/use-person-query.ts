import { useQuery } from '@tanstack/react-query'
import { getPerson } from '../api/get-person'
import { queryKeys } from '@/lib/query/query-keys'

export const usePersonQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.person(id ?? 'unknown'),
    queryFn: () => getPerson(id ?? ''),
    enabled: Boolean(id),
  })
