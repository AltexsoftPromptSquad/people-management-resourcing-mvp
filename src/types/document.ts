export type DocumentType =
  | 'Contract'
  | 'CV'
  | 'Certificate'
  | 'IDP Document'
  | 'Joining Interview Feedback'
  | 'Performance Document'
  | 'Other'

export type DocumentVisibility = 'Manager Only' | 'Employee Visible' | 'Shareable' | 'Sensitive'

export type DocumentRecord = {
  id: string
  personId: string
  name: string
  type: DocumentType
  uploadedById: string
  uploadedAt: string
  visibility: DocumentVisibility
  mockFileName: string
}
