import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  useCreateCustomListMutation,
  usePatchCustomListMutation,
} from '../../hooks/use-custom-lists-query'
import { listBuilderSchema, type ListBuilderFormValues } from '../../schemas/list-builder.schema'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { toast } from '@/shared/ui/toast'
import type { CustomField } from '@/types/custom-field'
import type { CustomList } from '@/types/custom-list'
import type { Person } from '@/types/person'

export type ListBuilderSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  managerId: string
  fields: CustomField[]
  people: Person[]
  listToEdit?: CustomList | null
  onSaved?: (list: CustomList) => void
}

const usageOptions: Array<{ value: 'none' | 'filter' | 'column' | 'both'; label: string }> = [
  { value: 'none', label: 'Not used' },
  { value: 'filter', label: 'Filter' },
  { value: 'column', label: 'Column' },
  { value: 'both', label: 'Both' },
]

const getDefaultFieldUsages = (fields: CustomField[], listToEdit?: CustomList | null) =>
  fields.map((field) => {
    const existing = listToEdit?.fieldConfigs.find((config) => config.customFieldId === field.id)
    return {
      customFieldId: field.id,
      usage: (existing?.usage ?? 'none') as 'none' | 'filter' | 'column' | 'both',
    }
  })

const getDefaultValues = (
  fields: CustomField[],
  listToEdit?: CustomList | null,
): ListBuilderFormValues => ({
  name: listToEdit?.name ?? '',
  position:
    typeof listToEdit?.employeeFilter.position === 'string'
      ? listToEdit.employeeFilter.position
      : '',
  grade:
    typeof listToEdit?.employeeFilter.grade === 'string' ? listToEdit.employeeFilter.grade : '',
  currentProjectStatus:
    typeof listToEdit?.employeeFilter.currentProjectStatus === 'string'
      ? listToEdit.employeeFilter.currentProjectStatus
      : '',
  riskLevel:
    typeof listToEdit?.employeeFilter.riskLevel === 'string'
      ? listToEdit.employeeFilter.riskLevel
      : '',
  fieldUsages: getDefaultFieldUsages(fields, listToEdit),
})

const getSortedUniqueValues = (values: string[]) => [...new Set(values.filter(Boolean))].sort()

const isConfiguredUsageItem = (
  item: ListBuilderFormValues['fieldUsages'][number],
): item is { customFieldId: string; usage: 'filter' | 'column' | 'both' } => item.usage !== 'none'

export const ListBuilderSheet: FC<ListBuilderSheetProps> = ({
  open,
  onOpenChange,
  managerId,
  fields,
  people,
  listToEdit,
  onSaved,
}) => {
  const createMutation = useCreateCustomListMutation(managerId)
  const patchMutation = usePatchCustomListMutation(managerId)
  const isEditMode = Boolean(listToEdit)

  const defaultValues = useMemo(() => getDefaultValues(fields, listToEdit), [fields, listToEdit])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListBuilderFormValues>({
    resolver: zodResolver(listBuilderSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues)
    }
  }, [defaultValues, open, reset])

  const positionOptions = useMemo(
    () => getSortedUniqueValues(people.map((person) => person.position)),
    [people],
  )
  const gradeOptions = useMemo(
    () => getSortedUniqueValues(people.map((person) => person.grade)),
    [people],
  )
  const statusOptions = useMemo(
    () => getSortedUniqueValues(people.map((person) => person.currentProjectStatus)),
    [people],
  )
  const riskOptions = useMemo(
    () => getSortedUniqueValues(people.map((person) => person.riskLevel)),
    [people],
  )

  const handleSave = async (values: ListBuilderFormValues) => {
    const employeeFilter: Record<string, string> = {}
    if (values.position) employeeFilter.position = values.position
    if (values.grade) employeeFilter.grade = values.grade
    if (values.currentProjectStatus)
      employeeFilter.currentProjectStatus = values.currentProjectStatus
    if (values.riskLevel) employeeFilter.riskLevel = values.riskLevel

    const fieldConfigs = values.fieldUsages.filter(isConfiguredUsageItem).map((item) => ({
      customFieldId: item.customFieldId,
      usage: item.usage,
    }))

    try {
      const savedList = listToEdit
        ? await patchMutation.mutateAsync({
            id: listToEdit.id,
            payload: {
              name: values.name.trim(),
              employeeFilter,
              fieldConfigs,
              defaultSort: listToEdit.defaultSort ?? { field: 'lastName', direction: 'asc' },
            },
          })
        : await createMutation.mutateAsync({
            name: values.name.trim(),
            ownerManagerId: managerId,
            sharedWithManagerIds: [],
            employeeFilter,
            fieldConfigs,
            defaultSort: { field: 'lastName', direction: 'asc' },
          })

      toast.success('Custom list saved')
      onOpenChange(false)
      onSaved?.(savedList)
    } catch {
      toast.error('Could not save custom list')
    }
  }

  const isSubmitting = createMutation.isPending || patchMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit List' : 'New List'}</SheetTitle>
          <SheetDescription>
            Configure list filters and choose how each custom field is used.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            List name *
            <Input className="mt-1" placeholder="e.g. Bench — Q3 2026" {...register('name')} />
            {errors.name?.message ? (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            ) : null}
          </label>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Employee filter</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Position
                <Select className="mt-1" {...register('position')}>
                  <option value="">Any</option>
                  {positionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Grade
                <Select className="mt-1" {...register('grade')}>
                  <option value="">Any</option>
                  {gradeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Status
                <Select className="mt-1" {...register('currentProjectStatus')}>
                  <option value="">Any</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Risk
                <Select className="mt-1" {...register('riskLevel')}>
                  <option value="">Any</option>
                  {riskOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Custom fields usage</h3>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <label key={field.id} className="block text-sm font-medium text-slate-700">
                  {field.name}
                  <input
                    type="hidden"
                    value={field.id}
                    {...register(`fieldUsages.${index}.customFieldId`)}
                  />
                  <Select className="mt-1" {...register(`fieldUsages.${index}.usage`)}>
                    {usageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </label>
              ))}
            </div>
          </section>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="button"
            aria-busy={isSubmitting}
            disabled={isSubmitting}
            onClick={() => void handleSubmit(handleSave)()}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
