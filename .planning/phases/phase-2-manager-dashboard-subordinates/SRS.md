# Software Requirements Specification

# Phase 2 - Manager Dashboard & Subordinates

## 1. Document Control

| Field                | Value                                                                   |
| -------------------- | ----------------------------------------------------------------------- |
| Product              | People Management & Resourcing MVP                                      |
| Phase                | Phase 2 - Manager Dashboard & Subordinates                              |
| Document type        | Software Requirements Specification                                     |
| Status               | Draft for implementation                                                |
| Implementation owner | Volodymyr                                                               |
| QA owner             | Ivan                                                                    |
| Product / BA owner   | Carlos                                                                  |
| Source BRD           | `docs/requirements/# Business Requirements Document.md`                 |
| Phase plan           | `.planning/phases/phase-2-manager-dashboard-subordinates/PLAN.md`       |
| Phase validation     | `.planning/phases/phase-2-manager-dashboard-subordinates/VALIDATION.md` |

## 2. Purpose

This SRS translates BRD dashboard and subordinates requirements into implementation-ready software requirements for Phase 2. The phase must move beyond placeholders to deliver a usable Unit Manager operational workspace with dashboard summary widgets, sorted action items, quick navigation, and a subordinate list experience with filtering, sorting, and row-level navigation.

Phase 2 is not expected to deliver full profile tabs, employee self-service forms, request/proposal/review workflows, profile sharing, assignment history, or custom list builder behavior.

## 3. Source Inputs

| Source                                | Used for                                                        |
| ------------------------------------- | --------------------------------------------------------------- |
| BRD sections 3-7                      | Scope boundaries, role behavior, desktop-only constraints       |
| BRD FR-DB-001 through FR-DB-007       | Manager dashboard requirements                                  |
| BRD FR-SL-001 through FR-SL-006       | Subordinates table requirements                                 |
| BRD BR-001 through BR-003             | Role and data visibility restrictions                           |
| BRD AC-DB-001 through AC-DB-004       | Dashboard acceptance criteria                                   |
| BRD AC-SL-001 through AC-SL-005       | Subordinates acceptance criteria                                |
| `.planning/REQUIREMENTS.md`           | Condensed requirement IDs and intent by area                    |
| `.planning/ROADMAP.md`                | Phase objective and sequencing                                  |
| Phase 2 `PLAN.md`                     | In-scope deliverables, tasks, expected outputs                  |
| Phase 2 `VALIDATION.md`               | QA checks and definition of done                                |
| `docs/architecture/*.md`              | Folder ownership, routing conventions, page/component structure |
| Phase 1 SRS + implementation baseline | Existing route, role, mock, and app-shell behavior              |

## 4. Phase Objective

Deliver a desktop-first Unit Manager workspace where:

- Dashboard summary cards show key operational counts.
- Manager action items are visible and ordered by due date.
- Overdue action items are visually emphasized.
- Quick navigation actions are available from the dashboard.
- Subordinates list is unit-scoped and supports required columns, sorting, and filtering.
- Selecting a subordinate opens the profile route entry point for later Phase 3 expansion.
- Mock data volume and realism increase from Phase 1 baseline toward 500+ employees.

## 5. Scope

### 5.1 In Scope

1. Dashboard data model and query boundary for summary and manager action items.
2. Dashboard UI components and page composition for Unit Manager role.
3. Four dashboard widgets:
   - subordinate headcount
   - active risks count
   - open action items count
   - active resourcing requests count
4. Manager action item list sorted ascending by due date.
5. Overdue visual treatment for dashboard action items.
6. Dashboard quick links/cards to Subordinates, Custom Lists, Resourcing, and Risks.
7. Subordinates data model and query boundary.
8. Subordinates list page with required columns.
9. Sorting and filtering behavior for subordinates list.
10. Empty state behavior for filtered/no-result list states.
11. Row click navigation to profile stub route for Phase 3 continuation.
12. Role guardrails so dashboard and subordinates remain Unit Manager only.
13. Mock seed expansion toward BRD target data volume and supporting dashboard/list realism.
14. Handoff and status updates in planning docs after implementation.

