import type { HTMLAttributes, ReactNode } from 'react'

export type DialogProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export type DialogContentProps = HTMLAttributes<HTMLDivElement>

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  cancelLabel: string
  confirmLabel: string
  onConfirm: () => void
  isLoading?: boolean
}
