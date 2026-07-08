import {
  getCustomListsPagePath,
  getResourcingAssignmentsPagePath,
  getResourcingIncomingPagePath,
} from '../../../src/app/routes'

export const phase5Routes = {
  customLists: getCustomListsPagePath(),
  assignments: getResourcingAssignmentsPagePath(),
  incoming: getResourcingIncomingPagePath(),
} as const

export const phase5Baselines = {
  seededListNames: ['Bench', 'Booked', 'Needs Conversation'],
  employeeFullName: 'Nazar Petrenko',
  secondUnitManagerName: 'Ihor Melnyk',
} as const
