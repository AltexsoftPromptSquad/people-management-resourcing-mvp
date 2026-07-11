import type { FC } from 'react'
import { useState } from 'react'
import {
  useCreateCustomFieldMutation,
  usePatchCustomFieldMutation,
} from '../../hooks/use-custom-lists-query'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { toast } from '@/shared/ui/toast'
import type { CustomField, CustomFieldType } from '@/types/custom-field'

export type CustomFieldManagerSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  managerId: string
  fields: CustomField[]
}

const fieldTypes: CustomFieldType[] = ['Text', 'Number', 'Date', 'Single Select', 'Boolean']

export const CustomFieldManagerSheet: FC<CustomFieldManagerSheetProps> = ({
  open,
  onOpenChange,
  managerId,
  fields,
}) => {
  const createFieldMutation = useCreateCustomFieldMutation(managerId)
  const patchFieldMutation = usePatchCustomFieldMutation(managerId)

  const [name, setName] = useState('')
  const [type, setType] = useState<CustomFieldType>('Text')
  const [optionsDraft, setOptionsDraft] = useState('')
  const [isSensitive, setSensitive] = useState(false)

  const activeFields = fields.filter((field) => field.isActive)

  const resetForm = () => {
    setName('')
    setType('Text')
    setOptionsDraft('')
    setSensitive(false)
  }

  const handleCreate = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error('Field name is required.')
      return
    }

    const options =
      type === 'Single Select'
        ? optionsDraft
            .split(',')
            .map((option) => option.trim())
            .filter(Boolean)
        : undefined

    if (type === 'Single Select' && (!options || options.length === 0)) {
      toast.error('Provide at least one option for Single Select.')
      return
    }

    try {
      await createFieldMutation.mutateAsync({
        name: trimmedName,
        type,
        options,
        isSensitive,
        isActive: true,
        createdByManagerId: managerId,
      })
      toast.success('Custom field created.')
      resetForm()
    } catch {
      toast.error('Could not create custom field.')
    }
  }

  const handleArchive = async (field: CustomField) => {
    try {
      await patchFieldMutation.mutateAsync({
        id: field.id,
        payload: { isActive: false },
      })
      toast.success(`Field "${field.name}" archived.`)
    } catch {
      toast.error('Could not archive custom field.')
    }
  }

  const isBusy = createFieldMutation.isPending || patchFieldMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Manage Custom Fields</SheetTitle>
          <SheetDescription>
            Create new fields and archive fields you no longer need.
          </SheetDescription>
        </SheetHeader>

        <section className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">New field</h3>
          <label className="block text-sm font-medium text-slate-700">
            Name
            <Input
              className="mt-1"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Type
            <Select
              className="mt-1"
              value={type}
              onChange={(event) => setType(event.target.value as CustomFieldType)}
            >
              {fieldTypes.map((fieldType) => (
                <option key={fieldType} value={fieldType}>
                  {fieldType}
                </option>
              ))}
            </Select>
          </label>
          {type === 'Single Select' ? (
            <label className="block text-sm font-medium text-slate-700">
              Options (comma-separated)
              <Input
                className="mt-1"
                value={optionsDraft}
                onChange={(event) => setOptionsDraft(event.target.value)}
              />
            </label>
          ) : null}
          <Checkbox
            label="Sensitive field"
            checked={isSensitive}
            onChange={(event) => setSensitive(event.target.checked)}
          />
          <Button
            type="button"
            className="w-fit"
            onClick={() => void handleCreate()}
            disabled={isBusy}
            aria-busy={isBusy}
          >
            Create Field
          </Button>
        </section>

        <section className="mt-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Active fields</h3>
          {activeFields.length === 0 ? (
            <p className="text-sm text-slate-600">No active custom fields.</p>
          ) : (
            <ul className="space-y-2">
              {activeFields.map((field) => (
                <li
                  key={field.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{field.name}</p>
                    <p className="text-xs text-slate-600">
                      {field.type}
                      {field.isSensitive ? ' · Sensitive' : ''}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isBusy}
                    onClick={() => void handleArchive(field)}
                  >
                    Archive
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
