import { faker } from '@faker-js/faker'
import { createActionItem } from '../factories/action-item-factory'
import { people } from './people'
import type { ActionItem } from '@/types/action-item'

faker.seed(20260625)

const managerActionItems: ActionItem[] = [
  {
    id: 'action-item-001',
    title: 'Escalate staffing gap for Atlas migration',
    assigneePersonId: 'person-um-001',
    assigneeName: 'Olena Kovalenko',
    managerId: 'person-um-001',
    dueDate: '2026-06-10T09:00:00.000Z',
    priority: 'Urgent',
    status: 'Open',
  },
  {
    id: 'action-item-002',
    title: 'Confirm replacement for critical backend role',
    assigneePersonId: 'person-um-001',
    assigneeName: 'Olena Kovalenko',
    managerId: 'person-um-001',
    dueDate: '2026-06-30T09:00:00.000Z',
    priority: 'High',
    status: 'In Progress',
  },
]

const generatedActionItems: ActionItem[] = people
  .filter((person) => person.managerId)
  .slice(0, 180)
  .map((person, index) =>
    createActionItem({
      index: index + 1,
      managerId: person.managerId ?? 'person-um-001',
      assigneePersonId: person.id,
      assigneeName: `${person.firstName} ${person.lastName}`,
    }),
  )

export const actionItems: ActionItem[] = [...managerActionItems, ...generatedActionItems]
