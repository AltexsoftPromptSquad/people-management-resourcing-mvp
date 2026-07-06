import { useQuery } from '@tanstack/react-query'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { RESOURCING_COPY } from '../constants/copy'
import {
  useCandidateProposalsQuery,
  usePatchCandidateProposalMutation,
  useResourcingRequestsQuery,
  useSubmitCandidateProposalsMutation,
} from '../hooks/use-resourcing-hooks'
import { getCandidateWarnings } from '../utils/candidate-warnings'
import type { CandidateWarning } from '../constants/copy'
import { GenerateSharedProfileSheet } from '@/features/profile-sharing/components/GenerateSharedProfileSheet'
import { apiGet } from '@/lib/api/api-client'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { ConfirmDialog } from '@/shared/ui/dialog'
import { DataTable } from '@/shared/ui/data-table'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { Input } from '@/shared/ui/input'
import { LoadingState } from '@/shared/ui/loading-state'
import { StatusPill } from '@/shared/ui/status-pill'
import { Textarea } from '@/shared/ui/textarea'
import { WarningBadge } from '@/shared/ui/warning-badge'
import { toast } from '@/shared/ui/toast'
import type { Person } from '@/types/person'
import type { ResourcingRequest } from '@/types/resourcing-request'
import type { ScheduledLeave } from '@/types/scheduled-leave'

type SelectedCandidate = {
  person: Person
  fitSummary: string
  warnings: CandidateWarning[]
  sharedProfileId?: string
  sharedProfileToken?: string
}

