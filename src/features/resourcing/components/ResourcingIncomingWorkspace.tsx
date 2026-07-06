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
import { externalCandidateUrlSchema } from '../schemas/candidate-decision.schema'
import { getCandidateWarnings } from '../utils/candidate-warnings'
import { CandidateProposalPanel } from './CandidateProposalPanel'
import { IncomingQueueTable } from './IncomingQueueTable'
import type { ExternalCandidate, SelectedCandidate } from './ResourcingIncomingWorkspace.types'
import { GenerateSharedProfileSheet } from '@/features/profile-sharing/components/GenerateSharedProfileSheet'
import { apiGet } from '@/lib/api/api-client'
import { ConfirmDialog } from '@/shared/ui/dialog'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PageHeader } from '@/shared/ui/page-header'
import { toast } from '@/shared/ui/toast'
import type { Person } from '@/types/person'
import type { ScheduledLeave } from '@/types/scheduled-leave'

type ResourcingIncomingWorkspaceProps = {
  managerId: string
  unitId: string
  personaDisplayName?: string
}

export const ResourcingIncomingWorkspace: FC<ResourcingIncomingWorkspaceProps> = ({
  managerId,
  unitId,
  personaDisplayName,
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
  const [externalCandidate, setExternalCandidate] = useState<ExternalCandidate | null>(null)
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

    // Optimistic update: mark as selected immediately so the controlled checkbox reflects
    // the checked state before the async API call resolves. Warnings are filled in after.
    setSelectedCandidates((current) => [
      ...current.filter((item) => item.person.id !== person.id),
      { person, fitSummary: '', warnings: [] },
    ])

    const leaves = await apiGet<ScheduledLeave[]>(`/api/people/${person.id}/scheduled-leaves`)
    const warnings = getCandidateWarnings(person, selectedRequest, leaves)

    setSelectedCandidates((current) =>
      current.map((item) => (item.person.id === person.id ? { ...item, warnings } : item)),
    )
  }

  const handleAddExternal = () => {
    const result = externalCandidateUrlSchema.safeParse({
      externalProfileUrl: externalUrl,
    })

    if (!result.success) {
      setExternalUrlError(result.error.issues[0]?.message ?? RESOURCING_COPY.validation.externalUrl)
      return
    }

    setExternalUrlError('')
    setExternalCandidate({ url: result.data.externalProfileUrl, fitSummary: '' })
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
      <PageHeader eyebrow={personaDisplayName} title="Incoming Requests" />

      <div className="grid gap-4 lg:grid-cols-[40%_60%]">
        <div>
          <IncomingQueueTable
            requests={requests}
            selectedRequestId={selectedRequestId}
            onSelectRequest={(requestId) => {
              setSelectedRequestId(requestId)
              setSelectedCandidates([])
              setExternalCandidate(null)
            }}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {!selectedRequest ? (
            <EmptyState
              title={RESOURCING_COPY.selectRequestTitle}
              description={RESOURCING_COPY.selectRequestDescription}
            />
          ) : (
            <CandidateProposalPanel
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
              onSubmit={() => {
                const hasInternal = selectedCandidates.length > 0
                const hasExternal = Boolean(externalCandidate)
                if (!hasInternal && !hasExternal) {
                  setCandidateError(RESOURCING_COPY.validation.noCandidates)
                  return
                }
                setCandidateError('')
                setSubmitDialogOpen(true)
              }}
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
