# Software Requirements Specification

# Phase 2 - Manager Dashboard & Subordinates

## 1. Document Control

| Field                | Value                                                   |
| -------------------- | ------------------------------------------------------- |
| Product              | People Management & Resourcing MVP                      |
| Phase                | Phase 2 - Manager Dashboard & Subordinates              |
| Document type        | Software Requirements Specification                     |
| Status               | Draft for implementation                                |
| Implementation owner | Volodymyr                                               |
| QA owner             | Ivan                                                    |
| Product / BA owner   | Carlos                                                  |
| Source BRD           | `docs/requirements/# Business Requirements Document.md` |
| Phase plan           | `.planning/phases/phase-2-dashboard/PLAN.md`            |
| Phase validation     | `.planning/phases/phase-2-dashboard/VALIDATION.md`      |

## 2. Purpose

This SRS translates BRD v1.1 and the Phase 2 plan into implementation-ready software requirements for the Manager Dashboard and Subordinates increment.

Phase 2 must deliver a functional Unit Manager dashboard, a working subordinates list with sort/filter and row navigation, and the domain type + seed data foundation needed by subsequent phases. It must stay frontend-only and desktop-focused.

Phase 2 is not expected to deliver full Employee Profile tab implementation, full resourcing candidate workflows, full custom lists behavior, or profile sharing UX completion.

## 3. Source Inputs

| Source                                       | Used for                                                           |
| -------------------------------------------- | ------------------------------------------------------------------ |
| BRD sections 3-7                             | Scope boundaries, desktop target, frontend-only constraints        |
| BRD section 8                                | Entity field definitions for types and seed data                   |
| BRD FR-DB-001 through FR-DB-007              | Dashboard requirements                                             |
| BRD FR-SL-001 through FR-SL-006              | Subordinates list requirements                                     |
| BRD BR-001, BR-003, BR-012 through BR-016    | Role scope, warnings visibility, feedback/leave rules              |
| BRD AC-DB-001 through AC-DB-004              | Dashboard acceptance criteria                                      |
| BRD AC-SL-001 through AC-SL-005              | Subordinates acceptance criteria                                   |
| BRD AC-EP-006 through AC-EP-008              | Feedbacks and scheduled leaves minimum behavior context            |
| BRD section 15 Confirmed Decisions           | Confirmed remediation outcomes (G-1, G-2, G-3, D-1, D-3, A-2, A-3) |
| `.planning/phases/phase-2-dashboard/PLAN.md` | Phase deliverables, data targets, route and feature boundaries     |
| `docs/architecture/data-models.md`           | Type-level data shape details                                      |
| `docs/architecture/feature-rules.md`         | Feature ownership and layering                                     |
| `docs/architecture/page-structure.md`        | Route-page responsibilities                                        |
| `docs/architecture/component-structure.md`   | Component placement and composition rules                          |
| `docs/architecture/shared-ui.md`             | Shared primitive ownership and control styling rules               |

## 4. Phase Objective

Deliver a desktop-first Unit Manager workspace where:

- Dashboard shows four operational widgets with seeded, non-zero values.
- Dashboard action items are sorted by due date with overdue emphasis.
- Dashboard quick navigation works for Subordinates, Custom Lists, Resourcing, and Risks.
- Subordinates list supports required columns, sorting, filtering, empty state, and row drilldown.
- `/people/:id` route exists as a valid Phase 2 stub entry point.
- Domain types and deterministic mock data are expanded to support Phase 2 and later phases.
- Seeded people dataset grows to 500+ records across three units.

## 5. Scope

### 5.1 In Scope

1. Complete and add missing domain types under `src/types/` according to BRD section 8 and phase plan.
2. Expand seeded datasets under `src/mocks/data/`:
   - 500+ people
   - feedbacks
   - scheduled leaves
   - risks
   - action items
   - project history
   - expanded resourcing requests
