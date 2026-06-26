import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '../api/get-dashboard-summary'
import { queryKeys } from '@/lib/query/query-keys'

export const useDashboardSummaryQuery = (managerId: string) => {
  return useQuery({
    queryKey: queryKeys.dashboardSummary(managerId),
    queryFn: () => getDashboardSummary(managerId),
    enabled: managerId.length > 0,
  })
}
