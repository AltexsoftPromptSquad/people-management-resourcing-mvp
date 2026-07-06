import type { SharedProfileSection } from '@/types/shared-profile'

export const SHARED_PROFILE_SECTION_LABELS: Record<SharedProfileSection, string> = {
  'basic-info': 'Basic info (name, position, grade)',
  'job-and-skills': 'Job and skills',
  availability: 'Availability',
  'project-history': 'Project history',
  feedbacks: 'Feedbacks',
  'scheduled-leaves': 'Scheduled leaves',
  risks: 'Risks',
  documents: 'Documents',
  'custom-fields': 'Custom fields',
}

export const DEFAULT_SHARED_SECTIONS: SharedProfileSection[] = [
  'basic-info',
  'job-and-skills',
  'availability',
  'project-history',
]

export const SENSITIVE_SHARED_SECTIONS: SharedProfileSection[] = [
  'feedbacks',
  'scheduled-leaves',
  'risks',
  'documents',
  'custom-fields',
]

export const ALL_SHARED_SECTIONS = Object.keys(
  SHARED_PROFILE_SECTION_LABELS,
) as SharedProfileSection[]