### 5.2 Out of Scope

The following must not be implemented as part of Phase 2 unless explicitly reprioritized:

- Full managerial profile tabs and editing flows (Phase 3).
- Employee personal profile edit workflows (Phase 3).
- DM resourcing request creation forms (Phase 4).
- UM candidate proposal workflows (Phase 4).
- DM candidate review and decision workflows (Phase 4).
- Assignment history recording and profile presentation (Phase 4).
- Custom list creation, inline editing, and sharing behaviors (Phase 5).
- Shared profile generation and token view UX (Phase 4/5).
- Real backend, authentication, persistence, file storage, or external integrations.
- Mobile/tablet/narrow viewport and responsive breakpoint validation.
- Unrelated app-shell redesigns or broad navigation refactors outside Phase 2 needs.

## 6. Users And Access Context

### 6.1 Supported Role In Phase 2

| Role         | Access in this phase                    |
| ------------ | --------------------------------------- |
| Unit Manager | Full Phase 2 dashboard and subordinates |
| Delivery Mgr | No access to UM dashboard/subordinates  |
| Employee     | No access to UM dashboard/subordinates  |

### 6.2 Role Access Rules

- Phase 1 role switch behavior remains intact and unchanged.
- Phase 2 features are accessible only in `unit-manager` role.
- Non-UM roles attempting direct URL access to UM Phase 2 routes must be redirected or blocked according to existing app route-guard policy.
- Subordinate list data scope must respect UM visibility constraints from BRD assumptions and business rules.

## 7. Functional Requirements

### 7.1 Routing And Navigation Integration

| ID         | Requirement                                                                                                  | Source               |
| ---------- | ------------------------------------------------------------------------------------------------------------ | -------------------- |
| SRS-F2-001 | Phase 2 routes shall be defined via helper functions in `src/app/routes.ts`.                                 | Architecture         |
| SRS-F2-002 | Phase 2 routes shall be registered only in `src/app/router.tsx`.                                             | Architecture         |
| SRS-F2-003 | Dashboard route shall remain Unit Manager landing route behavior from Phase 1.                               | FR-RS, FR-DB         |
| SRS-F2-004 | Subordinates route shall be available for Unit Manager navigation.                                           | FR-DB-007, FR-SL-001 |
| SRS-F2-005 | Unit Manager app navigation shall include an entry to Subordinates in addition to dashboard access.          | Phase 2 plan task 11 |
| SRS-F2-006 | Dashboard quick links shall route to valid targets or documented placeholders where implementation is later. | FR-DB-007, AC-DB-004 |
| SRS-F2-007 | Non-UM users shall not gain access to UM dashboard/subordinates by direct URL entry.                         | BR-002, BR-003       |

### 7.2 Dashboard Summary Widgets

| ID         | Requirement                                                                              | Source                  |
| ---------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| SRS-F2-010 | Unit Manager dashboard shall display a subordinate headcount widget.                     | FR-DB-001, AC-DB-001    |
| SRS-F2-011 | Unit Manager dashboard shall display an active risks widget.                             | FR-DB-002, AC-DB-001    |
| SRS-F2-012 | Unit Manager dashboard shall display an open action items widget.                        | FR-DB-003, AC-DB-001    |
| SRS-F2-013 | Unit Manager dashboard shall display an active resourcing requests widget.               | FR-DB-004, AC-DB-001    |
| SRS-F2-014 | Widget labels shall be clearly named and semantically understandable.                    | Validation #29          |
| SRS-F2-015 | Widget values shall be derived from mock/query data, not hard-coded component constants. | Validation #22          |
| SRS-F2-016 | Widget cards shall support loading and error handling through page/feature async states. | Page/component guidance |

### 7.3 Dashboard Action Items Section

