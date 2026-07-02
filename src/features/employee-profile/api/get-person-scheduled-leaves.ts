import { apiGet } from '@/lib/api/api-client'
import type { ScheduledLeave } from '@/types/scheduled-leave'

export const getPersonScheduledLeaves = (personId: string) =>
  apiGet<ScheduledLeave[]>(`/api/people/${personId}/scheduled-leaves`)
