# Phase 2 — Manager Dashboard & Subordinates — Test Plan

## 1. Document Control

| Field            | Value                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| Product          | People Management & Resourcing MVP                                                                               |
| Phase            | Phase 2 — Manager Dashboard & Subordinates                                                                       |
| Document type    | Test plan (QA design, pre-execution)                                                                             |
| Status           | Executed (evidence updated 2026-07-01)                                                                           |
| QA owner         | Ivan                                                                                                             |
| Dev owner        | Volodymyr                                                                                                        |
| Product / BA     | Carlos                                                                                                           |
| Planning sources | `.planning/phases/phase-2-dashboard/` (PLAN, SRS, IMPLEMENTATION_PLAN, VALIDATION, STATUS)                       |
| Legacy handoff   | `.planning/phases/phase-2-manager-dashboard-subordinates/STATUS.md` (superseded snapshot; QA notes merged below) |
| Source BRD       | `docs/requirements/# Business Requirements Document.md` (v1.1)                                                   |
| Precedent        | `tests/test_reports/phase1/phase-1-playwright-validation.md`, `tests/e2e/phase1/*`                               |

## 2. Purpose & Scope

This plan defines how Phase 2 is verified before QA sign-off. It fully covers both
planning locations:

- **Primary:** `.planning/phases/phase-2-dashboard/` — PLAN, SRS, IMPLEMENTATION_PLAN,
  VALIDATION, STATUS (authoritative scope and acceptance criteria).
- **Legacy handoff:** `.planning/phases/phase-2-manager-dashboard-subordinates/STATUS.md` —
  earlier implementation snapshot with QA handoff table; all items are mapped into this
  plan (§5 baseline, §6 suites, §11 traceability).

Functional scope: Unit Manager dashboard, subordinates list (sort / filter / search /
drilldown), `/people/:id` profile stub, expanded domain types, deterministic mock data,
MSW endpoints, query keys, shared UI primitives, role guards, accessibility, architecture
layering, and planning handoff artifacts.

Anything deferred in `SRS.md` §17 (full profile tabs, resourcing workflows, custom list
builder, profile sharing) is **out of scope** for functional testing — verify only that
stub/guarded routes exist and deferred UI is absent.

### 2.1 In scope

