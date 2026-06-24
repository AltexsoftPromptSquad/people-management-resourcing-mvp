export type EmploymentType = 'FTE' | 'Subcontractor'

export type EmploymentStatus = 'Active' | 'On Leave' | 'Notice Period' | 'Inactive'

export type CurrentProjectStatus =
  | 'Allocated'
  | 'Partially Allocated'
  | 'Bench'
  | 'Booked'
  | 'Unavailable'

export type RiskLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Critical'

export type GradeLevel = 'Junior' | 'Middle' | 'Senior' | 'Lead' | 'Principal'

export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type Person = {
  id: string
  firstName: string
  lastName: string
  workEmail: string
  personalEmail: string
  workPhone: string
  personalPhone: string
  position: string
  grade: GradeLevel
  unitId: string
  managerId?: string
  employmentType: EmploymentType
  employmentStatus: EmploymentStatus
  hireDate: string
  workLocation: string
  englishLevel: EnglishLevel
  currentProjectStatus: CurrentProjectStatus
  availabilityPercent: number
  riskLevel: RiskLevel
}
