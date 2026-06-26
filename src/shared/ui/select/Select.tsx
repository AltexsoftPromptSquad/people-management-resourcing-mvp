import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { SelectProps } from './Select.types'

export const Select: FC<SelectProps> = ({ className, children, ...props }) => {
  return (
    <select
      className={cn(
        'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-950 shadow-xs outline-none transition-colors focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
