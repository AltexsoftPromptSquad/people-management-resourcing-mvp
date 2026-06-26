import type { FC } from 'react'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import type { SubordinatesFilter } from '@/types/subordinates-query'
import type { CurrentProjectStatus, RiskLevel } from '@/types/person'

export type SubordinatesFiltersProps = {
  filter: SubordinatesFilter
  positions: string[]
  grades: string[]
  onFilterChange: (nextFilter: SubordinatesFilter) => void
}

const statusOptions: CurrentProjectStatus[] = [
  'Allocated',
  'Partially Allocated',
  'Bench',
  'Booked',
  'Unavailable',
]

const riskOptions: RiskLevel[] = ['None', 'Low', 'Medium', 'High', 'Critical']

export const SubordinatesFilters: FC<SubordinatesFiltersProps> = ({
  filter,
  positions,
  grades,
  onFilterChange,
}) => {
  return (
    <section aria-label="Subordinates filters" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Search</span>
        <Input
          value={filter.search ?? ''}
          placeholder="Search by name"
          onChange={(event) =>
            onFilterChange({ ...filter, search: event.target.value || undefined })
          }
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Position</span>
        <Select
          value={filter.position ?? ''}
          onChange={(event) =>
            onFilterChange({ ...filter, position: event.target.value || undefined })
          }
        >
          <option value="">All positions</option>
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Grade</span>
        <Select
          value={filter.grade ?? ''}
          onChange={(event) =>
            onFilterChange({ ...filter, grade: event.target.value || undefined })
          }
        >
          <option value="">All grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Status</span>
        <Select
          value={filter.currentStatus ?? ''}
          onChange={(event) =>
            onFilterChange({
              ...filter,
              currentStatus: (event.target.value as CurrentProjectStatus) || undefined,
            })
          }
        >
          <option value="">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Risk</span>
        <Select
          value={filter.riskLevel ?? ''}
          onChange={(event) =>
            onFilterChange({
              ...filter,
              riskLevel: (event.target.value as RiskLevel) || undefined,
            })
          }
        >
          <option value="">All risk levels</option>
          {riskOptions.map((riskLevel) => (
            <option key={riskLevel} value={riskLevel}>
              {riskLevel}
            </option>
          ))}
        </Select>
      </label>
    </section>
  )
}
