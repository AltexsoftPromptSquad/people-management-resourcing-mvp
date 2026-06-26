import { apiClient } from '@/lib/api/api-client'
import type { DashboardSummary } from '@/types/dashboard'

export const getDashboardSummary = (managerId: string) =>
  apiClient<DashboardSummary>('/api/dashboard/summary', { managerId })
