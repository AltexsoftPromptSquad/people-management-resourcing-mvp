# Phase 4 — Resourcing E2E Flow — Test Plan

## 1. Document Control

| Field            | Value                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Product          | People Management & Resourcing MVP                                                             |
| Phase            | Phase 4 — Resourcing E2E Flow                                                                  |
| Document type    | Test plan (QA design, pre-execution)                                                           |
| Status           | Ready for execution (SRS linked; pending Carlos SRS approval)                                  |
| QA owner         | Ivan                                                                                           |
| Dev owner        | Volodymyr                                                                                      |
| Product / BA     | Carlos                                                                                         |
| Planning sources | `.planning/phases/phase-4-resourcing/` (PLAN, SRS, phase-4-test-plan); `.planning/STATE.md`    |
| Source BRD       | `docs/requirements/# Business Requirements Document.md` (v1.1)                                 |
| Architecture     | `docs/architecture/ux-behavior.md`, `ux-requirements.md`, `data-models.md`, `feature-rules.md` |
| Precedent        | `.planning/phases/phase-3-employee-profile/phase-3-test-plan.md`, `tests/e2e/phase3/*`         |

## 2. Purpose & Scope

This plan defines how Phase 4 (the full resourcing E2E journey) is verified before QA sign-off. Phase 3 delivered employee profiles with read-only assignment history; Phase 4 adds request creation, candidate proposal with warnings and shared profiles, DM approve/reject, and assignment history write on decision.

This plan is grounded in Phase 4 `PLAN.md` and `SRS.md`, BRD v1.1 functional requirements (`FR-RR-*`, `FR-CP-*`, `FR-CD-*`, `FR-PS-*`, `FR-AH-*`), business rules (`BR-004`, `BR-010`, `BR-011`, `BR-012`–`BR-014`), acceptance criteria (`AC-RR-*`, `AC-CP-*`, `AC-CD-*`, `AC-PS-*`, `AC-AH-*`), and interaction contracts in `docs/architecture/ux-behavior.md` §3.5–3.10. Test cases in §6 reference SRS IDs; §7 maps BRD requirements to P4 tests and SRS IDs.

### 2.1 In scope

- Build / lint / format gates.
- DM resourcing requests at `/resourcing/requests`: create, submit, cancel, list, detail, candidate review (`FR-RR-*`, `AC-RR-*`).
- UM incoming queue at `/resourcing/incoming`: open request, employee browser, candidate selection, warnings, fit summary, external URL, shared profile, submit, withdraw (`FR-CP-*`, `AC-CP-*`).
- Candidate warnings: allocation >100%, leave overlap, High/Critical risk; non-blocking (`FR-CP-006`–`FR-CP-009`, `BR-012`–`BR-014`, A-3).
- Profile sharing: generate from proposal panel and profile header; public `/shared/:token` view (`FR-PS-*`, `FR-CP-010`, `AC-PS-*`).
- DM approve one candidate per request; reject with required reason (`FR-CD-*`, `AC-CD-*`, AS-009, D-1).
- Assignment history write on decision; visible on employee Resourcing History tab (`FR-AH-001`–`FR-AH-003`, `AC-AH-*`).
- Async states (loading / empty / error) per resourcing screen.
- Accessibility (dialogs, sheets, tables, forms, keyboard).
- Demo Scenarios 4, 5, and 6.

### 2.2 Out of scope

- Custom list builder and inline edit (Phase 5).
- FR-AH-004 UM Resourcing > Assignments dedicated section (Phase 5).
- Profile sharing UX polish beyond MVP (Phase 5).
- Mobile / tablet / responsive breakpoints (desktop-only per BRD `AS-016`).
- Backend / persistence (frontend-only MVP).

## 3. Test Approach

1. **Static gates** — `npm run build`, `npm run lint`, `npm run format:check`; exit code 0 required.
2. **Automated E2E (Playwright)** — new specs under `tests/e2e/phase4/` reusing existing harness. Expected values derive from mock layer via `tests/e2e/fixtures/phase4-data.ts`.
3. **Source-confirmed** — architectural constraints (feature ownership, thin pages, query keys, warning logic placement).

Every case is traceable to a BRD requirement, SRS ID, or ux-behavior flow.

## 4. Test Environments

