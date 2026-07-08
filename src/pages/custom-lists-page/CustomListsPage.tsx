import type { FC } from 'react'
import { CustomListsWorkspace } from '@/features/custom-lists/components/custom-lists-workspace'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
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
        <CustomListsWorkspace
          managerId={activePersona.personId}
          personaDisplayName={activePersona.displayName}
        />
      </section>
    </main>
  )
}
