import { apiGet } from '@/lib/api/api-client'
import type { AssignmentHistoryItem } from '@/types/assignment-history'

export const getPersonAssignmentHistory = (personId: string) =>
  apiGet<AssignmentHistoryItem[]>(`/api/people/${personId}/assignment-history`)
