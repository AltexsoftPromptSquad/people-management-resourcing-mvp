# Phase 4 — Final Pre-Build Package

**Status:** Ready to implement  
**Date:** 2026-07-06  
**Rule:** Phase 4 adds new surfaces. It must not break Phases 1–3.

---

## 1. What Phase 4 Delivers

| Area           | Route                  | Role                                          |
| -------------- | ---------------------- | --------------------------------------------- |
| DM requests    | `/resourcing/requests` | Create, submit, cancel, review candidates     |
| UM incoming    | `/resourcing/incoming` | Propose candidates, warnings, shared profiles |
| Public profile | `/shared/:token`       | Token view, no app shell                      |

**Demo scenarios:** 4 (DM request), 5 (UM proposal), 6 (DM approve/reject + history).

---

## 2. Non-Regression Rules (Phases 1–3)

### Do not change

| Area                           | Rule                                                     |
| ------------------------------ | -------------------------------------------------------- |
| Route guards                   | Keep `RoleRoute` on all Phase 1–3 routes unchanged       |
| Phase 3 profile tabs           | Do not rename, remove, or reorder tabs                   |
| Project history tab            | Keep separate from resourcing history                    |
| Employee personal view         | No resourcing or sensitive data leaks                    |
| `faker.seed(20260625)`         | Do not change                                            |
| Existing GET handlers          | All Phase 1–3 endpoints keep same shape and status codes |
| `GET /api/resourcing/requests` | Keep filter params; extend only                          |

### Minimal touch only

| File                                   | Allowed change                                                          |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `src/app/router.tsx`                   | Add `/shared/:token` route only                                         |
| `src/app/routes.ts`                    | Add `getSharedProfilePagePath` only                                     |
| `src/types/assignment-history.ts`      | Add fields only (`proposedById`, `'Proposed'`, optional `requestTitle`) |
| `src/mocks/data/assignment-history.ts` | Add `proposedById` to seed rows                                         |
| `src/mocks/handlers.ts`                | Append new handlers; do not edit existing handler logic                 |
| `src/lib/query/query-keys.ts`          | Append new keys only                                                    |
| `ProfileHeader.tsx`                    | Add optional action slot or button prop                                 |
| `EmployeeProfilePage.tsx`              | Pass shared-profile action to header only; no tab refactor              |
| `resourcing-*-page/`                   | Replace placeholder content (routes already exist)                      |

### Regression gate (run after every major step)

```bash
npm run build
npm run lint
npm run format:check
npm run test:e2e -- tests/e2e/phase3
```

Phase 3 E2E must stay at 78/78 pass before Phase 4 sign-off.

---

## 3. Document Index (source of truth)

| Doc                      | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `PLAN.md`                | Scope, gaps, demo playbook                    |
| `SRS.md`                 | SRS-F4-\* requirements (21 sections)          |
| `UX-FLOW.md`             | Layouts, click budgets, interaction contracts |
| `IMPLEMENTATION_PLAN.md` | 11 build steps                                |
| `phase-4-test-plan.md`   | P4-\* test cases for Ivan                     |
| `VALIDATION.md`          | Build gates + manual checklist                |
| `STATUS.md`              | Live implementation tracker                   |

---

## 4. Build Order (11 steps)

1. Shared UI: `checkbox`, `dialog`, `warning-badge`
2. Types + seeds: `assignment-history`, `candidate-proposals`, `shared-profiles`
3. Query keys + API client wrappers
4. MSW write handlers
5. `candidate-warnings.ts`
6. DM page (`/resourcing/requests`)
7. UM page (`/resourcing/incoming`)
8. Profile sharing + `/shared/:token`
9. Approve/reject + assignment history write (MSW)
10. Profile header button
11. E2E `tests/e2e/phase4/` + update STATUS/VALIDATION

---

## 5. Resolved Decisions (no open questions for build)

| Decision                      | Value                                                   |
| ----------------------------- | ------------------------------------------------------- |
| Request form                  | Sheet; single Submit = POST + PATCH Submitted           |
| Layout                        | Master-detail; no detail routes                         |
| Allocation warning            | `100 - availabilityPercent + workloadPercent > 100`     |
| History write                 | MSW on approve/reject/withdraw PATCH                    |
| FR-AH-004 Assignments section | Deferred to Phase 5                                     |
| Dependencies                  | No new npm packages (custom Dialog/Checkbox like Sheet) |

---

## 6. Demo Seed Anchors

| ID              | Status              | Use                         |
| --------------- | ------------------- | --------------------------- |
| `request-001`   | Submitted           | UM queue; no candidates yet |
| `request-003`   | Candidates Proposed | DM review; seeded proposals |
| `request-004`   | Draft               | DM cancel demo              |
| `person-dm-001` | DM persona          | Request creator             |
| `person-um-001` | UM persona          | Assigned manager            |

---

## 7. Human Gates (informational)

| Gate                | Owner  | Blocks               |
| ------------------- | ------ | -------------------- |
| SRS scope approval  | Carlos | Formal sign-off only |
| Phase 3 QA sign-off | Ivan   | Formal sign-off only |

Implementation proceeds per user request to build now.
