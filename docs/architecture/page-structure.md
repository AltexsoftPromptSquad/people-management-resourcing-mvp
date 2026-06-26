# Page Structure

Use this guide when creating a new route-level page. Pages should compose feature components, shared UI, and data hooks without becoming large business-logic containers.

For page state ownership, URL search params, query keys, filters, tables, and render stability, read `state-and-rendering.md` before implementing the behavior.

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

## URL Search Params And Query State

For the full decision flow, see `state-and-rendering.md`.

Pages may use URL search params for shareable view state such as active tab, selected unit, sort order, pagination, and applied filters. Do not wire every keystroke directly to URL params when that value also drives a TanStack Query key.

Use this pattern for search and filter-heavy pages:

1. Define typed default search params for the page.
2. Read URL-synchronized params through `useSearchParamState(defaultParams)`.
3. Keep editable draft controls in a page or feature hook while the user is typing.
4. Debounce text-like draft values before writing them to URL params, or write them on submit/blur when that is the better UX.
5. Build TanStack Query keys from URL-synchronized normalized params only.
6. Pass URL-synchronized params to feature query hooks and local draft params to filter controls.

This avoids request-per-character behavior while preserving shareable URLs.

Recommended ownership:

```text
src/shared/hooks/
  use-debounced-value.ts
  use-throttled-callback.ts
  use-search-param-state.ts
```

Use `src/shared/hooks` for app-agnostic timing and URL-state hooks. `useSearchParamState` owns one internal params state synchronized with the URL, plus parsing, serialization, default-value cleanup, and router replacement. Page or feature hooks own temporary draft filter state, apply buttons, debounced URL writes, and pagination reset behavior. Put domain-specific query hooks in `src/features/{domain}/hooks`.

Avoid:

```tsx
const [searchParams, setSearchParams] = useSearchParams()

const search = searchParams.get('search') ?? ''
const query = usePeopleQuery({ search })

const handleSearchChange = (value: string) => {
  setSearchParams({ search: value })
}
```

Prefer:

```tsx
const defaultPeopleSearchParams = {
  search: '',
  page: 1,
  unitIds: [] as readonly string[],
}

const { params, setParams } = useSearchParamState(defaultPeopleSearchParams)
const [draftParams, setDraftParams] = useState(params)

const debouncedSearch = useDebouncedValue(draftParams.search, 300)

useEffect(() => {
  setDraftParams(params)
}, [params])

useEffect(() => {
  setParams({ search: debouncedSearch, page: 1 })
}, [debouncedSearch, setParams])

const peopleQuery = usePeopleQuery(params)
```

When a page has an explicit **Apply filters** action, write URL params on that action instead of debouncing every field. Reset pagination to page 1 when writing search, filter, or sort changes that can change the result set.

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
