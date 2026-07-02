import { apiGet } from '@/lib/api/api-client'
import type { ActionItem } from '@/types/action-item'

export const getPersonActionItems = (personId: string) =>
  apiGet<ActionItem[]>(`/api/people/${personId}/action-items`)

export const getActionItemsByAssignee = (assigneeId: string) =>
  apiGet<ActionItem[]>('/api/action-items', { assigneeId })
