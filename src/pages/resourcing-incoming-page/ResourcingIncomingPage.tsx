import type { FC } from 'react'
import { EmptyState } from '@/shared/ui/empty-state'

export const ResourcingIncomingPage: FC = () => {
  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <EmptyState
          title="Incoming Resourcing placeholder"
          description="Unit Manager incoming request workflows are deferred to a later phase."
        />
      </section>
    </main>
  )
}
