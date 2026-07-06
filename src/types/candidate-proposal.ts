export type CandidateType = 'Internal' | 'External'
export type CandidateProposalStatus = 'Proposed' | 'Approved' | 'Rejected' | 'Withdrawn'

export type CandidateProposal = {
  id: string
  requestId: string
  candidateType: CandidateType
  employeeId?: string
  externalProfileUrl?: string
  proposedById: string
  proposedAt: string
  status: CandidateProposalStatus
  fitSummary: string
  availabilityPercent: number
  warnings: string[]
  sharedProfileId?: string
  sharedProfileToken?: string
  reviewedById?: string
  reviewedAt?: string
  rejectionReason?: string
  feedback?: string
}