3. Add/extend deterministic Faker factories and keep fixed seed value.
4. Extend MSW handlers for Phase 2 listed endpoints.
5. Extend query key contracts for new entities.
6. Implement Dashboard feature modules and compose dashboard page.
7. Implement Subordinates feature modules and compose subordinates page.
8. Add and register `/subordinates` and `/people/:id` routes (UM-only).
9. Add route helpers for Subordinates and Employee Profile paths.
10. Update Unit Manager navigation with Subordinates.
11. Add missing shared UI primitives required for Phase 2 if absent.
12. Preserve role guard behavior from Phase 1.
13. Keep loading, empty, and error states for async UI.
14. Update planning state/handoff notes after implementation.

### 5.2 Out of Scope

The following must not be implemented in Phase 2 unless explicitly reprioritized:

- Full employee profile tab implementation (managerial + personal full behavior).
- Full resourcing request creation/proposal/review decision workflows.
- Full custom lists create/edit/share UX.
- Full profile sharing generation and public token UX.
- Assignment history end-to-end flow and approval outcomes behavior.
- Backend/database/auth/file storage/external integrations.
- Mobile/tablet/narrow viewport support and responsive QA.

## 6. Users And Access Context

### 6.1 Supported Role In Phase 2

| Role                 | Access in this phase                                 |
| -------------------- | ---------------------------------------------------- |
| Unit Manager         | Full dashboard + subordinates scope                  |
| Sales / Delivery Mgr | No direct access to UM dashboard/subordinates routes |
| Employee             | No direct access to UM dashboard/subordinates routes |

### 6.2 Role Access Rules

- Unit Manager-only pages introduced in Phase 2 must be guarded.
- Non-UM direct URL access to `/dashboard`, `/subordinates`, `/people/:id` must be blocked/redirected by route-guard policy.
- Subordinates dataset must remain scoped to the active Unit Manager context.

## 7. Functional Requirements

### 7.1 Domain Types

| ID         | Requirement                                                                                                                                                                                                     | Source                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| SRS-F2-001 | `src/types/person.ts` shall include full BRD section 8.1 fields (including contact, emergency, employment, English, custom map).                                                                                | BRD 8.1, PLAN section 1  |
| SRS-F2-002 | `src/types/resourcing-request.ts` shall include full BRD section 8.10 fields listed in phase plan.                                                                                                              | BRD 8.10, PLAN section 1 |
| SRS-F2-003 | Missing type files shall be added: feedback, scheduled-leave, risk, action-item, assignment-history, project-history, document, idp, custom-field, custom-list, candidate-proposal, shared-profile, allocation. | BRD 8.x, PLAN section 1  |
| SRS-F2-004 | New and updated types shall avoid `any` and use explicit unions for statuses/levels/priorities where applicable.                                                                                                | Code quality             |
| SRS-F2-005 | Type ownership shall remain in `src/types/` for shared entities and follow architecture import direction.                                                                                                       | Architecture             |

### 7.2 Seed Data Expansion

| ID         | Requirement                                                                                            | Source                   |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------------------------ |
| SRS-F2-010 | People seed count shall be expanded to 500+ with 3 named personas retained.                            | BRD 7.1, PLAN section 2  |
| SRS-F2-011 | Feedbacks seed shall exist with minimum 2 entries per demo persona.                                    | BRD 8.16, PLAN section 2 |
| SRS-F2-012 | Scheduled leaves seed shall exist with at least one overlap scenario.                                  | BRD 8.17, BR-014         |
| SRS-F2-013 | Risks seed shall contain at least 20 records including High/Critical cases for dashboard and warnings. | BRD 7.1, BR-012          |
| SRS-F2-014 | Action items seed shall contain at least 30 records with overdue and upcoming mix.                     | BRD 7.1, FR-DB-005/006   |
| SRS-F2-015 | Resourcing requests seed shall be expanded to 10 with required request fields.                         | BRD 7.1, BRD 8.10        |
| SRS-F2-016 | Faker seed shall remain deterministic with `faker.seed(20260625)`.                                     | PLAN section 2           |

### 7.3 Mock API Endpoints

| ID         | Requirement                                                                                                                | Source         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| SRS-F2-020 | MSW handlers shall include Phase 2 listed person/resource endpoints in `src/mocks/handlers.ts` (or split handler modules). | PLAN section 3 |
| SRS-F2-021 | `/api/people` shall support unit filtering via query params for role-scoped list behavior.                                 | PLAN section 3 |
| SRS-F2-022 | Feedback create endpoint (`POST /api/people/:id/feedbacks`) shall exist as Phase 3-ready mock boundary.                    | PLAN section 3 |
| SRS-F2-023 | Resourcing requests endpoint shall support role-aware filtering by creator/assigned manager.                               | PLAN section 3 |

