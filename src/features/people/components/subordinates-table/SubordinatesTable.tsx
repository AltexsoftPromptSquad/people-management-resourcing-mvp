import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, type FC } from 'react'
import { Button } from '@/shared/ui/button'
import { DataTable } from '@/shared/ui/data-table'
import { buildSubordinatesColumns } from '../../tables/subordinates.columns'
import type {
  SubordinateListItem,
  SubordinatesSort,
  SubordinatesSortField,
} from '@/types/subordinates-query'

export type SubordinatesTableProps = {
  subordinates: SubordinateListItem[]
  sort: SubordinatesSort
  onSortChange: (nextSort: SubordinatesSort) => void
  onOpenProfile: (personId: string) => void
}

const sortableFields: SubordinatesSortField[] = [
  'fullName',
  'position',
  'grade',
  'currentStatus',
  'riskLevel',
]

export const SubordinatesTable: FC<SubordinatesTableProps> = ({
  subordinates,
  sort,
  onSortChange,
  onOpenProfile,
}) => {
  const columns = useMemo(() => buildSubordinatesColumns({ onOpenProfile }), [onOpenProfile])

  // TanStack Table returns unstable function references by design.
  // The compiler warning is expected here; this hook remains safe in this component.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: subordinates,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const toggleSort = (field: SubordinatesSortField) => {
    onSortChange({
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <DataTable>
      <thead className="bg-slate-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const field = header.column.id as SubordinatesSortField
              const isSortable = sortableFields.includes(field)

              return (
                <th key={header.id} scope="col" className="px-4 py-3 font-medium text-slate-700">
                  {isSortable ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 font-medium text-slate-700 hover:bg-transparent"
                      onClick={() => toggleSort(field)}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sort.field === field ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}
                    </Button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y divide-slate-200">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="transition-colors hover:bg-slate-50">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-4 py-3 text-slate-700">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}
