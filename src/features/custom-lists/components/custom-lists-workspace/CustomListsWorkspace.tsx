import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ListBuilderSheet } from '../list-builder-sheet'
import { CustomFieldManagerSheet } from '../custom-field-manager-sheet'
import { ShareListSheet } from '../share-list-sheet'
import { CustomListTable } from '../custom-list-table'
import {
  useAllCustomFieldsQuery,
  useCustomFieldsQuery,
  useCustomListRowsQuery,
  useCustomListsQuery,
  useManagerPeopleQuery,
} from '../../hooks/use-custom-lists-query'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PageHeader } from '@/shared/ui/page-header'
import { Select } from '@/shared/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { formatDisplayDate } from '@/shared/ui/date-picker'
import { normalizeBooleanFieldValue } from '@/lib/custom-fields/boolean-field-value'
import type { CustomField } from '@/types/custom-field'
import type { CustomList } from '@/types/custom-list'

export type CustomListsWorkspaceProps = {
  managerId: string
  personaDisplayName?: string
}

export const CustomListsWorkspace: FC<CustomListsWorkspaceProps> = ({
  managerId,
  personaDisplayName,
}) => {
  const customListsQuery = useCustomListsQuery(managerId)
  const customFieldsQuery = useCustomFieldsQuery(managerId)
  const allCustomFieldsQuery = useAllCustomFieldsQuery()
  const managerPeopleQuery = useManagerPeopleQuery(managerId)

  const customLists = useMemo(() => customListsQuery.data ?? [], [customListsQuery.data])
  const [activeListId, setActiveListId] = useState<string>('')
  const [isBuilderOpen, setBuilderOpen] = useState(false)
  const [isFieldManagerOpen, setFieldManagerOpen] = useState(false)
  const [isShareOpen, setShareOpen] = useState(false)
  const [listToEdit, setListToEdit] = useState<CustomList | null>(null)
  const [runtimeFilters, setRuntimeFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!activeListId && customLists.length > 0) {
      setActiveListId(customLists[0].id)
    }
  }, [activeListId, customLists])

  const activeList = useMemo(
    () => customLists.find((list) => list.id === activeListId) ?? null,
    [activeListId, customLists],
  )

  const listRowsQuery = useCustomListRowsQuery(activeList?.id, managerId)
  const managerFields = useMemo(
    () => (customFieldsQuery.data ?? []).filter((field) => field.isActive),
    [customFieldsQuery.data],
  )
  const visibleFields = useMemo(
    () => (allCustomFieldsQuery.data ?? []).filter((field) => field.isActive),
    [allCustomFieldsQuery.data],
  )

  useEffect(() => {
    setRuntimeFilters({})
  }, [activeListId])

  const filterableFields = useMemo(
    () =>
      (activeList?.fieldConfigs ?? [])
        .filter((config) => config.usage === 'filter' || config.usage === 'both')
        .map((config) => visibleFields.find((field) => field.id === config.customFieldId))
        .filter((field): field is CustomField => Boolean(field)),
    [visibleFields, activeList?.fieldConfigs],
  )

  const filteredRows = useMemo(() => {
    const rows = listRowsQuery.data ?? []
    if (Object.keys(runtimeFilters).length === 0) {
      return rows
    }

    return rows.filter((row) =>
      Object.entries(runtimeFilters).every(([fieldId, filterValue]) => {
        if (!filterValue) {
          return true
        }

        return String(row.values[fieldId] ?? '') === filterValue
      }),
    )
  }, [listRowsQuery.data, runtimeFilters])

  const hasActiveRuntimeFilters = useMemo(
    () => Object.values(runtimeFilters).some((value) => Boolean(value)),
    [runtimeFilters],
  )

  const formatFilterOptionLabel = (field: CustomField, option: string) => {
    if (field.type === 'Boolean') {
      const normalized = normalizeBooleanFieldValue(option)
      if (normalized === true) {
        return 'Yes'
      }

      if (normalized === false) {
        return 'No'
      }
    }

    if (field.type === 'Date') {
      return formatDisplayDate(option)
    }

    return option
  }

  if (
    customListsQuery.isPending ||
    customFieldsQuery.isPending ||
    allCustomFieldsQuery.isPending ||
    managerPeopleQuery.isPending
  ) {
    return <LoadingState label="Loading custom lists" />
  }

  if (
    customListsQuery.isError ||
    customFieldsQuery.isError ||
    allCustomFieldsQuery.isError ||
    managerPeopleQuery.isError
  ) {
    return <ErrorState title="Could not load list" description="Refresh the page to try again." />
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={personaDisplayName}
        title="Custom Lists"
        description="Track employees with list tabs and custom field columns."
        actions={
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => setFieldManagerOpen(true)}>
              Manage Fields
            </Button>
            {activeList?.ownerManagerId === managerId ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setListToEdit(activeList)
                    setBuilderOpen(true)
                  }}
                >
                  Edit List
                </Button>
                <Button type="button" variant="outline" onClick={() => setShareOpen(true)}>
                  Share List
                </Button>
              </>
            ) : null}
            <Button
              type="button"
              onClick={() => {
                setListToEdit(null)
                setBuilderOpen(true)
              }}
            >
              New List
            </Button>
          </div>
        }
      />

      {customLists.length === 0 ? (
        <EmptyState
          title="List not configured"
          description="Add columns to this list to start tracking employees."
        />
      ) : (
        <Tabs
          value={activeListId}
          onValueChange={setActiveListId}
          defaultValue={customLists[0]?.id ?? ''}
        >
          <TabsList className="w-full justify-start overflow-x-auto">
            {customLists.map((list) => (
              <TabsTrigger key={list.id} value={list.id}>
                {list.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {customLists.map((list) => (
            <TabsContent key={list.id} value={list.id}>
              {activeList?.id === list.id && listRowsQuery.isPending ? (
                <LoadingState label="Loading list rows" />
              ) : activeList?.id === list.id && listRowsQuery.isError ? (
                <ErrorState
                  title="Could not load list"
                  description="Refresh the page to try again."
                />
              ) : list.fieldConfigs.length === 0 ? (
                <EmptyState
                  title="List not configured"
                  description="Add columns to this list to start tracking employees."
                />
              ) : (
                <div className="space-y-3">
                  {filterableFields.length > 0 ? (
                    <section className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">List filters</h3>
                        {hasActiveRuntimeFilters ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setRuntimeFilters({})}
                          >
                            Clear filters
                          </Button>
                        ) : null}
                      </div>
                      <div className="mt-2 grid gap-3 md:grid-cols-3">
                        {filterableFields.map((field) => {
                          const options = Array.from(
                            new Set(
                              (listRowsQuery.data ?? [])
                                .map((row) => String(row.values[field.id] ?? ''))
                                .filter(Boolean),
                            ),
                          ).sort()

                          return (
                            <label
                              key={field.id}
                              className="block text-sm font-medium text-slate-700"
                            >
                              {field.name}
                              <Select
                                className="mt-1"
                                aria-label={field.name}
                                value={runtimeFilters[field.id] ?? ''}
                                onChange={(event) =>
                                  setRuntimeFilters((current) => ({
                                    ...current,
                                    [field.id]: event.target.value,
                                  }))
                                }
                              >
                                <option value="">Any</option>
                                {options.map((option) => (
                                  <option key={option} value={option}>
                                    {formatFilterOptionLabel(field, option)}
                                  </option>
                                ))}
                              </Select>
                            </label>
                          )
                        })}
                      </div>
                    </section>
                  ) : null}

                  {filteredRows.length === 0 ? (
                    <EmptyState
                      title={
                        hasActiveRuntimeFilters
                          ? 'No employees match the current filter'
                          : 'No employees match'
                      }
                      description={
                        hasActiveRuntimeFilters
                          ? 'Change or clear the filters above to see employees again.'
                          : "No employees in this unit match the list's filters."
                      }
                    />
                  ) : (
                    <CustomListTable
                      list={list}
                      managerId={managerId}
                      rows={filteredRows}
                      fields={visibleFields}
                    />
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <ListBuilderSheet
        open={isBuilderOpen}
        onOpenChange={(open) => {
          setBuilderOpen(open)
          if (!open) {
            setListToEdit(null)
          }
        }}
        managerId={managerId}
        fields={managerFields}
        people={managerPeopleQuery.data ?? []}
        listToEdit={listToEdit}
        onSaved={(savedList) => {
          setActiveListId(savedList.id)
        }}
      />

      <CustomFieldManagerSheet
        open={isFieldManagerOpen}
        onOpenChange={setFieldManagerOpen}
        managerId={managerId}
        fields={customFieldsQuery.data ?? []}
      />

      {activeList ? (
        <ShareListSheet
          open={isShareOpen}
          onOpenChange={setShareOpen}
          managerId={managerId}
          list={activeList}
          onShared={(sharedList) => {
            setActiveListId(sharedList.id)
          }}
        />
      ) : null}
    </div>
  )
}
