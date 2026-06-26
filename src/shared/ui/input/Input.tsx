import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { InputProps } from './Input.types'

export const Input: FC<InputProps> = ({ className, type = 'text', ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 shadow-xs outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
