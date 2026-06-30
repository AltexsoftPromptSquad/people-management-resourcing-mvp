import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { DataTableProps } from './DataTable.types'

export const DataTable: FC<DataTableProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs',
        className,
      )}
    >
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">{children}</table>
    </div>
  )
}
