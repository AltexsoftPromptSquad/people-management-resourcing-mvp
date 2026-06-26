import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { useMemo, type FC } from 'react'
import { useNavigate } from 'react-router'
import { getPersonProfilePagePath } from '@/app/routes'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import type {
  SubordinateListItem,
  SubordinatesSort,
  SubordinatesSortField,
} from '@/types/subordinates-query'
import type { RiskLevel } from '@/types/person'

export type SubordinatesTableProps = {
  subordinates: SubordinateListItem[]
  sort: SubordinatesSort
  onSortChange: (nextSort: SubordinatesSort) => void
}

const sortableFields: SubordinatesSortField[] = [
  'fullName',
  'position',
  'grade',
  'currentStatus',
  'riskLevel',
]

const riskTone = (riskLevel: RiskLevel) => {
  if (riskLevel === 'High' || riskLevel === 'Critical') {
    return 'danger'
  }

  if (riskLevel === 'Medium') {
    return 'warning'
  }

  if (riskLevel === 'Low') {
    return 'success'
  }

  return 'neutral'
}

export const SubordinatesTable: FC<SubordinatesTableProps> = ({
  subordinates,
  sort,
  onSortChange,
}) => {
  const navigate = useNavigate()

  const columns = useMemo<ColumnDef<SubordinateListItem>[]>(
    () => [
      { accessorKey: 'fullName', header: 'Name' },
      { accessorKey: 'position', header: 'Position' },
      { accessorKey: 'grade', header: 'Grade' },
      { accessorKey: 'currentStatus', header: 'Status' },
      {
        accessorKey: 'riskLevel',
        header: 'Risk',
        cell: ({ row }) => (
          <Badge tone={riskTone(row.original.riskLevel)}>{row.original.riskLevel}</Badge>
        ),
      },
    ],
    [],
  )

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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
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
            <tr
              key={row.id}
              className="cursor-pointer transition-colors hover:bg-slate-50"
              onClick={() => navigate(getPersonProfilePagePath(row.original.id))}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(getPersonProfilePagePath(row.original.id))
                }
              }}
              tabIndex={0}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
