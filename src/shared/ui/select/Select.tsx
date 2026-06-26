import type { FC } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SelectProps } from './Select.types'

export const Select: FC<SelectProps> = ({ className, children, ...props }) => {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-9 w-full cursor-pointer appearance-none rounded-md border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-950 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />
    </div>
  )
}
