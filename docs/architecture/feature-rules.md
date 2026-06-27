# Feature Rules

Explicit boundaries, ownership, shared vs. duplicated decisions, and state management rules. Supplements `project-structure.md`.

Read this document before adding a new feature, hook, component, or store.

---

## Feature Boundaries

Each feature owns exactly one domain. It does not reach into another feature's internals.

| Feature folder              | Domain it owns                                        | Must not reach into                            |
| --------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| `features/roles`            | Active role, persona list, role switching             | Any other feature's data                       |
| `features/dashboard`        | Widget counts, action item list for UM                | Employee profile tabs, resourcing forms        |
| `features/people`           | Subordinates list, person search, unit scoping        | Profile tabs, resourcing candidates            |
| `features/employee-profile` | All profile tabs, header, feedbacks, scheduled leaves | Resourcing request creation, subordinates list |
| `features/resourcing`       | Requests, candidates, decisions, assignment history   | Employee profile internal state                |
| `features/custom-lists`     | Custom fields, list builder, inline edit              | Employee profile header                        |
| `features/profile-sharing`  | Shared profile generation, public token view          | Resourcing request state                       |
| `features/documents`        | Document metadata, IDP                                | Risk records, feedback entries                 |
| `features/risks`            | Risk records, risk history                            | Feedbacks, scheduled leaves                    |
| `features/action-items`     | Action item records                                   | Risk records, profile tabs                     |

