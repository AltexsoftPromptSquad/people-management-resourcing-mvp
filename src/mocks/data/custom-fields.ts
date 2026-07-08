import type { CustomField } from '@/types/custom-field'

export const customFields: CustomField[] = [
  {
    id: 'field-bench-status-001',
    name: 'Bench Status',
    type: 'Single Select',
    options: ['Available', 'Interviewing', 'On Hold'],
    createdByManagerId: 'person-um-001',
    isSensitive: false,
    isActive: true,
  },
  {
    id: 'field-bench-readiness-002',
    name: 'Bench Readiness',
    type: 'Boolean',
    createdByManagerId: 'person-um-001',
    isSensitive: false,
    isActive: true,
  },
  {
    id: 'field-last-conversation-003',
    name: 'Last Conversation Date',
    type: 'Date',
    createdByManagerId: 'person-um-001',
    isSensitive: true,
    isActive: true,
  },
  {
    id: 'field-booking-notes-004',
    name: 'Booking Notes',
    type: 'Text',
    createdByManagerId: 'person-um-001',
    isSensitive: true,
    isActive: true,
  },
]
