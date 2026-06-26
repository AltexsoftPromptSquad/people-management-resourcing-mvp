import type { CurrentProjectStatus, RiskLevel } from './person'

export type SubordinatesFilter = {
  position?: string
  grade?: string
  currentStatus?: CurrentProjectStatus
  riskLevel?: RiskLevel
  search?: string
}

export type SubordinatesSortField =
  | 'fullName'
  | 'position'
  | 'grade'
  | 'currentStatus'
  | 'riskLevel'

export type SubordinatesSort = {
  field: SubordinatesSortField
  direction: 'asc' | 'desc'
}

export type SubordinateListItem = {
  id: string
  fullName: string
  position: string
  grade: string
  currentStatus: CurrentProjectStatus
  riskLevel: RiskLevel
  unitId: string
  managerId: string
}
