import { http, HttpResponse } from 'msw'
import { customFields } from './data/custom-fields'
import { customLists } from './data/custom-lists'
import { people } from './data/people'
import { normalizeCustomFieldValueForField } from '@/lib/custom-fields/boolean-field-value'
import type { CustomField } from '@/types/custom-field'
import type { CustomList } from '@/types/custom-list'
import type { CustomListRow } from '@/types/custom-list-row'
import type { Person } from '@/types/person'

type PatchCustomFieldValueBody = {
  fieldId: string
  value: string | number | boolean | null
}

type ShareCustomListBody = {
  managerIds: string[]
}

type CreateCustomFieldBody = Pick<
  CustomField,
  'name' | 'description' | 'type' | 'options' | 'createdByManagerId' | 'isSensitive' | 'isActive'
>

type PatchCustomFieldBody = Partial<Omit<CreateCustomFieldBody, 'createdByManagerId'>>

type CreateCustomListBody = Omit<CustomList, 'id'>

type PatchCustomListBody = Partial<
  Pick<CustomList, 'name' | 'description' | 'employeeFilter' | 'fieldConfigs' | 'defaultSort'>
>

const parseDateString = (value: unknown): Date | null => {
  if (typeof value !== 'string') {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

const matchesEmployeeFilter = (
  person: Person,
  employeeFilter: CustomList['employeeFilter'],
): boolean => {
  return Object.entries(employeeFilter).every(([key, filterValue]) => {
    if (key === 'lastConversationOlderThanDays') {
      const days = Number(Array.isArray(filterValue) ? filterValue[0] : filterValue)
      if (!Number.isFinite(days)) {
        return true
      }

      const lastConversation = parseDateString(
        person.customFieldValues['field-last-conversation-003'],
      )
      if (!lastConversation) {
        return false
      }

      const ageMs = Date.now() - lastConversation.getTime()
      return ageMs >= days * 24 * 60 * 60 * 1000
    }

    const personValue = person[key as keyof Person] ?? person.customFieldValues[key]
    const normalizedFilterValues = Array.isArray(filterValue) ? filterValue : [filterValue]

    return normalizedFilterValues.some((value) => String(personValue) === String(value))
  })
}

const getListRows = (list: CustomList, viewerManagerId: string): CustomListRow[] => {
  const listOwner = people.find((person) => person.id === list.ownerManagerId)
  if (!listOwner) {
    return []
  }

  const unitPeople = people.filter((person) => person.unitId === listOwner.unitId)
  const filteredPeople = unitPeople.filter((person) =>
    matchesEmployeeFilter(person, list.employeeFilter),
  )

  return filteredPeople.map((person) => {
    const values = list.fieldConfigs.reduce<Record<string, Person['customFieldValues'][string]>>(
      (accumulator, config) => {
        const field = customFields.find((item) => item.id === config.customFieldId)
        const rawValue = person.customFieldValues[config.customFieldId] ?? null
        accumulator[config.customFieldId] = normalizeCustomFieldValueForField(field, rawValue)
        return accumulator
      },
      {},
    )

    return {
      person,
      values,
      editable: viewerManagerId === list.ownerManagerId || person.managerId === viewerManagerId,
    }
  })
}

export const customListsHandlers = [
  http.get('/api/custom-fields', ({ request }) => {
    const url = new URL(request.url)
    const ownerManagerId = url.searchParams.get('ownerManagerId')

    if (!ownerManagerId) {
      return HttpResponse.json(customFields)
    }

    return HttpResponse.json(
      customFields.filter((field) => field.createdByManagerId === ownerManagerId),
    )
  }),
  http.post('/api/custom-fields', async ({ request }) => {
    const body = (await request.json()) as CreateCustomFieldBody
    const field: CustomField = {
      id: `field-custom-${String(customFields.length + 1).padStart(4, '0')}`,
      ...body,
    }

    customFields.push(field)
    return HttpResponse.json(field, { status: 201 })
  }),
  http.patch('/api/custom-fields/:id', async ({ params, request }) => {
    const field = customFields.find((item) => item.id === params.id)
    if (!field) {
      return HttpResponse.json({ message: 'Custom field not found' }, { status: 404 })
    }

    const body = (await request.json()) as PatchCustomFieldBody
    Object.assign(field, body)

    return HttpResponse.json(field)
  }),
  http.get('/api/custom-lists', ({ request }) => {
    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')

    if (!managerId) {
      return HttpResponse.json(customLists)
    }

    return HttpResponse.json(
      customLists.filter(
        (list) =>
          list.ownerManagerId === managerId || list.sharedWithManagerIds.includes(managerId),
      ),
    )
  }),
  http.post('/api/custom-lists', async ({ request }) => {
    const body = (await request.json()) as CreateCustomListBody
    const list: CustomList = {
      id: `list-custom-${String(customLists.length + 1).padStart(4, '0')}`,
      ...body,
    }

    customLists.push(list)
    return HttpResponse.json(list, { status: 201 })
  }),
  http.patch('/api/custom-lists/:id', async ({ params, request }) => {
    const list = customLists.find((item) => item.id === params.id)
    if (!list) {
      return HttpResponse.json({ message: 'Custom list not found' }, { status: 404 })
    }

    const body = (await request.json()) as PatchCustomListBody
    Object.assign(list, body)

    return HttpResponse.json(list)
  }),
  http.post('/api/custom-lists/:id/share', async ({ params, request }) => {
    const list = customLists.find((item) => item.id === params.id)
    if (!list) {
      return HttpResponse.json({ message: 'Custom list not found' }, { status: 404 })
    }

    const body = (await request.json()) as ShareCustomListBody
    list.sharedWithManagerIds = [...body.managerIds]

    return HttpResponse.json(list)
  }),
  http.get('/api/custom-lists/:id/rows', ({ params, request }) => {
    const list = customLists.find((item) => item.id === params.id)
    if (!list) {
      return HttpResponse.json({ message: 'Custom list not found' }, { status: 404 })
    }

    const url = new URL(request.url)
    const managerId = url.searchParams.get('managerId')
    if (!managerId) {
      return HttpResponse.json({ message: 'managerId is required' }, { status: 400 })
    }

    return HttpResponse.json(getListRows(list, managerId))
  }),
  http.patch('/api/people/:personId/custom-field-values', async ({ params, request }) => {
    const person = people.find((item) => item.id === params.personId)
    if (!person) {
      return HttpResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body = (await request.json()) as PatchCustomFieldValueBody
    const field = customFields.find((item) => item.id === body.fieldId)
    person.customFieldValues[body.fieldId] = normalizeCustomFieldValueForField(field, body.value)

    return HttpResponse.json(person)
  }),
]
