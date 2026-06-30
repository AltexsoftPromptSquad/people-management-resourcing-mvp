export type AssignmentHistoryStatus = 'Approved' | 'Rejected' | 'Withdrawn'

export type AssignmentHistoryItem = {
  id: string
  employeeId: string
  requestId: string
  proposalId: string
  status: AssignmentHistoryStatus
  proposedAt: string
  decisionAt: string
  decisionById: string
  feedback?: string
  convertedToProject: boolean
}
