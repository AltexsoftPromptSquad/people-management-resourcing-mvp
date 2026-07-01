export type CustomListSort = {
  field: string
  direction: 'asc' | 'desc'
}

export type CustomList = {
  id: string
  name: string
  description?: string
  ownerManagerId: string
  sharedWithManagerIds: string[]
  employeeFilter: Record<string, unknown>
  visibleColumns: string[]
  filterableFields: string[]
  defaultSort: CustomListSort
}
