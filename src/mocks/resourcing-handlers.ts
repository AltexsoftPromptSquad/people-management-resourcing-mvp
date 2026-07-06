import { http, HttpResponse } from 'msw'
import { assignmentHistory } from './data/assignment-history'
import { candidateProposals } from './data/candidate-proposals'
import { documents } from './data/documents'
import { feedbacks } from './data/feedbacks'
import { people } from './data/people'
import { projectHistory } from './data/project-history'
import { resourcingRequests } from './data/resourcing-requests'
import { risks } from './data/risks'
import { scheduledLeaves } from './data/scheduled-leaves'
import { sharedProfiles } from './data/shared-profiles'
import { skills } from './data/skills'
import type { AssignmentHistoryItem } from '@/types/assignment-history'
import type { CandidateProposal } from '@/types/candidate-proposal'
import type { ResourcingRequest, ResourcingRequestStatus } from '@/types/resourcing-request'
import type { SharedProfile, SharedProfileSection } from '@/types/shared-profile'
import type { SharedProfileView } from '@/types/shared-profile-view'

type CreateResourcingRequestBody = Omit<
  ResourcingRequest,
  'id' | 'requestCode' | 'status' | 'createdAt' | 'updatedAt'
> & { createdById: string }

type PatchResourcingRequestBody = Partial<ResourcingRequest> & {
  status?: ResourcingRequestStatus
}

