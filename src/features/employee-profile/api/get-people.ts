import { apiGet } from '@/lib/api/api-client'
import type { Person } from '@/types/person'

export const getPeople = () => apiGet<Person[]>('/api/people')
