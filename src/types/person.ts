export type EmploymentStatus = 'Active' | 'On Leave' | 'Notice Period' | 'Inactive'
export type EmploymentType = 'FTE' | 'Subcontractor'
export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type CurrentProjectStatus =
  | 'Allocated'
  | 'Partially Allocated'
  | 'Bench'
  | 'Booked'
  | 'Unavailable'

export type RiskLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Critical'

export type PersonAddress = {
  addressLine: string
  city: string
  country: string
}

export type EmergencyContact = {
  name: string
  phone: string
}

export type CustomFieldValue = string | number | boolean | null

export type Person = {
  id: string
  firstName: string
  lastName: string
  workEmail: string
  personalEmail: string
  workPhone: string
  personalPhone: string
  dateOfBirth: string
  address: PersonAddress
  emergencyContact: EmergencyContact
  position: string
  grade: string
  unitId: string
  managerId?: string
  employmentType: EmploymentType
  employmentStatus: EmploymentStatus
  englishLevel: EnglishLevel
  hireDate: string
  workLocation: string
  currentProjectStatus: CurrentProjectStatus
  availabilityPercent: number
  riskLevel: RiskLevel
  customFieldValues: Record<string, CustomFieldValue>
}
