import { useQuery } from '@tanstack/react-query'
import { getPersonas } from '../api/get-personas'

export const usePersonasQuery = () => {
  return useQuery({
    queryKey: ['personas'],
    queryFn: getPersonas,
  })
}
