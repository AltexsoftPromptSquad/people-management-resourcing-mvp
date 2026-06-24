import type { FC } from 'react'
import { RoleLandingSummary } from '@/features/roles/components/role-landing-summary'
import type { DashboardPageProps } from './DashboardPage.types'

export const DashboardPage: FC<DashboardPageProps> = () => {
  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <RoleLandingSummary
          role="unit-manager"
          title="Manager dashboard"
          description="Phase 1 landing page for the Unit Manager persona. Full dashboard widgets, subordinates, risks, and incoming request work move into later phases."
          items={[
            'Role-aware navigation is active',
            'Seeded manager persona is loaded',
            'Dashboard widgets are deferred to Phase 2',
          ]}
        />
      </div>
    </main>
  )
}
