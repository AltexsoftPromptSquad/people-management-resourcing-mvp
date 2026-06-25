import { useQuery } from '@tanstack/react-query'
import { getPersonas } from '../api/get-personas'
import { queryKeys } from '@/lib/query/query-keys'

export const usePersonasQuery = () => {
  return useQuery({
    queryKey: queryKeys.personas(),
    queryFn: getPersonas,
  })
}
