import type { FC } from 'react'
import { StatusPill } from '@/shared/ui/status-pill'
import type { ProfileHeaderProps } from './ProfileHeader.types'

const getRiskTone = (riskLevel: string) => {
  if (riskLevel === 'High' || riskLevel === 'Critical') {
    return 'danger' as const
  }

  if (riskLevel === 'Medium') {
    return 'warning' as const
  }

  if (riskLevel === 'Low') {
    return 'success' as const
  }

  return 'neutral' as const
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ person, managerName, unitName }) => {
  const initials = `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase()

  return (
    <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
            {initials}
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">
              {person.firstName} {person.lastName}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {person.position} · {person.grade}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {unitName ?? person.unitId} · Manager: {managerName ?? person.managerId ?? 'N/A'}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Availability: {person.availabilityPercent}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill tone="neutral">{person.currentProjectStatus}</StatusPill>
          <StatusPill
            tone={getRiskTone(person.riskLevel)}
          >{`Risk: ${person.riskLevel}`}</StatusPill>
        </div>
      </div>
    </header>
  )
}
