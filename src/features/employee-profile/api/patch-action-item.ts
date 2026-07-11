import { apiPatch } from '@/lib/api/api-client'
import type { ActionItem, ActionItemPriority, ActionItemStatus } from '@/types/action-item'

export type PatchActionItemPayload = Partial<{
  title: string
  description: string
  assigneeId: string
  dueDate: string
  priority: ActionItemPriority
  status: ActionItemStatus
}>

export const patchActionItem = (id: string, payload: PatchActionItemPayload) =>
  apiPatch<ActionItem, PatchActionItemPayload>(`/api/action-items/${id}`, payload)
