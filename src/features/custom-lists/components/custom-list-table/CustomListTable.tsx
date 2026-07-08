import type { FC } from 'react'
import { useMemo, useRef, useState } from 'react'
import { usePatchCustomFieldValueMutation } from '../../hooks/use-custom-lists-query'
import { DataTable } from '@/shared/ui/data-table'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { toast } from '@/shared/ui/toast'
import type { CustomField } from '@/types/custom-field'
import type { CustomList } from '@/types/custom-list'
import type { CustomListRow } from '@/types/custom-list-row'
import type { CustomFieldValue } from '@/types/person'

export type CustomListTableProps = {
  list: CustomList
  managerId: string
  rows: CustomListRow[]
  fields: CustomField[]
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return String(value)
}

type EditingCell = {
  key: string
  personId: string
  fieldId: string
}

const buildCellKey = (personId: string, fieldId: string) => `${personId}:${fieldId}`

const getDraftFromValue = (value: CustomFieldValue) => {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

const parseValueByFieldType = (
  field: CustomField,
  draftValue: string,
): { valid: true; value: CustomFieldValue } | { valid: false } => {
  if (field.type === 'Number') {
    if (!draftValue.trim()) {
      return { valid: true, value: null }
    }

    const normalized = Number(draftValue)
    if (Number.isNaN(normalized)) {
      return { valid: false }
    }

    return { valid: true, value: normalized }
  }

  if (field.type === 'Text' || field.type === 'Date' || field.type === 'Single Select') {
    return { valid: true, value: draftValue.trim() ? draftValue : null }
  }

  return { valid: true, value: draftValue }
}

export const CustomListTable: FC<CustomListTableProps> = ({ list, managerId, rows, fields }) => {
  const mutation = usePatchCustomFieldValueMutation(list.id, managerId)
  const columnFieldIds = list.fieldConfigs
    .filter((config) => config.usage === 'column' || config.usage === 'both')
    .map((config) => config.customFieldId)

  const customColumns = columnFieldIds
    .map((fieldId) => fields.find((field) => field.id === fieldId))
    .filter((field): field is CustomField => Boolean(field))

  const customColumnsById = useMemo(
    () =>
      customColumns.reduce<Record<string, CustomField>>((accumulator, field) => {
        accumulator[field.id] = field
        return accumulator
      }, {}),
    [customColumns],
  )

  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [draftValue, setDraftValue] = useState<string>('')
  const cellRefMap = useRef<Record<string, HTMLTableCellElement | null>>({})

  const closeEditor = (cellKey?: string) => {
    const targetCellKey = cellKey ?? editingCell?.key
    setEditingCell(null)

    if (!targetCellKey) {
      return
    }

    requestAnimationFrame(() => {
      cellRefMap.current[targetCellKey]?.focus()
    })
  }

  const handleStartEdit = async (row: CustomListRow, field: CustomField) => {
    if (!row.editable) {
      return
    }

    const nextCellKey = buildCellKey(row.person.id, field.id)

    if (editingCell && editingCell.key !== nextCellKey) {
      await handleCommit()
    }

    if (editingCell?.key === nextCellKey) {
      return
    }

    setEditingCell({
      key: nextCellKey,
      personId: row.person.id,
      fieldId: field.id,
    })
    setDraftValue(getDraftFromValue(row.values[field.id]))
  }

  const handleCancel = () => {
    closeEditor()
  }

  const handleCommit = async () => {
    if (!editingCell) {
      return
    }

    const field = customColumnsById[editingCell.fieldId]
    if (!field) {
      closeEditor(editingCell.key)
      return
    }

    const parsedValue = parseValueByFieldType(field, draftValue)
    if (!parsedValue.valid) {
      closeEditor(editingCell.key)
      return
    }

    try {
      await mutation.mutateAsync({
        personId: editingCell.personId,
        payload: {
          fieldId: editingCell.fieldId,
          value: parsedValue.value,
        },
      })
    } catch {
      toast.error(`Could not save "${field.name}". Change was not applied.`)
    } finally {
      closeEditor(editingCell.key)
    }
  }

  const renderEditableCell = (row: CustomListRow, field: CustomField) => {
    const cellKey = buildCellKey(row.person.id, field.id)
    const isEditing = editingCell?.key === cellKey

    if (!isEditing) {
      return (
        <td
          key={field.id}
          ref={(node) => {
            cellRefMap.current[cellKey] = node
          }}
          className={
            row.editable
              ? 'cursor-pointer px-4 py-3 text-slate-700'
              : 'cursor-default px-4 py-3 text-slate-700'
          }
          tabIndex={row.editable ? 0 : -1}
          onClick={() => void handleStartEdit(row, field)}
          onKeyDown={(event) => {
            if (!row.editable) {
              return
            }

            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              void handleStartEdit(row, field)
            }
          }}
        >
          {formatValue(row.values[field.id])}
        </td>
      )
    }

    if (field.type === 'Boolean') {
      return (
        <td key={field.id} className="px-4 py-3 text-slate-700">
          <input
            autoFocus
            type="checkbox"
            checked={Boolean(row.values[field.id])}
            onChange={(event) => {
              setDraftValue(event.target.checked ? 'true' : 'false')
              void mutation
                .mutateAsync({
                  personId: row.person.id,
                  payload: {
                    fieldId: field.id,
                    value: event.target.checked,
                  },
                })
                .catch(() => {
                  toast.error(`Could not save "${field.name}". Change was not applied.`)
                })
                .finally(() => {
                  closeEditor(cellKey)
                })
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault()
                handleCancel()
              }
            }}
          />
        </td>
      )
    }

    if (field.type === 'Single Select') {
      return (
        <td key={field.id} className="px-4 py-3 text-slate-700">
          <Select
            autoFocus
            value={draftValue}
            onChange={(event) => {
              const nextValue = event.target.value
              setDraftValue(nextValue)
              void mutation
                .mutateAsync({
                  personId: row.person.id,
                  payload: {
                    fieldId: field.id,
                    value: nextValue || null,
                  },
                })
                .catch(() => {
                  toast.error(`Could not save "${field.name}". Change was not applied.`)
                })
                .finally(() => {
                  closeEditor(cellKey)
                })
            }}
            onBlur={() => {
              void handleCommit()
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault()
                handleCancel()
              }
            }}
          >
            <option value="">—</option>
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </td>
      )
    }

    return (
      <td key={field.id} className="px-4 py-3 text-slate-700">
        <Input
          autoFocus
          type={field.type === 'Number' ? 'text' : field.type === 'Date' ? 'date' : 'text'}
          value={draftValue}
          onChange={(event) => {
            setDraftValue(event.target.value)
          }}
          onBlur={() => {
            void handleCommit()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              handleCancel()
              return
            }

            if (event.key === 'Enter' || event.key === 'Tab') {
              event.preventDefault()
              void handleCommit()
            }
          }}
        />
      </td>
    )
  }

  return (
    <DataTable>
      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
        <tr>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Position</th>
          <th className="px-4 py-3">Grade</th>
          <th className="px-4 py-3">Status</th>
          {customColumns.map((field) => (
            <th key={field.id} className="px-4 py-3">
              {field.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {rows.map((row) => (
          <tr key={row.person.id} className="hover:bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-900">
              {row.person.firstName} {row.person.lastName}
            </td>
            <td className="px-4 py-3 text-slate-700">{row.person.position}</td>
            <td className="px-4 py-3 text-slate-700">{row.person.grade}</td>
            <td className="px-4 py-3 text-slate-700">{row.person.currentProjectStatus}</td>
            {customColumns.map((field) => renderEditableCell(row, field))}
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}
