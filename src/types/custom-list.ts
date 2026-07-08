import type { CustomFieldUsage } from './custom-field'

export type CustomListSort = {
  field: string
  direction: 'asc' | 'desc'
}

export type CustomListFieldConfig = {
  customFieldId: string
  usage: CustomFieldUsage
}

export type CustomList = {
  id: string
  name: string
  description?: string
  ownerManagerId: string
  sharedWithManagerIds: string[]
  employeeFilter: Record<string, string | string[]>
  fieldConfigs: CustomListFieldConfig[]
  defaultSort?: CustomListSort
}
