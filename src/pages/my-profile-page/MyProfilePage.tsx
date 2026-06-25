import type { FC } from 'react'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import type { MyProfilePageProps } from './MyProfilePage.types'

export const MyProfilePage: FC<MyProfilePageProps> = () => {
  const { activePersona, isError, isPending } = useActivePersona()

  if (isPending) {
    return <LoadingState label="Loading employee workspace" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isError || !activePersona) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-slate-700">{activePersona.displayName}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">My Profile</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Foundation route for employee self-service. Contact editing, IDP status, documents, and
            action items are scheduled for Phase 3.
          </p>
        </header>
        <EmptyState
          title="Employee profile foundation is ready"
          description="The Employee landing route is scoped to the active employee persona and ready for the personal profile flow."
        />
      </section>
    </main>
  )
}
