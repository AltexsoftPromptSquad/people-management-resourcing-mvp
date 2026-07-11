import { apiPost } from '@/lib/api/api-client'
import type { ActionItem, ActionItemPriority, ActionItemStatus } from '@/types/action-item'

export type PostActionItemPayload = {
  personId: string
  title: string
  description: string
  assigneeId: string
  ownerId: string
  dueDate: string
  priority: ActionItemPriority
  status: ActionItemStatus
}

export const postActionItem = (payload: PostActionItemPayload) =>
  apiPost<ActionItem, PostActionItemPayload>('/api/action-items', payload)
