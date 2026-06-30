import { useDashboardSummaryQuery } from './use-dashboard-summary-query'

export const useDashboardStatsQuery = (managerId: string | undefined) =>
  useDashboardSummaryQuery(managerId)
