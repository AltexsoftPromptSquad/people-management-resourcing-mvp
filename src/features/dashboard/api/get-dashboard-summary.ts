import { apiClient } from '@/lib/api/api-client'
import type { DashboardSummary } from '../types/dashboard-summary'

export const getDashboardSummary = (managerId: string) => {
  const params = new URLSearchParams({ managerId })

  return apiClient<DashboardSummary>(`/api/dashboard/summary?${params.toString()}`)
}
