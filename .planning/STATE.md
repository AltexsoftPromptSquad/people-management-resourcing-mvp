# Current State

**Last updated:** 2026-06-27

## Completed

- [x] BRD v1.1 committed (`docs/requirements/# Business Requirements Document.md`) — remediated 2026-06-27
- [x] Decision Log committed (`docs/requirements/DECISION-LOG.md`) — G-1, G-2, G-3, D-1, D-3, A-2, A-3 closed
- [x] GSD-lite planning structure created (`.planning/`)
- [x] App scaffold — Vite + React + TypeScript + Tailwind
- [x] Tooling — ESLint, Prettier, Husky, lint-staged
- [x] Architecture docs — `page-structure.md`, `component-structure.md`, `project-structure.md`, `shared-ui.md`, `visual-theme.md`
- [x] Architecture docs — `data-models.md`, `ux-requirements.md`, `ux-behavior.md`, `feature-rules.md` (added 2026-06-27)

- [x] Phase 1 SRS created (`.planning/phases/phase-1-foundation/SRS.md`)
- [x] Phase 1 implementation plan created (`.planning/phases/phase-1-foundation/IMPLEMENTATION_PLAN.md`)
- [x] Phase 1 foundation implemented: role switcher, role-aware routes, app providers, domain types, MSW mock data foundation
- [x] Phase 1 validation passed (Ivan Zamikula, 2026-06-25) — all 20 functional/browser/a11y checks, build/lint pass
- [x] Requirements (BRD) gaps analysis (`tests/test_reports/requirements-test.md`)
- [x] Phase 2 plan created (`.planning/phases/phase-2-dashboard/PLAN.md`)

## In Progress

- [ ] **Carlos approval** of remediation decisions (see `docs/requirements/DECISION-LOG.md`)

## Not Started

- Phase 2 — Manager Dashboard & Subordinates (ready to begin pending Carlos approval)
- All BRD feature screens: dashboard, subordinates, profiles, resourcing, custom lists

## Next Owner Actions

### Carlos (Product / BA / BRD)

**Required to unblock Phase 2 implementation:**

1. **Review and approve** `docs/requirements/DECISION-LOG.md` — 7 proposed decisions (G-1, G-2, G-3, D-1, D-3, A-2, A-3). All have recommended defaults; Carlos confirms or amends.
2. **Confirm persona names** — Olena Kovalenko (UM), Marcus Reed (DM), Nazar Petrenko (Employee) — accept placeholders or provide final names.
3. **Confirm BRD v1.1 scope** — review new entities (Feedback, ScheduledLeave) and updated FRs in BRD.
4. **Phase 2 start approval** — once items 1–3 are confirmed, Phase 2 implementation may begin.

### Volodymyr (Development / JS implementation)

1. Wait for Carlos approval (above) before beginning Phase 2 implementation.
2. Execute Phase 2 plan at `.planning/phases/phase-2-dashboard/PLAN.md`.
3. Add all missing domain types from `docs/architecture/data-models.md`.
4. Expand seed data to 500+ employees and add new entity seed data (feedbacks, leaves, risks, action items).

### Ivan (QA / validation)

1. Prepare Phase 2 validation checklist (create `.planning/phases/phase-2-dashboard/VALIDATION.md`).
2. Prepare test case skeletons for Phases 3–5 based on updated BRD v1.1.

## Phase 1 Implementation Reference

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
| Mock endpoints (Phase 1)         | `/api/personas`, `/api/units`, `/api/people`, `/api/skills`, `/api/resourcing/requests` |
| Seed count (Phase 1)             | 75 people across 3 units; full 500+ seed in Phase 2                                     |

## Blockers / Open Decisions

| Item                                        | Status                             | Notes                                                             |
| ------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------- |
| **G-1 Feedbacks entity**                    | Proposed — pending Carlos approval | BRD v1.1 updated: entity §8.16, FR-EP-013–014, AC-EP-006–007      |
| **G-2 Scheduled Leaves entity**             | Proposed — pending Carlos approval | BRD v1.1 updated: entity §8.17, FR-EP-003 updated, AC-EP-008      |
| **G-3 Custom list filter-field builder**    | Proposed — pending Carlos approval | BRD v1.1 updated: FR-CL-002 updated, AC-CL-006                    |
| **D-1 One approval per request**            | Proposed — pending Carlos approval | AS-009 confirmed; §15 updated                                     |
| **D-3 No auto project history creation**    | Proposed — pending Carlos approval | BR-006 confirmed; §15 updated                                     |
| **A-2 Skills in scope**                     | Proposed — pending Carlos approval | Confirmed in BRD v1.1; no BRD changes needed                      |
| **A-3 Candidate fit warnings in scope**     | Proposed — pending Carlos approval | FR-CP-006–008, BR-012–014 confirmed; leave warning wired to §8.17 |
| **Persona names**                           | Proposed — pending Carlos approval | Placeholders: Olena Kovalenko, Marcus Reed, Nazar Petrenko        |
| Employee sees assignment history            | Decided — No                       | AS-011                                                            |
| Shared profile expiry                       | Decided — No                       | AS-006                                                            |
| Desktop-only validation                     | Decided                            | BRD AS-016                                                        |
| Shared custom lists are view-only           | Decided                            | BR-008/009                                                        |
| BRD trailing non-markdown content           | Resolved — removed 2026-06-27      | [N-4] Python script trimmed from BRD file                         |
| Git auth for push/pull in some environments | Environment                        | Use local terminal or SSH                                         |

## Chosen Approach

- **GSD-lite planning** in `.planning/` — PROJECT, REQUIREMENTS, ROADMAP, STATE, per-phase PLAN + VALIDATION
- **No BMAD, no OpenSpec, no heavy planning framework** at this stage
- **BRD as business source of truth**; AGENTS.md + architecture docs for engineering conventions
- **Frontend-only web application** with mock data layer (MSW) + Faker for all server-like data
- **Desktop browser validation only** — 1280px+ viewport; responsive breakpoint validation out of scope
