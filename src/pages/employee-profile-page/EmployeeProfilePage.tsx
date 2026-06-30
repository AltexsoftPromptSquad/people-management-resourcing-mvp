import type { FC } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import type { EmployeeProfilePageProps } from './EmployeeProfilePage.types'

export const EmployeeProfilePage: FC<EmployeeProfilePageProps> = () => {
  const navigate = useNavigate()
  const { personId } = useParams()

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <Button type="button" variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
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
