import { apiClient } from '@/lib/api/api-client'
import type { Persona } from '@/types'

export const getPersonas = () => {
  return apiClient<Persona[]>('/api/personas')
}
