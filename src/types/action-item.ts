import type { ResourcingRequestPriority } from './resourcing-request'

export type ActionItemStatus = 'Open' | 'In Progress' | 'Done' | 'Blocked'

export type ActionItem = {
  id: string
  title: string
  assigneePersonId: string
  assigneeName: string
  managerId: string
  dueDate: string
  priority: ResourcingRequestPriority
  status: ActionItemStatus
}

export type DashboardActionItem = {
  id: string
  title: string
  assigneeName: string
  dueDate: string
  priority: ResourcingRequestPriority
  status: ActionItemStatus
  isOverdue: boolean
}
