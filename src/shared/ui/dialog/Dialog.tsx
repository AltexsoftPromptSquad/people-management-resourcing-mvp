import type { FC, MouseEvent } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/button'
import type {
  ConfirmDialogProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogProps,
  DialogTitleProps,
} from './Dialog.types'

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

type DialogContentContextValue = {
  titleId: string
  descriptionId: string
}

const DialogContext = createContext<DialogContextValue | null>(null)
const DialogContentContext = createContext<DialogContentContextValue | null>(null)

const useDialogContext = () => {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('Dialog components must be used within Dialog.')
  }

  return context
}

const useDialogContentContext = () => {
  const context = useContext(DialogContentContext)

  if (!context) {
    throw new Error('Dialog title and description must be used within DialogContent.')
  }

  return context
}

export const Dialog: FC<DialogProps> = ({ children, open, defaultOpen = false, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open ?? internalOpen

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)
    },
    [onOpenChange, open],
  )

  const contextValue = useMemo<DialogContextValue>(
    () => ({
      open: isOpen,
      setOpen,
    }),
    [isOpen, setOpen],
  )

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>
}

export const DialogContent: FC<DialogContentProps> = ({ className, children, ...props }) => {
  const { open, setOpen } = useDialogContext()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const contentElement = contentRef.current
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusableElements = contentElement
      ? Array.from(contentElement.querySelectorAll<HTMLElement>(focusableSelector))
      : []
    focusableElements[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
        return
      }

      if (event.key !== 'Tab' || !contentElement) {
        return
      }

      const currentFocusable = Array.from(
        contentElement.querySelectorAll<HTMLElement>(focusableSelector),
      )

      if (currentFocusable.length === 0) {
        return
      }

      const first = currentFocusable[0]
      const last = currentFocusable[currentFocusable.length - 1]

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose, open])

  if (!open) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close dialog"
        className="absolute inset-0 cursor-pointer bg-slate-950/45"
        onClick={handleClose}
      />
      <DialogContentContext.Provider value={{ titleId, descriptionId }}>
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            'relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl focus:outline-none',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </DialogContentContext.Provider>
    </div>,
    document.body,
  )
}

export const DialogHeader: FC<DialogHeaderProps> = ({ className, ...props }) => {
  return <div className={cn('flex flex-col gap-1.5 text-left', className)} {...props} />
}

export const DialogFooter: FC<DialogFooterProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

export const DialogTitle: FC<DialogTitleProps> = ({ className, ...props }) => {
  const { titleId } = useDialogContentContext()

  return (
    <h2 id={titleId} className={cn('text-lg font-semibold text-slate-950', className)} {...props} />
  )
}

export const DialogDescription: FC<DialogDescriptionProps> = ({ className, ...props }) => {
  const { descriptionId } = useDialogContentContext()

  return <p id={descriptionId} className={cn('text-sm text-slate-600', className)} {...props} />
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onConfirm,
  isLoading = false,
}) => {
  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button type="button" aria-busy={isLoading} disabled={isLoading} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
