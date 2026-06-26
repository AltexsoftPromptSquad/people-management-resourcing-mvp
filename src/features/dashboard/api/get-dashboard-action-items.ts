import { apiClient } from '@/lib/api/api-client'
import type { DashboardActionItem } from '../types/dashboard-action-item'

export const getDashboardActionItems = (managerId: string) => {
  const params = new URLSearchParams({ managerId })

  return apiClient<DashboardActionItem[]>(`/api/dashboard/action-items?${params.toString()}`)
}
