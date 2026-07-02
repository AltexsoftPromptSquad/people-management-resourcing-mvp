import {
  getEmployeeProfilePagePath,
  getMyProfilePagePath,
  getResourcingRequestsPagePath,
  getSubordinatesPagePath,
} from '../../../src/app/routes'
import { actionItems } from '../../../src/mocks/data/action-items'
import { documents } from '../../../src/mocks/data/documents'
import { feedbacks } from '../../../src/mocks/data/feedbacks'
import { idpRecords } from '../../../src/mocks/data/idp'
import { people } from '../../../src/mocks/data/people'
import { personas } from '../../../src/mocks/data/personas'
import { scheduledLeaves } from '../../../src/mocks/data/scheduled-leaves'

const ensure = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) {
    throw new Error(message)
  }

  return value
}

const unitManagerPersona = ensure(
  personas.find((persona) => persona.role === 'unit-manager'),
  'Missing unit manager persona',
)

const deliveryManagerPersona = ensure(
  personas.find((persona) => persona.role === 'delivery-manager'),
  'Missing delivery manager persona',
)

const employeePersona = ensure(
  personas.find((persona) => persona.role === 'employee'),
  'Missing employee persona',
)

const employeePerson = ensure(
  people.find((person) => person.id === employeePersona.personId),
  'Missing employee person',
)

export const phase3Routes = {
  subordinates: getSubordinatesPagePath(),
  profile: getEmployeeProfilePagePath(employeePerson.id),
  myProfile: getMyProfilePagePath(),
  dmLanding: getResourcingRequestsPagePath(),
} as const

export const phase3Baselines = {
  unitManagerPersona,
  deliveryManagerPersona,
  employeePersona,
  employeePerson,
  expectedTabLabels: [
    'Overview',
    'Job and Skills',
    'Risks and Action Items',
    'Feedbacks',
    'Resourcing History',
    'Project History',
    'Documents and IDP',
  ],
  feedbackCount: feedbacks.filter((item) => item.personId === employeePerson.id).length,
  scheduledLeavesCount: scheduledLeaves.filter((item) => item.personId === employeePerson.id)
    .length,
  actionItemsCount: actionItems.filter((item) => item.personId === employeePerson.id).length,
  actionItemsAssignedToEmployee: actionItems.filter((item) => item.assigneeId === employeePerson.id)
    .length,
  documentsCount: documents.filter((item) => item.personId === employeePerson.id).length,
  employeeVisibleDocumentsCount: documents.filter(
    (item) => item.personId === employeePerson.id && item.visibility === 'Employee Visible',
  ).length,
  idpRecord: ensure(
    idpRecords.find((item) => item.personId === employeePerson.id),
    'Missing employee IDP',
  ),
} as const
