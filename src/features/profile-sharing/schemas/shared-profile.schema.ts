import { z } from 'zod'
import type { SharedProfileSection } from '@/types/shared-profile'

const sharedProfileSections = [
  'basic-info',
  'job-and-skills',
  'availability',
  'project-history',
  'risks',
  'feedbacks',
  'scheduled-leaves',
  'documents',
  'custom-fields',
] as const satisfies readonly SharedProfileSection[]

export const generateSharedProfileSchema = z.object({
  personId: z.string().trim().min(1),
  createdById: z.string().trim().min(1),
  allowedSections: z
    .array(z.enum(sharedProfileSections))
    .min(1)
    .refine((sections) => sections.includes('basic-info'), {
      message: 'Basic info section must always be included.',
    }),
})
