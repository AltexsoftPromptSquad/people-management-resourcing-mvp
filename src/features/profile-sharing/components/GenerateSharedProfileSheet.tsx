import type { FC } from 'react'
import { useState } from 'react'
import {
  ALL_SHARED_SECTIONS,
  DEFAULT_SHARED_SECTIONS,
  SHARED_PROFILE_SECTION_LABELS,
} from '../constants/sections'
import { useCreateSharedProfileMutation } from '../hooks/use-shared-profile-hooks'
import { generateSharedProfileSchema } from '../schemas/shared-profile.schema'
import { RESOURCING_COPY } from '@/features/resourcing/constants/copy'
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
import type { SharedProfileSection } from '@/types/shared-profile'

export type GenerateSharedProfileSheetProps = {
  personId: string
  createdById: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerated?: (token: string, profileId: string) => void
}

export const GenerateSharedProfileSheet: FC<GenerateSharedProfileSheetProps> = ({
  personId,
  createdById,
  open,
  onOpenChange,
  onGenerated,
}) => {
  const [selectedSections, setSelectedSections] =
    useState<SharedProfileSection[]>(DEFAULT_SHARED_SECTIONS)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const createMutation = useCreateSharedProfileMutation()

  const toggleSection = (section: SharedProfileSection, checked: boolean) => {
    if (section === 'basic-info') {
      return
    }

    setSelectedSections((current) => {
      if (checked) {
        return current.includes(section) ? current : [...current, section]
      }

      return current.filter((item) => item !== section)
    })
  }

  const handleGenerate = async () => {
    const validationResult = generateSharedProfileSchema.safeParse({
      personId,
      createdById,
      allowedSections: selectedSections,
    })

    if (!validationResult.success) {
      toast.error(RESOURCING_COPY.generateLinkFailed)
      return
    }

    try {
      const profile = await createMutation.mutateAsync({
        personId: validationResult.data.personId,
        allowedSections: validationResult.data.allowedSections as SharedProfileSection[],
        createdById: validationResult.data.createdById,
      })
      const link = `${window.location.origin}/shared/${profile.token}`
      setGeneratedLink(link)
      onGenerated?.(profile.token, profile.id)
    } catch {
      toast.error(RESOURCING_COPY.generateLinkFailed)
    }
  }

  const handleCopy = async () => {
    if (!generatedLink) {
      return
    }

    try {
      await navigator.clipboard.writeText(generatedLink)
    } catch {
      // Clipboard API may be unavailable (permissions denied, non-secure context, etc.)
    }
    toast.info(RESOURCING_COPY.linkCopied)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Generate Shared Profile</SheetTitle>
          <SheetDescription>
            Select sections to include in the shared profile link.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {ALL_SHARED_SECTIONS.map((section) => (
            <Checkbox
              key={section}
              label={SHARED_PROFILE_SECTION_LABELS[section]}
              checked={selectedSections.includes(section)}
              disabled={section === 'basic-info'}
              onChange={(event) => toggleSection(section, event.target.checked)}
            />
          ))}
        </div>
        {generatedLink ? (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="font-medium text-slate-900">Shared profile link</p>
            <p className="mt-1 break-all text-slate-600">{generatedLink}</p>
            <Button
              type="button"
              className="mt-3"
              variant="outline"
              onClick={() => void handleCopy()}
            >
              Copy Link
            </Button>
          </div>
        ) : null}
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Done
            </Button>
          </SheetClose>
          {!generatedLink ? (
            <Button
              type="button"
              aria-busy={createMutation.isPending}
              disabled={createMutation.isPending}
              onClick={() => void handleGenerate()}
            >
              Generate Link
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
