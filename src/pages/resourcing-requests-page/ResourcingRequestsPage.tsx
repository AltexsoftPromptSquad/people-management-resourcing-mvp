import type { FC } from 'react'
import { ResourcingRequestsWorkspace } from '@/features/resourcing/components/ResourcingRequestsWorkspace'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
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
      <section className="mx-auto max-w-7xl">
        <ResourcingRequestsWorkspace
          createdById={activePersona.personId}
          personaDisplayName={activePersona.displayName}
        />
      </section>
    </main>
  )
}