### 7.4 Query Keys

| ID         | Requirement                                                                                                                                          | Source         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| SRS-F2-030 | Query keys shall be extended for people/person/feedbacks/scheduled leaves/risks/action items/project history/assignment history/resourcing requests. | PLAN section 4 |
| SRS-F2-031 | Query key contracts shall use stable typed arguments and avoid ad hoc string concatenation.                                                          | Query rules    |

### 7.5 Dashboard

| ID         | Requirement                                                                                                        | Source                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| SRS-F2-040 | `/dashboard` shall render 4 widgets: Headcount, Active Risks, Open Action Items, Active Requests.                  | FR-DB-001..004, AC-DB-001 |
| SRS-F2-041 | Dashboard shall show manager open action items sorted by `dueDate` ascending.                                      | FR-DB-005, AC-DB-002      |
| SRS-F2-042 | Overdue action items shall be visually emphasized.                                                                 | FR-DB-006, AC-DB-003      |
| SRS-F2-043 | Dashboard quick nav shall provide links to Subordinates, Custom Lists, Resourcing, Risks.                          | FR-DB-007, AC-DB-004      |
| SRS-F2-044 | Dashboard shall display loading/empty/error states based on async query outcomes.                                  | Component structure       |
| SRS-F2-045 | Dashboard domain logic/components/hooks shall live under `src/features/dashboard/`; page remains thin composition. | Architecture              |

### 7.6 Subordinates List

| ID         | Requirement                                                                                  | Source               |
| ---------- | -------------------------------------------------------------------------------------------- | -------------------- |
| SRS-F2-050 | `/subordinates` shall list only employees subordinate to the active Unit Manager scope.      | FR-SL-001, AC-SL-001 |
| SRS-F2-051 | Table shall display columns: Name, Position, Grade, Project/Status, Risk.                    | FR-SL-002, AC-SL-002 |
| SRS-F2-052 | All columns shall be sortable.                                                               | FR-SL-003, AC-SL-003 |
| SRS-F2-053 | Filters shall include position, grade, current status, and risk level.                       | FR-SL-004            |
| SRS-F2-054 | Row click shall navigate to `/people/:id`.                                                   | FR-SL-005, AC-SL-005 |
| SRS-F2-055 | Empty state shall render when filters return no results.                                     | FR-SL-006            |
| SRS-F2-056 | Subordinates page shall show loading state while query pending and error state on failure.   | Component structure  |
| SRS-F2-057 | Subordinates domain modules shall live under `src/features/people/` as stated by phase plan. | PLAN section 6       |

### 7.7 Routing And Navigation

| ID         | Requirement                                                                                           | Source         |
| ---------- | ----------------------------------------------------------------------------------------------------- | -------------- |
| SRS-F2-060 | Route helpers shall include `getSubordinatesPagePath()` and `getEmployeeProfilePagePath(id: string)`. | PLAN section 7 |
| SRS-F2-061 | `src/app/router.tsx` shall register `/subordinates` and `/people/:id` as UM-only routes.              | PLAN section 7 |
| SRS-F2-062 | `src/app/navigation.ts` shall include Subordinates link for Unit Manager.                             | PLAN section 7 |
| SRS-F2-063 | `/people/:id` may be a placeholder in Phase 2 but must resolve to a valid route component.            | PLAN section 7 |

### 7.8 Shared UI Primitives

| ID         | Requirement                                                                                                       | Source         |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | -------------- |
| SRS-F2-070 | Before feature implementation, missing shared primitives needed by phase plan shall be added to `src/shared/ui/`. | PLAN section 8 |
| SRS-F2-071 | At minimum evaluate and add if missing: `select`, `data-table`, `status-pill`, `page-header`, `skeleton`.         | PLAN section 8 |
| SRS-F2-072 | Generic control styles shall not be duplicated inside feature components.                                         | `shared-ui.md` |
| SRS-F2-073 | Shared UI inventory documentation shall be updated when new primitives are introduced.                            | `shared-ui.md` |

