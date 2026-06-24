# Component Structure

Use this structure from the start of every React UI change. Choose the component location by ownership, not by convenience.

## Placement Rules

Reusable UI components:

```text
src/shared/ui/{component-name}/
  ComponentName.tsx
  ComponentName.types.ts
  index.ts
```

Business/domain components:

```text
src/features/{domain}/components/{component-name}/
  ComponentName.tsx
  ComponentName.types.ts
  index.ts
```

Page-only components:

```text
src/pages/{page-name}/components/{component-name}/
  ComponentName.tsx
  ComponentName.types.ts
  index.ts
```

Add these only when needed:

```text
ComponentName.constants.ts
ComponentName.utils.ts
```

## Reusable UI Example

Use `src/shared/ui` for components that do not know about people, projects, allocations, or other business domains.

### Badge

This is a concrete reusable UI component example from the project.

```text
src/shared/ui/badge/
  Badge.tsx
  Badge.types.ts
  index.ts
```

```tsx
// Badge.types.ts
export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger'

export type BadgeSize = 'sm' | 'md'

export type BadgeProps = {
  children: string
  tone?: BadgeTone
  size?: BadgeSize
  className?: string
}
```

```tsx
// Badge.tsx
import type { FC } from 'react'
import { cn } from '../../../lib/utils'
import type { BadgeProps, BadgeSize, BadgeTone } from './Badge.types'

const toneClassName: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  success: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-100 text-amber-800 ring-amber-200',
  danger: 'bg-red-100 text-red-700 ring-red-200',
}

const sizeClassName: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export const Badge: FC<BadgeProps> = ({ children, tone = 'neutral', size = 'sm', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium ring-1 ring-inset',
        toneClassName[tone],
        sizeClassName[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
```

```ts
// index.ts
export { Badge } from './Badge'
export type { BadgeProps, BadgeSize, BadgeTone } from './Badge.types'
```

### Status Pill

```text
src/shared/ui/status-pill/
  StatusPill.tsx
  StatusPill.types.ts
  index.ts
```

```tsx
// StatusPill.types.ts
export type StatusPillTone = 'neutral' | 'success' | 'warning' | 'danger'

export type StatusPillProps = {
  label: string
  tone?: StatusPillTone
  className?: string
}
```

```tsx
// StatusPill.tsx
import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { StatusPillProps } from './StatusPill.types'

const toneClassName: Record<NonNullable<StatusPillProps['tone']>, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
}

export const StatusPill: FC<StatusPillProps> = ({ label, tone = 'neutral', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        toneClassName[tone],
        className,
      )}
    >
      {label}
    </span>
  )
}
```

```ts
// index.ts
export { StatusPill } from './StatusPill'
export type { StatusPillProps, StatusPillTone } from './StatusPill.types'
```

## Business Component Example

Use `src/features/{domain}/components` for components that know about domain data or business rules.

```text
src/features/people/components/person-allocation-card/
  PersonAllocationCard.tsx
  PersonAllocationCard.types.ts
  index.ts
```

```tsx
// PersonAllocationCard.types.ts
export type PersonAllocationCardProps = {
  personName: string
  projectName: string
  allocationPercent: number
}
```

```tsx
// PersonAllocationCard.tsx
import type { FC } from 'react'
import { StatusPill } from '@/shared/ui/status-pill'
import type { PersonAllocationCardProps } from './PersonAllocationCard.types'

export const PersonAllocationCard: FC<PersonAllocationCardProps> = ({
  personName,
  projectName,
  allocationPercent,
}) => {
  const isOverallocated = allocationPercent > 100

  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-slate-950">{personName}</h3>
          <p className="text-sm text-slate-600">{projectName}</p>
        </div>
        <StatusPill label={`${allocationPercent}%`} tone={isOverallocated ? 'danger' : 'success'} />
      </div>
    </article>
  )
}
```

```ts
// index.ts
export { PersonAllocationCard } from './PersonAllocationCard'
export type { PersonAllocationCardProps } from './PersonAllocationCard.types'
```

## Page-Only Component Example

Use `src/pages/{page-name}/components` for components that are only useful inside one page.

```text
src/pages/home-page/components/home-page-header/
  HomePageHeader.tsx
  HomePageHeader.types.ts
  index.ts
```

```tsx
// HomePageHeader.types.ts
export type HomePageHeaderProps = {
  title: string
  description: string
}
```

```tsx
// HomePageHeader.tsx
import type { FC } from 'react'
import type { HomePageHeaderProps } from './HomePageHeader.types'

export const HomePageHeader: FC<HomePageHeaderProps> = ({ title, description }) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </header>
  )
}
```

```ts
// index.ts
export { HomePageHeader } from './HomePageHeader'
export type { HomePageHeaderProps } from './HomePageHeader.types'
```

## Async State Rules

Components that render async data must handle all meaningful states:

```tsx
import type { FC } from 'react'

export const PeopleTableSection: FC = () => {
  const { data, isPending, isError } = usePeopleQuery()

  if (isPending) {
    return <PeopleTableSkeleton />
  }

  if (isError) {
    return <PeopleTableError />
  }

  if (data.length === 0) {
    return <PeopleTableEmptyState />
  }

  return <PeopleTable people={data} />
}
```

## Baseline Rules

- Use named exports.
- Use explicit `Props` types.
- Define React components as arrow functions where possible and type props through `FC<Props>`.
- Do not use `any`.
- Use Tailwind CSS and `cn()` for conditional classes.
- Prefer shadcn/ui primitives before custom primitives.
- Keep constants and utilities colocated only when they are component-specific.
- Keep accessibility basics: semantic tags, form labels, button elements for actions, visible focus states, and keyboard-friendly controls.
- After changes, run `npm run build`, `npm run lint`, and `npm run format:check`.
