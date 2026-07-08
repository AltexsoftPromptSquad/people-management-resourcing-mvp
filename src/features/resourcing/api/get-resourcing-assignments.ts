import { apiGet } from '@/lib/api/api-client'
import type { ResourcingAssignmentRecord } from '@/types/resourcing-assignment'

export const getResourcingAssignments = (managerId: string) =>
  apiGet<ResourcingAssignmentRecord[]>('/api/resourcing/assignments', { managerId })
