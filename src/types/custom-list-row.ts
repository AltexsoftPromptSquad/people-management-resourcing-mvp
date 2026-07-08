import type { CustomFieldValue, Person } from './person'

export type CustomListRow = {
  person: Person
  values: Record<string, CustomFieldValue>
  editable: boolean
}
