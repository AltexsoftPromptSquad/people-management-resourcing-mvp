import {
  getCustomListsPagePath,
  getDashboardPagePath,
  getEmployeeProfilePagePath,
  getHomePagePath,
  getMyProfilePagePath,
  getResourcingIncomingPagePath,
  getResourcingRequestsPagePath,
  getRisksPagePath,
  getSubordinatesPagePath,
} from '../../../src/app/routes'
import { people } from '../../../src/mocks/data/people'
import { personas } from '../../../src/mocks/data/personas'
import { resourcingRequests } from '../../../src/mocks/data/resourcing-requests'
import { risks } from '../../../src/mocks/data/risks'
import { actionItems } from '../../../src/mocks/data/action-items'
import { feedbacks } from '../../../src/mocks/data/feedbacks'
import { scheduledLeaves } from '../../../src/mocks/data/scheduled-leaves'
import { projectHistory } from '../../../src/mocks/data/project-history'
import { assignmentHistory } from '../../../src/mocks/data/assignment-history'
import { units } from '../../../src/mocks/data/units'
import {
  getDashboardActionItems,
  getDashboardSummary,
  getSubordinatesForManager,
} from '../../../src/mocks/services/manager-data-service'
import type { CurrentProjectStatus, RiskLevel } from '../../../src/types/person'
import type { Role } from '../../../src/types/role'

const ensure = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) {
    throw new Error(message)
  }

  return value
}

const roleButtonLabels: Record<Role, string> = {
  'unit-manager': 'Unit Manager',
  'delivery-manager': 'Sales / Delivery Manager',
  employee: 'Employee',
}

const roleHeadings: Record<Role, string> = {
  'unit-manager': 'Manager Dashboard',
  'delivery-manager': 'Resourcing Requests',
  employee: 'My Profile',
}

const roleNavLabels: Record<Role, string> = {
  'unit-manager': 'Dashboard',
  'delivery-manager': 'Resourcing Requests',
  employee: 'My Profile',
}

const getPersonaByRole = (role: Role) =>
  ensure(
    personas.find((persona) => persona.role === role),
    `Missing persona for role ${role}`,
  )

const unitManagerPersona = getPersonaByRole('unit-manager')
const deliveryManagerPersona = getPersonaByRole('delivery-manager')
const employeePersona = getPersonaByRole('employee')

const managerId = 'person-um-001'
const managerSubordinates = getSubordinatesForManager(managerId)
const dashboardSummary = getDashboardSummary(managerId)
const dashboardActionItems = getDashboardActionItems(managerId)
const primarySubordinate = ensure(managerSubordinates[0], 'Expected at least one subordinate')

const filterRiskLevel: RiskLevel =
  managerSubordinates.find((item) => item.riskLevel === 'High')?.riskLevel ??
  managerSubordinates.find((item) => item.riskLevel === 'Critical')?.riskLevel ??
  primarySubordinate.riskLevel

const filterCurrentStatus: CurrentProjectStatus =
  managerSubordinates.find((item) => item.currentStatus === 'Bench')?.currentStatus ??
  managerSubordinates.find((item) => item.currentStatus === 'Allocated')?.currentStatus ??
  primarySubordinate.currentStatus

const filterPosition =
  managerSubordinates.find((item) => item.position)?.position ?? primarySubordinate.position
const filterGrade =
  managerSubordinates.find((item) => item.grade)?.grade ?? primarySubordinate.grade

const searchToken = primarySubordinate.fullName.split(' ')[0] ?? primarySubordinate.fullName

const activeRequestStatuses = new Set(['Submitted', 'In Review', 'Candidates Proposed'])

export const phase2Routes = {
  root: getHomePagePath(),
  dashboard: getDashboardPagePath(),
  subordinates: getSubordinatesPagePath(),
  customLists: getCustomListsPagePath(),
  resourcingIncoming: getResourcingIncomingPagePath(),
  risks: getRisksPagePath(),
  resourcingRequests: getResourcingRequestsPagePath(),
  myProfile: getMyProfilePagePath(),
  unknown: '/phase-2-unknown-route',
} as const

