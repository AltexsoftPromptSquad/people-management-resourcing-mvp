export type AssignmentHistoryStatus = 'Proposed' | 'Approved' | 'Rejected' | 'Withdrawn'

export type AssignmentHistoryItem = {
  id: string
  employeeId: string
  requestId: string
  proposalId: string
  status: AssignmentHistoryStatus
  proposedAt: string
  proposedById: string
  decisionAt?: string
  decisionById?: string
  feedback?: string
  requestTitle?: string
  convertedToProject: boolean
}
