import type { FC } from 'react'
import { Button } from '@/shared/ui/button'
import { ShadcnBadge } from '@/shared/ui/shadcn-badge'
import type { HomePageProps } from './HomePage.types'

export const HomePage: FC<HomePageProps> = () => {
  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="max-w-3xl">
          <ShadcnBadge variant="secondary">Frontend-only MVP</ShadcnBadge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            People Management & Resourcing
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            A React SPA foundation for managing people, skills, projects, allocations, and
            resourcing workflows with mock data and local frontend state.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button">Start planning</Button>
            <Button type="button" variant="outline">
              Review structure
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
