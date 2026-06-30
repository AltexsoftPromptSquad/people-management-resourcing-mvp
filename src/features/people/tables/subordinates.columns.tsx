import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/shared/ui/badge'
import type { RiskLevel } from '@/types/person'
import type { SubordinateListItem } from '@/types/subordinates-query'

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

type BuildSubordinatesColumnsParams = {
  onOpenProfile: (personId: string) => void
}

export const buildSubordinatesColumns = ({
  onOpenProfile,
}: BuildSubordinatesColumnsParams): ColumnDef<SubordinateListItem>[] => [
  {
    accessorKey: 'fullName',
    header: 'Name',
    cell: ({ row }) => (
      <button
        type="button"
        className="cursor-pointer text-left text-slate-700 hover:text-slate-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
        onClick={() => onOpenProfile(row.original.id)}
      >
        {row.original.fullName}
      </button>
    ),
  },
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
]
