import { apiGet, apiPatch, apiPost } from '@/lib/api/api-client'
import type { CustomField } from '@/types/custom-field'
import type { CustomList } from '@/types/custom-list'
import type { CustomListRow } from '@/types/custom-list-row'
import type { CustomFieldValue, Person } from '@/types/person'

export type CreateCustomFieldPayload = Pick<
  CustomField,
  'name' | 'description' | 'type' | 'options' | 'createdByManagerId' | 'isSensitive' | 'isActive'
>

export type PatchCustomFieldPayload = Partial<Omit<CreateCustomFieldPayload, 'createdByManagerId'>>

export type CreateCustomListPayload = Omit<CustomList, 'id'>

export type PatchCustomListPayload = Partial<
  Pick<CustomList, 'name' | 'description' | 'employeeFilter' | 'fieldConfigs' | 'defaultSort'>
>

export type ShareCustomListPayload = {
  managerIds: string[]
}

export type PatchCustomFieldValuePayload = {
  fieldId: string
  value: CustomFieldValue
}

export const getCustomFields = (ownerManagerId: string) =>
  apiGet<CustomField[]>('/api/custom-fields', { ownerManagerId })

export const getAllCustomFields = () => apiGet<CustomField[]>('/api/custom-fields')

export const createCustomField = (payload: CreateCustomFieldPayload) =>
  apiPost<CustomField, CreateCustomFieldPayload>('/api/custom-fields', payload)

export const patchCustomField = (id: string, payload: PatchCustomFieldPayload) =>
  apiPatch<CustomField, PatchCustomFieldPayload>(`/api/custom-fields/${id}`, payload)

export const getCustomLists = (managerId: string) =>
  apiGet<CustomList[]>('/api/custom-lists', { managerId })

export const createCustomList = (payload: CreateCustomListPayload) =>
  apiPost<CustomList, CreateCustomListPayload>('/api/custom-lists', payload)

export const patchCustomList = (id: string, payload: PatchCustomListPayload) =>
  apiPatch<CustomList, PatchCustomListPayload>(`/api/custom-lists/${id}`, payload)

export const shareCustomList = (id: string, payload: ShareCustomListPayload) =>
  apiPost<CustomList, ShareCustomListPayload>(`/api/custom-lists/${id}/share`, payload)

export const getCustomListRows = (id: string, managerId: string) =>
  apiGet<CustomListRow[]>(`/api/custom-lists/${id}/rows`, { managerId })

export const patchCustomFieldValue = (personId: string, payload: PatchCustomFieldValuePayload) =>
  apiPatch<Person, PatchCustomFieldValuePayload>(
    `/api/people/${personId}/custom-field-values`,
    payload,
  )
