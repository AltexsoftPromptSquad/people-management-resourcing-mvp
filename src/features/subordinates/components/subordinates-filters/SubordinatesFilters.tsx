import type { FC } from 'react'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import type { CurrentProjectStatus, RiskLevel } from '@/types/person'
import type { SubordinatesFilter } from '@/types/subordinates-query'

type SubordinatesFiltersProps = {
  filter: SubordinatesFilter
  positionOptions: string[]
  gradeOptions: string[]
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
  positionOptions,
  gradeOptions,
  onFilterChange,
}) => {
  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-5"
      aria-label="Subordinates filters"
    >
      <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Search
          <Input
            value={filter.search ?? ''}
            onChange={(event) =>
              onFilterChange({ ...filter, search: event.target.value || undefined })
            }
            placeholder="Search by name"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Position
          <Select
            value={filter.position ?? ''}
            onChange={(event) =>
              onFilterChange({ ...filter, position: event.target.value || undefined })
            }
          >
            <option value="">All positions</option>
            {positionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Grade
          <Select
            value={filter.grade ?? ''}
            onChange={(event) =>
              onFilterChange({ ...filter, grade: event.target.value || undefined })
            }
          >
            <option value="">All grades</option>
            {gradeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Status
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
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Risk
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
            {riskOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>
      </div>
    </section>
  )
}
