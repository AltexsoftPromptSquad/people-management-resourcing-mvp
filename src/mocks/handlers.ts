import { http, HttpResponse } from 'msw'
import { customListsHandlers } from './custom-lists-handlers'
import { actionItems } from './data/action-items'
import { assignmentHistory } from './data/assignment-history'
import { customFields } from './data/custom-fields'
import { documents } from './data/documents'
import { feedbacks } from './data/feedbacks'
import { idpRecords } from './data/idp'
import { people } from './data/people'
import { personas } from './data/personas'
import { projectHistory } from './data/project-history'
import { resourcingRequests } from './data/resourcing-requests'
import { risks } from './data/risks'
import { scheduledLeaves } from './data/scheduled-leaves'
import { skills } from './data/skills'
import { units } from './data/units'
import {
  getDashboardActionItems,
  getDashboardSummary,
  getFilteredSubordinates,
} from './services/manager-data-service'
import { resourcingHandlers } from './resourcing-handlers'
import { normalizeCustomFieldValueForField } from '@/lib/custom-fields/boolean-field-value'
import type { DocumentRecord } from '@/types/document'
import type { Feedback } from '@/types/feedback'
import type { IdpRecord } from '@/types/idp'
import type { Person, PersonAddress } from '@/types/person'
import type { Skill } from '@/types/skill'
import type { SubordinatesFilter, SubordinatesSort } from '@/types/subordinates-query'

const parseSubordinatesFilter = (url: URL): SubordinatesFilter => ({
  search: url.searchParams.get('search') ?? undefined,
  position: url.searchParams.get('position') ?? undefined,
  grade: url.searchParams.get('grade') ?? undefined,
  currentStatus:
    (url.searchParams.get('currentStatus') as SubordinatesFilter['currentStatus']) ?? undefined,
  riskLevel: (url.searchParams.get('riskLevel') as SubordinatesFilter['riskLevel']) ?? undefined,
})

const parseSubordinatesSort = (url: URL): SubordinatesSort => ({
  field: (url.searchParams.get('sortField') as SubordinatesSort['field']) ?? 'fullName',
  direction: (url.searchParams.get('sortDirection') as SubordinatesSort['direction']) ?? 'asc',
})

type PatchPersonPayload = {
  personalPhone?: string
  personalEmail?: string
  address?: string | PersonAddress
  englishLevel?: Person['englishLevel']
  skills?: Array<{ skillId: string; level: Skill['level'] }>
  managementNotes?: string
  customFieldValues?: Person['customFieldValues']
}

type AddDocumentPayload = Pick<
  DocumentRecord,
  'name' | 'type' | 'uploadedById' | 'visibility' | 'mockFileName'
>

type PatchIdpPayload = {
  status?: IdpRecord['status']
  documentReference?: string
}

type CreateActionItemPayload = {
  personId: string
  title: string
  description: string
  assigneeId: string
  ownerId: string
  dueDate: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Open' | 'In Progress' | 'Done' | 'Blocked'
}

type PatchActionItemPayload = Partial<{
  title: string
  description: string
  assigneeId: string
  dueDate: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Open' | 'In Progress' | 'Done' | 'Blocked'
}>

