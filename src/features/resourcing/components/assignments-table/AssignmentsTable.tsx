import type { FC } from 'react'
import { DataTable } from '@/shared/ui/data-table'
import { EmptyState } from '@/shared/ui/empty-state'
import { StatusPill } from '@/shared/ui/status-pill'
import type { ResourcingAssignmentRecord } from '@/types/resourcing-assignment'

export type AssignmentsTableProps = {
  assignments: ResourcingAssignmentRecord[]
}

const formatDecisionDate = (value?: string) => {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const toneByStatus: Record<string, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  Approved: 'success',
  Rejected: 'danger',
  Withdrawn: 'warning',
  Proposed: 'info',
}

export const AssignmentsTable: FC<AssignmentsTableProps> = ({ assignments }) => {
  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments"
        description="Assignment history for your unit will appear here."
      />
    )
  }

  return (
    <DataTable>
      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
        <tr>
          <th className="px-4 py-3">Request title</th>
          <th className="px-4 py-3">Candidate type</th>
          <th className="px-4 py-3">Decision</th>
          <th className="px-4 py-3">Decision date</th>
          <th className="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {assignments.map((assignment) => (
          <tr key={assignment.id} className="hover:bg-slate-50">
            <td className="px-4 py-3 text-slate-900">{assignment.requestTitle}</td>
            <td className="px-4 py-3 text-slate-700">{assignment.candidateType}</td>
            <td className="px-4 py-3">
              <StatusPill tone={toneByStatus[assignment.decision] ?? 'neutral'}>
                {assignment.decision}
              </StatusPill>
            </td>
            <td className="px-4 py-3 text-slate-700">
              {formatDecisionDate(assignment.decisionDate)}
            </td>
            <td className="px-4 py-3">
              <StatusPill tone={toneByStatus[assignment.status] ?? 'info'}>
                {assignment.status}
              </StatusPill>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}
