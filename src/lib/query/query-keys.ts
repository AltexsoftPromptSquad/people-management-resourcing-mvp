import type { SubordinatesFilter, SubordinatesSort } from '@/types/subordinates-query'

export const queryKeys = {
  personas: () => ['personas'] as const,
  dashboardSummary: (managerId: string) => ['dashboard', 'summary', managerId] as const,
  dashboardActionItems: (managerId: string) => ['dashboard', 'action-items', managerId] as const,
  subordinates: (managerId: string, filter: SubordinatesFilter, sort: SubordinatesSort) =>
    ['subordinates', managerId, filter, sort] as const,
}