- Build / lint / format gates (SRS-NF2-003..005; PLAN build table; VALIDATION #10–12).
- Routing, role guards, browser navigation stability (SRS §6, §7.7; IMPLEMENTATION_PLAN Step 1).
- Dashboard widgets, action items, quick nav, async states (SRS §7.5, §14.2; PLAN checks #1–7).
- Subordinates columns, sort, filter, search debounce, empty state, drilldown, URL state,
  table-only refresh overlay (SRS §7.6, §14.3; PLAN checks #8–13).
- Domain types, seed data quality, MSW endpoints, query keys (SRS §7.1–7.4, §14.4; PLAN #14–20).
- Shared UI primitives and architecture layering (SRS §7.8, §12; IMPLEMENTATION_PLAN Steps 8–9).
- Accessibility (SRS §11).
- Demo Scenarios 1 and partial Scenario 2 (PLAN Goal).
- Planning handoff documentation (SRS-F2-080..082; PLAN Definition of Done).

### 2.2 Out of scope

- Full employee profile behavior, resourcing request workflows, custom list builder,
  profile sharing UX (deferred per `SRS.md` §17).
- Mobile / tablet / responsive breakpoints (desktop-only per BRD AS-016).
- Backend / persistence (frontend-only per SRS-NF2-001/007).

## 3. Test Approach

Three complementary verification methods, consistent with the Phase 1 report:

1. **Static gates** — `npm run build`, `npm run lint`, `npm run format:check` run
   locally; exit code 0 required. Note: `npm run build` also runs `playwright test`
   (see `package.json` `build` script), so the E2E suite is part of the build gate.
2. **Automated E2E (Playwright)** — new specs under `tests/e2e/phase2/` reusing the
   existing harness (`support/test.ts`, `page-objects/AppShellPage.ts`,
   `console-monitor.ts`). Data assertions derive expected values from the mock layer
   (imported into `tests/e2e/fixtures/phase2-data.ts`) rather than hardcoded magic
   numbers, mirroring `fixtures/mock-baselines.ts`.
3. **Source-confirmed** — used only for non-visual architectural/ownership constraints
   (e.g. layering, shared-ui inventory, planning artifacts). Transient async UI states
   are now runtime-asserted in automated tests.

Every case below is traceable to a planning artifact (VALIDATION item, PLAN check,
SRS ID, IMPLEMENTATION_PLAN step, or legacy STATUS handoff row).

## 4. Test Environments

| Item       | Value                                                                   |
| ---------- | ----------------------------------------------------------------------- |
| Local dev  | `npm run dev` → `http://localhost:5173` (MSW active)                    |
| Viewport   | 1280 × 800 desktop (BRD AS-016 / SRS-NF2-002); no responsive validation |
| Mock layer | MSW service worker; deterministic Faker seed `faker.seed(20260625)`     |
| Browsers   | Chromium (primary, matches Playwright default project)                  |

## 5. Test Data Baseline (deterministic)

Merged from `phase-2-dashboard/STATUS.md`, legacy
`phase-2-manager-dashboard-subordinates/STATUS.md` QA handoff, and `src/mocks/data/*`.

Default persona: UM `persona-um-001` / Olena Kovalenko / `person-um-001`, unit
`unit-platform` (`units.ts` `managerId: 'person-um-001'`).

| Dataset                   | Expected                                                                               | Source                      |
| ------------------------- | -------------------------------------------------------------------------------------- | --------------------------- |
| People total              | 540 (3 persona-linked + 537 generated)                                                 | STATUS / `people.ts`        |
| Subordinates (UM scope)   | People in `unit-platform` excluding `person-um-001` (≈179)                             | `getSubordinatesForManager` |
| Risks total               | 20 (14 `Open`, 6 `Monitoring`), all `unit-platform` subordinates                       | `risks.ts`                  |
| Action items total        | 31 (26 subordinate-linked + 5 manager-owned)                                           | `action-items.ts`           |
| Resourcing requests total | 10 (5 base + 5 generated)                                                              | `resourcing-requests.ts`    |
| Feedbacks seed            | 6 total; ≥2 per demo persona (`person-um-001`, `person-dm-001`, `person-employee-001`) | `feedbacks.ts`              |
| Scheduled leaves seed     | 4 total; ≥1 per demo persona; overlap scenario for Phase 4 prep                        | `scheduled-leaves.ts`       |
| Project history seed      | present, person-scoped                                                                 | `project-history.ts`        |

### 5.1 Derived UM dashboard expectations (`person-um-001`)

Computed from `getDashboardSummary('person-um-001')`:

| Widget            | Expected value | Basis                                                                                                                            |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Subordinates      | ≈179 (>0)      | unit-platform minus manager                                                                                                      |
| Active Risks      | 20             | all 20 risks are subordinate-scoped and `Open`/`Monitoring`                                                                      |
| Open Action Items | 25             | 20 open subordinate items (6 of 26 are `Done`) + 5 manager-owned open                                                            |
| Active Requests   | 5              | `assignedUnitManagerId==='person-um-001'` and status in {Submitted, In Review, Candidates Proposed}: request-001/002/003/006/008 |

> Tests should assert these against values derived from the mock service in
> `phase2-data.ts` (not literals), so re-seeding cannot silently drift expectations.

## 6. Test Suites

### 6.1 Build / Lint / Format (gate)

| ID     | Case                   | Expected                                                                                                                   | Ref                         |
| ------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| P2-B01 | `npm run build`        | Exit 0; `tsc -b` clean; Vite bundle produced; Playwright suite passes                                                      | SRS-NF2-003, VALIDATION #10 |
| P2-B02 | `npm run lint`         | Exit 0. One known non-blocking `react-hooks/incompatible-library` warning from TanStack Table is acceptable; no new errors | SRS-NF2-004, VALIDATION #11 |
| P2-B03 | `npm run format:check` | Exit 0 (`All matched files use Prettier code style!`)                                                                      | SRS-NF2-005, VALIDATION #12 |

### 6.2 Routing & Role Guards

Default active role is UM; role state is session-only (resets to UM on reload).
`RoleRoute` redirects non-matching roles to their landing page via `<Navigate replace>`.

| ID     | Case                                                       | Expected                                                                                                      | Ref                                      |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| P2-R01 | UM opens `/dashboard`                                      | Manager Dashboard renders; UM nav active                                                                      | VALIDATION #1, SRS-F2-061                |
| P2-R02 | UM opens `/subordinates` via nav link                      | Subordinates page renders; `Subordinates` nav item present for UM only                                        | VALIDATION #3, SRS-F2-062                |
| P2-R03 | UM nav has exactly Dashboard + Subordinates                | No cross-role links                                                                                           | `navigation.ts`, legacy STATUS           |
| P2-R04 | Row/drilldown → `/people/:id`                              | Employee Profile stub renders for that id                                                                     | VALIDATION #6, SRS-F2-063                |
| P2-R05 | DM direct-navigates to `/dashboard`                        | Redirected to `/resourcing/requests` (DM landing)                                                             | VALIDATION #7, SRS §6.2                  |
| P2-R06 | DM direct-navigates to `/subordinates`                     | Redirected to DM landing                                                                                      | VALIDATION #7                            |
| P2-R07 | DM direct-navigates to `/people/person-um-001`             | Redirected to DM landing                                                                                      | VALIDATION #7                            |
| P2-R08 | Employee direct-navigates to `/dashboard`                  | Redirected to `/my-profile`                                                                                   | VALIDATION #7                            |
| P2-R09 | UM opens `/custom-lists`, `/resourcing/incoming`, `/risks` | Each resolves to a valid UM-guarded route component (stub OK)                                                 | VALIDATION #2, IMPLEMENTATION_PLAN       |
| P2-R10 | Unknown route as UM                                        | Redirects to `/dashboard` (fallback → role landing)                                                           | `router.tsx` fallback                    |
| P2-R11 | Reload on `/subordinates`                                  | Role resets to UM; page still resolves (no blank screen)                                                      | Phase 1 §24 precedent                    |
| P2-R12 | Browser back/forward stability                             | dashboard → subordinates → profile → back/forward renders correct content without broken state                | IMPLEMENTATION_PLAN Step 1               |
| P2-R13 | Route helpers exist                                        | `getSubordinatesPagePath()`, `getEmployeeProfilePagePath(id)` in `routes.ts`; registered only in `router.tsx` | SRS-F2-060, SRS §12.2 (source-confirmed) |

### 6.3 Dashboard (FR-DB-001..007, AC-DB-001..004)

| ID     | Case                               | Expected                                                                                                      | Ref                                  |
| ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| P2-D01 | Four summary widgets render        | Cards: Subordinates, Active Risks, Open Action Items, Active Requests — all non-zero                          | PLAN #1–2, SRS-F2-040, VALIDATION #2 |
| P2-D02 | Widget values match seed           | Values equal derived expectations in §5.1                                                                     | PLAN #2, SRS-F2-040                  |
| P2-D03 | Quick navigation present           | Links: Subordinates, Custom Lists, Resourcing, Risks (`aria-label="Quick navigation"`)                        | VALIDATION #2, SRS-F2-043            |
| P2-D04 | Quick links navigate correctly     | Each routes to `/subordinates`, `/custom-lists`, `/resourcing/incoming`, `/risks`                             | PLAN #5, SRS-F2-043                  |
| P2-D05 | Action items list renders + sorted | `My Action Items` list; items sorted ascending by due date                                                    | PLAN #3, SRS-F2-041, legacy STATUS   |
| P2-D06 | Overdue emphasis                   | Overdue items show `Overdue` danger `StatusPill` (text + tone, not color-only)                                | PLAN #4, SRS-F2-042, legacy STATUS   |
| P2-D07 | Loading state                      | `LoadingState` ("Loading manager dashboard") shown while dashboard queries are pending (forced delay in test) | PLAN #6, SRS-F2-044                  |
| P2-D08 | Error state                        | On forced query failure, `ErrorState` renders without page crash                                              | PLAN #7, SRS-F2-044                  |
| P2-D09 | Single `h1`, semantic headings     | One `h1` (Manager Dashboard); section `aria-label`s present                                                   | SRS-A11Y2-001                        |
| P2-D10 | Dashboard data-unavailable state   | When summary payload is unavailable (`null`), dashboard renders `EmptyState` ("Dashboard data unavailable")   | SRS-F2-044, ux-requirements          |

> **Overdue caveat (see Risk R-1):** `isOverdue` compares `dueDate` to the real
> `Date.now()`. With the current seed (earliest due date 2026-07-03) and a run date on
> or before ~2026-07-02, **no item is overdue**, so P2-D06 can fail purely due to the
> wall clock. Freeze the clock (Playwright `page.clock`) to a date ≥ 2026-07-16 for a
> deterministic assertion, or treat as a seed defect to remediate.

### 6.4 Subordinates List (FR-SL-001..006, AC-SL-001..005)

| ID     | Case                       | Expected                                                                                      | Ref                           |
| ------ | -------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------- |
| P2-S01 | Scoped list renders        | Only `unit-platform` subordinates (row count == baseline query length; manager excluded)      | PLAN #8, VALIDATION #4        |
| P2-S02 | Required columns           | Name, Position, Grade, Status, Risk column headers present                                    | PLAN #9, legacy STATUS        |
| P2-S03 | Sort by each column        | Clicking a sortable header toggles asc/desc; row order changes; header shows ↑/↓ indicator    | PLAN #10, SRS-F2-052          |
| P2-S04 | Sort persists in URL       | `sortField`/`sortDirection` search params update (default `fullName` asc omitted)             | IMPLEMENTATION_PLAN Step 8    |
| P2-S05 | Filter by risk level       | Selecting a risk narrows rows to that level; `riskLevel` param set                            | PLAN #11, VALIDATION #4       |
| P2-S06 | Filter by status           | Selecting a status narrows rows; `currentStatus` param set                                    | SRS-F2-053, legacy STATUS     |
| P2-S07 | Filter by position / grade | Position and Grade selects (options derived from baseline) narrow rows                        | SRS-F2-053, legacy STATUS     |
| P2-S08 | Search is debounced        | Typing does not push a URL update / blocking spinner on every keystroke; updates after ~350ms | VALIDATION #5                 |
| P2-S09 | Search filters by name     | Search value narrows to matching `fullName`; `search` param set                               | legacy STATUS (Search filter) |
| P2-S10 | Initial loading state      | `LoadingState` ("Loading subordinates") shown when initial subordinates fetch is delayed      | SRS-F2-056                    |
| P2-S11 | Empty state                | Filter with no matches renders EmptyState ("No subordinates match the current filters")       | PLAN #13, SRS-F2-055          |
| P2-S12 | Row click drilldown        | Clicking a row / open-profile control navigates to `/people/:id`                              | PLAN #12, VALIDATION #4/#6    |
| P2-S13 | Error state                | Forced `/api/subordinates` failure renders `ErrorState` without crash                         | SRS-F2-056                    |
| P2-S15 | Deep-link with params      | Loading `/subordinates?riskLevel=High&sortField=grade` applies filter+sort on first render    | IMPLEMENTATION_PLAN Step 8    |

### 6.5 Employee Profile Stub

| ID     | Case                         | Expected                                                                     | Ref                                 |
| ------ | ---------------------------- | ---------------------------------------------------------------------------- | ----------------------------------- |
| P2-P01 | Stub renders                 | `/people/:id` shows "Employee Profile" + Phase 3 stub EmptyState with the id | legacy STATUS, SRS-F2-063           |
| P2-P02 | Back navigation              | "Back" button returns to the previous page (`navigate(-1)`)                  | VALIDATION #6                       |
| P2-P03 | No deferred features present | No profile tabs / editing / history UI (confirms scope not over-built)       | SRS §17, legacy STATUS Deferred row |

### 6.6 Mock Data & MSW Endpoints (SRS-F2-010..023)

| ID     | Endpoint / dataset                           | Expected                                                                                                                                 | Ref                           |
| ------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| P2-M01 | `GET /api/people`                            | 540 records; deterministic across reloads                                                                                                | VALIDATION #8, SRS-F2-010     |
| P2-M02 | `GET /api/people?unitId=unit-platform`       | Only platform people (unit filtering works)                                                                                              | SRS-F2-021                    |
| P2-M03 | `GET /api/people?managerId=person-um-001`    | Manager-scoped subset                                                                                                                    | SRS-F2-021                    |
| P2-M04 | `GET /api/people/:id`                        | Person by id; 404 JSON for unknown id                                                                                                    | IMPLEMENTATION_PLAN Step 4    |
| P2-M05 | `GET /api/dashboard/summary?managerId=`      | Typed `DashboardSummary`; 400 when `managerId` missing                                                                                   | legacy STATUS, SRS-F2-020     |
| P2-M06 | `GET /api/dashboard/action-items?managerId=` | Sorted `DashboardActionItem[]`; 400 when missing managerId                                                                               | legacy STATUS, SRS-F2-020     |
| P2-M07 | `GET /api/subordinates?managerId=`           | Filtered/sorted subordinates; 400 when missing managerId                                                                                 | legacy STATUS, SRS-F2-020     |
| P2-M08 | Person-scoped sub-resources                  | `/feedbacks`, `/scheduled-leaves`, `/risks`, `/action-items`, `/project-history`, `/assignment-history` each return person-scoped arrays | VALIDATION #9                 |
| P2-M09 | `POST /api/people/:id/feedbacks`             | Returns 201 with created feedback (Phase 3-ready boundary)                                                                               | SRS-F2-022                    |
| P2-M10 | `GET /api/resourcing/requests`               | 10 total; `createdById` / `assignedManagerId` filters work                                                                               | VALIDATION #8, SRS-F2-015/023 |
| P2-M11 | `GET /api/risks`, `GET /api/action-items`    | 20 risks / 31 action items                                                                                                               | VALIDATION #8, SRS-F2-013/014 |
| P2-M12 | Determinism                                  | Two sequential fetches of `/api/people` return identical id ordering                                                                     | SRS-F2-016, SRS-NF2-006       |
| P2-M13 | Feedbacks per demo persona                   | ≥2 feedback records each for `person-um-001`, `person-dm-001`, `person-employee-001`                                                     | PLAN #17, SRS-F2-011          |
| P2-M14 | Scheduled leaves overlap scenario            | Seed includes overlapping leave windows or leave/resourcing date overlap documented for Phase 4 warnings                                 | PLAN #18, SRS-F2-012          |
| P2-M15 | Risk level mix                               | Seed includes at least one `High` and one `Critical` risk among 20 records                                                               | PLAN §2, SRS-F2-013           |
| P2-M16 | Action item date mix                         | Seed includes both past-due and future-due open items among ≥30 records                                                                  | PLAN #20, SRS-F2-014          |
| P2-M17 | Project history seed                         | `project-history.ts` exports person-scoped records                                                                                       | PLAN §2                       |
| P2-M18 | Resourcing request field completeness        | All 10 requests include full BRD §8.10 field set (clientName, requiredSkills, dates, etc.)                                               | PLAN §2, SRS-F2-015           |

### 6.7 Domain Types (SRS-F2-001..005, PLAN #14–15)

| ID     | Case                           | Expected                                                                                                                                                                                                                 | Ref                  |
| ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| P2-T01 | Required type files exist      | `feedback`, `scheduled-leave`, `risk`, `action-item`, `assignment-history`, `project-history`, `document`, `idp`, `custom-field`, `custom-list`, `candidate-proposal`, `shared-profile`, `allocation` under `src/types/` | PLAN #15, SRS-F2-003 |
| P2-T02 | Person type completeness       | `person.ts` includes full BRD §8.1 field set; build passes                                                                                                                                                               | PLAN #14, SRS-F2-001 |
| P2-T03 | ResourcingRequest completeness | `resourcing-request.ts` includes full BRD §8.10 field set; build passes                                                                                                                                                  | SRS-F2-002           |
| P2-T04 | Explicit unions, no `any`      | Status/level/priority fields use unions; no `any` in new type files                                                                                                                                                      | SRS-F2-004           |
| P2-T05 | Shared type ownership          | Entity types live in `src/types/`; features import React to shared types, not duplicate entities                                                                                                                         | SRS-F2-005           |

> P2-T01..T05 are primarily verified by `npm run build` (P2-B01) plus source-confirmed
> file inventory checks in the execution report.

### 6.8 Query Keys / Boundaries (SRS-F2-030..031)

| ID     | Case                                | Expected                                                                                                                            | Ref                               |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| P2-Q01 | Query keys typed & stable           | `src/lib/query/query-keys.ts` exposes keyed factories for dashboard/people/person sub-resources/resourcing; no ad-hoc string concat | SRS-F2-030/031 (source-confirmed) |
| P2-Q02 | Server-like data via TanStack Query | Entity data flows through queries, not Zustand                                                                                      | SRS §12.3 (source-confirmed)      |
| P2-Q03 | Normalized filter objects in keys   | Empty/default filter values normalized before query key creation; no raw `URLSearchParams` in keys                                  | IMPLEMENTATION_PLAN Step 5        |

### 6.9 Architecture & Layering (SRS §12, IMPLEMENTATION_PLAN)

| ID      | Case                        | Expected                                                                                         | Ref                                   |
| ------- | --------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------- |
| P2-AR01 | Thin dashboard page         | `DashboardPage.tsx` composes feature modules only; no domain logic inline                        | SRS-F2-045, SRS §12.1                 |
| P2-AR02 | Thin subordinates page      | `SubordinatesPage.tsx` orchestrates filters/URL state; table logic in feature modules            | SRS §12.1, IMPLEMENTATION_PLAN Step 8 |
| P2-AR03 | Feature ownership           | Dashboard under `src/features/dashboard/`; subordinates under `src/features/people/`             | SRS-F2-045/057, PLAN §5–6             |
| P2-AR04 | No hardcoded datasets in UI | Large datasets in mocks/factories/services, not inline in components                             | SRS §12.4, IMPLEMENTATION_PLAN Step 3 |
| P2-AR05 | API boundary respected      | Phase 2 pages fetch via typed API wrappers + MSW; no direct mock-data imports in page/feature UI | IMPLEMENTATION_PLAN Step 4            |
| P2-AR06 | URL state rules             | Draft search local + debounced; applied filter/sort in URL; no full-page spinner on refetch      | IMPLEMENTATION_PLAN Step 8            |

> P2-AR01..AR06 are source-confirmed unless a runtime assertion is practical (e.g. P2-S08
> and P2-S15 for URL/debounce behavior, P2-S10 for loading-state behavior).

### 6.10 Shared UI Primitives (SRS-F2-070..073, PLAN §8)

| ID      | Case                         | Expected                                                                             | Ref                           |
| ------- | ---------------------------- | ------------------------------------------------------------------------------------ | ----------------------------- |
| P2-UI01 | Core primitives exist        | `select`, `data-table`, `status-pill`, `page-header`, `skeleton` in `src/shared/ui/` | STATUS.md, SRS-F2-071         |
| P2-UI02 | Input primitive used         | Subordinates search filter uses shared `Input`                                       | legacy STATUS                 |
| P2-UI03 | Select primitive used        | Subordinates filter bar uses shared `Select` for position/grade/status/risk          | legacy STATUS, PLAN §6        |
| P2-UI04 | No duplicated control styles | Generic control styling not duplicated inside feature/page files                     | SRS-F2-072 (source-confirmed) |
| P2-UI05 | Shared UI inventory updated  | `docs/architecture/shared-ui.md` reflects new primitives                             | SRS-F2-073 (source-confirmed) |

### 6.11 Accessibility (SRS-A11Y2-001..006)

| ID     | Case                                      | Expected                                                                                    | Ref                                |
| ------ | ----------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------- |
| P2-A01 | Dashboard landmarks & headings            | Single `h1`; sections carry `aria-label` (summary, quick nav, action items)                 | SRS-A11Y2-001                      |
| P2-A02 | Quick nav keyboard reachable + focus ring | Tab reaches links; visible focus                                                            | SRS-A11Y2-002, IMPLEMENTATION_PLAN |
| P2-A03 | Sort controls keyboard operable           | Header sort buttons focusable and Enter/Space toggles sort                                  | SRS-A11Y2-003                      |
| P2-A04 | Filters have accessible names             | Each `Select`/`Input` has an associated label ("Search"/"Position"/"Grade"/"Status"/"Risk") | SRS-A11Y2-004                      |
| P2-A05 | State containers readable                 | Loading/empty/error use text + semantic containers                                          | SRS-A11Y2-005                      |
| P2-A06 | Overdue not color-only                    | Overdue conveyed with "Overdue" text label in the pill                                      | SRS-A11Y2-006                      |
| P2-A07 | No console errors during flows            | Zero console errors/warnings across dashboard + subordinates flows                          | Phase 1 §25 precedent              |

### 6.12 Demo Scenarios (PLAN Goal)

| ID       | Case                        | Steps / expected                                                                                               | Ref       |
| -------- | --------------------------- | -------------------------------------------------------------------------------------------------------------- | --------- |
| P2-E2E01 | Demo Scenario 1 — Dashboard | UM loads app → `/dashboard` → 4 non-zero widgets, sorted action items with overdue emphasis, quick nav visible | PLAN Goal |
| P2-E2E02 | Demo Scenario 2 (partial)   | UM opens Subordinates → applies filter/sort → clicks row → `/people/:id` stub → Back returns to list           | PLAN Goal |

### 6.13 Planning Handoff & Documentation (SRS-F2-080..082, PLAN DoD)

| ID     | Case                      | Expected                                                                                   | Ref                       |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------ | ------------------------- |
| P2-H01 | STATE.md updated          | `.planning/STATE.md` reflects Phase 2 implemented + validation status                      | SRS-F2-080                |
| P2-H02 | Phase 2 STATUS.md         | `.planning/phases/phase-2-dashboard/STATUS.md` documents delivered scope and remaining QA  | SRS-F2-081, PLAN DoD      |
| P2-H03 | Deferred scope documented | Phase 3+ deferrals explicit in STATUS/SRS §17 (profile, resourcing, custom lists, sharing) | SRS-F2-082, legacy STATUS |
| P2-H04 | VALIDATION.md evidence    | Checklist items marked with evidence after execution run                                   | VALIDATION §Evidence      |

### 6.14 Non-Functional

| ID     | Case                     | Expected                                              | Ref             |
| ------ | ------------------------ | ----------------------------------------------------- | --------------- |
| P2-N01 | Frontend-only            | No backend/persistence calls; all data via MSW        | SRS-NF2-001/007 |
| P2-N02 | Desktop layout at 1280px | Dashboard + subordinates usable, no clipping/overflow | SRS-NF2-002     |
| P2-N03 | Deterministic reruns     | Repeated runs yield identical seed-derived assertions | SRS-NF2-006     |

## 7. Traceability Matrix (planning artifacts → suites)

| Planning source                                         | Suites                  |
| ------------------------------------------------------- | ----------------------- |
| VALIDATION.md checklist (#1–12)                         | 6.1–6.6, 6.13           |
| PLAN.md acceptance (#1–20)                              | 6.1–6.7, 6.10           |
| IMPLEMENTATION_PLAN validation checklist                | 6.1–6.6, 6.8–6.10, 6.12 |
| SRS §7–§14 (all SRS-F2- requirements)                   | 6.1–6.14                |
| phase-2-dashboard/STATUS.md delivered                   | 6.3–6.6, 6.10           |
| legacy manager-dashboard-subordinates STATUS QA handoff | §5, 6.3–6.6, 6.10       |

## 8. Full Cross-Reference Tables

### 8.1 VALIDATION.md → test cases

| VALIDATION # | Item summary                                            | Test case(s)           |
| ------------ | ------------------------------------------------------- | ---------------------- |
| 1            | UM opens `/dashboard`                                   | P2-R01, P2-E2E01       |
| 2            | Quick nav to subordinates/custom lists/resourcing/risks | P2-D03, P2-D04         |
| 3            | UM opens `/subordinates` from nav                       | P2-R02                 |
| 4            | Subordinates filter/sort + profile drilldown            | P2-S03–S07, S12        |
| 5            | Debounced search, no full-page blocking per keystroke   | P2-S08, P2-S09         |
| 6            | `/people/:id` UM-guarded + back navigation              | P2-R04, P2-P02, P2-R07 |
| 7            | Non-UM blocked from UM routes                           | P2-R05–R08             |
| 8            | Mock scale (500+ people, 10 requests, risks/actions)    | P2-M01, M10, M11       |
| 9            | Person-scoped endpoints                                 | P2-M08                 |
| 10           | `npm run build`                                         | P2-B01                 |
| 11           | `npm run lint`                                          | P2-B02                 |
| 12           | `npm run format:check`                                  | P2-B03                 |

### 8.2 PLAN.md acceptance (#1–20) → test cases

| PLAN # | Item summary                         | Test case(s)     |
| ------ | ------------------------------------ | ---------------- |
| 1      | Four widget cards render             | P2-D01           |
| 2      | Widget values non-zero               | P2-D01, P2-D02   |
| 3      | Action items sorted by due date      | P2-D05           |
| 4      | Overdue action item highlighted      | P2-D06           |
| 5      | Quick nav links function             | P2-D04           |
| 6      | Dashboard LoadingState while pending | P2-D07           |
| 7      | Dashboard ErrorState on query fail   | P2-D08           |
| 8      | List shows only UM unit employees    | P2-S01           |
| 9      | All five columns visible             | P2-S02           |
| 10     | Sorting by name changes row order    | P2-S03           |
| 11     | Filtering by risk level              | P2-S05           |
| 12     | Row click opens employee profile     | P2-S12, P2-E2E02 |
| 13     | Empty state on no filter results     | P2-S11           |
| 14     | Person type full BRD §8.1 fields     | P2-T02, P2-B01   |
| 15     | All new type files exist             | P2-T01           |
| 16     | People seed 500+                     | P2-M01           |
| 17     | Feedback seed (2+ per demo persona)  | P2-M13           |
| 18     | ScheduledLeave seed + overlap        | P2-M14           |
| 19     | Risk seed 20+ with High/Critical     | P2-M11, P2-M15   |
| 20     | ActionItem seed 30+ overdue/upcoming | P2-M11, P2-M16   |

### 8.3 Legacy STATUS handoff table → test cases

| Legacy STATUS row                           | Test case(s)                      |
| ------------------------------------------- | --------------------------------- |
| Default UM persona                          | §5 baseline; all UM-default tests |
| Seed count 540                              | P2-M01                            |
| Unit Manager unit                           | P2-S01                            |
| Subordinate scope ~179                      | P2-S01, P2-D02                    |
| Dashboard widgets non-zero                  | P2-D01, P2-D02                    |
| Action items sort/overdue                   | P2-D05, P2-D06                    |
| Subordinates columns                        | P2-S02                            |
| Filters (search/position/grade/status/risk) | P2-S05–S09                        |
| Profile stub route                          | P2-P01, P2-S12                    |
| Deferred scope                              | P2-P03, P2-H03                    |
| MSW dashboard/subordinates endpoints        | P2-M05–M07                        |
| Shared UI Input/Select                      | P2-UI02, P2-UI03                  |

## 9. Proposed Automated Test Layout

Mirror the Phase 1 harness; keep expected values derived from the mock layer.

```text
tests/e2e/
  fixtures/
    phase2-data.ts            # baselines: personas, unit scope, derived dashboard/subordinate expectations
  page-objects/
    DashboardPage.ts          # summary cards, quick links, action-items list locators
    SubordinatesPage.ts       # filters, sortable headers, rows, overlay, empty state locators
  phase2/
    routing-guards.spec.ts    # 6.2
    dashboard.spec.ts         # 6.3, 6.12
    subordinates.spec.ts      # 6.4
    profile-stub.spec.ts      # 6.5
    mock-data.spec.ts         # 6.6, 6.7 (seed quality + endpoints)
    accessibility.spec.ts     # 6.11
```

Run: `npm run test:e2e` (or `npm run test:e2e:ui`); the full gate runs via
`npm run build`.

Architecture, shared UI inventory, and handoff doc checks (6.9, 6.10, 6.13) are
recorded in the execution report as source-confirmed rows, matching Phase 1 §9 practice.

## 10. Risks, Assumptions & Open Items

| ID  | Type       | Item                                                                                                                                                                           | Impact / action                                                                                                                               |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| R-1 | Risk (P1)  | `DashboardActionItem.isOverdue` uses live `Date.now()`; earliest seeded due date is 2026-07-03, so overdue emphasis (AC-DB-003 / SRS-F2-042) may not appear on early run dates | Freeze clock to ≥2026-07-16 in the overdue spec, or make seed due dates relative to now / include clearly-past dates. Confirm with Volodymyr. |
| R-2 | Risk       | Known lint warning `react-hooks/incompatible-library` (TanStack Table) — accepted by VALIDATION                                                                                | Assert "no new errors"; do not fail on this single documented warning                                                                         |
| R-3 | Assumption | Subordinate count (≈179) is not asserted as a literal                                                                                                                          | Derive from `getSubordinatesForManager('person-um-001')` in `phase2-data.ts`                                                                  |
| R-4 | Resolved   | Loading/error states previously treated as hard-to-observe                                                                                                                     | Replaced with runtime assertions in P2-D07/P2-D08/P2-D10, P2-S10/P2-S13, and P2-A05                                                           |
| R-5 | Resolved   | Two Phase 2 planning folders exist                                                                                                                                             | `phase-2-dashboard/` is authoritative; `phase-2-manager-dashboard-subordinates/` is a superseded handoff snapshot — both mapped in §8.3       |
| R-6 | Scope      | `/custom-lists`, `/resourcing/incoming`, `/risks` are UM-guarded stub routes                                                                                                   | Verify guard + valid render only (P2-R09, P2-D04); do not test deferred functionality                                                         |
| R-7 | Open (P1)  | GAP-1 (see `tests/test_reports/phase2/SRS_test.md`): quick-nav targets were undefined in original SRS route table; implementation added stub routes                            | P2-D04/P2-R09 validate current implementation; confirm with Carlos that stub destinations are acceptable for Phase 2 sign-off                 |

## 11. Entry & Exit Criteria

**Entry:** Phase 2 implemented (`phase-2-dashboard/STATUS.md` = Implemented); local deps
installed; `npm run dev` serves the app with MSW active.

**Exit (sign-off):**

- 6.1 gates pass (exit 0; only the one documented lint warning).
- All 6.2–6.5 functional cases pass (or documented, accepted deviations).
- 6.6–6.7 data/seed/type cases pass with deterministic values.
- 6.8–6.10 architecture and shared UI checks recorded (runtime or source-confirmed).
- 6.11 accessibility cases pass; zero console errors in core flows.
- 6.12 demo scenarios pass end-to-end.
- 6.13 handoff documentation updated.
- R-1 resolved or explicitly accepted by Carlos/Volodymyr before close.
- Execution results recorded in `tests/test_reports/phase2/` and
  `.planning/phases/phase-2-dashboard/VALIDATION.md` updated; `STATE.md` handoff advanced.

## 12. Execution Evidence Snapshot (2026-07-01)

| Command                                                                                              | Result  | Evidence summary                                                                                        |
| ---------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `npm run build`                                                                                      | ✅ Pass | `tsc -b` + Vite build passed; Playwright stage passed with **68 passed / 0 failed**                     |
| `npm run lint`                                                                                       | ✅ Pass | 0 errors; one known non-blocking warning: `react-hooks/incompatible-library` in `SubordinatesTable.tsx` |
| `npm run format:check`                                                                               | ✅ Pass | `All matched files use Prettier code style!`                                                            |
| `npx playwright test tests/e2e/phase2/accessibility.spec.ts -g "P2-A05"`                             | ✅ Pass | Empty/loading/error state semantics assertion passed                                                    |
| `npx playwright test tests/e2e/phase2/subordinates.spec.ts -g "P2-S03/P2-S04\|P2-S05/P2-S06/P2-S07"` | ✅ Pass | Sort toggling and filter narrowing checks passed after stability hardening                              |
