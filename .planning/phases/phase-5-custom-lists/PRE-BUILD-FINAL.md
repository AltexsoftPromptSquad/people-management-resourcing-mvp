# Phase 5 — Final Pre-Build Package

**Status:** Ready to implement (pending Carlos SRS approval)
**Date:** 2026-07-07
**Rule:** Phase 5 adds new surfaces and closes the MVP. It must not break Phases 1–4.

---

## 1. What Phase 5 Delivers

| Area           | Route                        | Role                                                |
| -------------- | ---------------------------- | --------------------------------------------------- |
| Custom Lists   | `/custom-lists`              | Fields, list builder, tabs, inline edit, sharing    |
| Assignments    | `/resourcing/assignments`    | Read-only aggregated assignment history (FR-AH-004) |
| Shared profile | `GenerateSharedProfileSheet` | Re-open existing active link (polish)               |

**Demo scenario:** 3 (custom list inline edit). **MVP exit:** all 7 demo scenarios pass.

---

## 2. Non-Regression Rules (Phases 1–4)

### Do not change

| Area                                  | Rule                                                |
| ------------------------------------- | --------------------------------------------------- |
| Route guards                          | Keep `RoleRoute` on all Phase 1–4 routes unchanged  |
| Resourcing & profile flows            | Do not alter DM requests, UM incoming, profile tabs |
| Project history vs assignment history | Keep separate (BR-006)                              |
| Employee personal view                | No sensitive data leaks                             |
| `faker.seed(20260625)`                | Do not change                                       |
| Existing GET/POST/PATCH handlers      | Keep same shape and status codes                    |

### Minimal touch only

| File                                              | Allowed change                                                        |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| `src/types/custom-list.ts`                        | Migrate to `fieldConfigs` (update seeds + consumers + tests together) |
| `src/types/custom-field.ts`                       | Add `CustomFieldUsage` export                                         |
| `src/mocks/data/people.ts`, `person-factory.ts`   | Migrate `customFieldValues` keys; add `person-um-002`                 |
| `src/mocks/handlers.ts`                           | Append new handlers only; do not edit existing handler logic          |
| `src/lib/query/query-keys.ts`                     | Append new keys only                                                  |
| `src/app/navigation.ts`                           | Add Custom Lists + Assignments (UM) nav items                         |
| `src/app/routes.ts`, `router.tsx`                 | Add `/resourcing/assignments` route + path helper only                |
| `GenerateSharedProfileSheet.tsx`                  | Add active-link re-open only                                          |
| `src/pages/custom-lists-page/CustomListsPage.tsx` | Replace placeholder content                                           |

### Regression gate (run after every major step)

```bash
npm run build
npm run lint
npm run format:check
npm run test:e2e -- tests/e2e/phase4
```

Phases 1–4 E2E must stay green before Phase 5 sign-off.

---

## 3. Document Index (source of truth)

| Doc                      | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `PLAN.md`                | Scope, gaps, acceptance checks                |
| `SRS.md`                 | SRS-F5-\* requirements (21 sections)          |
| `UX-FLOW.md`             | Layouts, click budgets, interaction contracts |
| `IMPLEMENTATION_PLAN.md` | 12 build steps                                |
| `phase-5-test-plan.md`   | P5-\* test cases for Ivan                     |
| `VALIDATION.md`          | Build gates + execution checklist             |
| `STATUS.md`              | Live implementation tracker                   |

---

## 4. Build Order (12 steps)

1. Migrate custom-list / custom-field types
2. Seeds: custom fields, 3 lists, migrate people keys, add `person-um-002`
3. Query keys + API client wrappers
4. MSW handlers (fields, lists, rows, inline edit, share, assignments, active shared)
5. Scaffold `features/custom-lists`
6. Custom Lists page (tabs + filters + table)
7. Inline-edit cell (5 types)
8. List builder sheet (RHF + Zod)
9. Custom field CRUD sheet
10. Share-list sheet + BR-009 scope
11. `/resourcing/assignments` + nav + shared-profile re-open
12. E2E `tests/e2e/phase5/` + update STATUS/VALIDATION/STATE/PROJECT

---

## 5. Resolved Decisions (no open questions for build)

| Decision                      | Value                                                     |
| ----------------------------- | --------------------------------------------------------- |
| Custom list type              | `fieldConfigs[]` with `usage: filter \| column \| both`   |
| Builder / share / field forms | `Sheet` + RHF + Zod                                       |
| Inline edit commit            | blur / Enter / Tab; Escape cancels; one cell at a time    |
| Inline edit feedback          | Optimistic; no success toast; error revert + toast        |
| Inline edit endpoint          | `PATCH /api/people/:personId/custom-field-values`         |
| Assignments (FR-AH-004)       | New UM route `/resourcing/assignments`, read-only         |
| Share recipient persona       | Seed `person-um-002` (real Person)                        |
| Shared-profile polish         | `GET /api/shared-profiles/active?personId=` on sheet open |
| Navigation                    | Add Custom Lists + Assignments to UM nav                  |
| Dependencies                  | No new npm packages                                       |
| Action-item count (33 vs 30)  | Accept as-is unless Carlos requests trim                  |

---

## 6. Demo Seed Anchors

| ID                            | Use                                                 |
| ----------------------------- | --------------------------------------------------- |
| `field-bench-status-001`      | Scenario 3 inline-edit target (Single Select)       |
| `list-bench-001`              | Bench tab; Scenario 3; shared with `person-um-002`  |
| `list-booked-001`             | Booked tab                                          |
| `list-needs-conversation-001` | Needs Conversation tab                              |
| `person-employee-001`         | Scenario 3 employee (Bench, Bench Status Available) |
| `person-um-001`               | List owner                                          |
| `person-um-002`               | Share recipient (new persona)                       |

---

## 7. Human Gates (informational)

| Gate                | Owner  | Blocks                             |
| ------------------- | ------ | ---------------------------------- |
| SRS scope approval  | Carlos | Implementation start; MVP sign-off |
| Phase 4 QA sign-off | Ivan   | Prerequisite — complete ✅         |
| Phase 5 QA sign-off | Ivan   | MVP close                          |
