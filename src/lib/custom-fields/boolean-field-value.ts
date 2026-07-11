import type { CustomFieldValue } from '@/types/person'
import type { CustomField } from '@/types/custom-field'

export const normalizeBooleanFieldValue = (value: unknown): boolean | null => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (normalized === 'true' || normalized === 'yes' || normalized === '1') {
      return true
    }

    if (normalized === 'false' || normalized === 'no' || normalized === '0') {
      return false
    }

    return null
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true
    }

    if (value === 0) {
      return false
    }

    return null
  }

  return null
}

export const getNextBooleanFieldValue = (current: boolean | null): boolean => {
  return current !== true
}

export const coerceBooleanFieldValue = (value: unknown): CustomFieldValue => {
  return normalizeBooleanFieldValue(value)
}

export const normalizeCustomFieldValueForField = (
  field: Pick<CustomField, 'type'> | undefined,
  value: unknown,
): CustomFieldValue => {
  if (field?.type === 'Boolean') {
    return coerceBooleanFieldValue(value)
  }

  return value as CustomFieldValue
}