export const handlers = [
  http.get('/api/personas', () => HttpResponse.json(personas)),
  http.get('/api/units', () => HttpResponse.json(units)),
  http.get('/api/people', ({ request }) => {
    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')
    const unitId = url.searchParams.get('unitId')

    if (managerId) {
      return HttpResponse.json(people.filter((person) => person.managerId === managerId))
    }

    if (unitId) {
      return HttpResponse.json(people.filter((person) => person.unitId === unitId))
    }

    return HttpResponse.json(people)
  }),
  http.get('/api/people/:id', ({ params }) => {
    const person = people.find((item) => item.id === params.id)

    if (!person) {
      return HttpResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    return HttpResponse.json(person)
  }),
  http.get('/api/people/:id/feedbacks', ({ params }) =>
    HttpResponse.json(feedbacks.filter((feedback) => feedback.personId === params.id)),
  ),
  http.post('/api/people/:id/feedbacks', async ({ request, params }) => {
    const body = (await request.json()) as Omit<Feedback, 'id' | 'personId' | 'createdAt'>

    const newFeedback = {
      id: `feedback-${String(feedbacks.length + 1).padStart(3, '0')}`,
      personId: params.id as string,
      authorId: body.authorId,
      type: body.type,
      content: body.content,
      visibility: body.visibility,
      createdAt: new Date().toISOString(),
    }

    feedbacks.push(newFeedback)

    return HttpResponse.json(newFeedback, { status: 201 })
  }),
  http.get('/api/people/:id/scheduled-leaves', ({ params }) =>
    HttpResponse.json(scheduledLeaves.filter((leave) => leave.personId === params.id)),
  ),
  http.get('/api/people/:id/risks', ({ params }) =>
    HttpResponse.json(risks.filter((risk) => risk.personId === params.id)),
  ),
  http.get('/api/people/:id/action-items', ({ params }) =>
    HttpResponse.json(actionItems.filter((item) => item.personId === params.id)),
  ),
  http.get('/api/people/:id/project-history', ({ params }) =>
    HttpResponse.json(projectHistory.filter((item) => item.personId === params.id)),
  ),
  http.get('/api/people/:id/assignment-history', ({ params }) =>
    HttpResponse.json(assignmentHistory.filter((item) => item.employeeId === params.id)),
  ),
  http.patch('/api/people/:id', async ({ params, request }) => {
    const person = people.find((item) => item.id === params.id)

    if (!person) {
      return HttpResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body = (await request.json()) as PatchPersonPayload

    if (body.personalPhone !== undefined) {
      person.personalPhone = body.personalPhone
    }

    if (body.personalEmail !== undefined) {
      person.personalEmail = body.personalEmail
    }

    if (body.address !== undefined) {
      person.address =
        typeof body.address === 'string'
          ? {
              ...person.address,
              addressLine: body.address,
            }
          : body.address
    }

    if (body.englishLevel !== undefined) {
      person.englishLevel = body.englishLevel
    }

    if (body.managementNotes !== undefined) {
      person.managementNotes = body.managementNotes
    }

    if (body.customFieldValues !== undefined) {
      const normalizedCustomFieldValues = Object.fromEntries(
        Object.entries(body.customFieldValues).map(([fieldId, value]) => {
          const field = customFields.find((item) => item.id === fieldId)
          return [fieldId, normalizeCustomFieldValueForField(field, value)]
        }),
      )

      person.customFieldValues = {
        ...person.customFieldValues,
        ...normalizedCustomFieldValues,
      }
    }

    if (body.skills && body.skills.length > 0) {
      body.skills.forEach(({ skillId, level }) => {
        const skill = skills.find((item) => item.id === skillId && item.personId === person.id)

        if (skill) {
          skill.level = level
        }
      })
    }

    return HttpResponse.json(person)
  }),
  http.get('/api/people/:id/documents', ({ params, request }) => {
    const url = new URL(request.url)
    const visibility = url.searchParams.get('visibility') as DocumentRecord['visibility'] | null

    const personDocuments = documents.filter((document) => document.personId === params.id)
    if (!visibility) {
      return HttpResponse.json(personDocuments)
    }

    return HttpResponse.json(
      personDocuments.filter((document) => document.visibility === visibility),
    )
  }),
  http.post('/api/people/:id/documents', async ({ params, request }) => {
    const person = people.find((item) => item.id === params.id)

    if (!person) {
      return HttpResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body = (await request.json()) as AddDocumentPayload

    const newDocument: DocumentRecord = {
      id: `document-${String(documents.length + 1).padStart(3, '0')}`,
      personId: person.id,
      name: body.name,
      type: body.type,
      uploadedById: body.uploadedById,
      uploadedAt: new Date(Date.UTC(2026, 6, 1, 10, 0, documents.length)).toISOString(),
      visibility: body.visibility,
      mockFileName: body.mockFileName,
    }

    documents.unshift(newDocument)

    return HttpResponse.json(newDocument, { status: 201 })
  }),
  http.get('/api/people/:id/idp', ({ params }) => {
    const idpRecord = idpRecords.find((item) => item.personId === params.id)

    if (!idpRecord) {
      return HttpResponse.json({
        id: `idp-fallback-${params.id}`,
        personId: params.id as string,
        documentReference: '',
        status: 'Not Started',
        lastUpdatedAt: new Date().toISOString(),
      } satisfies IdpRecord)
    }

    return HttpResponse.json(idpRecord)
  }),
  http.patch('/api/people/:id/idp', async ({ params, request }) => {
    const person = people.find((item) => item.id === params.id)

    if (!person) {
      return HttpResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body = (await request.json()) as PatchIdpPayload
    const existingRecord = idpRecords.find((item) => item.personId === person.id)
    const updatedAt = new Date(Date.UTC(2026, 6, 1, 10, 0, idpRecords.length)).toISOString()

    if (existingRecord) {
      if (body.status !== undefined) {
        existingRecord.status = body.status
      }

      if (body.documentReference !== undefined) {
        existingRecord.documentReference = body.documentReference
      }

      existingRecord.lastUpdatedAt = updatedAt

      return HttpResponse.json(existingRecord)
    }

    const newRecord: IdpRecord = {
      id: `idp-${String(idpRecords.length + 1).padStart(3, '0')}`,
      personId: person.id,
      documentReference: body.documentReference ?? '',
      status: body.status ?? 'Not Started',
      lastUpdatedAt: updatedAt,
    }

    idpRecords.push(newRecord)

    return HttpResponse.json(newRecord)
  }),
  http.get('/api/skills', () => HttpResponse.json(skills)),
  http.get('/api/resourcing/requests', ({ request }) => {
    const url = new URL(request.url)
    const createdById = url.searchParams.get('createdById')
    const assignedManagerId = url.searchParams.get('assignedManagerId')

    if (createdById) {
      return HttpResponse.json(
        resourcingRequests.filter((requestItem) => requestItem.createdById === createdById),
      )
    }

    if (assignedManagerId) {
      return HttpResponse.json(
        resourcingRequests.filter(
          (requestItem) => requestItem.assignedUnitManagerId === assignedManagerId,
        ),
      )
    }

    return HttpResponse.json(resourcingRequests)
  }),
  http.get('/api/risks', () => HttpResponse.json(risks)),
  http.get('/api/action-items', ({ request }) => {
    const url = new URL(request.url)
    const assigneeId = url.searchParams.get('assigneeId')

    if (!assigneeId) {
      return HttpResponse.json(actionItems)
    }

    return HttpResponse.json(actionItems.filter((item) => item.assigneeId === assigneeId))
  }),
  http.post('/api/action-items', async ({ request }) => {
    const body = (await request.json()) as CreateActionItemPayload
    const newItem = {
      id: `action-item-${String(actionItems.length + 1).padStart(4, '0')}`,
      ...body,
    }
    actionItems.push(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.patch('/api/action-items/:id', async ({ params, request }) => {
    const item = actionItems.find((entry) => entry.id === params.id)
    if (!item) {
      return HttpResponse.json({ message: 'Action item not found' }, { status: 404 })
    }

    const body = (await request.json()) as PatchActionItemPayload
    Object.assign(item, body)
    return HttpResponse.json(item)
  }),
  http.get('/api/dashboard/summary', ({ request }) => {
    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')

    if (!managerId) {
      return HttpResponse.json({ message: 'managerId is required' }, { status: 400 })
    }

    return HttpResponse.json(getDashboardSummary(managerId))
  }),
  http.get('/api/dashboard/action-items', ({ request }) => {
    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')

    if (!managerId) {
      return HttpResponse.json({ message: 'managerId is required' }, { status: 400 })
    }

    return HttpResponse.json(getDashboardActionItems(managerId))
  }),
  http.get('/api/subordinates', ({ request }) => {
    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')

    if (!managerId) {
      return HttpResponse.json({ message: 'managerId is required' }, { status: 400 })
    }

    return HttpResponse.json(
      getFilteredSubordinates(managerId, parseSubordinatesFilter(url), parseSubordinatesSort(url)),
    )
  }),
  ...customListsHandlers,
  ...resourcingHandlers,
]
