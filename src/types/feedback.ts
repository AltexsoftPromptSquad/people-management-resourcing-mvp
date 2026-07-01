export type FeedbackType = 'HR Note' | 'Performance' | 'General'
export type FeedbackVisibility = 'Manager Only' | 'Shareable'

export type Feedback = {
  id: string
  personId: string
  authorId: string
  type: FeedbackType
  content: string
  createdAt: string
  visibility: FeedbackVisibility
}
