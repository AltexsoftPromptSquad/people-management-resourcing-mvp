import { useQuery } from '@tanstack/react-query'
import { getResourcingRequests } from '../api/get-resourcing-requests'
import { queryKeys } from '@/lib/query/query-keys'

type RequestFilter = {
  createdById?: string
  assignedManagerId?: string
}

export const useResourcingRequestsQuery = (filter: RequestFilter) =>
  useQuery({
    queryKey: queryKeys.resourcingRequests(filter),
    queryFn: () => getResourcingRequests(filter),
  })