type ResourcingIncomingWorkspaceProps = {
  managerId: string
  unitId: string
}

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const ResourcingIncomingWorkspace: FC<ResourcingIncomingWorkspaceProps> = ({
  managerId,
  unitId,
}) => {
  const filter = useMemo(() => ({ assignedManagerId: managerId }), [managerId])
  const requestsQuery = useResourcingRequestsQuery(filter)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const selectedRequest = requestsQuery.data?.find((item) => item.id === selectedRequestId) ?? null

  const proposalsQuery = useCandidateProposalsQuery(selectedRequestId ?? undefined)
  const submitMutation = useSubmitCandidateProposalsMutation(selectedRequestId ?? '')
  const withdrawMutation = usePatchCandidateProposalMutation(selectedRequestId ?? '')

  const unitPeopleQuery = useQuery({
    queryKey: ['people', { unitId }],
    queryFn: () => apiGet<Person[]>('/api/people', { unitId }),
  })

  const [selectedCandidates, setSelectedCandidates] = useState<SelectedCandidate[]>([])
  const [externalUrl, setExternalUrl] = useState('')
  const [externalUrlError, setExternalUrlError] = useState('')
  const [externalCandidate, setExternalCandidate] = useState<{
    url: string
    fitSummary: string
  } | null>(null)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [candidateError, setCandidateError] = useState('')
  const [sharedProfilePersonId, setSharedProfilePersonId] = useState<string | null>(null)
  const [withdrawProposalId, setWithdrawProposalId] = useState<string | null>(null)

  const toggleEmployee = async (person: Person, checked: boolean) => {
    if (!selectedRequest) return

    if (!checked) {
      setSelectedCandidates((current) => current.filter((item) => item.person.id !== person.id))
      return
    }

    const leaves = await apiGet<ScheduledLeave[]>(`/api/people/${person.id}/scheduled-leaves`)
    const warnings = getCandidateWarnings(person, selectedRequest, leaves)

    setSelectedCandidates((current) => [
      ...current.filter((item) => item.person.id !== person.id),
      { person, fitSummary: '', warnings },
    ])
  }

  const handleAddExternal = () => {
    if (!isValidUrl(externalUrl.trim())) {
      setExternalUrlError(RESOURCING_COPY.validation.externalUrl)
      return
    }

    setExternalUrlError('')
    setExternalCandidate({ url: externalUrl.trim(), fitSummary: '' })
    setExternalUrl('')
  }

  const handleSubmitCandidates = async () => {
    if (!selectedRequest) return

    const hasInternal = selectedCandidates.length > 0
    const hasExternal = Boolean(externalCandidate)

    if (!hasInternal && !hasExternal) {
      setCandidateError(RESOURCING_COPY.validation.noCandidates)
      return
    }

    setCandidateError('')

    try {
      await submitMutation.mutateAsync({
        requestId: selectedRequest.id,
        candidates: [
          ...selectedCandidates.map((candidate) => ({
            candidateType: 'Internal' as const,
            employeeId: candidate.person.id,
            fitSummary: candidate.fitSummary.trim() || 'Fit summary not provided.',
            proposedById: managerId,
            availabilityPercent: candidate.person.availabilityPercent,
            warnings: candidate.warnings.map((warning) => warning.type),
            sharedProfileId: candidate.sharedProfileId,
          })),
          ...(externalCandidate
            ? [
                {
                  candidateType: 'External' as const,
                  externalProfileUrl: externalCandidate.url,
                  fitSummary: externalCandidate.fitSummary.trim() || 'External candidate profile.',
                  proposedById: managerId,
                },
              ]
            : []),
        ],
      })
      toast.success(RESOURCING_COPY.candidatesSubmitted)
      setSubmitDialogOpen(false)
      setSelectedCandidates([])
      setExternalCandidate(null)
    } catch {
      toast.error(RESOURCING_COPY.submissionFailed)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawProposalId) return

    try {
      await withdrawMutation.mutateAsync({
        id: withdrawProposalId,
        payload: { status: 'Withdrawn', reviewedById: managerId },
      })
      toast.success(RESOURCING_COPY.candidateWithdrawn)
      setWithdrawProposalId(null)
    } catch {
      toast.error(RESOURCING_COPY.withdrawFailed)
    }
  }

  if (requestsQuery.isPending) {
    return <LoadingState label="Loading incoming requests…" />
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
  const isProposalMode =
    selectedRequest?.status === 'Submitted' || selectedRequest?.status === 'In Review'
  const isReadOnlyProposed = selectedRequest?.status === 'Candidates Proposed'

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-slate-950">Incoming Requests</h1>

      <div className="grid gap-4 lg:grid-cols-[40%_60%]">
        <div>
          {requests.length === 0 ? (
            <EmptyState
              title={RESOURCING_COPY.umEmptyTitle}
              description={RESOURCING_COPY.umEmptyDescription}
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
                    className={`cursor-pointer hover:bg-slate-50 ${selectedRequestId === request.id ? 'bg-slate-50' : ''}`}
                    onClick={() => {
                      setSelectedRequestId(request.id)
                      setSelectedCandidates([])
                      setExternalCandidate(null)
                    }}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedRequestId(request.id)
                      }
                    }}
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
            <IncomingProposalPanel
              request={selectedRequest}
              unitPeople={unitPeopleQuery.data ?? []}
              unitPeopleLoading={unitPeopleQuery.isPending}
              selectedCandidates={selectedCandidates}
              externalCandidate={externalCandidate}
              externalUrl={externalUrl}
              externalUrlError={externalUrlError}
              candidateError={candidateError}
              isProposalMode={isProposalMode}
              isReadOnlyProposed={isReadOnlyProposed}
              proposals={proposalsQuery.data ?? []}
              proposalsLoading={proposalsQuery.isPending}
              onToggleEmployee={(person, checked) => void toggleEmployee(person, checked)}
              onFitSummaryChange={(personId, value) =>
                setSelectedCandidates((current) =>
                  current.map((item) =>
                    item.person.id === personId ? { ...item, fitSummary: value } : item,
                  ),
                )
              }
              onExternalUrlChange={setExternalUrl}
              onAddExternal={handleAddExternal}
              onExternalFitSummaryChange={(value) =>
                setExternalCandidate((current) =>
                  current ? { ...current, fitSummary: value } : current,
                )
              }
              onOpenSharedProfile={(personId) => setSharedProfilePersonId(personId)}
              onSubmit={() => setSubmitDialogOpen(true)}
              onWithdraw={(proposalId) => setWithdrawProposalId(proposalId)}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        title={RESOURCING_COPY.confirmSubmitCandidates.title}
        description={RESOURCING_COPY.confirmSubmitCandidates.description}
        cancelLabel={RESOURCING_COPY.confirmSubmitCandidates.cancel}
        confirmLabel={RESOURCING_COPY.confirmSubmitCandidates.confirm}
        isLoading={submitMutation.isPending}
        onConfirm={() => void handleSubmitCandidates()}
      />

      <ConfirmDialog
        open={Boolean(withdrawProposalId)}
        onOpenChange={(open) => !open && setWithdrawProposalId(null)}
        title={RESOURCING_COPY.confirmWithdraw.title}
        description={RESOURCING_COPY.confirmWithdraw.description}
        cancelLabel={RESOURCING_COPY.confirmWithdraw.cancel}
        confirmLabel={RESOURCING_COPY.confirmWithdraw.confirm}
        isLoading={withdrawMutation.isPending}
        onConfirm={() => void handleWithdraw()}
      />

      {sharedProfilePersonId ? (
        <GenerateSharedProfileSheet
          personId={sharedProfilePersonId}
          createdById={managerId}
          open={Boolean(sharedProfilePersonId)}
          onOpenChange={(open) => !open && setSharedProfilePersonId(null)}
          onGenerated={(token, profileId) => {
            setSelectedCandidates((current) =>
              current.map((item) =>
                item.person.id === sharedProfilePersonId
                  ? { ...item, sharedProfileId: profileId, sharedProfileToken: token }
                  : item,
              ),
            )
          }}
        />
      ) : null}
    </div>
  )
}

