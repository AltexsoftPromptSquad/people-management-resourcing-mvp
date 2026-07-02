import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { TextareaProps } from './Textarea.types'

export const Textarea: FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        'flex min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 shadow-xs outline-none transition-colors placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
