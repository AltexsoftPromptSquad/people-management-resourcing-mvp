# Phase 1 Foundation Implementation Plan

## Purpose

This document is the implementation plan for `.planning/phases/phase-1-foundation/SRS.md`. It translates the Phase 1 SRS into an execution-ready sequence for building the application foundation of the People Management & Resourcing MVP.

The implementation must follow:

- `AGENTS.md`
- `docs/architecture/project-structure.md`
- `docs/architecture/component-structure.md`
- `docs/architecture/shared-ui.md`
- `docs/architecture/page-structure.md`
- `docs/architecture/visual-theme.md`
- `.planning/phases/phase-1-foundation/SRS.md`
- `.planning/phases/phase-1-foundation/VALIDATION.md`

Phase 1 establishes the app shell, role switcher, role-aware routes, app providers, shared domain types, and mock data boundary. It must not implement deferred Phase 2 through Phase 5 business flows.

## Implementation Defaults And Decisions

| Area                      | Decision                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| Role switcher UI          | Use segmented buttons built from the existing `Button` primitive.                                         |
| Shared `Select` primitive | Do not add `Select` in Phase 1. It is not needed for the chosen role switcher pattern.                    |
| Mock boundary             | Use MSW endpoints in local development and in hosted demo builds when `VITE_ENABLE_MOCKS=true`.           |
| Async state               | Use TanStack Query for server-like mock data.                                                             |
| Local app state           | Use Zustand only for active role and active persona state.                                                |
| Role persistence          | Session-only in memory. Reload resets to Unit Manager.                                                    |
| Default role              | Unit Manager.                                                                                             |
| Seed size                 | 75 people total across 3 units.                                                                           |
| Persona names             | Use placeholders until Carlos confirms final names.                                                       |
| Desktop UI audit          | Not part of this implementation plan. Do not run it unless the user explicitly asks or grants permission. |
| Dependencies              | Do not add new npm dependencies. Use what already exists in `package.json`.                               |

Placeholder personas:

| Role                     | Persona ID             | Person ID             | Display name      | Title             |
| ------------------------ | ---------------------- | --------------------- | ----------------- | ----------------- |
| Unit Manager             | `persona-um-001`       | `person-um-001`       | `Olena Kovalenko` | Unit Manager      |
| Sales / Delivery Manager | `persona-dm-001`       | `person-dm-001`       | `Marcus Reed`     | Delivery Manager  |
| Employee                 | `persona-employee-001` | `person-employee-001` | `Nazar Petrenko`  | Software Engineer |

## Step-By-Step Implementation Plan

### 1. Add App Providers And Query Client

Create the app-level provider layer before adding feature queries.

Implementation requirements:

- Add a TanStack Query client in `src/lib/query/query-client.ts`.
- Configure query defaults for mock data:
  - `retry: false`
  - non-zero `staleTime`, for example 30 seconds
  - no custom persistence
- Add `src/app/providers/AppProviders.tsx`.
- Wrap `AppRouterProvider` with `AppProviders` in `src/App.tsx`.
- Keep router ownership in `src/app/router-provider.tsx` and `src/app/router.tsx`.

Acceptance checks:

- The app still renders through `App`.
- Query provider is available to route pages and feature hooks.
- No backend, auth, database, or persistence layer is introduced.

### 2. Add Shared Domain Types

Create shared types in `src/types/` before writing mocks, store, or feature hooks.

Required type files:

- `src/types/role.ts`
- `src/types/persona.ts`
- `src/types/person.ts`
- `src/types/unit.ts`
- `src/types/skill.ts`
- `src/types/resourcing-request.ts`

Contract decisions:

- `Role` union:

```ts
export type Role = 'unit-manager' | 'delivery-manager' | 'employee'
```

- `Persona` must include stable `id`, `role`, `personId`, `displayName`, `title`, optional `unitId`, and `isDefault`.
- `Person` must include the Phase 1 fields from the SRS: identity, work email, position, grade, unit, manager, employment status, current project status, availability, and risk level.
- `ResourcingRequest` is minimal and exists only to seed the future mock boundary.

