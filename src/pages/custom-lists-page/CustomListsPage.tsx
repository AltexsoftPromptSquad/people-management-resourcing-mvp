import type { FC } from 'react'
import { EmptyState } from '@/shared/ui/empty-state'

export const CustomListsPage: FC = () => {
  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <EmptyState
          title="Custom Lists placeholder"
          description="Custom list workflows are deferred to a later phase."
        />
      </section>
    </main>
  )
}
