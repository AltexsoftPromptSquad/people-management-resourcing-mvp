import type { FC } from 'react'
import { Button } from '@/shared/ui/button'
import type { EditableSectionProps } from './EditableSection.types'

export const EditableSection: FC<EditableSectionProps> = ({
  title,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  readContent,
  editContent,
  isSaving = false,
}) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
      </header>
      {isEditing ? editContent : readContent}
    </section>
  )
}
