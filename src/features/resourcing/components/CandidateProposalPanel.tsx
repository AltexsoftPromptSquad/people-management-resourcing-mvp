import type { FC } from 'react'
import { Link } from 'react-router'
import { CandidateRow } from './CandidateRow'
import type { ExternalCandidate, SelectedCandidate } from './ResourcingIncomingWorkspace.types'
import { getEmployeeProfilePagePath } from '@/app/routes'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { LoadingState } from '@/shared/ui/loading-state'
import { Textarea } from '@/shared/ui/textarea'
import type { Person } from '@/types/person'
import type { ResourcingRequest } from '@/types/resourcing-request'

type CandidateProposalPanelProps = {
  request: ResourcingRequest
  unitPeople: Person[]
  unitPeopleLoading: boolean
  selectedCandidates: SelectedCandidate[]
  externalCandidate: ExternalCandidate | null
  externalUrl: string
  externalUrlError: string
  candidateError: string
  isProposalMode: boolean
  isReadOnlyProposed: boolean
  isDecisionMode: boolean
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

export const CandidateProposalPanel: FC<CandidateProposalPanelProps> = ({
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
  isDecisionMode,
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
              {proposal.candidateType === 'External' || !proposal.employeeId ? (
                (proposal.externalProfileUrl ?? 'External candidate')
              ) : (
                <Link
                  className="text-teal-700 underline"
                  to={getEmployeeProfilePagePath(proposal.employeeId)}
                >
                  {proposal.employeeId}
                </Link>
              )}
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

    {isDecisionMode ? (
      <div className="space-y-3">
        <h3 className="font-medium text-slate-900">Decision details</h3>
        {proposalsLoading ? <LoadingState label="Loading candidates…" /> : null}
        {proposals.map((proposal) => (
          <div key={proposal.id} className="rounded-md border border-slate-200 p-3 text-sm">
            <p className="font-medium">
              {proposal.candidateType === 'External' || !proposal.employeeId ? (
                (proposal.externalProfileUrl ?? 'External candidate')
              ) : (
                <Link
                  className="text-teal-700 underline"
                  to={getEmployeeProfilePagePath(proposal.employeeId)}
                >
                  {proposal.employeeId}
                </Link>
              )}
            </p>
            <p className="mt-1 text-slate-600">{proposal.fitSummary}</p>
            <p className="mt-2 text-xs text-slate-500">Status: {proposal.status}</p>
            {proposal.rejectionReason ? (
              <p className="mt-1 text-xs text-slate-700">
                Rejection reason: {proposal.rejectionReason}
              </p>
            ) : null}
            {proposal.feedback ? (
              <p className="mt-1 text-xs text-slate-700">Decision note: {proposal.feedback}</p>
            ) : null}
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
          ) : unitPeople.length === 0 ? (
            <p className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              No unit employees match the requested role.
            </p>
          ) : (
            <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto">
              {unitPeople.map((person) => (
                <li key={person.id} className="flex items-center justify-between gap-2 text-sm">
                  <Checkbox
                    checked={selectedCandidates.some((item) => item.person.id === person.id)}
                    label={`${person.firstName} ${person.lastName} · ${person.position} · ${person.grade} · ${person.englishLevel} · ${person.availabilityPercent}% · ${person.riskLevel}`}
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
            <CandidateRow
              key={candidate.person.id}
              candidate={candidate}
              onFitSummaryChange={onFitSummaryChange}
              onOpenSharedProfile={onOpenSharedProfile}
            />
          ))}

          {externalCandidate ? (
            <div className="rounded-md border border-slate-200 p-3">
              <p className="font-medium text-sm">External: {externalCandidate.url}</p>
              <Textarea
                className="mt-2"
                aria-label="External candidate fit summary"
                placeholder="Summarise why this candidate is a good fit…"
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
