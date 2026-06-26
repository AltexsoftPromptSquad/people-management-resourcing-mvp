# Phase 2 Manager Dashboard & Subordinates Implementation Plan

## Purpose

This document is the implementation plan for `.planning/phases/phase-2-manager-dashboard-subordinates/SRS.md`. It translates the Phase 2 SRS into an execution-ready sequence for delivering the Unit Manager dashboard and subordinates list increment of the People Management & Resourcing MVP.

The implementation must follow:

- `AGENTS.md`
- `docs/architecture/project-structure.md`
- `docs/architecture/component-structure.md`
- `docs/architecture/shared-ui.md`
- `docs/architecture/page-structure.md`
- `docs/architecture/visual-theme.md`
- `.planning/phases/phase-2-manager-dashboard-subordinates/SRS.md`
- `.planning/phases/phase-2-manager-dashboard-subordinates/VALIDATION.md`

Phase 2 must implement dashboard + subordinates behavior only. It must not implement deferred Phase 3, Phase 4, or Phase 5 business workflows.

## Implementation Defaults And Decisions

| Area                           | Decision                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Route naming                   | Add `getSubordinatesPagePath()` mapped to `/subordinates`.                                                  |
| Profile drilldown route        | Add `getPersonProfilePagePath(personId)` mapped to `/people/:personId` as a Phase 3-ready stub entry point. |
| Dashboard data access          | Use TanStack Query + typed feature API functions. No direct mock imports in route pages/components.         |
| Subordinates list interactions | Support sort + filter in one state model so filtering does not reset sort unexpectedly.                     |
| Quick links for deferred areas | Link to existing valid routes/placeholders only; no broken targets.                                         |
| Mock boundary                  | Continue MSW-backed mock API pattern from Phase 1 (`src/mocks/handlers.ts` + feature API helpers).          |
| Seed size target               | Expand from 75 to a deterministic dataset above 500 (default: 540 people total across 3 units).             |
| Seed determinism               | Keep fixed faker seed and stable generated IDs for repeatable QA checks.                                    |
| Async state handling           | Dashboard and subordinates pages must show loading, error, and empty states.                                |
| Shared primitives              | Reuse existing shared UI primitives; add new generic primitives to `src/shared/ui` only if required.        |
| Local app state                | Keep Zustand usage limited to role/persona state; keep server-like list/summary data in Query.              |
| Dependencies                   | Do not add npm dependencies unless strictly required and approved.                                          |

## Step-By-Step Implementation Plan

### 1. Extend Routes, Guards, And Unit Manager Navigation

Add Phase 2 route helpers and route registration while preserving Phase 1 role-aware behavior.

Implementation requirements:

- Update `src/app/routes.ts`:
  - add `getSubordinatesPagePath(): '/subordinates'`
  - add `getPersonProfilePagePath(personId: string): string`
- Update `src/app/router.tsx`:
  - register Unit Manager subordinates route
  - register Phase 3-ready profile stub route entry for row drilldown
  - preserve role guard behavior for non-UM access restrictions
- Update `src/app/layouts/app-layout/`:
  - include `Subordinates` in Unit Manager navigation
  - keep Delivery Manager and Employee nav behavior unchanged

Acceptance checks:

- Unit Manager can open dashboard and subordinates routes.
- Non-UM roles cannot access UM-only Phase 2 routes by direct URL.
- Browser back/forward between dashboard and subordinates does not break.

### 2. Add Phase 2 Feature Types And Query Contracts

Define typed contracts before UI implementation so data shape is stable.

Implementation requirements:

- Add feature type contracts:
  - `src/features/dashboard/types/dashboard-summary.ts`
  - `src/features/dashboard/types/dashboard-action-item.ts`
  - `src/features/subordinates/types/subordinate-list-item.ts`
  - `src/features/subordinates/types/subordinates-filter.ts`
  - `src/features/subordinates/types/subordinates-sort.ts`
- Keep contract fields aligned with Phase 2 SRS section 8.
- Do not use `any`; use explicit unions for status/risk/priority fields.

Acceptance checks:

- Types compile cleanly with strict TypeScript.
- Types are reused by API and hooks, not duplicated ad hoc in components.

### 3. Add Dashboard API Layer And Query Hooks

Create typed feature APIs and hooks for dashboard summary and manager action items.

Implementation requirements:

- Add API functions:
  - `src/features/dashboard/api/get-dashboard-summary.ts`
  - `src/features/dashboard/api/get-dashboard-action-items.ts`
