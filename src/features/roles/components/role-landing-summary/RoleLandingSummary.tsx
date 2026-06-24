import type { FC } from 'react'
import { Badge } from '@/shared/ui/badge'
import { useActivePersona } from '../../hooks/use-active-persona'
import { roleDefinitions } from '../../constants'
import type { RoleLandingSummaryProps } from './RoleLandingSummary.types'

export const RoleLandingSummary: FC<RoleLandingSummaryProps> = ({
  role,
  title,
  description,
  items,
}) => {
  const { activePersona, isError, isPending } = useActivePersona()

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <Badge tone={role === 'employee' ? 'success' : 'neutral'} size="md">
            {roleDefinitions[role].label}
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="min-w-56 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Active persona</p>
          {isPending ? (
            <p className="mt-2 text-sm text-slate-600">Loading seeded persona...</p>
          ) : null}
          {isError ? <p className="mt-2 text-sm text-red-700">Persona data unavailable.</p> : null}
          {activePersona ? (
            <div className="mt-2">
              <p className="font-medium text-slate-950">{activePersona.displayName}</p>
              <p className="text-sm text-slate-600">{activePersona.title}</p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
