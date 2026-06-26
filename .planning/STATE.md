# Current State

**Last updated:** 2026-06-26

## Completed

- [x] BRD uploaded and committed (`docs/requirements/# Business Requirements Document.md`)
- [x] GSD-lite planning structure created (`.planning/`)
- [x] App scaffold — Vite + React + TypeScript + Tailwind
- [x] Tooling — ESLint, Prettier, Husky, lint-staged
- [x] Architecture docs — `docs/architecture/page-structure.md`, `component-structure.md`
- [x] Routing foundation — `src/app/router.tsx`, `AppLayout`, home route at `/`
- [x] Early UI — Button, Badge, shadcn-badge; `components.json`

- [x] Phase 1 SRS created (`.planning/phases/phase-1-foundation/SRS.md`)
- [x] Phase 1 implementation plan created (`.planning/phases/phase-1-foundation/IMPLEMENTATION_PLAN.md`)
- [x] Phase 1 foundation implemented locally: role switcher, role-aware routes, app providers, domain types, MSW mock data foundation

- [x] Phase 1 validation (see `phases/phase-1-foundation/VALIDATION.md`) and test artifacts generation
- [x] Requirements (BRD) gaps analysis (see test/test_reports/requirements-test.md)
- [x] Phase 2 implementation completed: dashboard widgets/action-items/quick-links, subordinates table with filter+sort, profile stub route, expanded seed data and MSW endpoints

## In Progress

- [ ] Phase 2 validation sign-off in progress (`.planning/phases/phase-2-manager-dashboard-subordinates/VALIDATION.md`)

## Not Started

- Full Phase 3 profile workflows
- Full Phase 4 resourcing proposal/review workflows
- Full Phase 5 custom list builder/share workflows

## Next Owner Actions

### Carlos (Product / BA / BRD)

1. Confirm BRD v1.0 scope sign-off or list change requests before Phase 2+ work.
2. Approve seeded persona names for UM, DM, and Employee (BRD requires named demo users).
3. Validate Phase 1 exit criteria align with demo stakeholder expectations.
4. Resolve or accept open questions in BRD §15 (defaults are documented; confirm no overrides needed).

### Volodymyr (Development / JS implementation)

1. Support Ivan during Phase 2 validation and fix defects found in checklist execution.
2. Prepare Phase 3 implementation plan update after QA sign-off.
3. Keep route pages thin and continue feature-first architecture as next phases expand.

### Ivan (QA / validation / test cases)

1. Map BRD acceptance criteria (AC-) to Phase 1 validation checks in `VALIDATION.md`.
2. Generate and run E2E Playwright tests for phase 1 validation
3. Prepare test case skeletons per requirement group for Phases 2–4.

## Phase 1 Implementation Handoff

| Item                             | Value                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Role switcher                    | Segmented buttons using the existing shared `Button` primitive                          |
| Default role                     | Unit Manager                                                                            |
| Unit Manager persona             | `persona-um-001` / Olena Kovalenko                                                      |
| Sales / Delivery Manager persona | `persona-dm-001` / Marcus Reed                                                          |
| Employee persona                 | `persona-employee-001` / Nazar Petrenko                                                 |
| Root route                       | `/` redirects to the active role landing route                                          |
| Unit Manager route               | `/dashboard`                                                                            |
| Sales / Delivery Manager route   | `/resourcing/requests`                                                                  |
| Employee route                   | `/my-profile`                                                                           |
| Mock endpoints                   | `/api/personas`, `/api/units`, `/api/people`, `/api/skills`, `/api/resourcing/requests` |
| Seed count                       | 75 people across 3 units; full 500+ seed deferred to Phase 2                            |
| Deferred note                    | Persona names are placeholders until Carlos confirms final names                        |

## Phase 2 Implementation Handoff

| Item                            | Value                                                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Unit Manager routes             | `/dashboard`, `/subordinates`, `/people/:personId`                                                                         |
| Dashboard widgets               | Subordinates, Active Risks, Open Action Items, Active Resourcing Requests                                                  |
| Dashboard quick links           | Subordinates, Custom Lists (placeholder), Resourcing Incoming (placeholder), Risks (placeholder)                           |
| Subordinates interactions       | URL-backed filter + sort state (`search`, `position`, `grade`, `currentStatus`, `riskLevel`, `sortField`, `sortDirection`) |
| Subordinates required columns   | Name, Position, Grade, Status, Risk                                                                                        |
| Profile drilldown               | Row click opens `/people/:personId` Phase 3-ready stub                                                                     |
| Mock endpoints                  | `/api/dashboard/summary`, `/api/dashboard/action-items`, `/api/subordinates`                                               |
| Seed totals                     | 540 people total (3 persona anchors + 537 generated)                                                                       |
| Unit Manager subordinate count  | 180 (records with `managerId=person-um-001`)                                                                               |
| Expected dashboard summary (UM) | Derived from `/api/dashboard/summary?managerId=person-um-001`; values are deterministic and non-empty for the current seed |
| Deferred work                   | Full profile tabs/editing, DM/UM resourcing workflows, custom list builder/share workflows                                 |