| ID         | Requirement                                                                                                    | Source               |
| ---------- | -------------------------------------------------------------------------------------------------------------- | -------------------- |
| SRS-F2-020 | Dashboard shall display manager action items list tied to Unit Manager context.                                | FR-DB-005            |
| SRS-F2-021 | Action items shall be sorted by due date in ascending order by default.                                        | FR-DB-005, AC-DB-002 |
| SRS-F2-022 | At least one seeded overdue item must be visually emphasized in desktop view.                                  | FR-DB-006, AC-DB-003 |
| SRS-F2-023 | Overdue styling shall remain readable and not rely on color alone where practical (label/icon/text indicator). | A11y guidance        |
| SRS-F2-024 | Action item list shall handle empty, loading, and error states.                                                | Validation           |

### 7.4 Dashboard Quick Navigation

| ID         | Requirement                                                                                             | Source              |
| ---------- | ------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F2-030 | Dashboard shall provide quick navigation actions for Subordinates, Custom Lists, Resourcing, and Risks. | FR-DB-007           |
| SRS-F2-031 | Quick navigation actions shall use route helper paths or centralized route references.                  | Architecture        |
| SRS-F2-032 | Quick navigation controls shall be keyboard reachable and show visible focus.                           | Validation #28, #31 |
| SRS-F2-033 | Links to later-phase areas may open placeholders, but behavior must be deterministic and non-broken.    | Phase boundaries    |
| SRS-F2-034 | Quick links shall not expose hidden UM-only pages to non-UM roles due to guard bypass.                  | Validation #16, #17 |

### 7.5 Subordinates Data Scope And Table

| ID         | Requirement                                                                                                        | Source               |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | -------------------- |
| SRS-F2-040 | Subordinates list shall include only records in Unit Manager scope.                                                | FR-SL-001, AC-SL-001 |
| SRS-F2-041 | Required columns shall include name, position, grade, status/project status, and risk level.                       | FR-SL-002, AC-SL-002 |
| SRS-F2-042 | Subordinates list shall support sorting interactions for applicable columns.                                       | FR-SL-003, AC-SL-003 |
| SRS-F2-043 | Subordinates list shall support filtering interactions at minimum for position, grade, status, and risk level.     | FR-SL-004            |
| SRS-F2-044 | Sort and filter interactions shall work together without inconsistent state resets.                                | Validation #13, #25  |
| SRS-F2-045 | Filter results with zero matches shall show a clear empty state.                                                   | FR-SL-006, AC-SL-004 |
| SRS-F2-046 | Subordinates table data shall come through feature query/API boundaries, not static arrays inside page components. | Validation #22       |

### 7.6 Subordinates Row Navigation

| ID         | Requirement                                                                                                           | Source               |
| ---------- | --------------------------------------------------------------------------------------------------------------------- | -------------------- |
| SRS-F2-050 | Clicking/selecting a subordinate row shall navigate to a profile route entry point for that person.                   | FR-SL-005, AC-SL-005 |
| SRS-F2-051 | Phase 2 profile target may be a stub/placeholder route, but route params/context must be implementation-ready.        | Phase 2 plan         |
| SRS-F2-052 | Subordinate row navigation shall preserve browser history behavior (back returns to prior list state where possible). | Validation #18       |

### 7.7 Mock Data And Seed Expansion

| ID         | Requirement                                                                                                               | Source           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| SRS-F2-060 | Phase 2 shall expand employee seed data from Phase 1 baseline toward BRD target of 500+ employees across 3 units.         | BRD 7.1, roadmap |
| SRS-F2-061 | Generated employee data shall remain deterministic and stable across app starts where existing mock strategy supports it. | Demo consistency |
| SRS-F2-062 | Seed data shall include sufficient risks, action items, and active requests to produce meaningful widget values.          | Validation #21   |
| SRS-F2-063 | Unit distribution shall be realistic and support Unit Manager subordinate scenarios.                                      | Validation #20   |
| SRS-F2-064 | Large datasets shall remain outside UI components and be sourced from mocks/factories/query layer.                        | Validation #22   |

### 7.8 Feature Layer Boundaries

