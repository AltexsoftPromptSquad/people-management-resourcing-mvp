import {
  getResourcingIncomingPagePath,
  getResourcingRequestsPagePath,
  getSharedProfilePagePath,
} from '../../../src/app/routes'
import { candidateProposals } from '../../../src/mocks/data/candidate-proposals'
import { personas } from '../../../src/mocks/data/personas'
import { resourcingRequests } from '../../../src/mocks/data/resourcing-requests'
import { sharedProfiles } from '../../../src/mocks/data/shared-profiles'

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

export const phase4Routes = {
  dmRequests: getResourcingRequestsPagePath(),
  umIncoming: getResourcingIncomingPagePath(),
  sharedProfile: getSharedProfilePagePath(
    ensure(sharedProfiles[0], 'Missing shared profile seed').token,
  ),
} as const

export const phase4Baselines = {
  dmPersona: deliveryManagerPersona,
  umPersona: unitManagerPersona,
  submittedRequest: ensure(
    resourcingRequests.find((request) => request.id === 'request-001'),
    'Missing request-001',
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
} as const
