import type { ResourcingRequest } from '@/types/resourcing-request'

export const resourcingRequests: ResourcingRequest[] = [
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