Implementation rules:

- Types must not import UI, pages, or feature modules.
- Use explicit string unions for fixed domain values.
- Do not use `any`.

### 3. Add Zustand Role Store

Create `src/store/role-store.ts`.

State shape:

- `activeRole: Role`
- `activePersonaId: string`

Actions:

- `setActiveRole(role: Role): void`
- `setActivePersona(personaId: string): void`

Default behavior:

- Initial role is `unit-manager`.
- Initial persona is `persona-um-001`.
- `setActiveRole('unit-manager')` sets persona to `persona-um-001`.
- `setActiveRole('delivery-manager')` sets persona to `persona-dm-001`.
- `setActiveRole('employee')` sets persona to `persona-employee-001`.

Constraints:

- Do not store people, requests, units, documents, risks, action items, or other server-like data in Zustand.
- Do not add local storage or reload persistence in Phase 1.

### 4. Add Mock Data, Factories, And MSW Handlers

Create the mock data foundation under `src/mocks/`.

Required mock modules:

- `src/mocks/browser.ts`
- `src/mocks/handlers.ts`
- `src/mocks/data/personas.ts`
- `src/mocks/data/units.ts`
- `src/mocks/data/people.ts`
- `src/mocks/data/skills.ts`
- `src/mocks/data/resourcing-requests.ts`
- `src/mocks/factories/person-factory.ts`

Data rules:

- Seed exactly 3 personas.
- Seed exactly 3 units.
- Seed exactly 75 people total:
  - 3 stable persona-linked people
  - 72 generated people
- Use `faker.seed(20260625)` before generated records.
- Generated records must have stable deterministic IDs, for example `person-generated-001`.
- Distribute generated people across the 3 units.
- Include enough people under the Unit Manager unit to support Phase 2 subordinate work.
- Seed skills and minimal resourcing requests for API boundary readiness, but do not build UI workflows for them.

MSW handlers:

| Method | Path                       | Response              |
| ------ | -------------------------- | --------------------- |
| GET    | `/api/personas`            | `Persona[]`           |
| GET    | `/api/units`               | `Unit[]`              |
| GET    | `/api/people`              | `Person[]`            |
| GET    | `/api/resourcing/requests` | `ResourcingRequest[]` |

Mock startup:

- Add an `enableMocking()` helper in `src/mocks/browser.ts`.
- In `src/main.tsx`, call `enableMocking()` when `import.meta.env.DEV` is true or `VITE_ENABLE_MOCKS=true`.
- Start React rendering after MSW startup resolves.
- Do not enable MSW in hosted production/demo builds unless `VITE_ENABLE_MOCKS=true` is explicitly configured.

### 5. Add API Client Helpers And Role Query Hook

Create a typed frontend API boundary instead of importing mock data directly in UI.

Required modules:

- `src/lib/api/api-client.ts`
- `src/features/roles/api/get-personas.ts`
- `src/features/roles/hooks/use-personas-query.ts`

API client behavior:

- Wrap `fetch`.
- Parse JSON responses.
- Throw a readable error for non-2xx responses.
- Keep the helper frontend-only and generic.

Roles feature behavior:

- `getPersonas()` calls `/api/personas`.
- `usePersonasQuery()` uses TanStack Query with a stable query key such as `['personas']`.
- UI components consume personas through the hook or page-level composition, not from mock data files.

### 6. Add Role Switcher

Create the domain-aware component:

- `src/features/roles/components/role-switcher/RoleSwitcher.tsx`
- `src/features/roles/components/role-switcher/RoleSwitcher.types.ts`
- `src/features/roles/components/role-switcher/index.ts`

Behavior:

- Render three segmented buttons:
  - Unit Manager
  - Sales / Delivery Manager
  - Employee
- Use the existing shared `Button` primitive.
- Do not add a new shared `Select`.
- Show active state with both visual treatment and text/ARIA state.
- Add `aria-label="Active role"` or an equivalent accessible label.
- On click:
  - update role store
  - navigate to the role landing route

Route mapping:

