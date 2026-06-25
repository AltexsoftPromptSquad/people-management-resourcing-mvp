export type ResourcingRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Candidates Proposed'
  | 'Approved'
  | 'Rejected'
  | 'Closed'
  | 'Cancelled'

export type ResourcingRequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export type ResourcingRequest = {
  id: string
  requestCode: string
  title: string
  projectName: string
  createdById: string
  assignedUnitManagerId: string
  requiredRole: string
  status: ResourcingRequestStatus
  priority: ResourcingRequestPriority
  createdAt: string
  updatedAt: string
}
