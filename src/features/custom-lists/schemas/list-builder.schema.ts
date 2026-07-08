import { z } from 'zod'

export const listFieldUsageSchema = z.enum(['none', 'filter', 'column', 'both'])

export const listBuilderSchema = z.object({
  name: z.string().trim().min(1, 'List name is required'),
  position: z.string(),
  grade: z.string(),
  currentProjectStatus: z.string(),
  riskLevel: z.string(),
  fieldUsages: z.array(
    z.object({
      customFieldId: z.string().min(1),
      usage: listFieldUsageSchema,
    }),
  ),
})

export type ListBuilderFormValues = z.infer<typeof listBuilderSchema>