| Item       | Value                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Local dev  | `npm run dev` → `http://localhost:5173` (MSW active)                                            |
| Viewport   | 1280 × 800 desktop (BRD `AS-016`)                                                               |
| Mock layer | MSW; deterministic Faker seed `faker.seed(20260625)`                                            |
| Browsers   | Chromium (primary)                                                                              |
| Personas   | UM `person-um-001` (Olena), DM `person-dm-001` (Marcus), Employee `person-employee-001` (Nazar) |

## 5. Test Data Baseline (deterministic)

| Dataset             | Expected                                                                                | Source                   |
| ------------------- | --------------------------------------------------------------------------------------- | ------------------------ |
| Resourcing requests | 10 total; `request-001` Submitted to `person-um-001`; `request-003` Candidates Proposed | `resourcing-requests.ts` |
| Candidate proposals | Phase 4 target: 2+ for `request-003`; none for `request-001`                            | `candidate-proposals.ts` |
| Shared profiles     | Created in-memory during tests via POST                                                 | `shared-profiles.ts`     |
| Scheduled leaves    | Overlap demo on subordinate overlapping `request-001` period                            | `scheduled-leaves.ts`    |
| Risks               | High/Critical at indices 0–1                                                            | `risks.ts`               |
| Assignment history  | Write on decision; read via existing GET endpoint                                       | `assignment-history.ts`  |

### 5.1 Demo target records

- **Primary proposal request:** `request-001` (Submitted, workload 100%, start `2026-07-10`).
- **Pre-seeded review request:** `request-003` (Candidates Proposed).
- **Cancel demo request:** `request-004` (Draft).
- **Warning demo:** UM subordinate with low availability, overlapping leave, and/or High/Critical risk.

## 6. Test Cases

### 6.1 Build / Lint / Format (§6.1)

| Check            | Command                | Pass criteria | Test ref | SRS ref     |
| ---------------- | ---------------------- | ------------- | -------- | ----------- |
| TypeScript build | `npm run build`        | Exit 0        | P4-B01   | SRS-NF4-003 |
| ESLint           | `npm run lint`         | Exit 0        | P4-B02   | SRS-NF4-004 |
| Prettier         | `npm run format:check` | Exit 0        | P4-B03   | SRS-NF4-005 |

### 6.2 Routing & Role Guards (§6.2)

| #   | Check                                   | Expected result                      | Test ref | Ref         |
| --- | --------------------------------------- | ------------------------------------ | -------- | ----------- |
| 1   | DM opens `/resourcing/requests`         | My Requests page renders             | P4-R01   | FR-RR-005   |
| 2   | UM opens `/resourcing/incoming`         | Incoming Requests page renders       | P4-R02   | FR-CP-001   |
| 3   | UM direct-nav to `/resourcing/requests` | Redirected to `/dashboard`           | P4-R03   | BR-002      |
| 4   | DM direct-nav to `/resourcing/incoming` | Redirected to `/resourcing/requests` | P4-R04   | BR-002      |
| 5   | Public opens `/shared/:token`           | Shared profile renders; no nav shell | P4-R05   | FR-PS-007   |
| 6   | Invalid shared token                    | ErrorState SRS-COPY4-003             | P4-R06   | ux-behavior |

### 6.3 DM Request Creation (§6.3)

| #   | Check                       | Expected result                       | Test ref | Ref                  |
| --- | --------------------------- | ------------------------------------- | -------- | -------------------- |
| 7   | New Request opens sheet     | All required fields present           | P4-RR01  | SRS-F4-110           |
| 8   | Submit with empty required  | Inline validation; submit blocked     | P4-RR02  | FR-RR-007, AC-RR-004 |
| 9   | Submit valid form           | Status Submitted                      | P4-RR03  | FR-RR-003, AC-RR-002 |
| 10  | Request in UM queue         | Appears in incoming queue immediately | P4-RR04  | FR-RR-004, AC-RR-003 |
| 11  | Cancel Draft request        | Status Cancelled; action hidden       | P4-RR05  | FR-RR-006, BR-010    |
| 12  | DM table shows own requests | Filtered by `createdById`             | P4-RR06  | FR-RR-005            |

### 6.4 UM Candidate Proposal (§6.4)

