import type { FC } from 'react'
import { Link, useParams } from 'react-router'
import { getSubordinatesPagePath } from '@/app/routes'
import { EmptyState } from '@/shared/ui/empty-state'
import type { PersonProfilePageProps } from './PersonProfilePage.types'

export const PersonProfilePage: FC<PersonProfilePageProps> = () => {
  const { personId } = useParams<{ personId: string }>()

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold text-slate-950">Person Profile (Stub)</h1>
          <p className="mt-2 text-sm text-slate-600">
            Phase 2 row drilldown target for person <span className="font-medium">{personId}</span>.
          </p>
        </header>
        <EmptyState
          title="Profile details are planned for Phase 3"
          description="This route confirms subordinate row navigation and browser history behavior."
        />
        <div>
          <Link
            to={getSubordinatesPagePath()}
            className="text-sm font-medium text-slate-800 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
          >
            Back to Subordinates
          </Link>
        </div>
      </section>
    </main>
  )
}
