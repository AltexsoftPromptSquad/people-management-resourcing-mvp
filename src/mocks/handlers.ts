import { http, HttpResponse } from 'msw'
import type { CurrentProjectStatus, RiskLevel } from '@/types/person'
import type { SubordinatesSortField } from '@/types/subordinates-query'
import { people } from './data/people'
import { personas } from './data/personas'
import { resourcingRequests } from './data/resourcing-requests'
import { skills } from './data/skills'
import { units } from './data/units'
import {
  getDashboardActionItemsForManager,
  getDashboardSummaryForManager,
  getSubordinatesForManager,
} from './services/manager-data-service'

const subordinateSortFields: SubordinatesSortField[] = [
  'fullName',
  'position',
  'grade',
  'currentStatus',
  'riskLevel',
]

export const handlers = [
  http.get('/api/personas', () => HttpResponse.json(personas)),
  http.get('/api/units', () => HttpResponse.json(units)),
  http.get('/api/people', () => HttpResponse.json(people)),
  http.get('/api/skills', () => HttpResponse.json(skills)),
  http.get('/api/resourcing/requests', () => HttpResponse.json(resourcingRequests)),
  http.get('/api/dashboard/summary', ({ request }) => {
    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')

    if (!managerId) {
      return HttpResponse.json({ message: 'managerId is required' }, { status: 400 })
    }

    return HttpResponse.json(getDashboardSummaryForManager(managerId))
  }),
  http.get('/api/dashboard/action-items', ({ request }) => {
    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')

    if (!managerId) {
      return HttpResponse.json({ message: 'managerId is required' }, { status: 400 })
    }

    return HttpResponse.json(getDashboardActionItemsForManager(managerId))
  }),
  http.get('/api/subordinates', ({ request }) => {
    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')

    if (!managerId) {
      return HttpResponse.json({ message: 'managerId is required' }, { status: 400 })
    }

    const position = url.searchParams.get('position')
    const grade = url.searchParams.get('grade')
    const currentStatus = url.searchParams.get('currentStatus')
    const riskLevel = url.searchParams.get('riskLevel')
    const search = url.searchParams.get('search')
    const requestedSortField = url.searchParams.get('sortField')
    const sortField = subordinateSortFields.includes(requestedSortField as SubordinatesSortField)
      ? (requestedSortField as SubordinatesSortField)
      : 'fullName'
    const sortDirection = url.searchParams.get('sortDirection') === 'desc' ? 'desc' : 'asc'

    return HttpResponse.json(
      getSubordinatesForManager(
        managerId,
        {
          position: position || undefined,
          grade: grade || undefined,
          currentStatus: (currentStatus as CurrentProjectStatus | null) ?? undefined,
          riskLevel: (riskLevel as RiskLevel | null) ?? undefined,
          search: search || undefined,
        },
        {
          field: sortField,
          direction: sortDirection,
        },
      ),
    )
  }),
]
