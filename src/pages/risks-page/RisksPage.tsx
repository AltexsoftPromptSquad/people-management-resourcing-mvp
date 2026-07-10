import { useMemo, useState, type FC } from 'react'
import { useNavigate } from 'react-router'
import { getEmployeeProfilePagePath } from '@/app/routes'
import { SubordinatesTable } from '@/features/people/components/subordinates-table'
import { defaultSubordinatesSort } from '@/features/people/hooks/use-subordinates-page-state'
import { useSubordinatesQuery } from '@/features/people/hooks/use-subordinates-query'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'
import { PageHeader } from '@/shared/ui/page-header'
import type { SubordinatesSort } from '@/types/subordinates-query'

export const RisksPage: FC = () => {
  const { activePersona, isError: isPersonaError, isPending: isPersonaPending } = useActivePersona()
  const managerId = activePersona?.personId
  const navigate = useNavigate()
  const [sort, setSort] = useState<SubordinatesSort>(defaultSubordinatesSort)

  const subordinatesQuery = useSubordinatesQuery(managerId, {}, sort)

  const atRiskSubordinates = useMemo(
    () => (subordinatesQuery.data ?? []).filter((person) => person.riskLevel !== 'None'),
    [subordinatesQuery.data],
  )

  if (isPersonaPending || subordinatesQuery.isPending) {
    return <LoadingState label="Loading risks" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isPersonaError || !activePersona || subordinatesQuery.isError) {
    return <ErrorState className="mx-auto mt-10 max-w-7xl" />
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <PageHeader
          eyebrow={activePersona.displayName}
          title="Risks"
          description="Subordinates with an active risk level, ordered for quick review."
        />

        {atRiskSubordinates.length === 0 ? (
          <EmptyState
            title="No subordinates with active risks"
            description="People in your unit currently have no risk flags. New risks will appear here."
          />
        ) : (
          <SubordinatesTable
            subordinates={atRiskSubordinates}
            sort={sort}
            onSortChange={setSort}
            onOpenProfile={(personId) => navigate(getEmployeeProfilePagePath(personId))}
          />
        )}
      </section>
    </main>
  )
}
