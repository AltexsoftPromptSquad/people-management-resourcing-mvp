import type { FC } from 'react'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import type { ResourcingRequestsPageProps } from './ResourcingRequestsPage.types'

export const ResourcingRequestsPage: FC<ResourcingRequestsPageProps> = () => {
  const { activePersona, isError, isPending } = useActivePersona()

  if (isPending) {
    return <LoadingState label="Loading resourcing workspace" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isError || !activePersona) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-teal-700">{activePersona.displayName}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Resourcing Requests</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Foundation route for Sales and Delivery Manager work. Request creation and candidate
            review workflows are scheduled for Phase 4.
          </p>
        </header>
        <EmptyState
          title="Resourcing foundation is ready"
          description="The Sales / Delivery Manager landing route is connected to role-aware navigation and mock persona data."
        />
      </section>
    </main>
  )
}
