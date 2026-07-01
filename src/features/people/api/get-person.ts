import { apiClient } from '@/lib/api/api-client'
import type { Person } from '@/types/person'

export const getPerson = (id: string) => apiClient<Person>(`/api/people/${id}`)
