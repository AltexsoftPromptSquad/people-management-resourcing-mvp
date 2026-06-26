import type { FC } from 'react'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'

export const RisksPage: FC = () => {
  const { activePersona, isError, isPending } = useActivePersona()

  if (isPending) return <LoadingState label="Loading risks" className="mx-auto mt-10 max-w-7xl" />
  if (isError || !activePersona) return <ErrorState className="mx-auto mt-10 max-w-7xl" />

  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-semibold text-slate-950">Risks</h1>
        <EmptyState
          className="mt-6"
          title="Dedicated risks view coming in Phase 3"
          description="Risk management is currently summarized on the dashboard and will expand on employee profiles."
        />
      </section>
    </main>
  )
}
