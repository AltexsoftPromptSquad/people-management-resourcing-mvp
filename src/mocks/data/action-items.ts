import { createActionItem } from '../factories/action-item-factory'
import { people } from './people'
import type { ActionItem } from '@/types/action-item'

const managerId = 'person-um-001'
const platformPeople = people.filter(
  (person) => person.unitId === 'unit-platform' && person.id !== managerId,
)

const subordinateActionItems: ActionItem[] = platformPeople.slice(0, 24).map((person, index) =>
  createActionItem({
    index: index + 1,
    personId: person.id,
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(Date.now() + (index - 12) * 24 * 60 * 60 * 1000).toISOString(),
    status: index % 5 === 0 ? 'Done' : 'Open',
  }),
)

const managerOwnActionItems: ActionItem[] = [
  createActionItem({
    index: 101,
    personId: platformPeople[0]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
  createActionItem({
    index: 102,
    personId: platformPeople[1]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
  createActionItem({
    index: 103,
    personId: platformPeople[2]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Progress',
  }),
  createActionItem({
    index: 104,
    personId: platformPeople[3]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
  createActionItem({
    index: 105,
    personId: platformPeople[4]?.id ?? 'person-employee-001',
    ownerId: managerId,
    assigneeId: managerId,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
  }),
]

export const actionItems: ActionItem[] = [...subordinateActionItems, ...managerOwnActionItems]
