import { actionItems } from '../data/action-items'
import { people } from '../data/people'
import { resourcingRequests } from '../data/resourcing-requests'
import { risks } from '../data/risks'
import { units } from '../data/units'
import type { DashboardActionItem, DashboardSummary } from '@/types/dashboard'
import type {
  SubordinateListItem,
  SubordinatesFilter,
  SubordinatesSort,
} from '@/types/subordinates-query'

const activeRequestStatuses = new Set(['Submitted', 'In Review', 'Candidates Proposed'])

export const getManagerUnitId = (managerId: string): string | undefined => {
  return units.find((unit) => unit.managerId === managerId)?.id
}

export const getSubordinatesForManager = (managerId: string): SubordinateListItem[] => {
  const unitId = getManagerUnitId(managerId)

  if (!unitId) {
    return []
  }

  return people
    .filter((person) => person.unitId === unitId && person.id !== managerId)
    .map((person) => ({
      id: person.id,
      fullName: `${person.firstName} ${person.lastName}`,
      position: person.position,
      grade: person.grade,
      currentStatus: person.currentProjectStatus,
      riskLevel: person.riskLevel,
      unitId: person.unitId,
      managerId: person.managerId ?? managerId,
    }))
}

export const getDashboardSummary = (managerId: string): DashboardSummary => {
  const subordinates = getSubordinatesForManager(managerId)
  const subordinateIds = new Set(subordinates.map((person) => person.id))

  const activeRisksCount = risks.filter(
    (risk) =>
      subordinateIds.has(risk.personId) && (risk.status === 'Open' || risk.status === 'Monitoring'),
  ).length

  const openActionItemsCount = actionItems.filter(
    (item) =>
      subordinateIds.has(item.personId) &&
      (item.status === 'Open' || item.status === 'In Progress'),
  ).length

  const activeResourcingRequestsCount = resourcingRequests.filter(
    (request) =>
      request.assignedUnitManagerId === managerId && activeRequestStatuses.has(request.status),
  ).length

  return {
    subordinateCount: subordinates.length,
    activeRisksCount,
    openActionItemsCount,
    activeResourcingRequestsCount,
  }
}

export const getDashboardActionItems = (managerId: string): DashboardActionItem[] => {
  const now = Date.now()

  return actionItems
    .filter(
      (item) =>
        item.ownerId === managerId && (item.status === 'Open' || item.status === 'In Progress'),
    )
    .map((item) => {
      const assignee = people.find((person) => person.id === item.assigneeId)

      return {
        id: item.id,
        title: item.title,
        assigneeName: assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unassigned',
        dueDate: item.dueDate,
        priority: item.priority,
        status: item.status,
        isOverdue: new Date(item.dueDate).getTime() < now,
      }
    })
    .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime())
}

const compareValues = (left: string, right: string, direction: SubordinatesSort['direction']) => {
  const result = left.localeCompare(right, undefined, { sensitivity: 'base' })

  return direction === 'asc' ? result : -result
}

export const getFilteredSubordinates = (
  managerId: string,
  filter: SubordinatesFilter,
  sort: SubordinatesSort,
): SubordinateListItem[] => {
  let results = getSubordinatesForManager(managerId)

  if (filter.search) {
    const search = filter.search.toLowerCase()
    results = results.filter((person) => person.fullName.toLowerCase().includes(search))
  }

  if (filter.position) {
    results = results.filter((person) => person.position === filter.position)
  }

  if (filter.grade) {
    results = results.filter((person) => person.grade === filter.grade)
  }

  if (filter.currentStatus) {
    results = results.filter((person) => person.currentStatus === filter.currentStatus)
  }

  if (filter.riskLevel) {
    results = results.filter((person) => person.riskLevel === filter.riskLevel)
  }

  return [...results].sort((left, right) =>
    compareValues(left[sort.field], right[sort.field], sort.direction),
  )
}