| #   | Check                     | Expected result                            | Test ref | Ref         |
| --- | ------------------------- | ------------------------------------------ | -------- | ----------- |
| 13  | Open assigned request     | Requirements summary visible               | P4-CP01  | FR-CP-001   |
| 14  | Employee browser          | Unit subordinates with key fields          | P4-CP02  | FR-CP-002   |
| 15  | Select internal candidate | Candidate row added                        | P4-CP03  | FR-CP-003   |
| 16  | Add external URL          | External candidate row with URL            | P4-CP04  | FR-CP-004   |
| 17  | Submit candidates         | ConfirmDialog → status Candidates Proposed | P4-CP05  | FR-CP-011   |
| 18  | Submit with no candidates | Inline error SRS-COPY4-048                 | P4-CP06  | ux-behavior |
| 19  | Withdraw candidate        | Status Withdrawn before DM decision        | P4-CP07  | FR-CP-012   |

### 6.5 Candidate Warnings (§6.5)

| #   | Check              | Expected result                      | Test ref | Ref       |
| --- | ------------------ | ------------------------------------ | -------- | --------- |
| 20  | Allocation warning | SRS-COPY4-050 when total > 100%      | P4-W01   | FR-CP-006 |
| 21  | Leave overlap      | SRS-COPY4-051 when leave overlaps    | P4-W02   | FR-CP-007 |
| 22  | High/Critical risk | SRS-COPY4-052 or SRS-COPY4-053       | P4-W03   | FR-CP-008 |
| 23  | Non-blocking       | Submit enabled with warnings present | P4-W04   | FR-CP-009 |

### 6.6 Shared Profile (§6.6)

| #   | Check                   | Expected result                          | Test ref | Ref       |
| --- | ----------------------- | ---------------------------------------- | -------- | --------- |
| 24  | Generate from proposal  | Link created; copy toast SRS-COPY4-011   | P4-PS01  | FR-CP-010 |
| 25  | Sensitive default off   | Contact, risks, feedbacks unchecked      | P4-PS02  | FR-PS-003 |
| 26  | Public link sections    | Only selected sections visible           | P4-PS03  | AC-PS-003 |
| 27  | No login on public view | No role switcher or app nav              | P4-PS04  | FR-PS-007 |
| 28  | Profile header action   | Generate Shared Profile on `/people/:id` | P4-PS05  | AC-PS-001 |

### 6.7 DM Candidate Review (§6.7)

| #   | Check                 | Expected result                             | Test ref | Ref       |
| --- | --------------------- | ------------------------------------------- | -------- | --------- |
| 29  | Candidate list        | Shared profile link or external URL per row | P4-CD01  | AC-CD-001 |
| 30  | Approve candidate     | Candidate Approved; request Approved        | P4-CD02  | AC-CD-002 |
| 31  | One approval limit    | Approve hidden for remaining Proposed       | P4-CD03  | FR-CD-004 |
| 32  | Reject without reason | Validation SRS-COPY4-040 blocks submit      | P4-CD04  | AC-CD-003 |
| 33  | Reject with reason    | Candidate Rejected; reason recorded         | P4-CD05  | AC-CD-004 |

### 6.8 Assignment History (§6.8)

| #   | Check              | Expected result                         | Test ref | Ref       |
| --- | ------------------ | --------------------------------------- | -------- | --------- |
| 34  | History on approve | New record on Resourcing History tab    | P4-AH01  | AC-AH-001 |
| 35  | History fields     | Request title, status, feedback visible | P4-AH02  | AC-AH-002 |
| 36  | Read-only          | No edit action on history records       | P4-AH03  | AC-AH-004 |

### 6.9 Async States (§6.9)

| #   | Check         | Expected result                     | Test ref | Ref         |
| --- | ------------- | ----------------------------------- | -------- | ----------- |
| 37  | Page loading  | LoadingState while requests pending | P4-AS01  | SRS-UI4-001 |
| 38  | Empty DM list | EmptyState SRS-COPY4-001            | P4-AS02  | ux-behavior |
| 39  | Query failure | ErrorState SRS-COPY4-010            | P4-AS03  | ux-behavior |

### 6.10 Accessibility (§6.10)

| #   | Check               | Expected result                | Test ref | Ref           |
| --- | ------------------- | ------------------------------ | -------- | ------------- |
| 40  | Page headings       | One `h1` per resourcing screen | P4-A01   | SRS-A11Y4-001 |
| 41  | Sheet focus trap    | Focus trapped; Escape closes   | P4-A02   | SRS-A11Y4-002 |
| 42  | Warning text labels | Warnings not color-only        | P4-A03   | SRS-A11Y4-005 |

