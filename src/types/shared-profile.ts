export type SharedProfileSection =
  | 'basic-info'
  | 'job-and-skills'
  | 'availability'
  | 'project-history'
  | 'feedbacks'
  | 'scheduled-leaves'
  | 'risks'
  | 'documents'
  | 'custom-fields'

export type SharedProfile = {
  id: string
  personId: string
  createdById: string
  allowedSections: SharedProfileSection[]
  token: string
  isActive: boolean
}