| ID         | Requirement                                                                                     | Source                |
| ---------- | ----------------------------------------------------------------------------------------------- | --------------------- |
| SRS-F2-070 | Dashboard domain logic/components/hooks shall live in `src/features/dashboard/`.                | Phase 2 plan          |
| SRS-F2-071 | Subordinates domain logic/components/hooks shall live in `src/features/subordinates/`.          | Phase 2 plan          |
| SRS-F2-072 | Route pages shall remain thin composition layers in `src/pages/`.                               | page-structure.md     |
| SRS-F2-073 | Reusable UI primitives created for this phase shall live in `src/shared/ui/`.                   | shared-ui guidance    |
| SRS-F2-074 | Server-like data state shall stay in TanStack Query layer, not migrated into Zustand app store. | architecture guidance |

### 7.9 Handoff Documentation

| ID         | Requirement                                                                                         | Source           |
| ---------- | --------------------------------------------------------------------------------------------------- | ---------------- |
| SRS-F2-080 | `.planning/STATE.md` shall be updated with Phase 2 implementation status and validation outcomes.   | Validation DoD   |
| SRS-F2-081 | Phase 2 handoff shall include expected widget values and seed assumptions used for QA verification. | Phase 2 handoff  |
| SRS-F2-082 | Deferred Phase 3-5 items shall be documented explicitly to avoid QA interpretation ambiguity.       | Scope management |

## 8. Data Contracts For Phase 2

The following contracts define minimum Phase 2 data shapes needed to implement and test the dashboard and subordinates scope. Names and exact file placement may vary, but fields and semantics must remain equivalent.

### 8.1 Dashboard Summary

```ts
export type DashboardSummary = {
  subordinateCount: number
  activeRisksCount: number
  openActionItemsCount: number
  activeResourcingRequestsCount: number
}
```

### 8.2 Dashboard Action Item

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

### 8.3 Subordinate List Item

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

### 8.4 Subordinates Query Filter

```ts
export type SubordinatesFilter = {
  position?: string
  grade?: string
  currentStatus?: 'Allocated' | 'Partially Allocated' | 'Bench' | 'Booked' | 'Unavailable'
  riskLevel?: 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
  search?: string
}
```

### 8.5 Subordinates Query Sort

```ts
export type SubordinatesSort = {
  field: 'fullName' | 'position' | 'grade' | 'currentStatus' | 'riskLevel'
  direction: 'asc' | 'desc'
}
```

## 9. Page And Route Requirements

| Route                  | Helper target                  | Allowed role(s) | Page folder                    | Purpose                                |
| ---------------------- | ------------------------------ | --------------- | ------------------------------ | -------------------------------------- |
| `/dashboard`           | `getDashboardPagePath()`       | Unit Manager    | `src/pages/dashboard-page/`    | UM dashboard with widgets and actions  |
| `/subordinates`        | `getSubordinatesPagePath()`    | Unit Manager    | `src/pages/subordinates-page/` | UM subordinate listing and interaction |
| `/people/:personId`    | `getPersonProfilePagePath(id)` | Unit Manager    | Phase 3 target/stub entry      | Subordinate row drilldown target       |
| `/resourcing/requests` | existing helper                | Delivery Mgr    | existing Phase 1 page          | unchanged in Phase 2                   |
| `/my-profile`          | existing helper                | Employee        | existing Phase 1 page          | unchanged in Phase 2                   |

If project route helper naming differs, implementation may use existing conventions, but the same route responsibilities must be preserved.

## 10. Shared UI Requirements

1. Dashboard widgets/cards must reuse existing shared surfaces and typography patterns where available.
2. Subordinates table controls (filter inputs/selects/sort affordances) should reuse existing shared UI primitives where possible.
3. New generic controls introduced for Phase 2 belong in `src/shared/ui/`, not in feature folders.
4. Feature-specific compositions (dashboard widget grid, subordinate row renderers) belong in `src/features/*`.
5. If shared UI inventory meaningfully changes, update `docs/architecture/shared-ui.md`.

## 11. UI Requirements

