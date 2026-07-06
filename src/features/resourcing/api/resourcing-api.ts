import { apiGet, apiPatch, apiPost } from '@/lib/api/api-client'
import type { CandidateProposal } from '@/types/candidate-proposal'
import type { ResourcingRequest, ResourcingRequestStatus } from '@/types/resourcing-request'

export type CreateResourcingRequestPayload = {
  title: string
  projectName: string
  clientName?: string
  requiredRole: string
  requiredSkills: string[]
  gradeLevel: string
  englishLevel: string
  expectedCompensationLevel: string
  workloadPercent: number
  startDate: string
  endDate: string
  durationText: string
  assignedUnitManagerId: string
  priority: string
  businessReason?: string
  createdById: string
}

export type PatchResourcingRequestPayload = Partial<CreateResourcingRequestPayload> & {
  status?: ResourcingRequestStatus
}

export type SubmitCandidateProposalsPayload = {
  requestId: string
  candidates: Array<{
    candidateType: 'Internal' | 'External'
    employeeId?: string
    externalProfileUrl?: string
    fitSummary: string
    sharedProfileId?: string
    proposedById: string
    availabilityPercent?: number
    warnings?: string[]
  }>
}

export type PatchCandidateProposalPayload = {
  status: 'Approved' | 'Rejected' | 'Withdrawn'
  feedback?: string
  rejectionReason?: string
  reviewedById: string
}

export const getResourcingRequest = (id: string) =>
  apiGet<ResourcingRequest>(`/api/resourcing/requests/${id}`)

export const createResourcingRequest = (payload: CreateResourcingRequestPayload) =>
  apiPost<ResourcingRequest, CreateResourcingRequestPayload>('/api/resourcing/requests', payload)

export const patchResourcingRequest = (id: string, payload: PatchResourcingRequestPayload) =>
  apiPatch<ResourcingRequest, PatchResourcingRequestPayload>(
    `/api/resourcing/requests/${id}`,
    payload,
  )

export const getCandidateProposals = (requestId: string) =>
  apiGet<CandidateProposal[]>(`/api/resourcing/requests/${requestId}/candidates`)

export const submitCandidateProposals = (payload: SubmitCandidateProposalsPayload) =>
  apiPost<CandidateProposal[], SubmitCandidateProposalsPayload>('/api/candidate-proposals', payload)

export const patchCandidateProposal = (id: string, payload: PatchCandidateProposalPayload) =>
  apiPatch<CandidateProposal, PatchCandidateProposalPayload>(
    `/api/candidate-proposals/${id}`,
    payload,
  )
