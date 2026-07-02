import { apiGet } from '@/lib/api/api-client'
import type { DocumentRecord } from '@/types/document'

export const getPersonDocuments = (personId: string) =>
  apiGet<DocumentRecord[]>(`/api/people/${personId}/documents`)
