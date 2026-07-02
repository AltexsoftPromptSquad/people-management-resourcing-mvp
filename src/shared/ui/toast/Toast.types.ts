import type { ReactNode } from 'react'

export type ToastTone = 'neutral' | 'success' | 'error' | 'warning' | 'info'

export type ShowToastInput = {
  title: string
  description?: string
  tone?: ToastTone
  durationMs?: number
}

export type ToastProviderProps = {
  children: ReactNode
}
