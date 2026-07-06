import type { FC } from 'react'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { WarningBadge } from '@/shared/ui/warning-badge'
import type { SelectedCandidate } from './ResourcingIncomingWorkspace.types'

type CandidateRowProps = {
  candidate: SelectedCandidate
  onFitSummaryChange: (personId: string, value: string) => void
  onOpenSharedProfile: (personId: string) => void
}

export const CandidateRow: FC<CandidateRowProps> = ({
  candidate,
  onFitSummaryChange,
  onOpenSharedProfile,
}) => {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <p className="font-medium text-sm">
        {candidate.person.firstName} {candidate.person.lastName}
      </p>
      <p className="mt-1 text-xs text-slate-600">
        {candidate.person.position} · {candidate.person.grade} · {candidate.person.englishLevel} ·{' '}
        {candidate.person.currentProjectStatus} · {candidate.person.availabilityPercent}% · Risk:{' '}
        {candidate.person.riskLevel}
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
  )
}