- Add hooks:
  - `src/features/dashboard/hooks/use-dashboard-summary-query.ts`
  - `src/features/dashboard/hooks/use-dashboard-action-items-query.ts`
- Use existing API client pattern under `src/lib/api/`.
- Define stable query keys, for example:
  - `['dashboard', 'summary', activePersonaId]`
  - `['dashboard', 'action-items', activePersonaId]`

Acceptance checks:

- Dashboard summary query resolves from mock API boundary.
- Action items query resolves and is consumable by UI with loading/error states.

### 4. Implement Dashboard Feature UI

Build dashboard widgets, action items list, and quick navigation components in feature layer.

Implementation requirements:

- Add components under `src/features/dashboard/components/`:
  - widget grid/cards
  - action items list
  - quick links block
- Widget requirements:
  - subordinate count
  - active risks count
  - open action items count
  - active resourcing requests count
- Action items requirements:
  - sort by due date ascending
  - visibly emphasize overdue records
- Quick links requirements:
  - Subordinates
  - Custom Lists
  - Resourcing
  - Risks
  - use valid route targets only

Acceptance checks:

- Four labeled widgets are visible with non-empty seeded values.
- Overdue items are clearly distinguishable.
- Quick links are keyboard reachable and navigable.

### 5. Compose Dashboard Page With Async States

Integrate feature components in route page while keeping page thin.

Implementation requirements:

- Update `src/pages/dashboard-page/`:
  - keep route-level composition only
  - consume dashboard hooks
  - show loading/error/empty states
- Continue to use shared async primitives where available in `src/shared/ui/`.

Acceptance checks:

- Dashboard route renders stable loading, error, empty, and success states.
- No large business logic remains in page layer.

### 6. Add Subordinates API Layer And Query Hooks

Create typed API/hook boundary for subordinate data retrieval with filter/sort support.

Implementation requirements:

- Add API and hooks:
  - `src/features/subordinates/api/get-subordinates.ts`
  - `src/features/subordinates/hooks/use-subordinates-query.ts`
- Support query params/arguments for filter and sort:
  - position
  - grade
  - status
  - riskLevel
  - search
  - sort field/direction
- Keep query state deterministic and stable when combining sort + filter.

Acceptance checks:

- Query returns Unit Manager scoped records only.
- Sort and filter can be applied together without broken state.

### 7. Implement Subordinates Table Feature

Build the subordinates table with required columns, controls, and empty-state behavior.

Implementation requirements:

- Add components under `src/features/subordinates/components/`:
  - table container
  - filter controls
  - sortable header controls
  - row renderer
  - empty state block
- Required columns:
  - name
  - position
  - grade
  - current status/project status
  - risk level
- Keep controls and table interactions keyboard operable.

Acceptance checks:

- Required columns are visible.
- Sorting works by supported columns.
- Filtering by at least position/grade/status/risk works.
- Empty state appears for no-match results.

### 8. Add Subordinates Page And Row Drilldown Navigation

Add route page composition and row click behavior to profile stub target.

Implementation requirements:

- Add page modules:
  - `src/pages/subordinates-page/SubordinatesPage.tsx`
  - `src/pages/subordinates-page/SubordinatesPage.types.ts`
  - `src/pages/subordinates-page/index.ts`
- Add profile entry stub page if missing:
  - `src/pages/person-profile-page/` (stub only for Phase 2)
- Row click behavior:
  - navigate to `getPersonProfilePagePath(personId)`
  - preserve list usability when returning via browser back

Acceptance checks:

- Unit Manager can open subordinates page from nav and dashboard quick link.
- Clicking a row opens the profile entry route.
- Back navigation returns to usable subordinates state.

### 9. Expand Mock Data, Handlers, And Seed Realism

Scale datasets and API responses to support Phase 2 UI behavior and validations.

Implementation requirements:

- Update mock data modules in `src/mocks/data/`:
  - people
  - risks
  - action items
  - resourcing requests
- Add/extend factories in `src/mocks/factories/` for deterministic generation.
- Update `src/mocks/handlers.ts` with endpoints used by Phase 2 feature APIs:
  - `GET /api/dashboard/summary`
  - `GET /api/dashboard/action-items`
  - `GET /api/subordinates`
- Ensure deterministic seed and stable IDs.
- Increase dataset to default target 540 total people while keeping 3 units and persona anchors.

Acceptance checks:

- Dashboard widget values and action item list are populated from mock APIs.
- Subordinates list has realistic volume and distribution.
- No large hard-coded datasets are embedded in UI components.

### 10. Update Planning Status And Handoff Notes

Document implementation outcomes and QA-ready context.