Cross-feature data (e.g. a person's skills needed by both `employee-profile` and `resourcing`) must come from `src/types/` and the mock data layer, not by importing feature internals.

---

## What May Be Shared (`src/shared/ui`)

Put a component in `src/shared/ui` only when ALL of these are true:

1. It has no knowledge of domain types (`Person`, `Risk`, `Feedback`, `ResourcingRequest`, etc.)
2. It would be usable in two or more different features
3. It is a generic UI primitive (form control, layout, feedback state, data display)

Required shared primitives for MVP (build these before the feature that needs them):

| Primitive       | Use cases                                             |
| --------------- | ----------------------------------------------------- |
| `Button`        | All actions — already exists                          |
| `Badge`         | Status, risk level, type labels — already exists      |
| `Tabs`          | Profile tabs, custom list tabs                        |
| `Select`        | Filter dropdowns, form selects                        |
| `Input`         | All text inputs                                       |
| `Textarea`      | Feedback content, fit summary, rejection reason       |
| `Checkbox`      | Section toggles in shared profile; filter-field usage |
| `Dialog`        | Confirm dialogs (withdraw, cancel, reject)            |
| `EmptyState`    | All empty list/table states — already exists          |
| `ErrorState`    | All query error states — already exists               |
| `LoadingState`  | All query loading states — already exists             |
| `StatusPill`    | Request status, leave status, candidate status        |
| `DataTable`     | Subordinates, assignment history, project history     |
| `Toast`         | Save confirmation messages                            |
| `ConfirmDialog` | Destructive action confirmation (wraps Dialog)        |
| `PageHeader`    | Consistent page title + action area layout            |
| `SectionHeader` | Tab/section heading with optional action              |

---

## What Must Not Be Duplicated

These are banned patterns across features:

| Anti-pattern                          | Why banned                                      | Correct approach                                                                       |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| Inline styled `<select>` element      | Creates inconsistent filter dropdowns           | Use `src/shared/ui/select`                                                             |
| Raw `<input>` with Tailwind classes   | Diverges from design system                     | Use `src/shared/ui/input`                                                              |
| Risk badge built per feature          | Three features show risk level                  | Build `RiskBadge` in `features/risks/components` or use shared `Badge` with tone logic |
| Status pill per feature               | Multiple features show request/candidate status | Use `src/shared/ui/status-pill`                                                        |
| Date formatting logic per file        | Produces inconsistent formats                   | Define once in `src/lib/formatting/dates.ts`                                           |
| Empty state text inline               | Inconsistent empty messaging                    | Use `EmptyState` primitive                                                             |
| Confirm dialog built per feature      | Divergent destructive-action UX                 | Use `ConfirmDialog` in shared UI                                                       |
| Reading `import.meta.env` in features | Bypasses config boundary                        | Import from `src/config.ts`                                                            |

---

## Business Logic Placement

| Logic type                              | Where it lives                                        |
| --------------------------------------- | ----------------------------------------------------- |
| Domain data query (TanStack Query)      | `src/features/{domain}/hooks/use-*-query.ts`          |
| Domain mutation (TanStack Query)        | `src/features/{domain}/hooks/use-*-mutation.ts`       |
| Form validation schema (Zod)            | `src/features/{domain}/schemas/*.schema.ts`           |
| Table column definitions                | `src/features/{domain}/tables/*.columns.tsx`          |
| Candidate warning detection logic       | `src/features/resourcing/utils/candidate-warnings.ts` |
| Leave overlap calculation               | `src/features/resourcing/utils/candidate-warnings.ts` |
| Date formatting                         | `src/lib/formatting/dates.ts`                         |
| Active role / persona ID                | `src/store/role-store.ts` (Zustand)                   |
| All server-like data (people, requests) | TanStack Query — never Zustand                        |

---

## State Management

### Use TanStack Query for:

All data that comes from mock API endpoints:

- People list, person detail
- Personas
- Resourcing requests, candidates
- Feedbacks, scheduled leaves, skills, risks, action items
- Documents, assignment history, project history
- Custom fields, custom lists

**Never** put any of the above into Zustand stores.

### Use Zustand for:

Only UI/application state that survives across unrelated renders and has no server-data equivalent:

- Active role
- Active persona ID
- UI preferences (sidebar open/closed, etc.)

### Candidate Warnings

The warning logic for FR-CP-006–008 is **not a UI concern** — it is business logic. Place it in:

```
src/features/resourcing/utils/candidate-warnings.ts
```

It receives a candidate (`Person`), their `ScheduledLeave[]`, their current `Allocation[]`, and the `ResourcingRequest`, and returns a typed `CandidateWarning[]`. The component reads the output and renders `WarningBadge` primitives.

---

## Data Access Patterns

### Feature API wrapper pattern (all features)

```ts
// src/features/people/api/get-subordinates.ts
import { apiClient } from '@/lib/api/api-client'
import type { Person } from '@/types/person'

export const getSubordinates = (managerId: string) =>
  apiClient<Person[]>(`/api/people?managerId=${managerId}`)
```

### TanStack Query hook pattern

```ts
// src/features/people/hooks/use-subordinates-query.ts
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/query-keys'
import { getSubordinates } from '../api/get-subordinates'
import { useRoleStore } from '@/store/role-store'

export const useSubordinatesQuery = () => {
  const activePersonaId = useRoleStore((state) => state.activePersonaId)
  return useQuery({
    queryKey: queryKeys.subordinates(activePersonaId),
    queryFn: () => getSubordinates(activePersonaId),
  })
}
```

### Mock handler pattern (new endpoints)

```ts
// src/mocks/handlers.ts — add alongside existing handlers
http.get('/api/people/:id/feedbacks', ({ params }) =>
  HttpResponse.json(feedbacks.filter(f => f.personId === params.id))
),
http.post('/api/people/:id/feedbacks', async ({ request, params }) => {
  const body = await request.json()
  const newFeedback = { id: generateId('feedback'), personId: params.id, ...body }
  feedbacks.push(newFeedback)
  return HttpResponse.json(newFeedback, { status: 201 })
}),
http.get('/api/people/:id/scheduled-leaves', ({ params }) =>
  HttpResponse.json(scheduledLeaves.filter(l => l.personId === params.id))
),
```

---

## What Requires Human Review

Before committing these categories of changes, a developer must review:

1. **Business rule enforcement in UI** — Any component that conditionally shows/hides data based on role must be reviewed against BRD §6 role permissions and assumptions AS-003–005.
2. **Sensitive section gating** — Any component that renders in the shared profile or employee personal view must be checked against FR-PS-003 and FR-EP-011.
3. **Assignment history vs project history separation** — Any feature touching either history tab must confirm they are never merged (BR-006, FR-AH-005, FR-EP-008).
4. **Feedback visibility** — Any component rendering Feedback entities must confirm it will not render in the personal view (BR-016).
5. **Candidate warning logic** — The three warning conditions (allocation, leave overlap, risk) must be correct and non-blocking (FR-CP-006–009). Incorrect logic could block valid candidates.
6. **Mutation side effects** — Inline list edits that mutate `Person.customFieldValues` must reflect in the employee profile immediately (FR-CL-005, AC-CL-003).
