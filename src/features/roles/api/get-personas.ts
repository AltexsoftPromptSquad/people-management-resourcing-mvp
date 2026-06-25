import { apiClient } from '@/lib/api/api-client'
import type { Persona } from '@/types/persona'

export const getPersonas = () => apiClient<Persona[]>('/api/personas')
