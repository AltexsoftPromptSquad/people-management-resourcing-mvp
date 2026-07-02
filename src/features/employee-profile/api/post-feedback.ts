import { apiPost } from '@/lib/api/api-client'
import type { Feedback, FeedbackType, FeedbackVisibility } from '@/types/feedback'

export type PostFeedbackPayload = {
  authorId: string
  type: FeedbackType
  content: string
  visibility: FeedbackVisibility
}

export const postFeedback = (personId: string, payload: PostFeedbackPayload) =>
  apiPost<Feedback, PostFeedbackPayload>(`/api/people/${personId}/feedbacks`, payload)
