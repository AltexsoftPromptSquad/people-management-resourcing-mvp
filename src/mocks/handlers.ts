import { http, HttpResponse } from 'msw'
import { actionItems } from './data/action-items'
import { people } from './data/people'
import { personas } from './data/personas'
import { resourcingRequests } from './data/resourcing-requests'
import { risks } from './data/risks'
import { skills } from './data/skills'
import { units } from './data/units'
import {
  getDashboardActionItems,
  getDashboardSummary,
  getFilteredSubordinates,
} from './services/manager-data-service'
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
  http.get('/api/people', () => HttpResponse.json(people)),
  http.get('/api/skills', () => HttpResponse.json(skills)),
  http.get('/api/resourcing/requests', () => HttpResponse.json(resourcingRequests)),
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
