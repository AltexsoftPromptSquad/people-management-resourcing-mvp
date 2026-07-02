import type { ReactNode } from 'react'

export type ProfileTabItem = {
  value: string
  label: string
  content: ReactNode
}

export type ProfileTabsProps = {
  tabs: ProfileTabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}
