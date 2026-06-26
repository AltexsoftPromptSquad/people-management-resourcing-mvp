import type { FC } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import type {
  SubordinateListItem,
  SubordinatesSort,
  SubordinatesSortField,
} from '@/types/subordinates-query'

type SubordinatesTableProps = {
  rows: SubordinateListItem[]
  sort: SubordinatesSort
  onSortChange: (sort: SubordinatesSort) => void
  onOpenProfile: (personId: string) => void
}

const columns: Array<{ key: SubordinatesSortField; label: string }> = [
  { key: 'fullName', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'grade', label: 'Grade' },
  { key: 'currentStatus', label: 'Status' },
  { key: 'riskLevel', label: 'Risk' },
]

const riskToneByLevel: Record<SubordinateListItem['riskLevel'], 'neutral' | 'warning' | 'danger'> =
  {
    None: 'neutral',
    Low: 'neutral',
    Medium: 'warning',
    High: 'danger',
    Critical: 'danger',
  }

const statusToneByStatus: Record<
  SubordinateListItem['currentStatus'],
  'neutral' | 'success' | 'warning' | 'danger'
> = {
  Allocated: 'success',
  'Partially Allocated': 'warning',
  Bench: 'neutral',
  Booked: 'warning',
  Unavailable: 'danger',
}

export const SubordinatesTable: FC<SubordinatesTableProps> = ({
  rows,
  sort,
  onSortChange,
  onOpenProfile,
}) => {
  const renderSortIcon = (field: SubordinatesSortField) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="size-4 text-slate-500" aria-hidden="true" />
    }

    return sort.direction === 'asc' ? (
      <ArrowUp className="size-4 text-slate-700" aria-hidden="true" />
    ) : (
      <ArrowDown className="size-4 text-slate-700" aria-hidden="true" />
    )
  }

  const handleSortChange = (field: SubordinatesSortField) => {
    if (sort.field !== field) {
      onSortChange({ field, direction: 'asc' })
      return
    }

    onSortChange({
      field,
      direction: sort.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-950">Subordinates</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-3 py-2">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
                    onClick={() => handleSortChange(column.key)}
                  >
                    {column.label}
                    {renderSortIcon(column.key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 last:border-none">
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className="cursor-pointer text-left text-sm font-medium text-slate-900 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
                    onClick={() => onOpenProfile(row.id)}
                  >
                    {row.fullName}
                  </button>
                </td>
                <td className="px-3 py-3 text-sm text-slate-700">{row.position}</td>
                <td className="px-3 py-3 text-sm text-slate-700">{row.grade}</td>
                <td className="px-3 py-3">
                  <Badge tone={statusToneByStatus[row.currentStatus]}>{row.currentStatus}</Badge>
                </td>
                <td className="px-3 py-3">
                  <Badge tone={riskToneByLevel[row.riskLevel]}>{row.riskLevel}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
