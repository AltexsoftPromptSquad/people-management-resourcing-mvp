import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { LoadingStateProps } from './LoadingState.types'

export const LoadingState: FC<LoadingStateProps> = ({ label = 'Loading', className }) => {
  return (
    <section
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600',
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    >
      {label}
    </section>
  )
}
