import {
  getDashboardPagePath,
  getHomePagePath,
  getMyProfilePagePath,
  getResourcingRequestsPagePath,
} from '../../../src/app/routes'
import { people } from '../../../src/mocks/data/people'
import { personas } from '../../../src/mocks/data/personas'
import { resourcingRequests } from '../../../src/mocks/data/resourcing-requests'
import { skills } from '../../../src/mocks/data/skills'
import { units } from '../../../src/mocks/data/units'
import type { Persona } from '../../../src/types/persona'
import type { Role } from '../../../src/types/role'

const roleButtonLabels: Record<Role, string> = {
  'unit-manager': 'Unit Manager',
  'delivery-manager': 'Sales / Delivery Manager',
  employee: 'Employee',
}

const roleHeadings: Record<Role, string> = {
  'unit-manager': 'Manager Dashboard',
  'delivery-manager': 'My Requests',
  employee: 'My Profile',
}

const roleNavLabels: Record<Role, string> = {
  'unit-manager': 'Dashboard',
  'delivery-manager': 'Resourcing Requests',
  employee: 'My Profile',
}

const roleRoutes: Record<Role, string> = {
  'unit-manager': getDashboardPagePath(),
  'delivery-manager': getResourcingRequestsPagePath(),
  employee: getMyProfilePagePath(),
}

const getPersonaByRole = (role: Role): Persona => {
  const persona = personas.find((candidate) => candidate.role === role)

  if (!persona) {
    throw new Error(`Missing persona baseline for role: ${role}`)
  }

  return persona
}

const unitManagerPersona = getPersonaByRole('unit-manager')
const deliveryManagerPersona = getPersonaByRole('delivery-manager')
const employeePersona = getPersonaByRole('employee')

export const phase1Routes = {
  root: getHomePagePath(),
  dashboard: getDashboardPagePath(),
  resourcingRequests: getResourcingRequestsPagePath(),
  myProfile: getMyProfilePagePath(),
  unknown: '/this-route-does-not-exist',
} as const

export const phase1Roles = {
  unitManager: {
    label: roleButtonLabels['unit-manager'],
    route: roleRoutes['unit-manager'],
    heading: roleHeadings['unit-manager'],
    personaName: unitManagerPersona.displayName,
    navLabel: roleNavLabels['unit-manager'],
    personaId: unitManagerPersona.id,
  },
  deliveryManager: {
    label: roleButtonLabels['delivery-manager'],
    route: roleRoutes['delivery-manager'],
    heading: roleHeadings['delivery-manager'],
    personaName: deliveryManagerPersona.displayName,
    navLabel: roleNavLabels['delivery-manager'],
    personaId: deliveryManagerPersona.id,
  },
  employee: {
    label: roleButtonLabels.employee,
    route: roleRoutes.employee,
    heading: roleHeadings.employee,
    personaName: employeePersona.displayName,
    navLabel: roleNavLabels.employee,
    personaId: employeePersona.id,
  },
} as const

export const endpointRecordCounts = {
  personas: personas.length,
  people: people.length,
  units: units.length,
  skills: skills.length,
  resourcingRequests: resourcingRequests.length,
} as const
