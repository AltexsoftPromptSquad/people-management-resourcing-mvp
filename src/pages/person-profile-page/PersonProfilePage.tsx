import type { FC } from 'react'
import { Link, useParams } from 'react-router'
import { getSubordinatesPagePath } from '@/app/routes'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import type { PersonProfilePageProps } from './PersonProfilePage.types'

export const PersonProfilePage: FC<PersonProfilePageProps> = () => {
  const { personId } = useParams()

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <Button asChild variant="outline" size="sm">
            <Link to={getSubordinatesPagePath()}>Back to Subordinates</Link>
          </Button>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Employee Profile</h1>
          <p className="mt-2 text-sm text-slate-600">Profile stub for Phase 3 implementation.</p>
        </header>

        <EmptyState
          title={`Profile entry for ${personId ?? 'unknown person'}`}
          description="Full managerial profile tabs, editing, and history views are scheduled for Phase 3."
        />
      </section>
    </main>
  )
}
