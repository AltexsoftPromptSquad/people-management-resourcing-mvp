import { http, HttpResponse } from 'msw'
import { actionItems } from './data/action-items'
import { assignmentHistory } from './data/assignment-history'
import { feedbacks } from './data/feedbacks'
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
import type { Feedback } from '@/types/feedback'
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
      createdAt: new Date(Date.UTC(2026, 6, 1, 10, 0, feedbacks.length)).toISOString(),
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
  http.get('/api/action-items', () => HttpResponse.json(actionItems)),
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
]
