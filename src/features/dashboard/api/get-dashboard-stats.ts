import type { DashboardSummary } from '@/types/dashboard'
import { getDashboardSummary } from './get-dashboard-summary'

export const getDashboardStats = (managerId: string): Promise<DashboardSummary> =>
  getDashboardSummary(managerId)