1. Desktop-first rendering at `>=1280px` must remain stable.
2. Dashboard must prioritize scannability of counts and due/overdue tasks.
3. Subordinates table must keep required columns visible and readable in desktop layout.
4. Filter and sort interactions must provide immediate and understandable feedback.
5. Empty and error states must use concise, non-technical text.
6. Route transitions dashboard <-> subordinates <-> profile stub must not produce blank states.

## 12. Non-Functional Requirements

| ID          | Requirement                                                                               | Source                  |
| ----------- | ----------------------------------------------------------------------------------------- | ----------------------- |
| SRS-NF2-001 | The app shall remain frontend-only in Phase 2.                                            | BRD principles          |
| SRS-NF2-002 | Desktop browser at 1280px+ is the required validation environment for this phase.         | BRD QA scope            |
| SRS-NF2-003 | Phase 2 implementation shall pass `npm run build`.                                        | Validation              |
| SRS-NF2-004 | Phase 2 implementation shall pass `npm run lint`.                                         | Validation              |
| SRS-NF2-005 | Phase 2 implementation shall pass `npm run format:check`.                                 | Validation              |
| SRS-NF2-006 | New/updated TypeScript code shall avoid `any` and keep domain contracts explicit.         | Code quality            |
| SRS-NF2-007 | Seed expansion shall remain deterministic enough for repeatable QA and demo verification. | Validation + demo usage |
| SRS-NF2-008 | Feature layering/import direction shall remain consistent with architecture docs.         | Architecture            |

## 13. Accessibility Requirements

| ID            | Requirement                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| SRS-A11Y2-001 | Dashboard widgets shall have clear titles and semantic grouping.                           |
| SRS-A11Y2-002 | Dashboard quick links/cards shall be keyboard reachable.                                   |
| SRS-A11Y2-003 | Subordinates table headers and sorting controls shall be keyboard operable.                |
| SRS-A11Y2-004 | Filter controls shall have accessible labels or clear visible labels.                      |
| SRS-A11Y2-005 | Focus states shall be visible for interactive controls on dashboard and subordinates page. |
| SRS-A11Y2-006 | Empty, loading, and error states shall use readable text and semantic page structure.      |

## 14. Implementation Constraints

1. Keep route-level pages thin; put dashboard/subordinates domain behavior under `src/features/`.
2. Keep route helpers and route registration centralized in `src/app/routes.ts` and `src/app/router.tsx`.
3. Keep server-like datasets in mocks + TanStack Query boundaries.
4. Do not hard-code large seeded arrays in UI component files.
5. Preserve Phase 1 role switcher and role-aware navigation behavior while adding Phase 2 routes.
6. Do not introduce backend/database/auth frameworks or production integrations.
7. Avoid unrelated refactors outside dashboard/subordinates scope.

## 15. Traceability Matrix

| Phase 2 SRS area                | BRD / planning references                          |
| ------------------------------- | -------------------------------------------------- |
| Dashboard widget quartet        | FR-DB-001 through FR-DB-004, AC-DB-001             |
| Dashboard action items ordering | FR-DB-005, AC-DB-002                               |
| Overdue emphasis                | FR-DB-006, AC-DB-003                               |
| Dashboard quick links           | FR-DB-007, AC-DB-004                               |
| Subordinates scope and columns  | FR-SL-001, FR-SL-002, AC-SL-001, AC-SL-002         |
| Subordinates sort/filter        | FR-SL-003, FR-SL-004, AC-SL-003                    |
| Subordinates empty state        | FR-SL-006, AC-SL-004                               |
| Row navigation                  | FR-SL-005, AC-SL-005                               |
| Role guardrails                 | BR-002, BR-003, Phase 2 validation #16-17          |
| Seed expansion                  | BRD 7.1 Mock Data, Roadmap Phase 2, Validation #19 |
| Frontend-only + desktop-only    | BRD principles, BRD QA scope                       |
| Build/lint/format gate          | Phase 2 validation                                 |

## 16. Acceptance Criteria

Phase 2 implementation is acceptable when all criteria below are true.

### 16.1 Build And Tooling

- `npm run build` exits with code 0.
- `npm run lint` exits with code 0.
- `npm run format:check` exits with code 0.

