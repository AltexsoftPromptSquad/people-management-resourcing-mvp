import { apiGet } from '@/lib/api/api-client'
import type { Feedback } from '@/types/feedback'

export const getPersonFeedbacks = (personId: string) =>
  apiGet<Feedback[]>(`/api/people/${personId}/feedbacks`)
