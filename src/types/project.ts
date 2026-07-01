export type ProjectStatus = 'Active' | 'Completed' | 'Planned' | 'Cancelled'

export type Project = {
  id: string
  name: string
  clientName: string
  role: string
  startDate: string
  endDate?: string
  allocationPercent: number
  status: ProjectStatus
}
