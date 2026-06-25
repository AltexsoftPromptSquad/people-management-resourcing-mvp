import { http, HttpResponse } from 'msw'
import { people } from './data/people'
import { personas } from './data/personas'
import { resourcingRequests } from './data/resourcing-requests'
import { skills } from './data/skills'
import { units } from './data/units'

export const handlers = [
  http.get('/api/personas', () => HttpResponse.json(personas)),
  http.get('/api/units', () => HttpResponse.json(units)),
  http.get('/api/people', () => HttpResponse.json(people)),
  http.get('/api/skills', () => HttpResponse.json(skills)),
  http.get('/api/resourcing/requests', () => HttpResponse.json(resourcingRequests)),
]
