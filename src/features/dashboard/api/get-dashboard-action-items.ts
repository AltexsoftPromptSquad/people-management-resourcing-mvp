import { apiClient } from '@/lib/api/api-client'
import type { DashboardActionItem } from '@/types/dashboard'

export const getDashboardActionItems = (managerId: string) =>
  apiClient<DashboardActionItem[]>('/api/dashboard/action-items', { managerId })
