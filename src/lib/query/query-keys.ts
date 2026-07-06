import type { SubordinatesFilter, SubordinatesSort } from '@/types/subordinates-query'

export const queryKeys = {
  personas: () => ['personas'] as const,
  units: () => ['units'] as const,
  people: (managerId?: string) => ['people', { managerId }] as const,
  person: (id: string) => ['person', id] as const,
  feedbacks: (personId: string) => ['feedbacks', personId] as const,
  scheduledLeaves: (personId: string) => ['scheduled-leaves', personId] as const,
  risks: (personId: string) => ['risks', personId] as const,
  actionItems: (personId: string) => ['action-items', personId] as const,
  actionItemsByAssignee: (assigneeId: string) => ['action-items', 'assignee', assigneeId] as const,
  projectHistory: (personId: string) => ['project-history', personId] as const,
  assignmentHistory: (personId: string) => ['assignment-history', personId] as const,
  skills: (personId: string) => ['skills', personId] as const,
  documents: (personId: string) => ['documents', personId] as const,
  documentsByVisibility: (personId: string, visibility: string) =>
    ['documents', personId, 'visibility', visibility] as const,
  idp: (personId: string) => ['idp', personId] as const,
  resourcingRequests: (filter: { createdById?: string; assignedManagerId?: string }) =>
    ['resourcing-requests', filter] as const,
  resourcingRequest: (id: string) => ['resourcing-request', id] as const,
  candidateProposals: (requestId: string) => ['candidate-proposals', requestId] as const,
  sharedProfile: (token: string) => ['shared-profile', token] as const,
  dashboardSummary: (managerId: string) => ['dashboard', 'summary', managerId] as const,
  dashboardActionItems: (managerId: string) => ['dashboard', 'action-items', managerId] as const,
  subordinates: (managerId: string, filter: SubordinatesFilter, sort: SubordinatesSort) =>
    ['subordinates', managerId, filter, sort] as const,
}
