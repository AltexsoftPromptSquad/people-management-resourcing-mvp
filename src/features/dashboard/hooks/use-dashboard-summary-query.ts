import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '../api/get-dashboard-summary'
import { queryKeys } from '@/lib/query/query-keys'

export const useDashboardSummaryQuery = (managerId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.dashboardSummary(managerId ?? 'unknown'),
    queryFn: () => getDashboardSummary(managerId ?? ''),
    enabled: Boolean(managerId),
  })
}
