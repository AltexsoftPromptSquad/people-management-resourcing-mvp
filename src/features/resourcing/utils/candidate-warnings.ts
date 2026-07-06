import type { Person } from '@/types/person'
import type { ResourcingRequest } from '@/types/resourcing-request'
import type { ScheduledLeave } from '@/types/scheduled-leave'
import type { CandidateWarning } from '../constants/copy'

const datesOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
  return startA <= endB && startB <= endA
}

export const getCandidateWarnings = (
  person: Person,
  request: ResourcingRequest,
  leaves: ScheduledLeave[],
): CandidateWarning[] => {
  const warnings: CandidateWarning[] = []
  const currentAllocation = 100 - person.availabilityPercent
  const projectedAllocation = currentAllocation + request.workloadPercent

  if (projectedAllocation > 100) {
    warnings.push({
      type: 'allocation',
      tone: 'warning',
      message: `Allocation would reach ${projectedAllocation}% — exceeds 100%.`,
    })
  }

  const overlappingLeave = leaves.find((leave) =>
    datesOverlap(leave.startDate, leave.endDate, request.startDate, request.endDate),
  )

  if (overlappingLeave) {
    warnings.push({
      type: 'leave-overlap',
      tone: 'warning',
      message: `Has scheduled leave overlapping the request period (${overlappingLeave.startDate} to ${overlappingLeave.endDate}).`,
    })
  }

  if (person.riskLevel === 'High') {
    warnings.push({
      type: 'risk',
      tone: 'danger',
      message: 'Risk level is High.',
    })
  }

  if (person.riskLevel === 'Critical') {
    warnings.push({
      type: 'risk',
      tone: 'danger',
      message: 'Risk level is Critical.',
    })
  }

  return warnings
}
