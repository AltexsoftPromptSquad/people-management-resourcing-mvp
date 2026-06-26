import type { FC } from 'react'
import { EmptyState } from '@/shared/ui/empty-state'

export const RisksPage: FC = () => {
  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <EmptyState
          title="Risks placeholder"
          description="Operational risks management workflows are deferred to a later phase."
        />
      </section>
    </main>
  )
}
