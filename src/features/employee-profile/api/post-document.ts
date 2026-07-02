import { apiPost } from '@/lib/api/api-client'
import type { DocumentRecord, DocumentType, DocumentVisibility } from '@/types/document'

export type PostDocumentPayload = {
  name: string
  type: DocumentType
  uploadedById: string
  visibility: DocumentVisibility
  mockFileName: string
}

export const postDocument = (personId: string, payload: PostDocumentPayload) =>
  apiPost<DocumentRecord, PostDocumentPayload>(`/api/people/${personId}/documents`, payload)
