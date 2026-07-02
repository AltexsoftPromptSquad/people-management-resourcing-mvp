import { createActionItem } from '../factories/action-item-factory'
import { people } from './people'
import type { ActionItem } from '@/types/action-item'

const managerId = 'person-um-001'
const platformPeople = people.filter(
  (person) => person.unitId === 'unit-platform' && person.id !== managerId,
)
const baseDueDate = Date.UTC(2026, 6, 15, 9, 0, 0)

const subordinateActionItems: ActionItem[] = platformPeople.slice(0, 26).map((person, index) =>
  createActionItem({
    index: index + 1,
    personId: person.id,
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(baseDueDate + (index - 12) * 24 * 60 * 60 * 1000).toISOString(),
    status: index % 5 === 0 ? 'Done' : 'Open',
  }),
)

const managerOwnActionItems: ActionItem[] = [
  createActionItem({
    index: 101,
    personId: platformPeople[0]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(baseDueDate - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
  createActionItem({
    index: 102,
    personId: platformPeople[1]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(baseDueDate - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
  createActionItem({
    index: 103,
    personId: platformPeople[2]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(baseDueDate + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Progress',
  }),
  createActionItem({
    index: 104,
    personId: platformPeople[3]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(baseDueDate + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
  createActionItem({
    index: 105,
    personId: platformPeople[4]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(baseDueDate + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
]

const employeeSelfServiceActionItems: ActionItem[] = [
  createActionItem({
    index: 201,
    personId: 'person-employee-001',
    ownerId: managerId,
    assigneeId: 'person-employee-001',
    dueDate: new Date(baseDueDate + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
  createActionItem({
    index: 202,
    personId: 'person-employee-001',
    ownerId: managerId,
    assigneeId: 'person-employee-001',
    dueDate: new Date(baseDueDate + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Progress',
  }),
]

export const actionItems: ActionItem[] = [
  ...subordinateActionItems,
  ...managerOwnActionItems,
  ...employeeSelfServiceActionItems,
]
