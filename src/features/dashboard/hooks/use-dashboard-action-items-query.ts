import { useQuery } from '@tanstack/react-query'
import { getDashboardActionItems } from '../api/get-dashboard-action-items'
import { queryKeys } from '@/lib/query/query-keys'

export const useDashboardActionItemsQuery = (managerId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.dashboardActionItems(managerId ?? 'unknown'),
    queryFn: () => getDashboardActionItems(managerId ?? ''),
    enabled: Boolean(managerId),
  })
}
