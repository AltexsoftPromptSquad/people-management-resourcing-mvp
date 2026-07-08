import type { FC } from 'react'
import { AssignmentsTable } from '@/features/resourcing/components/assignments-table'
import { useResourcingAssignmentsQuery } from '@/features/resourcing/hooks/use-resourcing-hooks'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PageHeader } from '@/shared/ui/page-header'

export const ResourcingAssignmentsPage: FC = () => {
  const { activePersona, isError: isPersonaError, isPending: isPersonaPending } = useActivePersona()

  const assignmentsQuery = useResourcingAssignmentsQuery(activePersona?.personId)

  if (isPersonaPending || assignmentsQuery.isPending) {
    return <LoadingState label="Loading assignments" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isPersonaError || !activePersona || assignmentsQuery.isError) {
    return (
      <ErrorState
        className="mx-auto mt-10 max-w-7xl"
        title="Could not load assignments"
        description="Refresh the page to try again."
      />
    )
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <PageHeader
          eyebrow={activePersona.displayName}
          title="Assignments"
          description="Read-only assignment history for your unit."
        />
        <AssignmentsTable assignments={assignmentsQuery.data ?? []} />
      </section>
    </main>
  )
}
