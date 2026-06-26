import { faker } from '@faker-js/faker'
import type { ActionItem, ActionItemStatus } from '@/types/action-item'
import type { ResourcingRequestPriority } from '@/types/resourcing-request'

const actionItemStatuses: ActionItemStatus[] = ['Open', 'In Progress', 'Done', 'Blocked']
const priorities: ResourcingRequestPriority[] = ['Low', 'Medium', 'High', 'Urgent']

type CreateActionItemParams = {
  index: number
  managerId: string
  assigneePersonId: string
  assigneeName: string
}

export const createActionItem = ({
  index,
  managerId,
  assigneePersonId,
  assigneeName,
}: CreateActionItemParams): ActionItem => {
  const dueDate = faker.date.soon({ days: 30 }).toISOString()

  return {
    id: `action-item-generated-${String(index).padStart(4, '0')}`,
    title: faker.helpers.arrayElement([
      'Update project allocation forecast',
      'Review staffing risks before sprint planning',
      'Validate bench utilization for next month',
      'Confirm candidate interview panel availability',
      'Align delivery plan with project dependencies',
    ]),
    assigneePersonId,
    assigneeName,
    managerId,
    dueDate,
    priority: faker.helpers.arrayElement(priorities),
    status: faker.helpers.arrayElement(actionItemStatuses),
  }
}
