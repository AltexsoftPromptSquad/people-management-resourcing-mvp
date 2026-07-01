export type DashboardSummary = {
  subordinateCount: number
  activeRisksCount: number
  openActionItemsCount: number
  activeResourcingRequestsCount: number
}

export type DashboardActionItem = {
  id: string
  title: string
  assigneeName: string
  dueDate: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Open' | 'In Progress' | 'Done' | 'Blocked'
  isOverdue: boolean
}
