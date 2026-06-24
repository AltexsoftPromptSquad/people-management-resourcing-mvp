import type { FC } from 'react'
import { RoleLandingSummary } from '@/features/roles/components/role-landing-summary'
import type { MyProfilePageProps } from './MyProfilePage.types'

export const MyProfilePage: FC<MyProfilePageProps> = () => {
  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <RoleLandingSummary
          role="employee"
          title="My profile"
          description="Phase 1 landing page for the Employee persona. Personal profile editing, IDP updates, action items, and certificates are planned for later phases."
          items={[
            'Employee-specific navigation is active',
            'Seeded employee persona is loaded',
            'Profile tabs are deferred to Phase 3',
          ]}
        />
      </div>
    </main>
  )
}
