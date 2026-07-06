import { z } from 'zod'

export const rejectCandidateSchema = z.object({
  rejectionReason: z.string().trim().min(1, 'A rejection reason is required.'),
})

export const externalCandidateUrlSchema = z.object({
  externalProfileUrl: z
    .string()
    .trim()
    .url('Enter a valid URL (e.g. https://example.com/profile).')
    .refine((value) => value.startsWith('http://') || value.startsWith('https://'), {
      message: 'Enter a valid URL (e.g. https://example.com/profile).',
    }),
})
