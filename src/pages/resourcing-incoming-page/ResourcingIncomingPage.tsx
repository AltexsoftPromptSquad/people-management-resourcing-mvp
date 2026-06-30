import type { FC } from 'react'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'

export const ResourcingIncomingPage: FC = () => {
  const { activePersona, isError, isPending } = useActivePersona()

  if (isPending)
    return <LoadingState label="Loading resourcing queue" className="mx-auto mt-10 max-w-7xl" />
  if (isError || !activePersona) return <ErrorState className="mx-auto mt-10 max-w-7xl" />

  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-semibold text-slate-950">Incoming Resourcing Requests</h1>
        <EmptyState
          className="mt-6"
          title="Resourcing fulfillment coming in Phase 4"
          description="Incoming request queue and candidate proposal workflows are scheduled for a later phase."
        />
      </section>
    </main>
  )
}
