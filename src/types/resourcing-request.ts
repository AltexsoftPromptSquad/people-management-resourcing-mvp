import type { EnglishLevel, GradeLevel } from './person'

export type ResourcingRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Candidates Proposed'
  | 'Approved'
  | 'Rejected'
  | 'Closed'
  | 'Cancelled'

export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export type ResourcingRequest = {
  id: string
  title: string
  requestCode: string
  createdById: string
  assignedUnitManagerId: string
  projectName: string
  requiredRole: string
  requiredSkills: string[]
  gradeLevel: GradeLevel
  englishLevel: EnglishLevel
  workloadPercent: number
  startDate: string
  durationText: string
  priority: RequestPriority
  status: ResourcingRequestStatus
  createdAt: string
  updatedAt: string
}
