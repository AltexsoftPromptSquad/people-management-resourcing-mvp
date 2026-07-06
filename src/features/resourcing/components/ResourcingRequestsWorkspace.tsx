import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { RESOURCING_COPY } from '../constants/copy'
import {
  useCandidateProposalsQuery,
  useCreateAndSubmitRequestMutation,
  usePatchCandidateProposalMutation,
  usePatchResourcingRequestMutation,
  useResourcingRequestsQuery,
} from '../hooks/use-resourcing-hooks'
import { useUnitsQuery } from '@/features/employee-profile/hooks'
import { getSharedProfilePagePath } from '@/app/routes'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/dialog'
import { DataTable } from '@/shared/ui/data-table'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { Input } from '@/shared/ui/input'
import { LoadingState } from '@/shared/ui/loading-state'
import { Select } from '@/shared/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'
import { StatusPill } from '@/shared/ui/status-pill'
import { Textarea } from '@/shared/ui/textarea'
import { toast } from '@/shared/ui/toast'
import type { ResourcingRequest } from '@/types/resourcing-request'

type ResourcingRequestsWorkspaceProps = {
  createdById: string
}

const emptyForm = {
  title: '',
  projectName: '',
  clientName: '',
  requiredRole: '',
  requiredSkills: '',
  gradeLevel: '',
  englishLevel: 'B2',
  expectedCompensationLevel: 'Middle',
  workloadPercent: '100',
  startDate: '',
  endDate: '',
  durationText: '',
  assignedUnitManagerId: '',
  priority: 'Medium',
  businessReason: '',
}

