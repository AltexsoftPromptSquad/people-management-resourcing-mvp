import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export type SheetProps = {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export type SheetTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

export type SheetCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

export type SheetContentSide = 'right' | 'left' | 'top' | 'bottom'

export type SheetContentProps = HTMLAttributes<HTMLDivElement> & {
  side?: SheetContentSide
  onEscapeKeyDown?: (event: KeyboardEvent) => void
}

export type SheetHeaderProps = HTMLAttributes<HTMLDivElement>

export type SheetFooterProps = HTMLAttributes<HTMLDivElement>

export type SheetTitleProps = HTMLAttributes<HTMLHeadingElement>

export type SheetDescriptionProps = HTMLAttributes<HTMLParagraphElement>