### 6.11 Demo Scenarios (§6.11)

| #   | Check      | Expected result                                    | Test ref | Ref     |
| --- | ---------- | -------------------------------------------------- | -------- | ------- |
| 43  | Scenario 4 | DM create + submit request end-to-end              | P4-D04   | BRD §14 |
| 44  | Scenario 5 | UM propose with warnings + shared profile + submit | P4-D05   | BRD §14 |
| 45  | Scenario 6 | DM approve/reject; UM verifies assignment history  | P4-D06   | BRD §14 |

### 6.12 Source-Confirmed Architecture (§6.12)

| #   | Check                     | Expected result                                            | Test ref | Ref        |
| --- | ------------------------- | ---------------------------------------------------------- | -------- | ---------- |
| 46  | Feature ownership         | Resourcing in `features/resourcing/`                       | P4-SC01  | SRS-F4-520 |
| 47  | Profile sharing ownership | Sharing in `features/profile-sharing/`                     | P4-SC02  | SRS-F4-521 |
| 48  | Warning logic placement   | `candidate-warnings.ts` utility                            | P4-SC03  | SRS-F4-522 |
| 49  | Thin pages                | Pages compose features only                                | P4-SC04  | SRS-F4-523 |
| 50  | Query keys                | `resourcingRequest`, `candidateProposals`, `sharedProfile` | P4-SC05  | SRS-F4-020 |

## 7. BRD Requirement To Test Mapping

| BRD ref       | P4 tests                          | SRS IDs        |
| ------------- | --------------------------------- | -------------- |
| FR-RR-001–007 | P4-RR01–RR06                      | SRS-F4-110–115 |
| AC-RR-001–004 | P4-RR02–RR04                      | SRS-F4-112–113 |
| FR-CP-001–012 | P4-CP01–CP07, P4-W01–W04          | SRS-F4-210–219 |
| AC-CP-001–004 | P4-CP03, P4-W01, P4-CP04, P4-CP05 | SRS-F4-211–218 |
| FR-PS-001–007 | P4-PS01–PS05                      | SRS-F4-310–314 |
| AC-PS-001–004 | P4-PS02–PS05                      | SRS-F4-311–313 |
| FR-CD-001–009 | P4-CD01–CD05                      | SRS-F4-410–416 |
| AC-CD-001–004 | P4-CD01–CD05                      | SRS-F4-410–415 |
| FR-AH-001–003 | P4-AH01–AH03                      | SRS-F4-510–512 |
| AC-AH-001–004 | P4-AH01–AH03                      | SRS-F4-512–513 |
| BRD §14 S4–S6 | P4-D04–D06                        | §17.6          |

## 8. Risks

| ID  | Risk                                | Mitigation                                            |
| --- | ----------------------------------- | ----------------------------------------------------- |
| R-1 | Carlos SRS not yet approved         | Test plan aligned to draft SRS; update on approval    |
| R-2 | Phase 3 Ivan sign-off pending       | Phase 4 E2E assumes profile tab exists (Phase 3 done) |
| R-3 | Assignment history type drift       | PLAN §0 type alignment before implementation          |
| R-4 | Warning demo seed not deterministic | Document demo person IDs in `phase4-data.ts` fixture  |

## 9. Definition Of Done (exit / sign-off)

Phase 4 validation is **done** when:

- [ ] §6.1 gates pass (exit 0).
- [ ] §6.2–6.11 functional cases pass.
- [ ] §6.12 source-confirmed rows recorded.
- [ ] Demo Scenarios 4, 5, 6 pass end-to-end.
- [ ] Execution results recorded under `tests/test_reports/phase4/`.
- [ ] `.planning/STATE.md` and Phase 4 `STATUS.md` updated.
- [ ] Carlos signs off product review against SRS.
- [ ] Ivan signs off Phase 4 validation before Phase 5 starts.

## 10. Out of Scope for Phase 4 QA

Do **not** block Phase 4 on: custom list builder (Phase 5), FR-AH-004 Assignments section (Phase 5), profile sharing polish (Phase 5), mobile/tablet responsive breakpoints, or backend/persistence.