### 7.9 Handoff Documentation

| ID         | Requirement                                                                               | Source           |
| ---------- | ----------------------------------------------------------------------------------------- | ---------------- |
| SRS-F2-080 | `.planning/STATE.md` shall be updated with Phase 2 implementation and validation status.  | PLAN, process    |
| SRS-F2-081 | `STATUS.md` for Phase 2 shall be created/updated with handoff details and deferred scope. | PLAN DoD         |
| SRS-F2-082 | Deferred items to Phase 3+ shall be explicitly documented to avoid scope confusion.       | Scope governance |

## 8. Data Contracts (Phase 2 Minimum)

### 8.1 Dashboard Stats

```ts
export type DashboardStats = {
  subordinateHeadcount: number
  activeRisksCount: number
  openActionItemsCount: number
  activeRequestsCount: number
}
```

### 8.2 Dashboard Action Item Row

```ts
export type DashboardActionItemRow = {
  id: string
  title: string
  dueDate: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: string
  isOverdue: boolean
}
```

### 8.3 Subordinates Table Row

```ts
export type SubordinateRow = {
  id: string
  fullName: string
  position: string
  grade: string
  currentProjectStatus: 'Allocated' | 'Partially Allocated' | 'Bench' | 'Booked' | 'Unavailable'
  riskLevel: 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
}
```

## 9. Page And Route Requirements

| Route                  | Helper                           | Allowed role(s)      | Page folder                               | Purpose                                       |
| ---------------------- | -------------------------------- | -------------------- | ----------------------------------------- | --------------------------------------------- |
| `/dashboard`           | `getDashboardPagePath()`         | Unit Manager         | `src/pages/dashboard-page/`               | Functional manager dashboard                  |
| `/subordinates`        | `getSubordinatesPagePath()`      | Unit Manager         | `src/pages/subordinates-page/`            | Subordinates table with sort/filter           |
| `/people/:id`          | `getEmployeeProfilePagePath(id)` | Unit Manager         | `src/pages/employee-profile-page/` (stub) | Valid drilldown target; full profile deferred |
| `/resourcing/requests` | existing helper                  | Sales / Delivery Mgr | existing page                             | Phase 1 behavior preserved                    |
| `/my-profile`          | existing helper                  | Employee             | existing page                             | Phase 1 behavior preserved                    |

## 10. Non-Functional Requirements

| ID          | Requirement                                                                     | Source         |
| ----------- | ------------------------------------------------------------------------------- | -------------- |
| SRS-NF2-001 | App remains frontend-only with mocked data boundaries.                          | BRD principle  |
| SRS-NF2-002 | Phase 2 UI validated for desktop browser usage at 1280px+ viewport.             | BRD AS-016     |
| SRS-NF2-003 | `npm run build` must pass.                                                      | PLAN AC        |
| SRS-NF2-004 | `npm run lint` must pass.                                                       | PLAN AC        |
| SRS-NF2-005 | `npm run format:check` must pass.                                               | PLAN AC        |
| SRS-NF2-006 | Seed generation and API responses must be deterministic for repeatable QA runs. | PLAN section 2 |
| SRS-NF2-007 | No backend or persistence dependencies are introduced.                          | Scope rules    |

## 11. Accessibility Requirements

| ID            | Requirement                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------- |
| SRS-A11Y2-001 | Dashboard cards and sections shall have clear semantic headings and labels.                 |
| SRS-A11Y2-002 | Dashboard quick nav links shall be keyboard reachable with visible focus.                   |
| SRS-A11Y2-003 | Subordinates sorting controls shall be keyboard operable.                                   |
| SRS-A11Y2-004 | Filter controls shall have explicit labels and accessible names.                            |
| SRS-A11Y2-005 | Empty/loading/error states shall use readable text and semantic container structure.        |
| SRS-A11Y2-006 | Overdue highlighting shall not rely on color alone; include textual/status cues where used. |

## 12. Implementation Constraints

1. Keep route pages thin; business logic lives in feature modules.
2. Route helpers and route registration remain centralized in `src/app/routes.ts` and `src/app/router.tsx`.
3. Use TanStack Query for server-like data; do not move entity data to Zustand.
4. Keep large datasets in mocks/factories/services; do not hard-code inside UI components.
5. Reuse existing shared UI primitives before adding new ones.
6. Do not implement deferred Phase 3+ user workflows in Phase 2.
7. Keep faker seed fixed as specified in plan.

