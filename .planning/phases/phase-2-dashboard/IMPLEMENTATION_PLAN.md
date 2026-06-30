# Phase 2 Manager Dashboard & Subordinates Implementation Plan

## Purpose

This document is the implementation plan for `.planning/phases/phase-2-dashboard/SRS.md`. It translates the Phase 2 SRS into an execution-ready sequence for delivering the Unit Manager dashboard, subordinates list, and required data foundation for subsequent phases.

The implementation must follow:

- `AGENTS.md`
- `.planning/PROJECT.md`
- `docs/architecture/project-structure.md`
- `docs/architecture/component-structure.md`
- `docs/architecture/page-structure.md`
- `docs/architecture/state-and-rendering.md`
- `docs/architecture/shared-ui.md`
- `docs/architecture/feature-rules.md`
- `.planning/phases/phase-2-dashboard/SRS.md`
- `.planning/phases/phase-2-dashboard/VALIDATION.md`

Phase 2 must implement dashboard + subordinates + type/seed/API expansion only. It must not implement deferred Phase 3+ business workflows.

## Implementation Defaults And Decisions

| Area                       | Decision                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| Dashboard feature location | Use `src/features/dashboard/` as source of truth for dashboard APIs/hooks/components.                 |
| Subordinates feature owner | Use `src/features/people/` for subordinate data and table interactions (per architecture ownership).  |
| Route naming               | Add `getSubordinatesPagePath()` and `getEmployeeProfilePagePath(id)` helpers in `src/app/routes.ts`.  |
| Profile route in Phase 2   | `/people/:id` is a stub entry point only; full profile behavior deferred to next phase.               |
| Data boundary              | Keep server-like data in TanStack Query + typed API wrappers + MSW handlers.                          |
| Local app state            | Keep Zustand usage limited to role/persona and non-server UI state only.                              |
| URL/filter state           | Use URL-synchronized applied params and local draft/debounced text inputs (no request per keystroke). |
| Seed determinism           | Keep `faker.seed(20260625)` unchanged and use stable generated IDs.                                   |
| Seed size target           | Expand to 500+ people with realistic 3-unit distribution and manager scoping.                         |
| Shared primitives          | Reuse from `src/shared/ui`; add generic missing primitives in shared layer before feature usage.      |
| Dependencies               | Do not add npm dependencies unless strictly required and approved.                                    |

## Step-By-Step Implementation Plan

### 1. Align Phase 2 Scope, Structure, And Route Targets

Create the Phase 2 implementation scaffolding first so subsequent work follows architecture boundaries.

Implementation requirements:

- Confirm feature ownership against architecture:
  - dashboard -> `src/features/dashboard/`
  - subordinates/people -> `src/features/people/`
- Add route helpers in `src/app/routes.ts`:
  - `getSubordinatesPagePath()`
  - `getEmployeeProfilePagePath(id: string)`
- Register routes in `src/app/router.tsx`:
  - `/subordinates` as UM-only
  - `/people/:id` as UM-only stub route
- Update `src/app/navigation.ts` to add Subordinates for Unit Manager.
- Preserve existing role-guard behavior and role landing redirects from Phase 1.

Acceptance checks:

- Unit Manager can open `/dashboard` and `/subordinates`.
- Non-UM direct URL access to UM-only routes is blocked/redirected.
- Browser back/forward between dashboard/subordinates/profile-stub remains stable.

### 2. Complete Shared Domain Types Required By BRD Section 8

Establish type contracts before mock services and UI logic.

Implementation requirements:

- Update existing partial types:
  - `src/types/person.ts` with full BRD section 8.1 field set.
  - `src/types/resourcing-request.ts` with full BRD section 8.10 field set.
- Add missing shared type files:
  - `feedback.ts`
  - `scheduled-leave.ts`
  - `risk.ts`
  - `action-item.ts`
  - `assignment-history.ts`
  - `project-history.ts`
  - `document.ts`
  - `idp.ts`
  - `custom-field.ts`
  - `custom-list.ts`
  - `candidate-proposal.ts`
  - `shared-profile.ts`
  - `allocation.ts`
- Keep explicit unions for statuses/levels/priorities/visibility fields.
- Keep types in `src/types/`; avoid feature-local duplication of shared entities.

Acceptance checks:

- `npm run build` passes strict typing with new/updated entities.
- No `any` introduced in new type files.
- Feature API/hook code consumes shared type contracts.

### 3. Expand Deterministic Seed Data And Factories

Build realistic data volume and coverage for dashboard/subordinates and later phases.

Implementation requirements:

- Expand `src/mocks/data/people.ts` to 500+ total records (including 3 persona anchors).
- Add missing data modules:
  - `feedbacks.ts`
  - `scheduled-leaves.ts`
  - `risks.ts`
  - `action-items.ts`
  - `project-history.ts`
- Expand `resourcing-requests.ts` to 10 requests with full required fields.
- Add or extend factories in `src/mocks/factories/` for deterministic generation.
- Keep `faker.seed(20260625)` and stable ID generation strategy.
- Ensure data distribution supports:
  - Unit Manager scoped subordinate list
  - non-zero dashboard stats
  - overdue + upcoming action items
  - risk mix with High/Critical values
  - leave overlap examples for upcoming phases