### 16.2 Dashboard

- Unit Manager can open dashboard route successfully.
- Four required widgets are visible and correctly labeled.
- Widget counts are derived from seeded/query data.
- Manager action items are ordered by due date ascending.
- Overdue item treatment is visually distinct.
- Quick navigation actions are available and usable.

### 16.3 Subordinates

- Unit Manager can open subordinates route successfully.
- Table shows required columns.
- Dataset respects Unit Manager subordinate scope.
- Sorting and filtering operate correctly and together.
- Empty state appears for no-match filter results.
- Row click opens profile entry route.

### 16.4 Guardrails And Navigation

- Non-UM role cannot access UM dashboard/subordinates workflows.
- Browser back/forward does not break route state.
- Phase 1 role switcher behavior remains intact.

### 16.5 Mock Data And Seed

- Employee seed volume grows beyond Phase 1 baseline toward 500+ target.
- Seed distribution supports realistic cross-unit demos.
- Risks/action items/requests are seeded enough to populate dashboard meaningfully.
- No large hard-coded datasets appear in UI components.

### 16.6 Documentation Handoff

- `.planning/STATE.md` updated with status and validation notes.
- QA handoff includes expected widget values and seed assumptions.
- Deferred Phase 3+ scope remains explicitly documented.

## 17. QA Validation Mapping

| Validation item                        | Covered by SRS                      |
| -------------------------------------- | ----------------------------------- |
| Build / lint / format                  | SRS-NF2-003 through SRS-NF2-005     |
| Dashboard route access                 | SRS-F2-001 through SRS-F2-004       |
| 4 dashboard widgets                    | SRS-F2-010 through SRS-F2-016       |
| Action item sorting                    | SRS-F2-020 through SRS-F2-021       |
| Overdue visual treatment               | SRS-F2-022 through SRS-F2-023       |
| Quick nav actions                      | SRS-F2-030 through SRS-F2-034       |
| Subordinates route and data scope      | SRS-F2-040                          |
| Required columns                       | SRS-F2-041                          |
| Sorting and filtering                  | SRS-F2-042 through SRS-F2-044       |
| Empty state handling                   | SRS-F2-045                          |
| Row click to profile stub              | SRS-F2-050 through SRS-F2-052       |
| Role/routing guardrails                | SRS-F2-007, SRS-F2-034              |
| Seed expansion and distribution checks | SRS-F2-060 through SRS-F2-063       |
| No hard-coded large datasets in UI     | SRS-F2-064                          |
| Keyboard/focus and accessibility       | SRS-A11Y2-001 through SRS-A11Y2-006 |

## 18. Open Decisions

| Decision                                         | Owner     | Default for implementation                                            |
| ------------------------------------------------ | --------- | --------------------------------------------------------------------- |
| Final Phase 2 employee seed count                | Volodymyr | Increase substantially toward 500+, exact count documented in handoff |
| Dashboard summary endpoint shapes                | Volodymyr | Use concise typed contracts in feature API/query layer                |
| Subordinates route naming (`/subordinates` etc.) | Volodymyr | Follow existing route-helper conventions in `src/app/routes.ts`       |
| Profile stub route target for row click          | Volodymyr | Reuse/add Phase 3-ready profile entry path and placeholder            |
| Quick link behavior for deferred areas           | Volodymyr | Route to existing placeholders; no broken/undefined links             |

## 19. Definition Of Done

Phase 2 is done when:

- All in-scope requirements in this SRS are implemented or explicitly deferred with rationale.
- `npm run build`, `npm run lint`, and `npm run format:check` pass.
- Dashboard and subordinates validations pass per Phase 2 `VALIDATION.md`.
- Role and routing guardrails continue to enforce non-UM restrictions.
- Seed data expands and supports dashboard/subordinates realism.
- No Phase 3+ business flows are accidentally implemented in this phase.
- `.planning/STATE.md` is updated and QA handoff artifacts are complete.
- Ivan can execute Phase 2 validation without additional product interpretation.
