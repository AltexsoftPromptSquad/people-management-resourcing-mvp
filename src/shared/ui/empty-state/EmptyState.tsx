import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { EmptyStateProps } from './EmptyState.types'

export const EmptyState: FC<EmptyStateProps> = ({ title, description, className }) => {
  return (
    <section className={cn('rounded-lg border border-slate-200 bg-white p-6', className)}>
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </section>
  )
}
