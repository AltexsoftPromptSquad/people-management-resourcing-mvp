import { apiClient } from '@/lib/api/api-client'
import type { ResourcingRequest } from '@/types/resourcing-request'

type RequestFilter = {
  createdById?: string
  assignedManagerId?: string
}

export const getResourcingRequests = (filter: RequestFilter) =>
  apiClient<ResourcingRequest[]>('/api/resourcing/requests', filter)