export const phase2Roles = {
  unitManager: {
    label: roleButtonLabels['unit-manager'],
    route: phase2Routes.dashboard,
    heading: roleHeadings['unit-manager'],
    personaName: unitManagerPersona.displayName,
    navLabel: roleNavLabels['unit-manager'],
    personaId: unitManagerPersona.id,
  },
  deliveryManager: {
    label: roleButtonLabels['delivery-manager'],
    route: phase2Routes.resourcingRequests,
    heading: roleHeadings['delivery-manager'],
    personaName: deliveryManagerPersona.displayName,
    navLabel: roleNavLabels['delivery-manager'],
    personaId: deliveryManagerPersona.id,
  },
  employee: {
    label: roleButtonLabels.employee,
    route: phase2Routes.myProfile,
    heading: roleHeadings.employee,
    personaName: employeePersona.displayName,
    navLabel: roleNavLabels.employee,
    personaId: employeePersona.id,
  },
} as const

export const phase2Baselines = {
  managerId,
  managerUnitId: 'unit-platform',
  managerSubordinates,
  dashboardSummary,
  dashboardActionItems,
  peopleTotal: people.length,
  risksTotal: risks.length,
  actionItemsTotal: actionItems.length,
  resourcingRequestsTotal: resourcingRequests.length,
  activeRequestsForManager: resourcingRequests.filter(
    (item) => item.assignedUnitManagerId === managerId && activeRequestStatuses.has(item.status),
  ).length,
  assignedRequestsForManager: resourcingRequests.filter(
    (item) => item.assignedUnitManagerId === managerId,
  ).length,
  feedbacksForDemoPersonas: {
    um: feedbacks.filter((item) => item.personId === 'person-um-001').length,
    dm: feedbacks.filter((item) => item.personId === 'person-dm-001').length,
    employee: feedbacks.filter((item) => item.personId === 'person-employee-001').length,
  },
  scheduledLeavesForDemoPersonas: {
    um: scheduledLeaves.filter((item) => item.personId === 'person-um-001').length,
    dm: scheduledLeaves.filter((item) => item.personId === 'person-dm-001').length,
    employee: scheduledLeaves.filter((item) => item.personId === 'person-employee-001').length,
  },
  hasLeaveOverlap:
    scheduledLeaves.some(
      (item) => item.personId === 'person-employee-001' && item.startDate <= '2026-08-08',
    ) && scheduledLeaves.some((item) => item.personId === 'person-um-001'),
  hasHighRisk: risks.some((item) => item.level === 'High'),
  hasCriticalRisk: risks.some((item) => item.level === 'Critical'),
  hasPastAndFutureActionDates: (() => {
    const dueTimestamps = actionItems.map((item) => new Date(item.dueDate).getTime())
    return Math.min(...dueTimestamps) < Math.max(...dueTimestamps)
  })(),
  projectHistoryForPerson: projectHistory.filter((item) => item.personId === 'person-employee-001')
    .length,
  assignmentHistoryForPerson: assignmentHistory.filter(
    (item) => item.employeeId === 'person-employee-001',
  ).length,
  filterValues: {
    riskLevel: filterRiskLevel,
    currentStatus: filterCurrentStatus,
    position: filterPosition,
    grade: filterGrade,
    searchToken,
  },
  profileTarget: primarySubordinate,
} as const

export const getProfilePathFor = (personId: string) => getEmployeeProfilePagePath(personId)

export const expectedNavLabelsForUnitManager = ['Dashboard', 'Subordinates'] as const
export const expectedQuickLinkLabels = [
  'Subordinates',
  'Custom Lists',
  'Resourcing',
  'Risks',
] as const

export const phase2EndpointExpectations = {
  unitsTotal: units.length,
  peopleTotal: people.length,
  risksTotal: risks.length,
  actionItemsTotal: actionItems.length,
  resourcingRequestsTotal: resourcingRequests.length,
  managerScopedPeopleTotal: people.filter((item) => item.managerId === managerId).length,
  unitScopedPeopleTotal: people.filter((item) => item.unitId === 'unit-platform').length,
} as const
