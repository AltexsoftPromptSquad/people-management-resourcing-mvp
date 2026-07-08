export type CustomFieldType = 'Text' | 'Number' | 'Date' | 'Single Select' | 'Boolean'

export type CustomFieldUsage = 'filter' | 'column' | 'both'

export type CustomField = {
  id: string
  name: string
  description?: string
  type: CustomFieldType
  options?: string[]
  createdByManagerId: string
  isSensitive: boolean
  isActive: boolean
}
