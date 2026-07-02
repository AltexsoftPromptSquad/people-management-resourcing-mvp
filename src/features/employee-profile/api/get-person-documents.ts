import { apiGet } from '@/lib/api/api-client'
import type { DocumentRecord } from '@/types/document'

export const getPersonDocuments = (personId: string, visibility?: DocumentRecord['visibility']) =>
  apiGet<DocumentRecord[]>(
    `/api/people/${personId}/documents`,
    visibility ? { visibility } : undefined,
  )
