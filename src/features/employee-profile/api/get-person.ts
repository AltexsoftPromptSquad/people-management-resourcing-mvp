import { apiGet } from '@/lib/api/api-client'
import type { Person } from '@/types/person'

export const getPerson = (personId: string) => apiGet<Person>(`/api/people/${personId}`)
