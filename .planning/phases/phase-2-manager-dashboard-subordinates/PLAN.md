# Phase 2 — Manager Dashboard & Subordinates

## Objective

Deliver the Unit Manager operational workspace: a dashboard with key widgets and action items, plus a subordinates list that supports filtering, sorting, and profile navigation stubs, while scaling seed data to support realistic desktop demos.

## Scope

### In scope

1. **Unit Manager dashboard page** — 4 core widgets:
   - subordinate headcount
   - active risks
   - open action items
   - active resourcing requests
     (FR-DB-001-004, AC-DB-001)
2. **Manager action items list** — sorted by due date with overdue visual emphasis (FR-DB-005-006, AC-DB-002)
3. **Dashboard quick navigation** — links/cards for Subordinates, Custom Lists, Resourcing, and Risks (FR-DB-007, AC-DB-004)
4. **Subordinates page and table** — Unit Manager scoped table with required columns, sort and filter behavior, and empty state (FR-SL-001-006, AC-SL-001-004)
5. **Row navigation to profile stub** — selecting a subordinate opens a route-level profile entry point for full profile work in Phase 3 (AC-SL-005)
6. **Mock data expansion** — increase seed data from Phase 1 baseline toward BRD demo target of 500+ employees across units, with enough risks/action items/requests for dashboard and list realism (BRD data scope, Roadmap Phase 2)
7. **Feature-first architecture alignment** — keep pages thin; place domain behavior in `src/features/dashboard` and `src/features/subordinates`; keep shared primitives in `src/shared/ui`

### Out of scope

- Full managerial profile tabs and editable profile content (Phase 3)
- Employee personal profile editing (Phase 3)
- Resourcing request creation/proposal/review workflows (Phase 4)
- Assignment history implementation (Phase 4)
- Custom list builder and inline-edit workflows (Phase 5)
- Profile sharing UX implementation (Phase 4/5)
- Mobile, tablet, narrow viewport, and responsive breakpoint validation
- Backend, authentication, persistence, or external integrations

## Tasks

| #   | Task                                                                                               | Owner     | Depends on |
| --- | -------------------------------------------------------------------------------------------------- | --------- | ---------- |
| 1   | Confirm Phase 2 route helpers and route registration updates in `src/app/routes.ts` + `router.tsx` | Volodymyr | Phase 1    |
| 2   | Add dashboard feature model/types for widget summary and action items                              | Volodymyr | 1          |
| 3   | Add dashboard API/query hook layer (`/api/dashboard/summary`, `/api/dashboard/action-items`)       | Volodymyr | 2          |
| 4   | Build dashboard feature components for widgets and action items list                               | Volodymyr | 3          |
| 5   | Add dashboard page composition with loading/error/empty states                                     | Volodymyr | 4          |
| 6   | Add subordinates API/query hook layer (`/api/subordinates`)                                        | Volodymyr | 1          |
| 7   | Build subordinates feature table (columns, sort, filter, empty state)                              | Volodymyr | 6          |
| 8   | Add subordinate row navigation to profile stub route for Phase 3                                   | Volodymyr | 7          |
| 9   | Expand and normalize mock seed data toward 500+ employees across 3 units                           | Volodymyr | Phase 1    |
| 10  | Seed realistic risks, action items, and request counts for dashboard widgets                       | Volodymyr | 9          |
| 11  | Update AppLayout Unit Manager nav to include Subordinates entry                                    | Volodymyr | 1, 7       |
| 12  | Validate seeded dashboard/list values and scenario expectations                                    | Ivan      | 4, 7, 10   |

## Expected Outputs

| Output                        | Location (target)                                                       |
| ----------------------------- | ----------------------------------------------------------------------- |
| Dashboard feature modules     | `src/features/dashboard/`                                               |
| Subordinates feature modules  | `src/features/subordinates/`                                            |
| Dashboard page                | `src/pages/dashboard-page/`                                             |
| Subordinates page             | `src/pages/subordinates-page/`                                          |
| Route and path helper updates | `src/app/routes.ts`, `src/app/router.tsx`                               |
| Unit Manager nav updates      | `src/app/layouts/app-layout/`                                           |
| Expanded seed/factory data    | `src/mocks/data/`, `src/mocks/factories/`                               |
| Phase 2 validation checklist  | `.planning/phases/phase-2-manager-dashboard-subordinates/VALIDATION.md` |

## Handoff to QA (Ivan)

When Phase 2 implementation tasks are complete, Volodymyr notifies Ivan with:

1. Branch name and commit SHA
2. Dev server URL (`http://localhost:5173`)
3. Confirmed Unit Manager flow routes (dashboard + subordinates + profile stub entry)
4. Widget calculation notes and expected seeded values for each widget
5. Subordinates table behavior notes (supported filters/sorts and known edge cases)
6. Seed count summary (final employee total and per-unit distribution)
7. Deferred items for later phases (profile tabs, resourcing workflows, custom lists, sharing)

Ivan runs checks in `VALIDATION.md` before Phase 3 starts.
