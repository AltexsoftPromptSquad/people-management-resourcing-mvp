import {
  getResourcingIncomingPagePath,
  getResourcingRequestsPagePath,
  getSharedProfilePagePath,
} from '../../../src/app/routes'
import { candidateProposals } from '../../../src/mocks/data/candidate-proposals'
import { people } from '../../../src/mocks/data/people'
import { personas } from '../../../src/mocks/data/personas'
import { resourcingRequests } from '../../../src/mocks/data/resourcing-requests'
import { scheduledLeaves } from '../../../src/mocks/data/scheduled-leaves'
import { sharedProfiles } from '../../../src/mocks/data/shared-profiles'
import type { FetchOverrideRule } from './phase3-data'

export type { FetchOverrideRule }
export { overrideFetch } from './phase3-data'

const ensure = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) {
    throw new Error(message)
  }

  return value
}

const deliveryManagerPersona = ensure(
  personas.find((persona) => persona.role === 'delivery-manager'),
  'Missing delivery manager persona',
)

const unitManagerPersona = ensure(
  personas.find((persona) => persona.role === 'unit-manager'),
  'Missing unit manager persona',
)

const employeePersona = ensure(
  personas.find((persona) => persona.role === 'employee'),
  'Missing employee persona',
)

const employeePerson = ensure(
  people.find((person) => person.id === employeePersona.personId),
  'Missing employee person',
)

const seededSharedProfile = ensure(sharedProfiles[0], 'Missing shared profile seed')

export const phase4Routes = {
  dmRequests: getResourcingRequestsPagePath(),
  umIncoming: getResourcingIncomingPagePath(),
  sharedProfile: getSharedProfilePagePath(seededSharedProfile.token),
  invalidSharedProfile: getSharedProfilePagePath('non-existent-token-abc123'),
} as const

export const phase4Baselines = {
  dmPersona: deliveryManagerPersona,
  umPersona: unitManagerPersona,
  employeePersona,
  employeePerson,
  seededSharedProfile,
  submittedRequest: ensure(
    resourcingRequests.find((request) => request.id === 'request-001'),
    'Missing request-001',
  ),
  inReviewRequest: ensure(
    resourcingRequests.find((request) => request.id === 'request-002'),
    'Missing request-002',
  ),
  candidatesProposedRequest: ensure(
    resourcingRequests.find((request) => request.id === 'request-003'),
    'Missing request-003',
  ),
  draftRequest: ensure(
    resourcingRequests.find((request) => request.id === 'request-004'),
    'Missing request-004',
  ),
  seededProposals: candidateProposals.filter((proposal) => proposal.requestId === 'request-003'),
  internalProposal: ensure(
    candidateProposals.find(
      (proposal) => proposal.requestId === 'request-003' && proposal.candidateType === 'Internal',
    ),
    'Missing internal proposal for request-003',
  ),
  externalProposal: ensure(
    candidateProposals.find(
      (proposal) => proposal.requestId === 'request-003' && proposal.candidateType === 'External',
    ),
    'Missing external proposal for request-003',
  ),
  /** person-employee-001 has leave-001 that overlaps request-001 period (2026-07-10 – 2026-11-10) */
  employeeLeaveOverlap: ensure(
    scheduledLeaves.find(
      (leave) =>
        leave.personId === 'person-employee-001' &&
        leave.startDate >= '2026-07-10' &&
        leave.startDate <= '2026-11-10',
    ),
    'Missing leave overlapping request-001 period for person-employee-001',
  ),
  /** person-generated-001 has a seeded shared profile and allocation warning */
  allocationWarningCandidate: ensure(
    candidateProposals.find(
      (p) => p.requestId === 'request-003' && p.warnings?.includes('allocation'),
    ),
    'Missing candidate proposal with allocation warning',
  ),
} as const
