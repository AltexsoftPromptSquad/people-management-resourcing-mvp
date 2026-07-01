export type ActionItemPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export type ActionItemStatus = 'Open' | 'In Progress' | 'Done' | 'Blocked'

export type ActionItem = {
  id: string
  personId: string
  title: string
  description: string
  assigneeId: string
  ownerId: string
  dueDate: string
  priority: ActionItemPriority
  status: ActionItemStatus
}
