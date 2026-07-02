import type { HTMLAttributes, ReactNode } from 'react'

export type TabsProps = {
  children: ReactNode
  className?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export type TabsListProps = HTMLAttributes<HTMLUListElement>

export type TabsTriggerProps = HTMLAttributes<HTMLLIElement> & {
  value: string
  selected?: boolean
  disabled?: boolean
  id?: string
  panelId?: string
  tabIndex?: number
}

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string
  selected?: boolean
  tabId?: string
}