type IncomingProposalPanelProps = {
  request: ResourcingRequest
  unitPeople: Person[]
  unitPeopleLoading: boolean
  selectedCandidates: SelectedCandidate[]
  externalCandidate: { url: string; fitSummary: string } | null
  externalUrl: string
  externalUrlError: string
  candidateError: string
  isProposalMode: boolean
  isReadOnlyProposed: boolean
  proposals: import('@/types/candidate-proposal').CandidateProposal[]
  proposalsLoading: boolean
  onToggleEmployee: (person: Person, checked: boolean) => void
  onFitSummaryChange: (personId: string, value: string) => void
  onExternalUrlChange: (value: string) => void
  onAddExternal: () => void
  onExternalFitSummaryChange: (value: string) => void
  onOpenSharedProfile: (personId: string) => void
  onSubmit: () => void
  onWithdraw: (proposalId: string) => void
}

const IncomingProposalPanel: FC<IncomingProposalPanelProps> = ({
  request,
  unitPeople,
  unitPeopleLoading,
  selectedCandidates,
  externalCandidate,
  externalUrl,
  externalUrlError,
  candidateError,
  isProposalMode,
  isReadOnlyProposed,
  proposals,
  proposalsLoading,
  onToggleEmployee,
  onFitSummaryChange,
  onExternalUrlChange,
  onAddExternal,
  onExternalFitSummaryChange,
  onOpenSharedProfile,
  onSubmit,
  onWithdraw,
}) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-xl font-semibold text-slate-950">{request.title}</h2>
      <p className="mt-1 text-sm text-slate-600">
        {request.requiredRole} · {request.workloadPercent}%
      </p>
    </div>

    {isReadOnlyProposed ? (
      <div className="space-y-3">
        <h3 className="font-medium text-slate-900">Submitted candidates</h3>
        {proposalsLoading ? <LoadingState label="Loading candidates…" /> : null}
        {proposals.map((proposal) => (
          <div key={proposal.id} className="rounded-md border border-slate-200 p-3 text-sm">
            <p className="font-medium">
              {proposal.candidateType === 'External'
                ? proposal.externalProfileUrl
                : proposal.employeeId}
            </p>
            <p className="mt-1 text-slate-600">{proposal.fitSummary}</p>
            {proposal.status === 'Proposed' ? (
              <Button
                type="button"
                className="mt-2"
                variant="outline"
                onClick={() => onWithdraw(proposal.id)}
              >
                Withdraw
              </Button>
            ) : (
              <p className="mt-2 text-xs text-slate-500">Status: {proposal.status}</p>
            )}
          </div>
        ))}
      </div>
    ) : null}

    {isProposalMode ? (
      <>
        <div>
          <h3 className="font-medium text-slate-900">Unit employees</h3>
          {unitPeopleLoading ? (
            <LoadingState label="Loading employees…" className="mt-2" />
          ) : (
            <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto">
              {unitPeople.map((person) => (
                <li key={person.id} className="flex items-center justify-between gap-2 text-sm">
                  <Checkbox
                    checked={selectedCandidates.some((item) => item.person.id === person.id)}
                    label={`${person.firstName} ${person.lastName} · ${person.availabilityPercent}% · ${person.riskLevel}`}
                    onChange={(event) => onToggleEmployee(person, event.target.checked)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-slate-900">Selected candidates</h3>
          {selectedCandidates.map((candidate) => (
            <div key={candidate.person.id} className="rounded-md border border-slate-200 p-3">
              <p className="font-medium text-sm">
                {candidate.person.firstName} {candidate.person.lastName}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {candidate.warnings.map((warning) => (
                  <WarningBadge key={warning.message} tone={warning.tone}>
                    {warning.message}
                  </WarningBadge>
                ))}
              </div>
              <Textarea
                className="mt-2"
                aria-label={`Fit summary for ${candidate.person.firstName}`}
                placeholder="Fit summary"
                value={candidate.fitSummary}
                onChange={(event) => onFitSummaryChange(candidate.person.id, event.target.value)}
              />
              <Button
                type="button"
                className="mt-2"
                variant="outline"
                onClick={() => onOpenSharedProfile(candidate.person.id)}
              >
                Generate Shared Profile
              </Button>
              {candidate.sharedProfileToken ? (
                <p className="mt-1 text-xs text-teal-700">Profile link ready</p>
              ) : null}
            </div>
          ))}

          {externalCandidate ? (
            <div className="rounded-md border border-slate-200 p-3">
              <p className="font-medium text-sm">External: {externalCandidate.url}</p>
              <Textarea
                className="mt-2"
                aria-label="External candidate fit summary"
                placeholder="Fit summary"
                value={externalCandidate.fitSummary}
                onChange={(event) => onExternalFitSummaryChange(event.target.value)}
              />
            </div>
          ) : null}

          <div className="flex gap-2">
            <Input
              aria-label="External profile URL"
              placeholder="https://example.com/profile"
              value={externalUrl}
              onChange={(event) => onExternalUrlChange(event.target.value)}
            />
            <Button type="button" variant="outline" onClick={onAddExternal}>
              Add
            </Button>
          </div>
          {externalUrlError ? <p className="text-xs text-red-600">{externalUrlError}</p> : null}
          {candidateError ? <p className="text-xs text-red-600">{candidateError}</p> : null}
        </div>

        <Button type="button" onClick={onSubmit}>
          Submit Candidates
        </Button>
      </>
    ) : null}
  </div>
)