| Role               | Landing route          |
| ------------------ | ---------------------- |
| `unit-manager`     | `/dashboard`           |
| `delivery-manager` | `/resourcing/requests` |
| `employee`         | `/my-profile`          |

Accessibility:

- Buttons must be keyboard reachable.
- Focus rings must remain visible.
- Use `aria-pressed` for active role buttons.

### 7. Add Role-Aware Routes, Guards, Redirects, And Navigation

Update route helpers in `src/app/routes.ts`:

- `getHomePagePath() => '/'`
- `getDashboardPagePath() => '/dashboard'`
- `getResourcingRequestsPagePath() => '/resourcing/requests'`
- `getMyProfilePagePath() => '/my-profile'`
- `getFallbackRoutePath() => '*'`

Add app-level route helpers or guard components as needed under `src/app/`.

Routing behavior:

- `/` redirects to the current active role landing route.
- Unknown routes redirect to the current active role landing route.
- A wrong-role direct route redirects to the current active role landing route.
- Browser back/forward must not create a blank screen.

Register only in `src/app/router.tsx`.

Allowed routes:

| Route                  | Allowed role       |
| ---------------------- | ------------------ |
| `/dashboard`           | `unit-manager`     |
| `/resourcing/requests` | `delivery-manager` |
| `/my-profile`          | `employee`         |

Update `AppLayout`:

- Render the role switcher in the header.
- Render navigation items based on `activeRole`.
- Do not show Employee any Unit Manager or Sales / Delivery Manager links.
- Do not show Sales / Delivery Manager any direct employee browsing links.
- Keep the existing header pattern and desktop-first structure.

### 8. Add Placeholder Pages And Shared Async State Primitives

Add shared generic state primitives:

- `src/shared/ui/empty-state/EmptyState.tsx`
- `src/shared/ui/empty-state/EmptyState.types.ts`
- `src/shared/ui/empty-state/index.ts`
- `src/shared/ui/error-state/ErrorState.tsx`
- `src/shared/ui/error-state/ErrorState.types.ts`
- `src/shared/ui/error-state/index.ts`
- `src/shared/ui/loading-state/LoadingState.tsx`
- `src/shared/ui/loading-state/LoadingState.types.ts`
- `src/shared/ui/loading-state/index.ts`

Update `docs/architecture/shared-ui.md` inventory:

- Change Empty state to Available.
- Change Error state to Available.
- Change Loading state to Available.

Add pages:

- `src/pages/dashboard-page/DashboardPage.tsx`
- `src/pages/dashboard-page/DashboardPage.types.ts`
- `src/pages/dashboard-page/index.ts`
- `src/pages/resourcing-requests-page/ResourcingRequestsPage.tsx`
- `src/pages/resourcing-requests-page/ResourcingRequestsPage.types.ts`
- `src/pages/resourcing-requests-page/index.ts`
- `src/pages/my-profile-page/MyProfilePage.tsx`
- `src/pages/my-profile-page/MyProfilePage.types.ts`
- `src/pages/my-profile-page/index.ts`

Page behavior:

- Each page is a thin route-level component.
- Each page has one clear `h1`.
- Each page shows the active persona context.
- Each page uses loading, error, and empty states when reading personas through TanStack Query.
- Placeholder text must be concise and role-appropriate.

Do not implement:

- dashboard widgets
- subordinates table
- profile tabs
- request forms
- candidate workflow
- custom lists
- profile sharing
- assignment history

### 9. Update Handoff Notes

After implementation, update `.planning/STATE.md`.

Include:

- Phase 1 routes and behavior.
- Persona names and role mappings.
- Seed count: 75 people across 3 units.
- Note that persona names are placeholders until Carlos confirms.
- Note that full 500+ seed data is deferred to Phase 2.

## Data, Model, And API Contracts

### Role

```ts
export type Role = 'unit-manager' | 'delivery-manager' | 'employee'
```

### Persona

```ts
export type Persona = {
  id: string
  role: Role
  personId: string
  displayName: string
  title: string
  unitId?: string
  isDefault: boolean
}
```

### Unit

```ts
export type Unit = {
  id: string
  name: string
  managerId: string
}
```

### Person

