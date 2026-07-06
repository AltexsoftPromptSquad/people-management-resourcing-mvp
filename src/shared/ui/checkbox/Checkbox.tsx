import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { CheckboxProps } from './Checkbox.types'

export const Checkbox: FC<CheckboxProps> = ({ className, label, id, disabled, ...props }) => {
  const inputId = id ?? (label ? `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 text-sm text-slate-700',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className="size-4 rounded border border-slate-300 text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        {...props}
      />
      {label ? <span>{label}</span> : null}
    </label>
  )
}
