export type ProjectHistoryItem = {
  id: string
  personId: string
  projectId: string
  projectName: string
  role: string
  startDate: string
  endDate?: string
  allocationPercent: number
}