export const ResourcingRequestsWorkspace: FC<ResourcingRequestsWorkspaceProps> = ({
  createdById,
}) => {
  const filter = useMemo(() => ({ createdById }), [createdById])
  const requestsQuery = useResourcingRequestsQuery(filter)
  const unitsQuery = useUnitsQuery()
  const createMutation = useCreateAndSubmitRequestMutation(createdById)
  const patchRequestMutation = usePatchResourcingRequestMutation(filter)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [approveProposalId, setApproveProposalId] = useState<string | null>(null)
  const [rejectProposalId, setRejectProposalId] = useState<string | null>(null)
  const [approveNote, setApproveNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')

  const selectedRequest = requestsQuery.data?.find((item) => item.id === selectedId) ?? null
  const proposalsQuery = useCandidateProposalsQuery(
    selectedRequest?.status === 'Candidates Proposed' ? selectedRequest.id : undefined,
  )
  const patchProposalMutation = usePatchCandidateProposalMutation(selectedRequest?.id ?? '')

  const unitManagers = useMemo(
    () => (unitsQuery.data ?? []).map((unit) => ({ id: unit.managerId, label: unit.name })),
    [unitsQuery.data],
  )

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.title.trim()) errors.title = RESOURCING_COPY.validation.requestTitle
    if (!form.requiredRole.trim()) errors.requiredRole = RESOURCING_COPY.validation.requiredRole
    if (!form.gradeLevel.trim()) errors.gradeLevel = RESOURCING_COPY.validation.gradeLevel
    if (!form.assignedUnitManagerId)
      errors.assignedUnitManagerId = RESOURCING_COPY.validation.assignedUm
    const workload = Number(form.workloadPercent)
    if (!workload || workload < 1 || workload > 100)
      errors.workloadPercent = RESOURCING_COPY.validation.workload
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitRequest = async () => {
    if (!validateForm()) return

    try {
      await createMutation.mutateAsync({
        title: form.title.trim(),
        projectName: form.projectName.trim() || form.title.trim(),
        clientName: form.clientName.trim() || undefined,
        requiredRole: form.requiredRole.trim(),
        requiredSkills: form.requiredSkills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        gradeLevel: form.gradeLevel.trim(),
        englishLevel: form.englishLevel,
        expectedCompensationLevel: form.expectedCompensationLevel,
        workloadPercent: Number(form.workloadPercent),
        startDate: form.startDate || '2026-08-01',
        endDate: form.endDate || '2026-12-31',
        durationText: form.durationText || '4 months',
        assignedUnitManagerId: form.assignedUnitManagerId,
        priority: form.priority,
        businessReason: form.businessReason.trim() || undefined,
        createdById,
      })
      toast.success(RESOURCING_COPY.requestSubmitted)
      setFormOpen(false)
      setForm(emptyForm)
    } catch {
      toast.error(RESOURCING_COPY.requestSubmitFailed)
    }
  }

  const handleCancelRequest = async () => {
    if (!selectedRequest) return

    try {
      await patchRequestMutation.mutateAsync({
        id: selectedRequest.id,
        payload: { status: 'Cancelled' },
      })
      toast.success(RESOURCING_COPY.requestCancelled)
      setCancelDialogOpen(false)
    } catch {
      toast.error(RESOURCING_COPY.cancelFailed)
    }
  }

  const handleApprove = async () => {
    if (!approveProposalId) return

    const proposal = proposalsQuery.data?.find((item) => item.id === approveProposalId)
    if (!proposal) return

    try {
      await patchProposalMutation.mutateAsync({
        id: approveProposalId,
        payload: {
          status: 'Approved',
          feedback: approveNote.trim() || undefined,
          reviewedById: createdById,
        },
      })
      const name =
        proposal.candidateType === 'External'
          ? 'External candidate'
          : (proposal.employeeId ?? 'Candidate')
      toast.success(RESOURCING_COPY.candidateApproved(name))
      setApproveProposalId(null)
      setApproveNote('')
    } catch {
      toast.error(RESOURCING_COPY.approvalFailed)
    }
  }

  const handleReject = async () => {
    if (!rejectProposalId) return
    if (!rejectReason.trim()) {
      setRejectError(RESOURCING_COPY.validation.rejectionReason)
      return
    }

    const proposal = proposalsQuery.data?.find((item) => item.id === rejectProposalId)

    try {
      await patchProposalMutation.mutateAsync({
        id: rejectProposalId,
        payload: {
          status: 'Rejected',
          rejectionReason: rejectReason.trim(),
          reviewedById: createdById,
        },
      })
      toast.success(RESOURCING_COPY.candidateRejected(proposal?.employeeId ?? 'Candidate'))
      setRejectProposalId(null)
      setRejectReason('')
      setRejectError('')
    } catch {
      toast.error(RESOURCING_COPY.rejectionFailed)
    }
  }

  if (requestsQuery.isPending) {
    return <LoadingState label="Loading requests…" />
  }

  if (requestsQuery.isError) {
    return (
      <ErrorState
        title={RESOURCING_COPY.loadErrorTitle}
        description={RESOURCING_COPY.loadErrorDescription}
      />
    )
  }

  const requests = requestsQuery.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-950">My Requests</h1>
        <Sheet open={isFormOpen} onOpenChange={setFormOpen}>
          <SheetTrigger asChild>
            <Button type="button">New Request</Button>
          </SheetTrigger>
          <SheetContent side="right" className="max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>New Resourcing Request</SheetTitle>
              <SheetDescription>
                Fill in the request details and submit in one step.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Request title *
                <Input
                  className="mt-1"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                />
                {formErrors.title ? (
                  <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
                ) : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Project name
                <Input
                  className="mt-1"
                  value={form.projectName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, projectName: event.target.value }))
                  }
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Required role *
                <Input
                  className="mt-1"
                  value={form.requiredRole}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, requiredRole: event.target.value }))
                  }
                />
                {formErrors.requiredRole ? (
                  <p className="mt-1 text-xs text-red-600">{formErrors.requiredRole}</p>
                ) : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Grade level *
                <Input
                  className="mt-1"
                  value={form.gradeLevel}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, gradeLevel: event.target.value }))
                  }
                />
                {formErrors.gradeLevel ? (
                  <p className="mt-1 text-xs text-red-600">{formErrors.gradeLevel}</p>
                ) : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Assigned Unit Manager *
                <Select
                  className="mt-1"
                  value={form.assignedUnitManagerId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      assignedUnitManagerId: event.target.value,
                    }))
                  }
                >
                  <option value="">Select manager</option>
                  {unitManagers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.label}
                    </option>
                  ))}
                </Select>
                {formErrors.assignedUnitManagerId ? (
                  <p className="mt-1 text-xs text-red-600">{formErrors.assignedUnitManagerId}</p>
                ) : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Workload % *
                <Input
                  className="mt-1"
                  type="number"
                  min={1}
                  max={100}
                  value={form.workloadPercent}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, workloadPercent: event.target.value }))
                  }
                />
                {formErrors.workloadPercent ? (
                  <p className="mt-1 text-xs text-red-600">{formErrors.workloadPercent}</p>
                ) : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Required skills (comma-separated)
                <Input
                  className="mt-1"
                  value={form.requiredSkills}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, requiredSkills: event.target.value }))
                  }
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Business reason
                <Textarea
                  className="mt-1"
                  value={form.businessReason}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, businessReason: event.target.value }))
                  }
                />
              </label>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="button"
                aria-busy={createMutation.isPending}
                disabled={createMutation.isPending}
                onClick={() => void handleSubmitRequest()}
              >
                Submit
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 lg:grid-cols-[55%_45%]">
        <div>
          {requests.length === 0 ? (
            <EmptyState
              title={RESOURCING_COPY.dmEmptyTitle}
              description={RESOURCING_COPY.dmEmptyDescription}
            />
          ) : (
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
                    className={`cursor-pointer hover:bg-slate-50 ${selectedId === request.id ? 'bg-slate-50' : ''}`}
                    onClick={() => setSelectedId(request.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedId(request.id)
                      }
                    }}
                    tabIndex={0}
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
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {!selectedRequest ? (
            <EmptyState
              title={RESOURCING_COPY.selectRequestTitle}
              description={RESOURCING_COPY.selectRequestDescription}
            />
          ) : (
            <RequestDetailPanel
              request={selectedRequest}
              proposals={proposalsQuery.data ?? []}
              proposalsLoading={proposalsQuery.isPending}
              onCancel={() => setCancelDialogOpen(true)}
              onApprove={(proposalId) => setApproveProposalId(proposalId)}
              onReject={(proposalId) => setRejectProposalId(proposalId)}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title={RESOURCING_COPY.confirmCancelRequest.title}
        description={RESOURCING_COPY.confirmCancelRequest.description}
        cancelLabel={RESOURCING_COPY.confirmCancelRequest.cancel}
        confirmLabel={RESOURCING_COPY.confirmCancelRequest.confirm}
        isLoading={patchRequestMutation.isPending}
        onConfirm={() => void handleCancelRequest()}
      />

      <Sheet
        open={Boolean(approveProposalId)}
        onOpenChange={(open) => !open && setApproveProposalId(null)}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Approve candidate</SheetTitle>
            <SheetDescription>Add an optional note for this approval.</SheetDescription>
          </SheetHeader>
          <Textarea
            className="mt-4"
            aria-label="Approval note (optional)"
            placeholder="Optional approval note"
            value={approveNote}
            onChange={(event) => setApproveNote(event.target.value)}
          />
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => setApproveProposalId(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              aria-busy={patchProposalMutation.isPending}
              disabled={patchProposalMutation.isPending}
              onClick={() => void handleApprove()}
            >
              Approve
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={Boolean(rejectProposalId)}
        onOpenChange={(open) => !open && setRejectProposalId(null)}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Reject candidate</SheetTitle>
            <SheetDescription>A rejection reason is required.</SheetDescription>
          </SheetHeader>
          <Textarea
            className="mt-4"
            aria-label="Rejection reason"
            placeholder="Rejection reason *"
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
          />
          {rejectError ? <p className="mt-1 text-xs text-red-600">{rejectError}</p> : null}
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => setRejectProposalId(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              aria-busy={patchProposalMutation.isPending}
              disabled={patchProposalMutation.isPending}
              onClick={() => void handleReject()}
            >
              Reject
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

type RequestDetailPanelProps = {
  request: ResourcingRequest
  proposals: import('@/types/candidate-proposal').CandidateProposal[]
  proposalsLoading: boolean
  onCancel: () => void
  onApprove: (proposalId: string) => void
  onReject: (proposalId: string) => void
}

const RequestDetailPanel: FC<RequestDetailPanelProps> = ({
  request,
  proposals,
  proposalsLoading,
  onCancel,
  onApprove,
  onReject,
}) => {
  const hasApproved = proposals.some((item) => item.status === 'Approved')
  const canCancel = request.status === 'Draft' || request.status === 'Submitted'

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">{request.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{request.requestCode}</p>
        <StatusPill tone="info">{request.status}</StatusPill>
      </div>
      <dl className="grid gap-2 text-sm text-slate-700">
        <div>
          <dt className="font-medium">Role</dt>
          <dd>{request.requiredRole}</dd>
        </div>
        <div>
          <dt className="font-medium">Workload</dt>
          <dd>{request.workloadPercent}%</dd>
        </div>
        <div>
          <dt className="font-medium">Period</dt>
          <dd>
            {request.startDate} to {request.endDate}
          </dd>
        </div>
      </dl>
      {canCancel ? (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel Request
        </Button>
      ) : null}
      {request.status === 'Candidates Proposed' ? (
        <div className="space-y-3">
          <h3 className="font-medium text-slate-900">Proposed candidates</h3>
          {proposalsLoading ? <LoadingState label="Loading candidates…" /> : null}
          {proposals.map((proposal) => (
            <div key={proposal.id} className="rounded-md border border-slate-200 p-3 text-sm">
              <p className="font-medium">
                {proposal.candidateType === 'External' ? 'External candidate' : proposal.employeeId}
              </p>
              <p className="mt-1 text-slate-600">{proposal.fitSummary}</p>
              {proposal.sharedProfileToken ? (
                <a
                  className="mt-2 inline-block text-teal-700 underline"
                  href={getSharedProfilePagePath(proposal.sharedProfileToken)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View shared profile
                </a>
              ) : null}
              {proposal.externalProfileUrl ? (
                <a
                  className="mt-2 inline-block text-teal-700 underline"
                  href={proposal.externalProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  External profile
                </a>
              ) : null}
              {proposal.status === 'Proposed' && !hasApproved ? (
                <div className="mt-3 flex gap-2">
                  <Button type="button" size="sm" onClick={() => onApprove(proposal.id)}>
                    Approve
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onReject(proposal.id)}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">Status: {proposal.status}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
