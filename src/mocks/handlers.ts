import { delay, http, HttpResponse } from 'msw'
import { mockDb } from './db/mock-db'

const mockDelayMs = 250

export const handlers = [
  http.get('/api/personas', async () => {
    await delay(mockDelayMs)

    return HttpResponse.json(mockDb.personas)
  }),
  http.get('/api/people', async () => {
    await delay(mockDelayMs)

    return HttpResponse.json(mockDb.people)
  }),
  http.get('/api/units', async () => {
    await delay(mockDelayMs)

    return HttpResponse.json(mockDb.units)
  }),
  http.get('/api/resourcing-requests', async () => {
    await delay(mockDelayMs)

    return HttpResponse.json(mockDb.resourcingRequests)
  }),
]
