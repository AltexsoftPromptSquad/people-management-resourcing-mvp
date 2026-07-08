import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useShareCustomListMutation } from '../../hooks/use-custom-lists-query'
import { usePersonasQuery } from '@/features/roles/hooks/use-personas-query'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
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
import type { CustomList } from '@/types/custom-list'

export type ShareListSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  managerId: string
  list: CustomList
  onShared?: (list: CustomList) => void
}

export const ShareListSheet: FC<ShareListSheetProps> = ({
  open,
  onOpenChange,
  managerId,
  list,
  onShared,
}) => {
  const personasQuery = usePersonasQuery()
  const shareMutation = useShareCustomListMutation(managerId)
  const [selectedManagerIds, setSelectedManagerIds] = useState<string[]>(list.sharedWithManagerIds)

  useEffect(() => {
    if (open) {
      setSelectedManagerIds(list.sharedWithManagerIds)
    }
  }, [list.sharedWithManagerIds, open])

  const eligibleManagers = useMemo(
    () =>
      (personasQuery.data ?? []).filter(
        (persona) => persona.role === 'unit-manager' && persona.personId !== list.ownerManagerId,
      ),
    [list.ownerManagerId, personasQuery.data],
  )

  const handleToggleManager = (managerIdToToggle: string, checked: boolean) => {
    setSelectedManagerIds((current) => {
      if (checked) {
        return current.includes(managerIdToToggle) ? current : [...current, managerIdToToggle]
      }

      return current.filter((item) => item !== managerIdToToggle)
    })
  }

  const handleSubmit = async () => {
    try {
      const updated = await shareMutation.mutateAsync({
        id: list.id,
        payload: { managerIds: selectedManagerIds },
      })
      toast.success('List sharing updated')
      onOpenChange(false)
      onShared?.(updated)
    } catch {
      toast.error('Could not update list sharing')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-lg">
        <SheetHeader>
          <SheetTitle>Share "{list.name}"</SheetTitle>
          <SheetDescription>
            Recipients can view this list and edit custom values only for their own direct reports.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {personasQuery.isPending ? (
            <p className="text-sm text-slate-600">Loading eligible managers...</p>
          ) : eligibleManagers.length === 0 ? (
            <p className="text-sm text-slate-600">No eligible managers available for sharing.</p>
          ) : (
            eligibleManagers.map((persona) => (
              <Checkbox
                key={persona.personId}
                label={persona.displayName}
                checked={selectedManagerIds.includes(persona.personId)}
                onChange={(event) => handleToggleManager(persona.personId, event.target.checked)}
              />
            ))
          )}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="button"
            aria-busy={shareMutation.isPending}
            disabled={shareMutation.isPending || personasQuery.isPending}
            onClick={() => void handleSubmit()}
          >
            Share
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
