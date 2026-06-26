import type { ResourcingRequest } from '@/types/resourcing-request'

const baselineResourcingRequests: ResourcingRequest[] = [
  {
    id: 'request-001',
    requestCode: 'REQ-001',
    title: 'Frontend Engineer for Client Portal',
    projectName: 'Client Portal Modernization',
    createdById: 'person-dm-001',
    assignedUnitManagerId: 'person-um-001',
    requiredRole: 'Frontend Engineer',
    status: 'Submitted',
    priority: 'Medium',
    createdAt: '2026-06-20T09:00:00.000Z',
    updatedAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 'request-002',
    requestCode: 'REQ-002',
    title: 'Backend Engineer for Data Sync',
    projectName: 'Data Sync Platform',
    createdById: 'person-dm-001',
    assignedUnitManagerId: 'person-um-001',
    requiredRole: 'Backend Engineer',
    status: 'Draft',
    priority: 'High',
    createdAt: '2026-06-21T11:30:00.000Z',
    updatedAt: '2026-06-21T11:30:00.000Z',
  },
]

const generatedResourcingRequests: ResourcingRequest[] = Array.from({ length: 14 }, (_, index) => {
  const id = index + 3
  const statusByIndex: ResourcingRequest['status'][] = [
    'Submitted',
    'In Review',
    'Candidates Proposed',
    'Approved',
    'Draft',
    'Closed',
  ]
  const priorityByIndex: ResourcingRequest['priority'][] = ['Low', 'Medium', 'High', 'Urgent']

  return {
    id: `request-${String(id).padStart(3, '0')}`,
    requestCode: `REQ-${String(id).padStart(3, '0')}`,
    title: `Resource request ${id}`,
    projectName: `Delivery Stream ${((index % 6) + 1).toString()}`,
    createdById: 'person-dm-001',
    assignedUnitManagerId: index % 2 === 0 ? 'person-um-001' : 'person-manager-002',
    requiredRole: index % 2 === 0 ? 'Software Engineer' : 'QA Engineer',
    status: statusByIndex[index % statusByIndex.length],
    priority: priorityByIndex[index % priorityByIndex.length],
    createdAt: new Date(Date.UTC(2026, 5, 1 + index, 9, 0, 0)).toISOString(),
    updatedAt: new Date(Date.UTC(2026, 5, 1 + index, 12, 0, 0)).toISOString(),
  }
})

export const resourcingRequests: ResourcingRequest[] = [
  ...baselineResourcingRequests,
  ...generatedResourcingRequests,
]
