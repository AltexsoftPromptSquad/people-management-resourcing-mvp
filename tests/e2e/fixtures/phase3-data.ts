import {
  getDashboardPagePath,
  getEmployeeProfilePagePath,
  getMyProfilePagePath,
  getResourcingRequestsPagePath,
  getSubordinatesPagePath,
} from '../../../src/app/routes'
import { actionItems } from '../../../src/mocks/data/action-items'
import { assignmentHistory } from '../../../src/mocks/data/assignment-history'
import { documents } from '../../../src/mocks/data/documents'
import { feedbacks } from '../../../src/mocks/data/feedbacks'
import { idpRecords } from '../../../src/mocks/data/idp'
import { people } from '../../../src/mocks/data/people'
import { personas } from '../../../src/mocks/data/personas'
import { projectHistory } from '../../../src/mocks/data/project-history'
import { risks } from '../../../src/mocks/data/risks'
import { scheduledLeaves } from '../../../src/mocks/data/scheduled-leaves'
import { skills } from '../../../src/mocks/data/skills'
import { units } from '../../../src/mocks/data/units'

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

const unitManagerPerson = ensure(
  people.find((person) => person.id === unitManagerPersona.personId),
  'Missing unit manager person',
)

const employeeUnit = ensure(
  units.find((unit) => unit.id === employeePerson.unitId),
  'Missing employee unit',
)

export const phase3Routes = {
  dashboard: getDashboardPagePath(),
  subordinates: getSubordinatesPagePath(),
  profile: getEmployeeProfilePagePath(employeePerson.id),
  profileForUnknownId: getEmployeeProfilePagePath('person-does-not-exist-999'),
  unitManagerProfile: getEmployeeProfilePagePath(unitManagerPerson.id),
  myProfile: getMyProfilePagePath(),
  dmLanding: getResourcingRequestsPagePath(),
  unknown: '/phase-3-unknown-route',
} as const

export const phase3Roles = {
  unitManager: {
    label: 'Unit Manager',
    route: phase3Routes.dashboard,
    heading: 'Manager Dashboard',
    personaName: unitManagerPersona.displayName,
    navLabel: 'Dashboard',
  },
  deliveryManager: {
    label: 'Sales / Delivery Manager',
    route: phase3Routes.dmLanding,
    heading: 'My Requests',
    personaName: deliveryManagerPersona.displayName,
    navLabel: 'Resourcing Requests',
  },
  employee: {
    label: 'Employee',
    route: phase3Routes.myProfile,
    heading: 'My Profile',
    personaName: employeePersona.displayName,
    navLabel: 'My Profile',
  },
} as const

const feedbacksForEmployee = feedbacks
  .filter((item) => item.personId === employeePerson.id)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

const actionItemsForEmployee = actionItems.filter((item) => item.personId === employeePerson.id)
const actionItemsAssignedToEmployee = actionItems.filter(
  (item) => item.assigneeId === employeePerson.id,
)

export const phase3Baselines = {
  unitManagerPersona,
  deliveryManagerPersona,
  employeePersona,
  employeePerson,
  unitManagerPerson,
  employeeUnitName: employeeUnit.name,
  employeeManagerName: `${unitManagerPerson.firstName} ${unitManagerPerson.lastName}`,
  employeeFullName: `${employeePerson.firstName} ${employeePerson.lastName}`,
  expectedTabLabels: [
    'Overview',
    'Job and Skills',
    'Risks and Action Items',
    'Feedbacks',
    'Resourcing History',
    'Project History',
    'Documents and IDP',
  ] as const,
  feedbacksForEmployee,
  scheduledLeavesForEmployee: scheduledLeaves.filter((item) => item.personId === employeePerson.id),
  risksForEmployee: risks.filter((item) => item.personId === employeePerson.id),
  actionItemsForEmployee,
  openActionItemsForEmployee: actionItemsForEmployee.filter((item) => item.status !== 'Done'),
  actionItemsAssignedToEmployee,
  documentsForEmployee: documents.filter((item) => item.personId === employeePerson.id),
  employeeVisibleDocumentsForEmployee: documents.filter(
    (item) => item.personId === employeePerson.id && item.visibility === 'Employee Visible',
  ),
  idpRecordForEmployee: ensure(
    idpRecords.find((item) => item.personId === employeePerson.id),
    'Missing employee IDP',
  ),
  skillsForEmployee: skills.filter((item) => item.personId === employeePerson.id),
  projectHistoryForEmployee: projectHistory.filter((item) => item.personId === employeePerson.id),
  assignmentHistoryForEmployee: assignmentHistory.filter(
    (item) => item.employeeId === employeePerson.id,
  ),
} as const

export const getProfilePathFor = (personId: string) => getEmployeeProfilePagePath(personId)

export type FetchOverrideRule = {
  /** Substring matched against the request URL. */
  urlIncludes: string
  /** Restrict the rule to a specific HTTP method (defaults to matching any method). */
  method?: 'GET' | 'POST' | 'PATCH'
  /** Milliseconds to delay before resolving with the real response. */
  delayMs?: number
  /** When set, short-circuits with this JSON body/status instead of hitting the network. */
  respondWith?: { status: number; body: unknown }
}

/**
 * Browser-side `window.fetch` override so a specific mock endpoint can be slowed down or forced
 * to fail/return an empty payload. Pass to `page.addInitScript(overrideFetch, rules)` before
 * navigation. MSW's service worker sits below `window.fetch`, so `page.route` cannot reliably
 * intercept these requests — this mirrors the pattern used across the Phase 1/2 e2e suites.
 */
export const overrideFetch = (rules: FetchOverrideRule[]) => {
  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input, init) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    const method = (init?.method ?? 'GET').toUpperCase()
    const rule = rules.find((candidate) => {
      if (candidate.method && candidate.method !== method) {
        return false
      }

      const matchIndex = url.indexOf(candidate.urlIncludes)
      if (matchIndex === -1) {
        return false
      }

      // Treat the match as a path boundary so a rule for `/api/people/{id}` does not also match
      // nested resources such as `/api/people/{id}/risks`. The character immediately after the
      // match must terminate the path (end of string) or start the query string. A rule that
      // needs a deeper segment should include that segment in `urlIncludes` (e.g. `/risks`).
      const nextChar = url[matchIndex + candidate.urlIncludes.length]
      return nextChar === undefined || nextChar === '?'
    })

    if (rule) {
      if (rule.delayMs) {
        await new Promise((resolve) => setTimeout(resolve, rule.delayMs))
      }

      if (rule.respondWith) {
        return new Response(JSON.stringify(rule.respondWith.body), {
          status: rule.respondWith.status,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    return originalFetch(input, init)
  }
}
