import { actionItems } from '../data/action-items'
import { people } from '../data/people'
import { resourcingRequests } from '../data/resourcing-requests'
import { risks } from '../data/risks'
import type { DashboardActionItem } from '@/types/action-item'
import type { DashboardSummary } from '@/types/dashboard'
import type {
  SubordinateListItem,
  SubordinatesFilter,
  SubordinatesSort,
} from '@/types/subordinates-query'

const normalizeString = (value: string) => value.trim().toLowerCase()

export const getSubordinatesForManager = (
  managerId: string,
  filter: SubordinatesFilter,
  sort: SubordinatesSort,
): SubordinateListItem[] => {
  const normalizedSearch = filter.search ? normalizeString(filter.search) : ''

  const filteredSubordinates = people
    .filter((person) => person.managerId === managerId)
    .filter((person) => !filter.position || person.position === filter.position)
    .filter((person) => !filter.grade || person.grade === filter.grade)
    .filter(
      (person) => !filter.currentStatus || person.currentProjectStatus === filter.currentStatus,
    )
    .filter((person) => !filter.riskLevel || person.riskLevel === filter.riskLevel)
    .filter((person) => {
      if (!normalizedSearch) {
        return true
      }

      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase()
      return fullName.includes(normalizedSearch)
    })
    .map((person) => ({
      id: person.id,
      fullName: `${person.firstName} ${person.lastName}`,
      position: person.position,
      grade: person.grade,
      currentStatus: person.currentProjectStatus,
      riskLevel: person.riskLevel,
      unitId: person.unitId,
      managerId,
    }))

  return [...filteredSubordinates].sort((left, right) => {
    const leftValue = left[sort.field]
    const rightValue = right[sort.field]
    const comparison = leftValue.localeCompare(rightValue)

    return sort.direction === 'asc' ? comparison : comparison * -1
  })
}

export const getDashboardSummaryForManager = (managerId: string): DashboardSummary => {
  const subordinateIds = new Set(
    people.filter((person) => person.managerId === managerId).map((person) => person.id),
  )

  const activeRisksCount = risks.filter(
    (risk) => risk.managerId === managerId && risk.isActive && risk.level !== 'None',
  ).length

  const openActionItemsCount = actionItems.filter(
    (actionItem) => actionItem.managerId === managerId && actionItem.status !== 'Done',
  ).length

  const activeResourcingRequestsCount = resourcingRequests.filter(
    (request) =>
      request.assignedUnitManagerId === managerId &&
      !['Closed', 'Cancelled', 'Rejected'].includes(request.status),
  ).length

  return {
    subordinateCount: subordinateIds.size,
    activeRisksCount,
    openActionItemsCount,
    activeResourcingRequestsCount,
  }
}

export const getDashboardActionItemsForManager = (managerId: string): DashboardActionItem[] => {
  const now = new Date()

  return actionItems
    .filter((actionItem) => actionItem.managerId === managerId && actionItem.status !== 'Done')
    .map((actionItem) => {
      const dueDate = new Date(actionItem.dueDate)
      const isOverdue = dueDate.getTime() < now.getTime()

      return {
        id: actionItem.id,
        title: actionItem.title,
        assigneeName: actionItem.assigneeName,
        dueDate: actionItem.dueDate,
        priority: actionItem.priority,
        status: actionItem.status,
        isOverdue,
      }
    })
    .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime())
}
