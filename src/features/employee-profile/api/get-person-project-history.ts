import { apiGet } from '@/lib/api/api-client'
import type { ProjectHistoryItem } from '@/types/project-history'

export const getPersonProjectHistory = (personId: string) =>
  apiGet<ProjectHistoryItem[]>(`/api/people/${personId}/project-history`)
