import type { FC } from 'react'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'

export const CustomListsPage: FC = () => {
  const { activePersona, isError, isPending } = useActivePersona()

  if (isPending)
    return <LoadingState label="Loading custom lists" className="mx-auto mt-10 max-w-7xl" />
  if (isError || !activePersona) return <ErrorState className="mx-auto mt-10 max-w-7xl" />

  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-semibold text-slate-950">Custom Lists</h1>
        <EmptyState
          className="mt-6"
          title="Custom lists coming in Phase 5"
          description="Bench, Booked, and Needs Conversation list workflows are not implemented yet."
        />
      </section>
    </main>
  )
}
