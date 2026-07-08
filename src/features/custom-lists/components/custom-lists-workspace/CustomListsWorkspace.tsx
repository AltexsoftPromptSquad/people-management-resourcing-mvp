import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ListBuilderSheet } from '../list-builder-sheet'
import { ShareListSheet } from '../share-list-sheet'
import { CustomListTable } from '../custom-list-table'
import {
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
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
  const managerPeopleQuery = useManagerPeopleQuery(managerId)

  const customLists = useMemo(() => customListsQuery.data ?? [], [customListsQuery.data])
  const [activeListId, setActiveListId] = useState<string>('')
  const [isBuilderOpen, setBuilderOpen] = useState(false)
  const [isShareOpen, setShareOpen] = useState(false)
  const [listToEdit, setListToEdit] = useState<CustomList | null>(null)

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

  if (customListsQuery.isPending || customFieldsQuery.isPending || managerPeopleQuery.isPending) {
    return <LoadingState label="Loading custom lists" />
  }

  if (customListsQuery.isError || customFieldsQuery.isError || managerPeopleQuery.isError) {
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
              ) : (listRowsQuery.data ?? []).length === 0 ? (
                <EmptyState
                  title="No employees match"
                  description="No employees in this unit match the list's filters."
                />
              ) : (
                <CustomListTable
                  list={list}
                  managerId={managerId}
                  rows={listRowsQuery.data ?? []}
                  fields={customFieldsQuery.data ?? []}
                />
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
        fields={customFieldsQuery.data ?? []}
        people={managerPeopleQuery.data ?? []}
        listToEdit={listToEdit}
        onSaved={(savedList) => {
          setActiveListId(savedList.id)
        }}
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
