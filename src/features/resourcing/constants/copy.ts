export const RESOURCING_COPY = {
  dmEmptyTitle: 'No requests yet',
  dmEmptyDescription: 'Create your first resourcing request to get started.',
  umEmptyTitle: 'No incoming requests',
  umEmptyDescription: 'Resourcing requests assigned to you will appear here.',
  selectRequestTitle: 'Select a request',
  selectRequestDescription: 'Choose a request from the table to view details.',
  loadErrorTitle: 'Could not load requests',
  loadErrorDescription: 'Refresh the page to try again.',
  sharedProfileInvalidTitle: 'Profile not available',
  sharedProfileInvalidDescription:
    'This shared profile link is no longer active or does not exist.',
  linkCopied: 'Link copied to clipboard.',
  generateLinkFailed: 'Could not generate link. Try again.',
  candidatesSubmitted: 'Candidates submitted. Request status updated to Candidates Proposed.',
  submissionFailed: 'Submission failed. Your candidates were not saved. Try again.',
  candidateApproved: (name: string) => `${name} approved. Assignment history updated.`,
  approvalFailed: 'Could not record approval. Try again.',
  candidateRejected: (name: string) => `${name} rejected.`,
  rejectionFailed: 'Could not record rejection. Try again.',
  requestCancelled: 'Request cancelled.',
  cancelFailed: 'Could not cancel the request. Try again.',
  candidateWithdrawn: 'Candidate withdrawn.',
  withdrawFailed: 'Could not withdraw candidate. Try again.',
  requestSubmitted: 'Request submitted.',
  requestSubmitFailed: 'Could not submit request. Try again.',
  confirmCancelRequest: {
    title: 'Cancel request?',
    description:
      "This request will be cancelled and removed from the Unit Manager's queue. This cannot be undone.",
    cancel: 'Keep request',
    confirm: 'Cancel request',
  },
  confirmWithdraw: {
    title: 'Withdraw candidate?',
    description:
      'The proposed candidate will be removed from this request. The Sales / Delivery Manager will no longer see them.',
    cancel: 'Keep candidate',
    confirm: 'Withdraw',
  },
  confirmSubmitCandidates: {
    title: 'Submit candidates?',
    description:
      'The Sales / Delivery Manager will be notified that candidates have been proposed for this request.',
    cancel: 'Keep editing',
    confirm: 'Submit',
  },
  validation: {
    rejectionReason: 'A rejection reason is required.',
    externalUrl: 'Enter a valid URL (e.g. https://example.com/profile).',
    requestTitle: 'Request title is required.',
    requiredRole: 'Required role is required.',
    gradeLevel: 'Grade level is required.',
    englishLevel: 'English level is required.',
    assignedUm: 'Assigned Unit Manager is required.',
    workload: 'Workload must be between 1 and 100.',
    noCandidates: 'Add at least one candidate before submitting.',
  },
} as const

export type CandidateWarningType = 'allocation' | 'leave-overlap' | 'risk'

export type CandidateWarning = {
  type: CandidateWarningType
  tone: 'warning' | 'danger'
  message: string
}
