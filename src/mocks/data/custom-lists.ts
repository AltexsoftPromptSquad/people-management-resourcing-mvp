import type { CustomList } from '@/types/custom-list'

export const customLists: CustomList[] = [
  {
    id: 'list-bench-001',
    name: 'Bench',
    ownerManagerId: 'person-um-001',
    sharedWithManagerIds: [],
    employeeFilter: {
      currentProjectStatus: 'Bench',
    },
    fieldConfigs: [
      { customFieldId: 'field-bench-status-001', usage: 'both' },
      { customFieldId: 'field-bench-readiness-002', usage: 'column' },
    ],
    defaultSort: {
      field: 'lastName',
      direction: 'asc',
    },
  },
  {
    id: 'list-booked-001',
    name: 'Booked',
    ownerManagerId: 'person-um-001',
    sharedWithManagerIds: [],
    employeeFilter: {
      currentProjectStatus: 'Booked',
    },
    fieldConfigs: [{ customFieldId: 'field-booking-notes-004', usage: 'column' }],
    defaultSort: {
      field: 'lastName',
      direction: 'asc',
    },
  },
  {
    id: 'list-needs-conversation-001',
    name: 'Needs Conversation',
    ownerManagerId: 'person-um-001',
    sharedWithManagerIds: [],
    employeeFilter: {
      lastConversationOlderThanDays: '30',
    },
    fieldConfigs: [{ customFieldId: 'field-last-conversation-003', usage: 'both' }],
    defaultSort: {
      field: 'lastName',
      direction: 'asc',
    },
  },
]
