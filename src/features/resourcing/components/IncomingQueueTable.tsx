import type { FC, KeyboardEvent } from 'react'
import { DataTable } from '@/shared/ui/data-table'
import { EmptyState } from '@/shared/ui/empty-state'
import { StatusPill } from '@/shared/ui/status-pill'
import type { ResourcingRequest } from '@/types/resourcing-request'

type IncomingQueueTableProps = {
  requests: ResourcingRequest[]
  selectedRequestId: string | null
  onSelectRequest: (requestId: string) => void
}

export const IncomingQueueTable: FC<IncomingQueueTableProps> = ({
  requests,
  selectedRequestId,
  onSelectRequest,
}) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No incoming requests"
        description="Resourcing requests assigned to you will appear here."
      />
    )
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, requestId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectRequest(requestId)
    }
  }

  return (
    <DataTable>
      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
        <tr>
          <th className="px-4 py-3">Code</th>
          <th className="px-4 py-3">Title</th>
          <th className="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {requests.map((request) => (
          <tr
            key={request.id}
            className={`cursor-pointer hover:bg-slate-50 ${selectedRequestId === request.id ? 'bg-slate-50' : ''}`}
            onClick={() => onSelectRequest(request.id)}
            tabIndex={0}
            onKeyDown={(event) => handleKeyDown(event, request.id)}
          >
            <td className="px-4 py-3 font-medium">{request.requestCode}</td>
            <td className="px-4 py-3">{request.title}</td>
            <td className="px-4 py-3">
              <StatusPill tone="info">{request.status}</StatusPill>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}
