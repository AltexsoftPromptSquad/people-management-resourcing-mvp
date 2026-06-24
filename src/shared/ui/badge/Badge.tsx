import type { FC } from 'react'
import { cn } from '../../../lib/utils'
import type { BadgeProps, BadgeSize, BadgeTone } from './Badge.types'

const toneClassName: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  success: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-100 text-amber-800 ring-amber-200',
  danger: 'bg-red-100 text-red-700 ring-red-200',
}

const sizeClassName: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export const Badge: FC<BadgeProps> = ({ children, tone = 'neutral', size = 'sm', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium ring-1 ring-inset',
        toneClassName[tone],
        sizeClassName[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
