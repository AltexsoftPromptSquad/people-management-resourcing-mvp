import { useQuery } from '@tanstack/react-query'
import { getDashboardActionItems } from '../api/get-dashboard-action-items'
import { queryKeys } from '@/lib/query/query-keys'

export const useDashboardActionItemsQuery = (managerId: string) => {
  return useQuery({
    queryKey: queryKeys.dashboardActionItems(managerId),
    queryFn: () => getDashboardActionItems(managerId),
    enabled: managerId.length > 0,
  })
}
