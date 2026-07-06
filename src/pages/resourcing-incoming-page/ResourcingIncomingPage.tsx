import type { FC } from 'react'
import { ResourcingIncomingWorkspace } from '@/features/resourcing/components/ResourcingIncomingWorkspace'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'

export const ResourcingIncomingPage: FC = () => {
  const { activePersona, isError, isPending } = useActivePersona()

  if (isPending) {
    return <LoadingState label="Loading resourcing queue" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isError || !activePersona) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <ResourcingIncomingWorkspace
          managerId={activePersona.personId}
          unitId={activePersona.unitId ?? 'unit-platform'}
          personaDisplayName={activePersona.displayName}
        />
      </section>
    </main>
  )
}
