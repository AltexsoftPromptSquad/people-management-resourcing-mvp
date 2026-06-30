import { faker } from '@faker-js/faker'
import type { ActionItem, ActionItemPriority, ActionItemStatus } from '@/types/action-item'

const priorities: ActionItemPriority[] = ['Low', 'Medium', 'High', 'Urgent']
const statuses: ActionItemStatus[] = ['Open', 'In Progress', 'Done', 'Blocked']

type CreateActionItemParams = {
  index: number
  personId: string
  ownerId: string
  assigneeId: string
  dueDate: string
  status?: ActionItemStatus
}

export const createActionItem = ({
  index,
  personId,
  ownerId,
  assigneeId,
  dueDate,
  status,
}: CreateActionItemParams): ActionItem => ({
  id: `action-item-${String(index).padStart(3, '0')}`,
  personId,
  title: faker.helpers.arrayElement([
    'Schedule 1:1 follow-up',
    'Review IDP progress',
    'Confirm project allocation',
    'Discuss career development',
    'Prepare performance notes',
    'Coordinate bench transition',
  ]),
  description: faker.lorem.sentence(),
  assigneeId,
  ownerId,
  dueDate,
  priority: faker.helpers.arrayElement(priorities),
  status: status ?? faker.helpers.arrayElement(statuses),
})
