import { apiGet } from '@/lib/api/api-client'
import type { Unit } from '@/types/unit'

export const getUnits = () => apiGet<Unit[]>('/api/units')
