export type IdpStatus = 'Not Started' | 'In Progress' | 'Completed'

export type IdpRecord = {
  id: string
  personId: string
  documentReference: string
  status: IdpStatus
  lastUpdatedAt: string
}
