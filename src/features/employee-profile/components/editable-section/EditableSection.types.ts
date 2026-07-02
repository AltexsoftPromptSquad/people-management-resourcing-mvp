import type { ReactNode } from 'react'

export type EditableSectionProps = {
  title: string
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  readContent: ReactNode
  editContent: ReactNode
  isSaving?: boolean
}