type SubmitCandidateProposalsBody = {
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

type PatchCandidateProposalBody = {
  status: 'Approved' | 'Rejected' | 'Withdrawn'
  feedback?: string
  rejectionReason?: string
  reviewedById: string
}

type CreateSharedProfileBody = {
  personId: string
  allowedSections: SharedProfileSection[]
  createdById: string
}

const buildSharedProfileView = (profile: SharedProfile): SharedProfileView | null => {
  const person = people.find((item) => item.id === profile.personId)

  if (!person) {
    return null
  }

  const view: SharedProfileView = {
    token: profile.token,
    personId: profile.personId,
    allowedSections: profile.allowedSections,
    person: {
      firstName: person.firstName,
      lastName: person.lastName,
      position: person.position,
      grade: person.grade,
      englishLevel: person.englishLevel,
      availabilityPercent: person.availabilityPercent,
      currentProjectStatus: person.currentProjectStatus,
    },
  }

  if (profile.allowedSections.includes('job-and-skills')) {
    view.skills = skills
      .filter((skill) => skill.personId === person.id)
      .map((skill) => ({ name: skill.name, level: skill.level }))
  }

  if (profile.allowedSections.includes('project-history')) {
    view.projectHistory = projectHistory
      .filter((item) => item.personId === person.id)
      .map((item) => ({
        projectName: item.projectName,
        role: item.role,
        startDate: item.startDate,
        endDate: item.endDate,
        allocationPercent: item.allocationPercent,
        status: 'Active',
      }))
  }

  if (profile.allowedSections.includes('feedbacks')) {
    view.feedbacks = feedbacks
      .filter((feedback) => feedback.personId === person.id)
      .map((feedback) => ({
        type: feedback.type,
        content: feedback.content,
        createdAt: feedback.createdAt,
      }))
  }

  if (profile.allowedSections.includes('scheduled-leaves')) {
    view.scheduledLeaves = scheduledLeaves
      .filter((leave) => leave.personId === person.id)
      .map((leave) => ({
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        status: leave.status,
      }))
  }

  if (profile.allowedSections.includes('risks')) {
    view.risks = risks
      .filter((risk) => risk.personId === person.id)
      .map((risk) => ({
        level: risk.level,
        description: risk.description,
      }))
  }

  if (profile.allowedSections.includes('documents')) {
    view.documents = documents
      .filter((document) => document.personId === person.id)
      .map((document) => ({
        name: document.name,
        type: document.type,
      }))
  }

  if (profile.allowedSections.includes('custom-fields')) {
    view.customFields = person.customFieldValues
  }

  return view
}

const createAssignmentHistoryRecord = (
  proposal: CandidateProposal,
  status: AssignmentHistoryItem['status'],
  reviewedById: string,
  feedback?: string,
): AssignmentHistoryItem | null => {
  if (!proposal.employeeId) {
    return null
  }

  const request = resourcingRequests.find((item) => item.id === proposal.requestId)
  const now = new Date().toISOString()

  const record: AssignmentHistoryItem = {
    id: `assignment-history-${String(assignmentHistory.length + 1).padStart(4, '0')}`,
    employeeId: proposal.employeeId,
    requestId: proposal.requestId,
    proposalId: proposal.id,
    status,
    proposedAt: proposal.proposedAt,
    proposedById: proposal.proposedById,
    decisionAt: now,
    decisionById: reviewedById,
    feedback,
    requestTitle: request?.title,
    convertedToProject: status === 'Approved',
  }

  assignmentHistory.unshift(record)
  return record
}

export const resourcingHandlers = [
  http.get('/api/resourcing/requests/:id', ({ params }) => {
    const request = resourcingRequests.find((item) => item.id === params.id)

    if (!request) {
      return HttpResponse.json({ message: 'Request not found' }, { status: 404 })
    }

    return HttpResponse.json(request)
  }),
  http.post('/api/resourcing/requests', async ({ request }) => {
    const body = (await request.json()) as CreateResourcingRequestBody
    const nextIndex = resourcingRequests.length + 1
    const newRequest: ResourcingRequest = {
      id: `request-${String(nextIndex).padStart(3, '0')}`,
      requestCode: `REQ-${String(nextIndex).padStart(3, '0')}`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body,
    }

    resourcingRequests.unshift(newRequest)

    return HttpResponse.json(newRequest, { status: 201 })
  }),
  http.patch('/api/resourcing/requests/:id', async ({ params, request }) => {
    const existing = resourcingRequests.find((item) => item.id === params.id)

    if (!existing) {
      return HttpResponse.json({ message: 'Request not found' }, { status: 404 })
    }

    const body = (await request.json()) as PatchResourcingRequestBody

    Object.assign(existing, body, { updatedAt: new Date().toISOString() })

    return HttpResponse.json(existing)
  }),
  http.get('/api/resourcing/requests/:id/candidates', ({ params }) => {
    const proposals = candidateProposals
      .filter((proposal) => proposal.requestId === params.id && proposal.status !== 'Withdrawn')
      .map((proposal) => {
        if (!proposal.sharedProfileId) {
          return proposal
        }

        const profile = sharedProfiles.find((item) => item.id === proposal.sharedProfileId)

        return profile ? { ...proposal, sharedProfileToken: profile.token } : proposal
      })

    return HttpResponse.json(proposals)
  }),
  http.post('/api/candidate-proposals', async ({ request }) => {
    const body = (await request.json()) as SubmitCandidateProposalsBody
    const created: CandidateProposal[] = body.candidates.map((candidate, index) => {
      const proposal: CandidateProposal = {
        id: `proposal-${String(candidateProposals.length + index + 1).padStart(4, '0')}`,
        requestId: body.requestId,
        candidateType: candidate.candidateType,
        employeeId: candidate.employeeId,
        externalProfileUrl: candidate.externalProfileUrl,
        proposedById: candidate.proposedById,
        proposedAt: new Date().toISOString(),
        status: 'Proposed',
        fitSummary: candidate.fitSummary,
        availabilityPercent: candidate.availabilityPercent ?? 100,
        warnings: candidate.warnings ?? [],
        sharedProfileId: candidate.sharedProfileId,
      }

      candidateProposals.push(proposal)
      return proposal
    })

    const resourcingRequest = resourcingRequests.find((item) => item.id === body.requestId)

    if (resourcingRequest) {
      resourcingRequest.status = 'Candidates Proposed'
      resourcingRequest.updatedAt = new Date().toISOString()
    }

    return HttpResponse.json(created, { status: 201 })
  }),
  http.patch('/api/candidate-proposals/:id', async ({ params, request }) => {
    const proposal = candidateProposals.find((item) => item.id === params.id)

    if (!proposal) {
      return HttpResponse.json({ message: 'Proposal not found' }, { status: 404 })
    }

    const body = (await request.json()) as PatchCandidateProposalBody
    const resourcingRequest = resourcingRequests.find((item) => item.id === proposal.requestId)

    proposal.status = body.status
    proposal.reviewedById = body.reviewedById
    proposal.reviewedAt = new Date().toISOString()

    if (body.status === 'Approved') {
      proposal.feedback = body.feedback
      createAssignmentHistoryRecord(proposal, 'Approved', body.reviewedById, body.feedback)

      if (resourcingRequest) {
        resourcingRequest.status = 'Approved'
        resourcingRequest.updatedAt = new Date().toISOString()
      }

      candidateProposals
        .filter(
          (item) =>
            item.requestId === proposal.requestId &&
            item.id !== proposal.id &&
            item.status === 'Proposed',
        )
        .forEach((item) => {
          item.status = 'Rejected'
          item.reviewedById = body.reviewedById
          item.reviewedAt = new Date().toISOString()
          item.rejectionReason = 'Another candidate was approved for this request.'
          createAssignmentHistoryRecord(item, 'Rejected', body.reviewedById, item.rejectionReason)
        })
    }

    if (body.status === 'Rejected') {
      proposal.rejectionReason = body.rejectionReason
      createAssignmentHistoryRecord(proposal, 'Rejected', body.reviewedById, body.rejectionReason)

      const remainingProposed = candidateProposals.filter(
        (item) => item.requestId === proposal.requestId && item.status === 'Proposed',
      )

      if (remainingProposed.length === 0 && resourcingRequest?.status !== 'Approved') {
        const hasApproved = candidateProposals.some(
          (item) => item.requestId === proposal.requestId && item.status === 'Approved',
        )

        if (!hasApproved && resourcingRequest) {
          resourcingRequest.status = 'Rejected'
          resourcingRequest.updatedAt = new Date().toISOString()
        }
      }
    }

    if (body.status === 'Withdrawn') {
      createAssignmentHistoryRecord(proposal, 'Withdrawn', body.reviewedById)
    }

    return HttpResponse.json(proposal)
  }),
  http.post('/api/shared-profiles', async ({ request }) => {
    const body = (await request.json()) as CreateSharedProfileBody
    const nextIndex = sharedProfiles.length + 1
    const token = `shared-token-${String(nextIndex).padStart(4, '0')}-${body.personId}`

    const profile: SharedProfile = {
      id: `shared-profile-${String(nextIndex).padStart(4, '0')}`,
      personId: body.personId,
      createdById: body.createdById,
      allowedSections: body.allowedSections,
      token,
      isActive: true,
    }

    sharedProfiles.push(profile)

    return HttpResponse.json(profile, { status: 201 })
  }),
  http.get('/api/shared-profiles/:token', ({ params }) => {
    const profile = sharedProfiles.find((item) => item.token === params.token && item.isActive)

    if (!profile) {
      return HttpResponse.json({ message: 'Shared profile not found' }, { status: 404 })
    }

    const view = buildSharedProfileView(profile)

    if (!view) {
      return HttpResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    return HttpResponse.json(view)
  }),
]
