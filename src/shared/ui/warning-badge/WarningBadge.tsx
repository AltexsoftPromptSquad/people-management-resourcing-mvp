import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { WarningBadgeProps } from './WarningBadge.types'

const toneClassName = {
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-red-200 bg-red-50 text-red-900',
} satisfies Record<NonNullable<WarningBadgeProps['tone']>, string>

export const WarningBadge: FC<WarningBadgeProps> = ({ tone = 'warning', children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        toneClassName[tone],
      )}
    >
      {children}
    </span>
  )
}
