import { apiGet } from '@/lib/api/api-client'
import type { IdpRecord } from '@/types/idp'

export const getPersonIdp = (personId: string) => apiGet<IdpRecord>(`/api/people/${personId}/idp`)