Implementation requirements:

- Update `.planning/STATE.md` with:
  - implementation status
  - validation status
  - open blockers
  - deferred work
- Add/maintain a Phase 2 status note file if required by process.
- Provide QA handoff details:
  - expected widget values
  - seed totals and distribution
  - supported sort/filter cases
  - known deferred areas

Acceptance checks:

- Ivan can execute validation checklist without additional interpretation.

## Data, Model, And API Contracts

### Dashboard Summary

```ts
export type DashboardSummary = {
  subordinateCount: number
  activeRisksCount: number
  openActionItemsCount: number
  activeResourcingRequestsCount: number
}
```

### Dashboard Action Item

```ts
export type DashboardActionItem = {
  id: string
  title: string
  assigneeName: string
  dueDate: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Open' | 'In Progress' | 'Done' | 'Blocked'
  isOverdue: boolean
}
```

### Subordinate List Item

```ts
export type SubordinateListItem = {
  id: string
  fullName: string
  position: string
  grade: string
  currentStatus: 'Allocated' | 'Partially Allocated' | 'Bench' | 'Booked' | 'Unavailable'
  riskLevel: 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
  unitId: string
  managerId: string
}
```

### Subordinates Filter

```ts
export type SubordinatesFilter = {
  position?: string
  grade?: string
  currentStatus?: 'Allocated' | 'Partially Allocated' | 'Bench' | 'Booked' | 'Unavailable'
  riskLevel?: 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
  search?: string
}
```

### Subordinates Sort

```ts
export type SubordinatesSort = {
  field: 'fullName' | 'position' | 'grade' | 'currentStatus' | 'riskLevel'
  direction: 'asc' | 'desc'
}
```

## Routing And UI Behavior

| User action                                    | Expected behavior                                   |
| ---------------------------------------------- | --------------------------------------------------- |
| Open app as Unit Manager                       | `/dashboard` loads dashboard summary + action items |
| Click `Subordinates` in UM nav                 | Opens `/subordinates`                               |
| Click dashboard quick link `Subordinates`      | Opens `/subordinates`                               |
| Apply filter + sort in subordinates            | Rows update correctly and remain consistent         |
| Filter returns no records                      | Empty-state UI appears                              |
| Click subordinate row                          | Navigates to `/people/:personId` stub route         |
| Press browser Back from profile stub           | Returns to usable subordinates experience           |
| Open `/dashboard` or `/subordinates` as non-UM | Redirects/blocks according to route-guard policy    |
| Use keyboard on quick links and table controls | Controls are reachable, focus-visible, and operable |

## Validation Checklist

Run before Phase 2 is considered implementation-complete:

```bash
npm run build
npm run lint
npm run format:check
```

Manual checks:

- Dashboard route is accessible for Unit Manager.
- Four widgets render and match seeded data expectations.
- Action items are sorted by due date ascending.
- Overdue action items are visually emphasized.
- Quick links are usable and route correctly.
- Subordinates page is accessible for Unit Manager.
- Subordinates dataset is Unit Manager scoped.
- Required table columns are visible.
- Sorting works correctly.
- Filtering works correctly and in combination with sorting.
- Empty state appears when filters return no matches.
- Row click navigates to profile stub route.
- Non-UM roles cannot access UM dashboard/subordinates routes.
- Browser back/forward is stable across dashboard/subordinates/profile stub.
- Dashboard/subordinates controls are keyboard operable with visible focus.
- Seed expansion is above Phase 1 baseline and documented in handoff notes.
- No large hard-coded datasets exist inside UI components.

## Assumptions And Non-Goals

Assumptions:

- Existing Phase 1 role switch and route-guard architecture is reused.
- Existing API client and TanStack Query setup remains the standard feature data pattern.
- Existing MSW structure remains active in dev and optionally in hosted demo builds with `VITE_ENABLE_MOCKS=true`.
- Default Phase 2 seed target is 540 total people unless changed by stakeholder decision.
- Profile row-drilldown route in Phase 2 is a stub entry point only, not a full profile implementation.

Non-goals:

- Do not implement full managerial profile tabs or editing flows.
- Do not implement employee self-service editing forms.
- Do not implement DM request creation or candidate review flows.
- Do not implement UM candidate proposal workflows.
- Do not implement assignment history persistence and presentation flows.
- Do not implement custom list creation, inline edit, and sharing workflows.
- Do not implement profile-sharing generation/token UX.
- Do not add backend/database/auth/file-storage/integration layers.
- Do not block on mobile/tablet/narrow viewport and responsive breakpoint validation.
