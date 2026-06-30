export type LeaveType = 'Annual' | 'Sick' | 'Parental' | 'Other'
export type LeaveStatus = 'Confirmed' | 'Tentative'

export type ScheduledLeave = {
  id: string
  personId: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  status: LeaveStatus
  notes?: string
}
