import { z } from 'zod'

export const requestFormSchema = z.object({
  title: z.string().trim().min(1, 'Request title is required.'),
  projectName: z.string().trim().min(1, 'Project name is required.'),
  clientName: z.string(),
  requiredRole: z.string().trim().min(1, 'Required role is required.'),
  requiredSkills: z.string().trim().min(1, 'At least one required skill is required.'),
  gradeLevel: z.string().trim().min(1, 'Grade level is required.'),
  englishLevel: z.string().trim().min(1, 'English level is required.'),
  expectedCompensationLevel: z.string().trim().min(1, 'Expected compensation level is required.'),
  workloadPercent: z.string().refine((value) => {
    const numberValue = Number(value)
    return Number.isFinite(numberValue) && numberValue >= 1 && numberValue <= 100
  }, 'Workload must be between 1 and 100.'),
  startDate: z
    .string()
    .trim()
    .min(1, 'Start date is required.')
    .refine((value) => {
      if (!value) {
        return true
      }

      const selectedDate = new Date(`${value}T00:00:00`)
      if (Number.isNaN(selectedDate.getTime())) {
        return false
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Start date cannot be in the past.'),
  endDate: z.string(),
  assignedUnitManagerId: z.string().trim().min(1, 'Assigned Unit Manager is required.'),
  priority: z.string().trim().min(1, 'Priority is required.'),
  businessReason: z.string(),
})

export type RequestFormValues = z.infer<typeof requestFormSchema>