Acceptance checks:

- People dataset exports 500+ records.
- Risks dataset has >=20 records; action items >=30 records.
- Feedbacks and scheduled leaves exist per plan thresholds.
- Dashboard and subordinates are populated from seeded data (no UI hardcoded datasets).

### 4. Extend MSW Endpoints And Shared API Boundary

Expose typed server-like boundaries for Phase 2 and future phases.

Implementation requirements:

- Extend `src/mocks/handlers.ts` (or split handler modules) with:
  - `GET /api/people`
  - `GET /api/people/:id`
  - `GET /api/people/:id/feedbacks`
  - `POST /api/people/:id/feedbacks`
  - `GET /api/people/:id/scheduled-leaves`
  - `GET /api/people/:id/risks`
  - `GET /api/people/:id/action-items`
  - `GET /api/people/:id/project-history`
  - `GET /api/people/:id/assignment-history`
  - `GET /api/resourcing/requests` with role-aware filtering behavior
- Ensure `/api/people` supports unit/manager-oriented filtering via query params.
- Use shared frontend API client pattern in `src/lib/api/`.

Acceptance checks:

- Endpoint responses match shared type contracts.
- Mock API errors are representable by hooks/pages through existing error states.
- Phase 2 pages can fetch data through API wrappers without direct mock-data imports.

### 5. Extend Query Keys And Feature Query Contracts

Add stable query key coverage before UI composition.

Implementation requirements:

- Extend `src/lib/query/query-keys.ts` with typed helpers for:
  - people list/person detail
  - feedbacks/scheduled leaves/risks/action items
  - project history/assignment history
  - resourcing requests with normalized filter object
- Avoid raw `URLSearchParams` in query keys.
- Normalize empty/default values before query key creation.
- Keep query parameters serializable and stable.

Acceptance checks:

- Query hooks use query key helpers consistently.
- No request-per-keystroke behavior from draft text input state.
- Refetch behavior is predictable for sort/filter/url changes.

### 6. Implement Dashboard Feature Modules

Deliver dashboard behavior entirely from feature modules with thin page composition.

Implementation requirements:

- Add/extend dashboard API and hooks:
  - `src/features/dashboard/api/get-dashboard-stats.ts`
  - `src/features/dashboard/hooks/use-dashboard-stats-query.ts`
- Add/extend dashboard components:
  - stat cards
  - action items list
  - quick navigation block
- Implement required dashboard UX:
  - 4 widgets: headcount, active risks, open action items, active requests
  - action items sorted by due date ascending
  - overdue visual emphasis
  - quick links: Subordinates, Custom Lists, Resourcing, Risks
- Keep quick links routed to valid existing/stub routes only.
- Provide loading/empty/error handling at page/feature composition level.

Acceptance checks:

- Dashboard meets FR-DB-001..007 and AC-DB-001..004.
- All four widget values are non-zero with seeded data.
- At least one overdue item is visibly distinct.

### 7. Implement Subordinates List Feature Modules

Build subordinates table behavior with sort/filter and route drilldown.

Implementation requirements:

- Add/extend people feature APIs/hooks:
  - `src/features/people/api/get-subordinates.ts`
  - `src/features/people/hooks/use-subordinates-query.ts`
- Add table configuration and UI modules:
  - `src/features/people/tables/subordinates.columns.tsx`
  - `src/features/people/components/subordinates-table/SubordinatesTable.tsx`
- Implement filter controls for:
  - position
  - grade
  - current project status
  - risk level
- Implement table behavior:
  - required 5 columns
  - sortable columns
  - empty state on no matches
  - row click to `/people/:id`
- Keep filter controls controlled by props and avoid direct router calls from reusable components.

Acceptance checks:

- Subordinates requirements FR-SL-001..006 and AC-SL-001..005 are met.
- Results remain scoped to active Unit Manager context.
- Sorting/filtering behavior is stable and keyboard-usable.

### 8. Compose Route Pages With State/Rendering Rules

Apply page-level orchestration and async state requirements.

Implementation requirements:

- Replace dashboard placeholder in `src/pages/dashboard-page/`.
- Create/compose `src/pages/subordinates-page/` with thin page ownership.
- Add `/people/:id` page stub target for drilldown.
- Apply `state-and-rendering.md` rules:
  - keep draft search local
  - debounce text search before URL write/query invalidation
  - use URL-synchronized applied params for shareable state
  - avoid full-page blocking spinner on every refetch
- Ensure consistent loading, empty, error states.

Acceptance checks:

- Page-level logic remains orchestration-only.
- Search/filter changes do not cause full-page loading flicker.
- Browser navigation preserves usable page state.

### 9. Add Missing Shared UI Primitives (If Needed)

Introduce generic controls in shared layer before feature usage.

Implementation requirements:

- Evaluate inventory in `docs/architecture/shared-ui.md`.
- Add missing primitives required by Phase 2 plan/SRS:
  - `select`
  - `data-table`
  - `status-pill`
  - `page-header`
  - `skeleton`