## Validation Status

- Build check: `npm run build` (pass)
- Lint check: `npm run lint` (pass)
- Format check: `npm run format:check` (pass)
- Manual desktop validation: Pending Ivan QA run-through of Phase 2 validation checklist

## Blockers / Open Decisions

- No active implementation blockers for Phase 2 delivery.

## Blockers / Open Decisions

| Item                                                               | Status                    | Default / Notes                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[G-1] Feedbacks entity / section missing — High**                | Open                      | PDF §4 requires a Feedbacks section on the managerial profile. No entity, FR, AC, or roadmap entry exists. Add Feedback entity + FR/AC + roadmap line, or explicitly de-scope with rationale.                                                                        |
| **[G-2] Scheduled Leaves entity / section missing — High**         | Open                      | PDF §4 requires a Scheduled Leaves section on the managerial profile. No Leave entity, no profile FR/AC. FR-CP-007 (leave-overlap warning) depends on this data. Add entity + profile FR/AC + seed data and wire FR-CP-007 to it.                                    |
| **[G-3] Custom list filter-field builder UI unspecified — Medium** | Open                      | PDF §3 requires selecting which fields act as filters (vs. columns vs. both). `CustomList.filterableFields` exists in the data model but no FR/AC covers the builder UI. Extend FR-CL-002 to require filterable-field selection and field/column interchangeability. |
| **[D-1] One approval per request** (scope narrowing)               | Needs stakeholder confirm | AS-009 / BRD §15 restrict to one approval per request. PDF §6.3 implies per-candidate independent decisions. Confirm with Carlos before Phase 3.                                                                                                                     |
| **[D-3] Assignment → project-history creation excluded**           | Needs stakeholder confirm | PDF §4/§6 implies a successful assignment produces a corresponding project-history entry ("both items exist"). BR-006 excludes any creation flow; `convertedToProject` flag only. Confirm this is acceptable for MVP.                                                |
| **[A-2] Skills entity in scope?**                                  | Needs confirm             | PDF profile list does not mention skills. Generated BRD adds a Skills entity, "Job & Skills" tab, and required-skills on requests. Confirm with Carlos that skills are intended MVP scope.                                                                           |
| **[A-3] Candidate fit warnings in scope?**                         | Needs confirm             | FR-CP-006–008 (allocation >100%, leave overlap, High/Critical risk warnings) are not in the PDF. Confirm these are intended additions.                                                                                                                               |
| Seeded persona names                                               | Open                      | BRD requires 1 UM, 1 DM, 1 Employee — names not specified in BRD.                                                                                                                                                                                                    |
| BRD file has trailing non-markdown content after line 970          | Open                      | Ignore lines after `*End of Document*` when parsing. Trim the file when convenient [N-4].                                                                                                                                                                            |
| Git auth for push/pull in some environments                        | Environment               | Use local terminal or SSH.                                                                                                                                                                                                                                           |
| Employee sees assignment history                                   | Decided — No              | AS-011                                                                                                                                                                                                                                                               |
| Shared profile expiry                                              | Decided — No              | AS-006                                                                                                                                                                                                                                                               |
| Desktop-only validation                                            | Decided                   | BRD AS-016; mobile/tablet/narrow viewport out of scope.                                                                                                                                                                                                              |
| Shared custom lists are view-only [D-2]                            | Decided                   | BR-008/009: shared lists view-only for structure; shared recipients may edit custom values for own reports only. PDF is silent on read/write restriction — reasonable MVP interpretation.                                                                            |

## Chosen Approach

- **GSD-lite planning** in `.planning/` — PROJECT, REQUIREMENTS, ROADMAP, STATE, per-phase PLAN + VALIDATION
- **No BMAD, no OpenSpec, no heavy planning framework** at this stage
- **BRD as business source of truth**; AGENTS.md + architecture docs for engineering conventions
- **Frontend-only web application** with mock data layer (MSW optional per AGENTS.md) + Faker for all server-like data
- **Desktop browser validation only** — 1280px+ viewport; responsive breakpoint validation out of scope