## 13. Traceability Matrix

| Phase 2 SRS area                | BRD / plan references                          |
| ------------------------------- | ---------------------------------------------- |
| Dashboard widgets               | FR-DB-001..004, AC-DB-001, PLAN section 5      |
| Dashboard action items behavior | FR-DB-005..006, AC-DB-002..003, PLAN section 5 |
| Dashboard quick navigation      | FR-DB-007, AC-DB-004, PLAN section 5           |
| Subordinates list core behavior | FR-SL-001..006, AC-SL-001..005, PLAN section 6 |
| Route + nav updates             | PLAN section 7                                 |
| Domain types completion         | BRD section 8, PLAN section 1                  |
| Seed data expansion             | BRD 7.1, PLAN section 2                        |
| MSW endpoint expansion          | PLAN section 3                                 |
| Query key expansion             | PLAN section 4                                 |
| Shared primitives additions     | PLAN section 8, shared-ui rules                |

## 14. Acceptance Criteria

### 14.1 Build / Lint / Format

- `npm run build` exits with code 0.
- `npm run lint` exits with code 0.
- `npm run format:check` exits with code 0.

### 14.2 Dashboard

1. Four widget cards render with valid labels and seeded non-zero values.
2. Action items are sorted ascending by due date.
3. At least one overdue action item is visibly emphasized.
4. Quick links navigate to expected routes.
5. Loading and error states are handled without page breakage.

### 14.3 Subordinates

1. List shows only active Unit Manager scoped employees.
2. Five required columns are visible.
3. Sorting changes row order correctly.
4. Filtering by at least risk/status works correctly.
5. Empty state appears when filters return no data.
6. Row click navigates to `/people/:id`.

### 14.4 Data Foundation

1. Required type files exist and compile.
2. People seed is 500+ deterministic records.
3. Risks/action-items/feedbacks/scheduled-leaves datasets exist as required.
4. Resourcing requests expanded to 10 with required fields.
5. New MSW endpoints respond with typed data.

## 15. QA Validation Mapping

| Validation area                    | Covered by SRS sections        |
| ---------------------------------- | ------------------------------ |
| Build/lint/format gates            | Section 14.1, SRS-NF2-003..005 |
| Dashboard behavior                 | Section 7.5, Section 14.2      |
| Subordinates behavior              | Section 7.6, Section 14.3      |
| Route and role guard behavior      | Sections 6 and 7.7             |
| Type and seed expansion            | Sections 7.1, 7.2, 14.4        |
| Mock endpoint and query boundaries | Sections 7.3 and 7.4           |
| Accessibility coverage             | Section 11                     |

## 16. Open Decisions

| Decision                                            | Owner     | Default for implementation                                |
| --------------------------------------------------- | --------- | --------------------------------------------------------- |
| Final UX details for table primitive (`data-table`) | Volodymyr | Use existing shared primitive or add one if missing       |
| Scope depth for `/people/:id` in Phase 2            | Volodymyr | Keep as stub entry point only                             |
| Exact seed distribution across units                | Volodymyr | Deterministic balanced distribution supporting UM scope   |
| Validation checklist file details                   | Ivan      | Create `.planning/phases/phase-2-dashboard/VALIDATION.md` |

## 17. Deferred to Phase 3+

- Full Employee Profile tabs implementation and editing flows.
- Personal profile editing/full employee self-service behavior.
- Resourcing request creation and candidate review full business flow.
- Custom list builder and sharing full UX.
- Shared profile generation full UX.

## 18. Definition Of Done

Phase 2 is done when:

- In-scope requirements in this SRS are implemented or explicitly deferred.
- Build/lint/format checks pass.
- Dashboard and subordinates acceptance checks pass.
- Domain types and seed data targets are met.
- UM route/nav updates are complete and role guards preserved.
- Planning handoff files (`STATE.md`, Phase 2 status/validation artifacts) are updated.
- Ivan can execute Phase 2 validation without requiring additional requirement interpretation.
