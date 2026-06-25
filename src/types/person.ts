export type EmploymentStatus = 'Active' | 'On Leave' | 'Notice Period' | 'Inactive'

export type CurrentProjectStatus =
  | 'Allocated'
  | 'Partially Allocated'
  | 'Bench'
  | 'Booked'
  | 'Unavailable'

export type RiskLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Critical'

export type Person = {
  id: string
  firstName: string
  lastName: string
  workEmail: string
  position: string
  grade: string
  unitId: string
  managerId?: string
  employmentStatus: EmploymentStatus
  currentProjectStatus: CurrentProjectStatus
  availabilityPercent: number
  riskLevel: RiskLevel
}
