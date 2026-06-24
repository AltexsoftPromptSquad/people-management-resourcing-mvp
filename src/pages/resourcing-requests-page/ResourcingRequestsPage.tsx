import type { FC } from 'react'
import { RoleLandingSummary } from '@/features/roles/components/role-landing-summary'
import type { ResourcingRequestsPageProps } from './ResourcingRequestsPage.types'

export const ResourcingRequestsPage: FC<ResourcingRequestsPageProps> = () => {
  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <RoleLandingSummary
          role="delivery-manager"
          title="My resourcing requests"
          description="Phase 1 landing page for the Sales / Delivery Manager persona. Request creation, candidate review, and decision workflows are intentionally deferred."
          items={[
            'DM-specific navigation is active',
            'Seeded delivery persona is loaded',
            'Resourcing workflows are deferred to Phase 4',
          ]}
        />
      </div>
    </main>
  )
}
