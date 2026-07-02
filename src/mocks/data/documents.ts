import type { DocumentRecord } from '@/types/document'

export const documents: DocumentRecord[] = [
  {
    id: 'document-001',
    personId: 'person-employee-001',
    name: 'React Advanced Certificate',
    type: 'Certificate',
    uploadedById: 'person-employee-001',
    uploadedAt: '2026-03-08T09:00:00.000Z',
    visibility: 'Employee Visible',
    mockFileName: 'react-advanced-certificate.pdf',
  },
  {
    id: 'document-002',
    personId: 'person-employee-001',
    name: 'Individual Development Plan 2026',
    type: 'IDP Document',
    uploadedById: 'person-um-001',
    uploadedAt: '2026-01-15T10:30:00.000Z',
    visibility: 'Manager Only',
    mockFileName: 'idp-2026-petrenko.pdf',
  },
  {
    id: 'document-003',
    personId: 'person-um-001',
    name: 'Leadership Coaching Certificate',
    type: 'Certificate',
    uploadedById: 'person-um-001',
    uploadedAt: '2025-11-20T11:00:00.000Z',
    visibility: 'Employee Visible',
    mockFileName: 'leadership-coaching-certificate.pdf',
  },
  {
    id: 'document-004',
    personId: 'person-dm-001',
    name: 'Stakeholder Management Workshop',
    type: 'Certificate',
    uploadedById: 'person-dm-001',
    uploadedAt: '2026-02-11T08:00:00.000Z',
    visibility: 'Employee Visible',
    mockFileName: 'stakeholder-management-workshop.pdf',
  },
]
