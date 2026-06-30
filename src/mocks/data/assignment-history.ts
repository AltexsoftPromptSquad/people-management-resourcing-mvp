import { people } from './people'
import type { AssignmentHistoryItem } from '@/types/assignment-history'

const assignmentStatuses: AssignmentHistoryItem['status'][] = ['Approved', 'Rejected', 'Withdrawn']

export const assignmentHistory: AssignmentHistoryItem[] = people
  .slice(0, 90)
  .map((person, index) => ({
    id: `assignment-history-${String(index + 1).padStart(4, '0')}`,
    employeeId: person.id,
    requestId: `request-${String((index % 10) + 1).padStart(3, '0')}`,
    proposalId: `proposal-${String(index + 1).padStart(4, '0')}`,
    status: assignmentStatuses[index % assignmentStatuses.length],
    proposedAt: new Date(Date.UTC(2026, 3, (index % 28) + 1, 9, 0, 0)).toISOString(),
    decisionAt: new Date(Date.UTC(2026, 3, (index % 28) + 2, 10, 0, 0)).toISOString(),
    decisionById: 'person-dm-001',
    feedback:
      index % 3 === 1 ? 'Missing required cloud migration experience for this request.' : undefined,
    convertedToProject: index % 3 === 0,
  }))
