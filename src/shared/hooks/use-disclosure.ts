import { useCallback, useState } from 'react'

export type UseDisclosureOptions = {
  defaultOpen?: boolean
}

export type UseDisclosureResult = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setIsOpen: (isOpen: boolean) => void
}

export const useDisclosure = (options: UseDisclosureOptions = {}): UseDisclosureResult => {
  const [isOpen, setIsOpen] = useState(options.defaultOpen ?? false)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((currentIsOpen) => !currentIsOpen)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}
