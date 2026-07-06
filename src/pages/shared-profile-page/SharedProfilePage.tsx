import type { FC } from 'react'
import { useParams } from 'react-router'
import { SharedProfileSections } from '@/features/profile-sharing/components/SharedProfileSections'
import { useSharedProfileQuery } from '@/features/profile-sharing/hooks/use-shared-profile-hooks'
import { RESOURCING_COPY } from '@/features/resourcing/constants/copy'
import { ErrorState } from '@/shared/ui/error-state'
import { LoadingState } from '@/shared/ui/loading-state'

export const SharedProfilePage: FC = () => {
  const { token } = useParams<{ token: string }>()
  const profileQuery = useSharedProfileQuery(token)

  if (profileQuery.isPending) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <LoadingState label="Loading shared profile…" />
      </main>
    )
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <ErrorState
          title={RESOURCING_COPY.sharedProfileInvalidTitle}
          description={RESOURCING_COPY.sharedProfileInvalidDescription}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-950">Shared Profile</h1>
        <p className="mt-2 text-sm text-slate-600">
          {profileQuery.data.person.firstName} {profileQuery.data.person.lastName}
        </p>
      </header>
      <SharedProfileSections profile={profileQuery.data} />
    </main>
  )
}
