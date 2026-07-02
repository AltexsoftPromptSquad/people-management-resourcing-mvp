import { apiGet } from '@/lib/api/api-client'
import type { Risk } from '@/types/risk'

export const getPersonRisks = (personId: string) => apiGet<Risk[]>(`/api/people/${personId}/risks`)
