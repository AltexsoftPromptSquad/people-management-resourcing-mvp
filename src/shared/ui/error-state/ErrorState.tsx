import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { ErrorStateProps } from './ErrorState.types'

export const ErrorState: FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'Mock data could not be loaded. Try refreshing the page.',
  className,
}) => {
  return (
    <section
      className={cn('rounded-lg border border-red-200 bg-red-50 p-6', className)}
      role="alert"
    >
      <h2 className="text-base font-semibold text-red-700">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-red-700">{description}</p>
    </section>
  )
}
