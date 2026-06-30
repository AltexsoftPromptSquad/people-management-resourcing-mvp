import type { ScheduledLeave } from '@/types/scheduled-leave'

export const scheduledLeaves: ScheduledLeave[] = [
  {
    id: 'leave-001',
    personId: 'person-employee-001',
    leaveType: 'Annual',
    startDate: '2026-07-18',
    endDate: '2026-07-28',
    status: 'Confirmed',
    notes: 'Summer vacation',
  },
  {
    id: 'leave-002',
    personId: 'person-employee-001',
    leaveType: 'Other',
    startDate: '2026-08-05',
    endDate: '2026-08-08',
    status: 'Tentative',
    notes: 'Conference attendance',
  },
  {
    id: 'leave-003',
    personId: 'person-um-001',
    leaveType: 'Annual',
    startDate: '2026-07-12',
    endDate: '2026-07-19',
    status: 'Confirmed',
  },
  {
    id: 'leave-004',
    personId: 'person-dm-001',
    leaveType: 'Sick',
    startDate: '2026-06-30',
    endDate: '2026-07-03',
    status: 'Confirmed',
  },
]