- Keep primitives app-agnostic and typed.
- Update shared UI inventory statuses/documentation when new primitives are added.

Acceptance checks:

- No duplicated generic control styling in feature/page files.
- New primitives are reused by dashboard/subordinates where applicable.
- Shared UI review checklist items are satisfied.

### 10. Finalize Planning Handoff And Validation Artifacts

Record implementation status and QA-ready guidance.

Implementation requirements:

- Update `.planning/STATE.md` with:
  - implementation status
  - validation status
  - blockers
  - deferred scope
- Update/create phase status handoff file under `.planning/phases/phase-2-dashboard/`.
- Ensure `.planning/phases/phase-2-dashboard/VALIDATION.md` exists and maps to SRS checks.
- Provide QA handoff notes:
  - expected dashboard behavior
  - supported sort/filter cases
  - seed volume summary
  - explicit deferred items

Acceptance checks:

- Ivan can execute validation without extra requirement interpretation.
- Deferred scope is explicit and non-ambiguous.

## Data, Model, And API Contracts

### Dashboard Stats

```ts
export type DashboardStats = {
  subordinateHeadcount: number
  activeRisksCount: number
  openActionItemsCount: number
  activeRequestsCount: number
}
```

### Subordinates Query Parameters

```ts
export type SubordinatesQueryParams = {
  managerId: string
  search?: string
  position?: string
  grade?: string
  currentProjectStatus?: 'Allocated' | 'Partially Allocated' | 'Bench' | 'Booked' | 'Unavailable'
  riskLevel?: 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
  sortBy?: 'fullName' | 'position' | 'grade' | 'currentProjectStatus' | 'riskLevel'
  sortDirection?: 'asc' | 'desc'
}
```

### Core Phase 2 Endpoints

| Method | Endpoint                             | Primary phase usage                                      |
| ------ | ------------------------------------ | -------------------------------------------------------- |
| GET    | `/api/people`                        | Subordinates source (scoped/filterable)                  |
| GET    | `/api/people/:id`                    | Profile route stub data boundary                         |
| GET    | `/api/people/:id/feedbacks`          | Data foundation for upcoming profile tabs                |
| POST   | `/api/people/:id/feedbacks`          | Data boundary for future feedback add flow               |
| GET    | `/api/people/:id/scheduled-leaves`   | Data foundation and warning support                      |
| GET    | `/api/people/:id/risks`              | Dashboard/profile risk data boundary                     |
| GET    | `/api/people/:id/action-items`       | Dashboard action list and profile support                |
| GET    | `/api/people/:id/project-history`    | Data foundation for profile/history tabs                 |
| GET    | `/api/people/:id/assignment-history` | Data foundation for profile/history tabs                 |
| GET    | `/api/resourcing/requests`           | Dashboard active request count + role-aware request list |

## Routing And UI Behavior

| User action                               | Expected behavior                                                |
| ----------------------------------------- | ---------------------------------------------------------------- |
| Open app as Unit Manager                  | `/dashboard` loads with widget cards, action list, and quick nav |
| Click UM nav `Subordinates`               | Opens `/subordinates`                                            |
| Sort or filter subordinates               | Table updates correctly and remains in scoped UM dataset         |
| Filter returns no rows                    | Empty state message appears                                      |
| Click subordinate row                     | Navigates to `/people/:id` stub route                            |
| Open UM-only route as non-UM              | Access blocked/redirected by role guard                          |
| Use keyboard in filters/table/quick links | Controls are focus-visible and operable                          |
| Type in search filter                     | No request-per-keystroke full-page reload behavior               |

## Validation Checklist

Run before considering Phase 2 implementation complete:

```bash
npm run build
npm run lint
npm run format:check
```

Manual validation checks:

- Dashboard:
  - 4 widgets render with non-zero seeded values
  - action items sorted by due date
  - overdue highlighting present
  - quick links navigate correctly
- Subordinates:
  - required 5 columns visible
  - sorting works
  - filtering works
  - empty state appears on no results
  - row click opens `/people/:id`
- Scope and access:
  - non-UM blocked from UM pages
  - browser back/forward remains stable
  - list remains UM-scoped
- Data foundation:
  - people >= 500
  - risks >= 20
  - action items >= 30
  - feedbacks/scheduled leaves datasets exist
  - resourcing requests = 10
- Architecture:
  - pages remain thin
  - feature ownership respected
  - no duplicated generic control styling
  - query state and URL state follow `state-and-rendering.md`

## Assumptions And Non-Goals

Assumptions:

- Phase 1 routing, role-switch, guards, and provider setup are stable and reused.
- BRD v1.1 and decision log are approved source of truth.
- Validation is desktop-only (1280px+), no mobile/tablet blocking checks.
- Mocked API boundaries remain authoritative for frontend behavior.

Non-goals:

- Do not implement full employee profile tabs/editing flows in Phase 2.
- Do not implement end-to-end request creation/proposal/review workflows in Phase 2.
- Do not implement full custom list builder and profile-sharing UX in Phase 2.
- Do not add backend/database/auth/integration/file-storage components.
- Do not introduce unrelated refactors outside Phase 2 scope.
