import { Slot } from '@radix-ui/react-slot'
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
import type {
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetProps,
  SheetTitleProps,
  SheetTriggerProps,
} from './Sheet.types'

type SheetContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  setTriggerElement: (element: HTMLElement | null) => void
  getTriggerElement: () => HTMLElement | null
}

type SheetContentContextValue = {
  titleId: string
  descriptionId: string
}

const SheetContext = createContext<SheetContextValue | null>(null)
const SheetContentContext = createContext<SheetContentContextValue | null>(null)

const sideClassName = {
  right: 'right-0 top-0 h-full w-full max-w-md border-l',
  left: 'left-0 top-0 h-full w-full max-w-md border-r',
  top: 'left-0 top-0 w-full border-b',
  bottom: 'bottom-0 left-0 w-full border-t',
} satisfies Record<NonNullable<SheetContentProps['side']>, string>

const useSheetContext = () => {
  const context = useContext(SheetContext)

  if (!context) {
    throw new Error('Sheet components must be used within Sheet.')
  }

  return context
}

const useSheetContentContext = () => {
  const context = useContext(SheetContentContext)

  if (!context) {
    throw new Error('Sheet title and description must be used within SheetContent.')
  }

  return context
}

export const Sheet: FC<SheetProps> = ({ children, open, defaultOpen = false, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const triggerElementRef = useRef<HTMLElement | null>(null)
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

  const contextValue = useMemo<SheetContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      setTriggerElement: (element: HTMLElement | null) => {
        triggerElementRef.current = element
      },
      getTriggerElement: () => triggerElementRef.current,
    }),
    [isOpen, setOpen],
  )

  return <SheetContext.Provider value={contextValue}>{children}</SheetContext.Provider>
}

export const SheetTrigger: FC<SheetTriggerProps> = ({
  className,
  asChild = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const { setOpen, setTriggerElement } = useSheetContext()
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className={className}
      type={asChild ? undefined : type}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)

        if (event.defaultPrevented) {
          return
        }

        setTriggerElement(event.currentTarget)
        setOpen(true)
      }}
      {...props}
    />
  )
}

export const SheetClose: FC<SheetCloseProps> = ({
  className,
  asChild = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const { setOpen, getTriggerElement } = useSheetContext()
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className={className}
      type={asChild ? undefined : type}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)

        if (event.defaultPrevented) {
          return
        }

        setOpen(false)
        getTriggerElement()?.focus()
      }}
      {...props}
    />
  )
}

export const SheetContent: FC<SheetContentProps> = ({
  className,
  children,
  side = 'right',
  onEscapeKeyDown,
  ...props
}) => {
  const { open, setOpen, getTriggerElement } = useSheetContext()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const handleClose = useCallback(() => {
    setOpen(false)
    getTriggerElement()?.focus()
  }, [getTriggerElement, setOpen])

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
    const firstFocusable = focusableElements[0]
    firstFocusable?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
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
        return
      }

      onEscapeKeyDown?.(event)

      if (event.defaultPrevented) {
        return
      }

      handleClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      getTriggerElement()?.focus()
    }
  }, [getTriggerElement, handleClose, open, onEscapeKeyDown])

  if (!open) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close panel"
        className="absolute inset-0 cursor-pointer bg-slate-950/45"
        onClick={handleClose}
      />
      <SheetContentContext.Provider value={{ titleId, descriptionId }}>
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            'absolute z-10 overflow-y-auto bg-white p-6 shadow-xl focus:outline-none',
            sideClassName[side],
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </SheetContentContext.Provider>
    </div>,
    document.body,
  )
}

export const SheetHeader: FC<SheetHeaderProps> = ({ className, ...props }) => {
  return <div className={cn('flex flex-col gap-1.5 text-left', className)} {...props} />
}

export const SheetFooter: FC<SheetFooterProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

export const SheetTitle: FC<SheetTitleProps> = ({ className, ...props }) => {
  const { titleId } = useSheetContentContext()

  return (
    <h2 id={titleId} className={cn('text-lg font-semibold text-slate-950', className)} {...props} />
  )
}

export const SheetDescription: FC<SheetDescriptionProps> = ({ className, ...props }) => {
  const { descriptionId } = useSheetContentContext()

  return <p id={descriptionId} className={cn('text-sm text-slate-600', className)} {...props} />
}
