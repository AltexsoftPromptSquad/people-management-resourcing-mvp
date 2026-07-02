import type { IdpRecord } from '@/types/idp'

export const idpRecords: IdpRecord[] = [
  {
    id: 'idp-001',
    personId: 'person-employee-001',
    documentReference: 'IDP-2026-001',
    status: 'In Progress',
    lastUpdatedAt: '2026-06-28T12:00:00.000Z',
  },
  {
    id: 'idp-002',
    personId: 'person-um-001',
    documentReference: 'IDP-2026-010',
    status: 'Completed',
    lastUpdatedAt: '2026-05-30T10:00:00.000Z',
  },
  {
    id: 'idp-003',
    personId: 'person-dm-001',
    documentReference: 'IDP-2026-021',
    status: 'Not Started',
    lastUpdatedAt: '2026-04-10T09:30:00.000Z',
  },
]
