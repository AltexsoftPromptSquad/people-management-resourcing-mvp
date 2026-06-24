# Page Structure

Use this guide when creating a new route-level page. Pages should compose feature components, shared UI, and data hooks without becoming large business-logic containers.

## Placement

Create pages under `src/pages/{page-name}`:

```text
src/pages/home-page/
  HomePage.tsx
  HomePage.types.ts
  index.ts
  components/
    home-page-header/
      HomePageHeader.tsx
      HomePageHeader.types.ts
      index.ts
```

Use page-only components only when they are specific to that page. Move reusable UI to `src/shared/ui` and domain/business components to `src/features/{domain}/components`.

## File Rules

- Use `PageName.tsx`, `PageName.types.ts`, and `index.ts`.
- Use named exports.
- Define page components as arrow functions where possible: `export const PageName: FC<PageNameProps> = (...) => ...`.
- Use explicit `Props` types, even when empty.
- Do not use `any`.
- Keep route/page components thin.
- Use Tailwind CSS and `cn()` where class composition is needed.
- Use shadcn/ui primitives where possible.

## Page Responsibilities

A page can:

- Own page layout and spacing.
- Read URL params/search params.
- Trigger page-level data queries.
- Compose feature components and shared UI.
- Handle page-level loading, empty, and error states.

A page should not:

- Contain large tables directly.
- Contain form validation schemas.
- Hard-code large mock datasets.
- Own complex domain transformations.
- Duplicate feature logic that belongs in `src/features/{domain}`.

## Basic Page Example

```text
src/pages/home-page/
  HomePage.tsx
  HomePage.types.ts
  index.ts
```

```tsx
// HomePage.types.ts
export type HomePageProps = Record<string, never>
```

```tsx
// HomePage.tsx
import type { FC } from 'react'
import { Button } from '@/shared/ui/button'
import type { HomePageProps } from './HomePage.types'

export const HomePage: FC<HomePageProps> = () => {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">
              People Management & Resourcing
            </h1>
            <p className="text-sm text-slate-600">
              Plan people, projects, skills, and allocations from one frontend-only MVP.
            </p>
          </div>
          <Button type="button">Start planning</Button>
        </header>
      </div>
    </main>
  )
}
```

```ts
// index.ts
export { HomePage } from './HomePage'
export type { HomePageProps } from './HomePage.types'
```

## Async Page Example

Page-level async state should be explicit and readable:

```tsx
import type { FC } from 'react'
import { HomeSummary } from '@/features/home/components/home-summary'
import { useHomeSummaryQuery } from '@/features/home/hooks/use-home-summary-query'
import type { HomePageProps } from './HomePage.types'

export const HomePage: FC<HomePageProps> = () => {
  const { data, isPending, isError } = useHomeSummaryQuery()

  if (isPending) {
    return <HomePageSkeleton />
  }

  if (isError) {
    return <HomePageError />
  }

  if (data.items.length === 0) {
    return <HomePageEmptyState />
  }

  return <HomeSummary summary={data} />
}
```

## Route Registration

Keep route paths and route registration centralized under `src/app`:

```text
src/app/routes.ts
src/app/router.tsx
src/pages/home-page/
```

Declare path helpers in `src/app/routes.ts`:

```ts
export const getHomePagePath = () => '/'
```

Register the route in `src/app/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router'
import { getHomePagePath } from './routes'
import { HomePage } from '@/pages/home-page'

export const router = createBrowserRouter([
  {
    path: getHomePagePath(),
    element: <HomePage />,
  },
])
```

Use route helpers everywhere else:

```tsx
import { Link } from 'react-router'
import { getHomePagePath } from '@/app/routes'

export const HomeLink: FC = () => {
  return <Link to={getHomePagePath()}>Home</Link>
}
```

## Checklist

Before finishing a new page:

- Page is under `src/pages/{page-name}`.
- Page-only components are under `src/pages/{page-name}/components`.
- Business components live under `src/features/{domain}/components`.
- Shared primitives live under `src/shared/ui`.
- Loading, empty, and error states exist for async data.
- Accessibility basics are covered: headings, labels, buttons, focus states, and semantic layout.
- `npm run build`, `npm run lint`, and `npm run format:check` pass.
