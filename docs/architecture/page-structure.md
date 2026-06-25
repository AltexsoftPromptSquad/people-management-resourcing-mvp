# Page Structure

Use this guide when creating a new route-level page. Pages should compose feature components, shared UI, and data hooks without becoming large business-logic containers.

## Placement

Create pages under `src/pages/{page-name}`:

```text
src/pages/example-page/
  ExamplePage.tsx
  ExamplePage.types.ts
  index.ts
  components/
    example-page-header/
      ExamplePageHeader.tsx
      ExamplePageHeader.types.ts
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
src/pages/example-page/
  ExamplePage.tsx
  ExamplePage.types.ts
  index.ts
```

```tsx
// ExamplePage.types.ts
export type ExamplePageProps = Record<string, never>
```

```tsx
// ExamplePage.tsx
import type { FC } from 'react'
import { Button } from '@/shared/ui/button'
import type { ExamplePageProps } from './ExamplePage.types'

export const ExamplePage: FC<ExamplePageProps> = () => {
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
export { ExamplePage } from './ExamplePage'
export type { ExamplePageProps } from './ExamplePage.types'
```

## Async Page Example

Page-level async state should be explicit and readable:

```tsx
import type { FC } from 'react'
import { ExampleSummary } from '@/features/example/components/example-summary'
import { useExampleSummaryQuery } from '@/features/example/hooks/use-example-summary-query'
import type { ExamplePageProps } from './ExamplePage.types'

export const ExamplePage: FC<ExamplePageProps> = () => {
  const { data, isPending, isError } = useExampleSummaryQuery()

  if (isPending) {
    return <ExamplePageSkeleton />
  }

  if (isError) {
    return <ExamplePageError />
  }

  if (data.items.length === 0) {
    return <ExamplePageEmptyState />
  }

  return <ExampleSummary summary={data} />
}
```

## Route Registration

Keep route paths and route registration centralized under `src/app`:

```text
src/app/routes.ts
src/app/router.tsx
src/pages/example-page/
```

Declare path helpers in `src/app/routes.ts`:

```ts
export const getExamplePagePath = () => '/example'
```

Register the route in `src/app/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router'
import { getExamplePagePath } from './routes'
import { ExamplePage } from '@/pages/example-page'

export const router = createBrowserRouter([
  {
    path: getExamplePagePath(),
    element: <ExamplePage />,
  },
])
```

Use route helpers everywhere else:

```tsx
import { Link } from 'react-router'
import { getExamplePagePath } from '@/app/routes'

export const ExampleLink: FC = () => {
  return <Link to={getExamplePagePath()}>Example</Link>
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
