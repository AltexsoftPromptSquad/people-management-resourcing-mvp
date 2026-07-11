import type { SharedProfile } from '@/types/shared-profile'

export const sharedProfiles: SharedProfile[] = [
  {
    id: 'shared-profile-0001',
    personId: 'person-employee-001',
    createdById: 'person-um-001',
    allowedSections: ['basic-info', 'job-and-skills', 'availability', 'project-history'],
    token: 'demo-shared-profile-token-0001',
    isActive: true,
  },
  {
    id: 'shared-profile-0002',
    personId: 'person-generated-034',
    createdById: 'person-um-001',
    allowedSections: ['basic-info', 'job-and-skills', 'availability', 'project-history'],
    token: 'demo-shared-profile-token-0002',
    isActive: true,
  },
]
