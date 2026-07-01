import type { EnglishLevel } from './person'

export type ResourcingRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Candidates Proposed'
  | 'Approved'
  | 'Rejected'
  | 'Closed'
  | 'Cancelled'

export type ResourcingRequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type CompensationLevel = 'Junior' | 'Middle' | 'Senior' | 'Lead'

export type ResourcingRequest = {
  id: string
  requestCode: string
  title: string
  projectName: string
  clientName?: string
  createdById: string
  assignedUnitManagerId: string
  requiredRole: string
  requiredSkills: string[]
  gradeLevel: string
  englishLevel: EnglishLevel
  expectedCompensationLevel: CompensationLevel
  workloadPercent: number
  startDate: string
  endDate: string
  durationText: string
  status: ResourcingRequestStatus
  priority: ResourcingRequestPriority
  businessReason?: string
  createdAt: string
  updatedAt: string
}