```ts
export type Person = {
  id: string
  firstName: string
  lastName: string
  workEmail: string
  position: string
  grade: string
  unitId: string
  managerId?: string
  employmentStatus: 'Active' | 'On Leave' | 'Notice Period' | 'Inactive'
  currentProjectStatus: 'Allocated' | 'Partially Allocated' | 'Bench' | 'Booked' | 'Unavailable'
  availabilityPercent: number
  riskLevel: 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
}
```

### Skill

```ts
export type Skill = {
  id: string
  personId: string
  name: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  yearsExperience: number
}
```

### Minimal Resourcing Request

```ts
export type ResourcingRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Candidates Proposed'
  | 'Approved'
  | 'Rejected'
  | 'Closed'
  | 'Cancelled'

export type ResourcingRequest = {
  id: string
  requestCode: string
  title: string
  projectName: string
  createdById: string
  assignedUnitManagerId: string
  requiredRole: string
  status: ResourcingRequestStatus
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  createdAt: string
  updatedAt: string
}
```

## Routing And UI Behavior

| User action                     | Expected behavior                                                             |
| ------------------------------- | ----------------------------------------------------------------------------- |
| Open `/`                        | Redirect to `/dashboard` by default because Unit Manager is the default role. |
| Select Unit Manager             | Set active role/persona and navigate to `/dashboard`.                         |
| Select Sales / Delivery Manager | Set active role/persona and navigate to `/resourcing/requests`.               |
| Select Employee                 | Set active role/persona and navigate to `/my-profile`.                        |
| Open wrong-role route directly  | Redirect to current role landing route.                                       |
| Open unknown route              | Redirect to current role landing route.                                       |
| Switch role                     | Navigation, page content, and active persona update without full page reload. |

Role-specific navigation:

| Active role              | Visible nav item    |
| ------------------------ | ------------------- |
| Unit Manager             | Dashboard           |
| Sales / Delivery Manager | Resourcing Requests |
| Employee                 | My Profile          |

## Validation Checklist

Run these commands before considering implementation complete:

```bash
npm run build
npm run lint
npm run format:check
```

Manual checks:

- Fresh `/` load redirects to `/dashboard`.
- Default role is Unit Manager.
- Role switcher shows Unit Manager, Sales / Delivery Manager, and Employee.
- Unit Manager navigation shows Dashboard only.
- Sales / Delivery Manager navigation shows Resourcing Requests only.
- Employee navigation shows My Profile only.
- Switching Unit Manager to Sales / Delivery Manager navigates to `/resourcing/requests`.
- Switching Sales / Delivery Manager to Employee navigates to `/my-profile`.
- Switching roles changes route, navigation, and content without full page reload.
- Wrong-role routes redirect to active role landing.
- Unknown routes redirect to active role landing.
- Browser back/forward does not create a blank screen.
- Role switcher is keyboard reachable and has visible focus state.
- `/api/personas` returns exactly 3 personas.
- `/api/units` returns exactly 3 units.
- `/api/people` returns exactly 75 people.
- `/api/resourcing/requests` returns minimal seeded requests.
- No large mock datasets are hard-coded inside components.

## Assumptions And Non-Goals

Assumptions:

- The requested `@phase-1-fundation` path means `.planning/phases/phase-1-foundation/`.
- Placeholder persona names are acceptable until Carlos confirms final names.
- Session-only role state is acceptable for Phase 1.
- MSW is enabled in local development by default and in hosted demo builds only when `VITE_ENABLE_MOCKS=true`.
- No new package dependencies are needed.

Non-goals:

- Do not implement manager dashboard widgets.
- Do not implement a subordinates table.
- Do not implement employee profile tabs or editable profile forms.
- Do not implement resourcing request workflows.
- Do not implement candidate proposal, approval, rejection, or assignment history.
- Do not implement custom lists or profile sharing.
- Do not add real authentication.
- Do not add a backend, database, ORM, server framework, or root `api/` or `db/` folder.
- Do not add full 500+ employee seed data in Phase 1.
- Do not add or run a desktop UI audit for this work unless the user explicitly asks or grants permission.
