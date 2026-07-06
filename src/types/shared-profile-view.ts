import type { SharedProfileSection } from '@/types/shared-profile'

export type SharedProfileView = {
  token: string
  personId: string
  allowedSections: SharedProfileSection[]
  person: {
    firstName: string
    lastName: string
    position: string
    grade: string
    englishLevel: string
    availabilityPercent: number
    currentProjectStatus: string
  }
  skills?: Array<{ name: string; level: string }>
  projectHistory?: Array<{
    projectName: string
    clientName?: string
    role: string
    startDate: string
    endDate?: string
    allocationPercent: number
    status: string
  }>
  feedbacks?: Array<{ type: string; content: string; createdAt: string }>
  scheduledLeaves?: Array<{ leaveType: string; startDate: string; endDate: string; status: string }>
  risks?: Array<{ level: string; description: string }>
  documents?: Array<{ name: string; type: string }>
  customFields?: Record<string, string | number | boolean | null>
}
