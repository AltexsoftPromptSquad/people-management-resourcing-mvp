# Phase 4 — Resourcing E2E Flow — Test Plan

## 1. Document Control

| Field            | Value                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product          | People Management & Resourcing MVP                                                                                                                          |
| Phase            | Phase 4 — Resourcing E2E Flow                                                                                                                               |
| Document type    | Test plan (QA design, pre-execution)                                                                                                                        |
| Status           | Ready for execution (SRS approved — Carlos Nunes, 2026-07-06)                                                                                               |
| QA owner         | Ivan                                                                                                                                                        |
| Dev owner        | Volodymyr                                                                                                                                                   |
| Product / BA     | Carlos                                                                                                                                                      |
| Planning sources | `.planning/phases/phase-4-resourcing/` (PLAN, SRS, phase-4-test-plan); `.planning/STATE.md`                                                                 |
| Source BRD       | `docs/requirements/# Business Requirements Document.md` (v1.1)                                                                                              |
| Architecture     | `docs/architecture/ux-behavior.md`, `ux-requirements.md`, `data-models.md`, `feature-rules.md`, `state-and-rendering.md`, `shared-ui.md`, `visual-theme.md` |
| Precedent        | `.planning/phases/phase-3-employee-profile/phase-3-test-plan.md`, `tests/e2e/phase3/*`                                                                      |

## 2. Purpose & Scope

This plan defines how Phase 4 (the full resourcing E2E journey) is verified before QA sign-off. Phase 3 delivered employee profiles with read-only assignment history; Phase 4 adds request creation, candidate proposal with warnings and shared profiles, DM approve/reject, and assignment history write on decision.

This plan is grounded in Phase 4 `PLAN.md` and `SRS.md`, BRD v1.1 functional requirements (`FR-RR-*`, `FR-CP-*`, `FR-CD-*`, `FR-PS-*`, `FR-AH-*`), business rules (`BR-004`, `BR-010`, `BR-011`, `BR-012`–`BR-015`), acceptance criteria (`AC-RR-*`, `AC-CP-*`, `AC-CD-*`, `AC-PS-*`, `AC-AH-*`), and interaction contracts in `docs/architecture/ux-behavior.md` §1–§8. Test cases in §6 reference SRS and ux-behavior IDs; §7 maps BRD requirements to P4 tests and SRS IDs.

### 2.1 In scope

- Build / lint / format gates.
- DM resourcing requests at `/resourcing/requests`: create, submit, cancel, list, detail, candidate review (`FR-RR-*`, `AC-RR-*`).
- UM incoming queue at `/resourcing/incoming`: open request, employee browser, candidate selection, fit summary, warnings, external URL, shared profile, submit, withdraw (`FR-CP-*`, `AC-CP-*`).
- Candidate warnings: allocation >100%, leave overlap, High/Critical risk; non-blocking (`FR-CP-006`–`FR-CP-009`, `BR-012`–`BR-014`, A-3).
- External URL validation: valid passes, invalid blocked (`BR-015`, `SRS-COPY4-041`).
- Request form: all required-field and format validations including start date (`ux-behavior §5.5`).
- Profile sharing: generate from proposal panel and profile header; public `/shared/:token` view; default-on/off sections; name/position/grade always checked and disabled (`FR-PS-*`, `FR-CP-010`, `AC-PS-*`).
- DM approve one candidate per request; reject with required reason; all-rejected transitions request to Rejected (`FR-CD-*`, `AC-CD-*`, AS-009, D-1).
- Confirm dialog copy verbatim for cancel request, withdraw candidate, submit candidates (`SRS-COPY4-030`–`SRS-COPY4-032`).
- No confirm dialog for reject (sheet is the confirmation step) (`ux-behavior §5.4`).
- Assignment history write on decision; visible on employee Resourcing History tab; never mixed with project history (`FR-AH-001`–`FR-AH-003`, `FR-AH-006`, `AC-AH-*`, `BR-006`).
- Status pill tone mapping per `ux-behavior §4.5` (`SRS-UI4-003`).
- Async states (loading / empty / error) per resourcing screen, including UM empty incoming and proposal panel section loading.
- Accessibility: `<main>` landmark, `aria-busy` on LoadingState, `role="alert"` on ErrorState, icon-only button labels, focus rings, focus trapping, focus return, `<h1>` programmatic focus, checkbox keyboard, form labels, validation association, keyboard table and screen navigation.
- Source-confirmed architecture: feature boundaries, import direction, state ownership, shared UI inventory, query keys.
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
3. **Source-confirmed** — architectural constraints (feature ownership, import direction, state ownership, shared UI inventory, query keys, warning logic placement); these are code-inspection checks, not E2E assertions.

Every case is traceable to a BRD requirement, SRS ID, or architecture doc reference.

## 4. Test Environments

| Item       | Value                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Local dev  | `npm run dev` → `http://localhost:5173` (MSW active)                                            |
| Viewport   | 1280 × 800 desktop (BRD `AS-016`)                                                               |
| Mock layer | MSW; deterministic Faker seed `faker.seed(20260625)`                                            |
| Browsers   | Chromium (primary)                                                                              |
| Personas   | UM `person-um-001` (Olena), DM `person-dm-001` (Marcus), Employee `person-employee-001` (Nazar) |

> **Persona ID note:** the IDs above are `personId` values on the `Persona` entity (person record IDs). The persona entity IDs are `persona-um-001`, `persona-dm-001`, `persona-employee-001`. E2E fixtures resolve by role; see `tests/e2e/fixtures/phase4-data.ts`.

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

| #   | Check                                   | Expected result                      | Test ref | Ref              |
| --- | --------------------------------------- | ------------------------------------ | -------- | ---------------- |
| 1   | DM opens `/resourcing/requests`         | My Requests page renders             | P4-R01   | FR-RR-005        |
| 2   | UM opens `/resourcing/incoming`         | Incoming Requests page renders       | P4-R02   | FR-CP-001        |
| 3   | UM direct-nav to `/resourcing/requests` | Redirected to `/dashboard`           | P4-R03   | BR-002           |
| 4   | DM direct-nav to `/resourcing/incoming` | Redirected to `/resourcing/requests` | P4-R04   | BR-002           |
| 5   | Public opens `/shared/:token`           | Shared profile renders; no nav shell | P4-R05   | FR-PS-007        |
| 6   | Invalid shared token                    | ErrorState SRS-COPY4-003             | P4-R06   | ux-behavior §5.1 |

### 6.3 DM Request Creation (§6.3)

| #   | Check                             | Expected result                                                  | Test ref | Ref                          |
| --- | --------------------------------- | ---------------------------------------------------------------- | -------- | ---------------------------- |
| 7   | New Request opens sheet           | All required fields present; first field receives focus          | P4-RR01  | SRS-F4-110, ux-behavior §6.2 |
| 8   | Submit with empty required fields | Inline validation per field; focus moves to first error field    | P4-RR02  | FR-RR-007, AC-RR-004         |
| 9   | Submit valid form                 | Status Submitted; success toast                                  | P4-RR03  | FR-RR-003, AC-RR-002         |
| 10  | Request in UM queue               | Appears in incoming queue immediately                            | P4-RR04  | FR-RR-004, AC-RR-003         |
| 11  | Cancel Draft request              | Status Cancelled; Cancel action no longer renders                | P4-RR05  | FR-RR-006, BR-010            |
| 12  | DM table shows own requests       | Filtered by `createdById`                                        | P4-RR06  | FR-RR-005                    |
| 13  | Start date in past                | Inline error "Start date cannot be in the past."; submit blocked | P4-RR07  | ux-behavior §5.5             |

### 6.4 UM Candidate Proposal (§6.4)

| #   | Check                      | Expected result                                                                                                     | Test ref | Ref                            |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------ |
| 14  | Open assigned request      | Requirements summary visible                                                                                        | P4-CP01  | FR-CP-001                      |
| 15  | Employee browser           | Unit subordinates with availability, skills, grade, English level, risk level, leave warnings                       | P4-CP02  | FR-CP-002, ux-requirements §UM |
| 16  | Select internal candidate  | Candidate row added                                                                                                 | P4-CP03  | FR-CP-003                      |
| 17  | Add external URL (valid)   | External candidate row with URL                                                                                     | P4-CP04  | FR-CP-004                      |
| 18  | Submit candidates          | ConfirmDialog → status Candidates Proposed                                                                          | P4-CP05  | FR-CP-011                      |
| 19  | Submit with no candidates  | Inline error SRS-COPY4-048                                                                                          | P4-CP06  | ux-behavior §3.6               |
| 20  | Withdraw candidate         | Status Withdrawn before DM decision                                                                                 | P4-CP07  | FR-CP-012                      |
| 21  | Fit summary textarea       | Textarea present per candidate; placeholder "Summarise why this candidate is a good fit…"; value sent with proposal | P4-CP08  | FR-CP-005, ux-behavior §5.7    |
| 22  | Add external URL (invalid) | Inline error SRS-COPY4-041; submit blocked                                                                          | P4-CP09  | BR-015, SRS-COPY4-041          |

### 6.5 Candidate Warnings (§6.5)

| #   | Check              | Expected result                               | Test ref | Ref       |
| --- | ------------------ | --------------------------------------------- | -------- | --------- |
| 23  | Allocation warning | SRS-COPY4-050 inline in candidate row         | P4-W01   | FR-CP-006 |
| 24  | Leave overlap      | SRS-COPY4-051 inline in candidate row         | P4-W02   | FR-CP-007 |
| 25  | High/Critical risk | SRS-COPY4-052 or SRS-COPY4-053 per risk level | P4-W03   | FR-CP-008 |
| 26  | Non-blocking       | Submit enabled with warnings present          | P4-W04   | FR-CP-009 |

### 6.6 Shared Profile (§6.6)

| #   | Check                               | Expected result                                                                              | Test ref | Ref                         |
| --- | ----------------------------------- | -------------------------------------------------------------------------------------------- | -------- | --------------------------- |
| 27  | Generate from proposal              | Link created; copy toast SRS-COPY4-011                                                       | P4-PS01  | FR-CP-010                   |
| 28  | Sensitive default off               | Contact, risks, feedbacks, manager notes, scheduled leaves, documents unchecked              | P4-PS02  | FR-PS-003                   |
| 29  | Default-on sections present         | Name/position/grade, skills, English level, availability, project history checked by default | P4-PS06  | FR-PS-006, SRS-F4-312       |
| 30  | Name/position/grade always included | Checkbox is checked and disabled (cannot be unchecked)                                       | P4-PS07  | FR-PS-006, ux-behavior §3.5 |
| 31  | Public link sections                | Only selected sections visible at `/shared/:token`                                           | P4-PS03  | AC-PS-003                   |
| 32  | No login on public view             | No role switcher or app nav on `/shared/:token`                                              | P4-PS04  | FR-PS-007                   |
| 33  | Profile header action               | "Generate Shared Profile" button visible in UM managerial profile header                     | P4-PS05  | AC-PS-001                   |

### 6.7 DM Candidate Review (§6.7)

| #   | Check                   | Expected result                                                  | Test ref | Ref                      |
| --- | ----------------------- | ---------------------------------------------------------------- | -------- | ------------------------ |
| 34  | Candidate list          | Internal shows shared profile link; external shows URL           | P4-CD01  | AC-CD-001, FR-CD-002–003 |
| 35  | Approve candidate       | Candidate Approved; request Approved; assignment history created | P4-CD02  | AC-CD-002                |
| 36  | One approval limit      | Approve action not rendered for remaining Proposed candidates    | P4-CD03  | FR-CD-004                |
| 37  | Reject without reason   | Inline error SRS-COPY4-040; submit blocked                       | P4-CD04  | AC-CD-003                |
| 38  | Reject with reason      | Candidate Rejected; reason recorded                              | P4-CD05  | AC-CD-004                |
| 39  | All candidates rejected | Request status transitions to Rejected                           | P4-CD06  | FR-CD-008, SRS-F4-416    |

### 6.8 Assignment History (§6.8)

| #   | Check                         | Expected result                                                                                    | Test ref | Ref                          |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------- | -------- | ---------------------------- |
| 40  | History on approve            | New record on employee Resourcing History tab after approval                                       | P4-AH01  | AC-AH-001                    |
| 41  | History fields                | Request title, status, feedback/rejection reason visible                                           | P4-AH02  | AC-AH-002                    |
| 42  | Read-only                     | No edit action on history records                                                                  | P4-AH03  | AC-AH-004                    |
| 43  | Separate from project history | No assignment history records on Project History tab; no project entries on Resourcing History tab | P4-AH04  | AC-AH-003, FR-AH-006, BR-006 |

### 6.9 Async States & UI Rendering (§6.9)

| #   | Check                       | Expected result                                                                                                                                                                                                | Test ref | Ref                           |
| --- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------- |
| 44  | Page loading                | Page-tier LoadingState while requests pending                                                                                                                                                                  | P4-AS01  | SRS-UI4-001, ux-behavior §1.1 |
| 45  | Empty DM list               | EmptyState: "No requests yet" / "Create your first resourcing request to get started." (SRS-COPY4-001)                                                                                                         | P4-AS02  | SRS-UI4-007, ux-behavior §5.1 |
| 46  | Query failure               | ErrorState: "Could not load requests" / "Refresh the page to try again." (SRS-COPY4-010)                                                                                                                       | P4-AS03  | ux-behavior §5.2              |
| 47  | Empty UM incoming list      | EmptyState: "No incoming requests" / "Resourcing requests assigned to you will appear here." (SRS-COPY4-002)                                                                                                   | P4-AS04  | SRS-UI4-007, ux-behavior §5.1 |
| 48  | Proposal panel section load | Section-tier LoadingState while employee browser loads independently                                                                                                                                           | P4-AS05  | SRS-UI4-002, ux-behavior §1.1 |
| 49  | Status pill tone mapping    | Request status pills: Draft→neutral, Submitted/In Review/Candidates Proposed→info, Approved→success, Rejected/Cancelled→danger; Candidate: Proposed→info, Approved→success, Rejected→danger, Withdrawn→neutral | P4-UI01  | SRS-UI4-003, ux-behavior §4.5 |

### 6.10 Accessibility (§6.10)

| #   | Check                                 | Expected result                                                                                                                                                                              | Test ref | Ref                                         |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------- |
| 50  | Page headings                         | Exactly one `<h1>` per resourcing screen                                                                                                                                                     | P4-A01   | SRS-A11Y4-001, ux-requirements §global      |
| 51  | Sheet / dialog full keyboard contract | On open: focus moves to first focusable element; Tab traps; Shift+Tab reverses; Escape closes; on close: focus returns to trigger                                                            | P4-A02   | SRS-A11Y4-002, ux-behavior §6.2             |
| 52  | Warning text labels                   | Candidate warnings use text labels (not color alone); tone matches warning/danger per ux-behavior §5.6                                                                                       | P4-A03   | SRS-A11Y4-005, visual-theme §accessibility  |
| 53  | Form field labels                     | Every `<input>`, `<select>`, `<textarea>` in resourcing forms has an associated `<label>` (visible or via `aria-label`)                                                                      | P4-A04   | SRS-A11Y4-003                               |
| 54  | Validation error association          | Validation messages linked to field via `aria-describedby`; error border `border-red-500 ring-1 ring-red-500` applied                                                                        | P4-A05   | SRS-A11Y4-004, ux-behavior §4.2             |
| 55  | Keyboard table row activation         | Request and candidate table rows: Tab to focus, Enter activates (open detail / open profile)                                                                                                 | P4-A06   | SRS-A11Y4-006, ux-behavior §6.3             |
| 56  | Loading button `aria-busy`            | Submit/confirm buttons set `aria-busy="true"` and `disabled` during mutation; spinner left of label                                                                                          | P4-A07   | SRS-A11Y4-007, ux-behavior §1.1             |
| 57  | `<main>` landmark                     | Every resourcing screen (`/resourcing/requests`, `/resourcing/incoming`, `/shared/:token`) has a `<main>` element wrapping primary content                                                   | P4-A08   | ux-behavior §8, ux-requirements §global     |
| 58  | `aria-busy` on LoadingState root      | Page-tier and Section-tier `<LoadingState>` root element has `aria-busy="true"` (distinct from button loading)                                                                               | P4-A09   | ux-behavior §8                              |
| 59  | `role="alert"` on ErrorState root     | `<ErrorState>` root element has `role="alert"` so screen readers announce it automatically                                                                                                   | P4-A10   | ux-behavior §8                              |
| 60  | Icon-only buttons have labels         | All icon-only action buttons (table row actions, copy, close, etc.) have `aria-label` or visible text label                                                                                  | P4-A11   | ux-behavior §8                              |
| 61  | Visible focus ring                    | All interactive elements show focus ring on keyboard focus; no `outline-none` without ring replacement; uses `focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2` | P4-A12   | ux-behavior §8, visual-theme §accessibility |
| 62  | `<h1>` programmatic focus on nav      | Page `<h1>` has `tabIndex={-1}` and receives `focus()` after route mount for screen reader page-change announcement                                                                          | P4-A13   | ux-behavior §2.2, §6.1                      |
| 63  | Checkbox keyboard in employee browser | Space key toggles candidate selection checkbox; checkbox communicates checked state to screen readers                                                                                        | P4-A14   | ux-behavior §6.3                            |

### 6.11 Demo Scenarios (§6.11)

| #   | Check      | Expected result                                    | Test ref | Ref     |
| --- | ---------- | -------------------------------------------------- | -------- | ------- |
| 64  | Scenario 4 | DM create + submit request end-to-end              | P4-D04   | BRD §14 |
| 65  | Scenario 5 | UM propose with warnings + shared profile + submit | P4-D05   | BRD §14 |
| 66  | Scenario 6 | DM approve/reject; UM verifies assignment history  | P4-D06   | BRD §14 |

### 6.12 Source-Confirmed Architecture (§6.12)

| #   | Check                               | Expected result                                                                                                                                         | Test ref | Ref                                                                    |
| --- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| 67  | Feature ownership — resourcing      | All request/proposal/decision/warning logic in `src/features/resourcing/`                                                                               | P4-SC01  | SRS-F4-520, feature-rules §Feature Boundaries                          |
| 68  | Feature ownership — profile sharing | All generation and public view logic in `src/features/profile-sharing/`                                                                                 | P4-SC02  | SRS-F4-521, feature-rules §Feature Boundaries                          |
| 69  | Warning logic placement             | `src/features/resourcing/utils/candidate-warnings.ts` exists; warning logic not inline in components                                                    | P4-SC03  | SRS-F4-522, feature-rules §Business Logic                              |
| 70  | Thin pages                          | Route pages in `src/pages/resourcing-*-page/` and `src/pages/shared-profile-page/` contain no business logic                                            | P4-SC04  | SRS-F4-523, component-structure §Page Responsibilities                 |
| 71  | Query key helpers                   | `resourcingRequest(id)`, `candidateProposals(requestId)`, `sharedProfile(token)` helpers exist in `query-keys.ts`                                       | P4-SC05  | SRS-F4-020, state-and-rendering §TanStack Query Keys                   |
| 72  | Import direction                    | `pages → features → shared/lib/types`; no reverse imports (shared does not import from features; features do not import from other features' internals) | P4-SC06  | project-structure §Import Direction, feature-rules §Feature Boundaries |
| 73  | State ownership                     | Server-like data (requests, proposals, assignment history, shared profiles) in TanStack Query only; active role and persona ID only in Zustand          | P4-SC07  | state-and-rendering §State Ownership, feature-rules §State Management  |
| 74  | Shared UI inventory updated         | `shared-ui.md` component inventory lists checkbox, dialog/confirm-dialog, and warning-badge as Available                                                | P4-SC08  | shared-ui.md §Component Inventory                                      |

### 6.13 Confirm Dialog Copy (§6.13)

Confirm dialog copy must match `ux-behavior §5.4` and `SRS-COPY4-030`–`SRS-COPY4-032` verbatim. These are destructive-action guards; incorrect copy misleads users.

| #   | Check                          | Expected result                                                                                                                                                                                         | Test ref | Ref                              |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------- |
| 75  | Cancel Request dialog copy     | Title "Cancel request?"; Description "This request will be cancelled and removed from the Unit Manager's queue. This cannot be undone."; Cancel "Keep request"; Confirm "Cancel request"                | P4-CC01  | SRS-COPY4-030, ux-behavior §3.9  |
| 76  | Withdraw Candidate dialog copy | Title "Withdraw candidate?"; Description "The proposed candidate will be removed from this request. The Sales / Delivery Manager will no longer see them."; Cancel "Keep candidate"; Confirm "Withdraw" | P4-CC02  | SRS-COPY4-031, ux-behavior §3.10 |
| 77  | Submit Candidates dialog copy  | Title "Submit candidates?"; Description "The Sales / Delivery Manager will be notified that candidates have been proposed for this request."; Cancel "Keep editing"; Confirm "Submit"                   | P4-CC03  | SRS-COPY4-032, ux-behavior §3.6  |
| 78  | No dialog for Reject action    | Clicking Reject opens a Sheet with required reason field; no ConfirmDialog fires before the sheet                                                                                                       | P4-CC04  | ux-behavior §5.4, §3.8           |

## 7. BRD / Architecture Requirement To Test Mapping

| Source ref                          | P4 tests                           | SRS / arch IDs                          |
| ----------------------------------- | ---------------------------------- | --------------------------------------- |
| FR-RR-001–007                       | P4-RR01–RR07                       | SRS-F4-110–115, ux-behavior §5.5        |
| AC-RR-001–004                       | P4-RR02–RR04                       | SRS-F4-112–113                          |
| FR-CP-001–012                       | P4-CP01–CP09, P4-W01–W04           | SRS-F4-210–221                          |
| AC-CP-001–004                       | P4-CP03, P4-W01, P4-CP04, P4-CP05  | SRS-F4-211–218                          |
| BR-015                              | P4-CP09                            | SRS-COPY4-041                           |
| FR-PS-001–007                       | P4-PS01–PS07                       | SRS-F4-310–314                          |
| AC-PS-001–004                       | P4-PS02, P4-PS03, P4-PS04, P4-PS05 | SRS-F4-311–313                          |
| FR-PS-006 (default / disabled)      | P4-PS06, P4-PS07                   | SRS-F4-312, ux-behavior §3.5            |
| FR-CD-001–009                       | P4-CD01–CD06                       | SRS-F4-410–416                          |
| AC-CD-001–004                       | P4-CD01–CD05                       | SRS-F4-410–415                          |
| FR-AH-001–003                       | P4-AH01–AH04                       | SRS-F4-510–513                          |
| FR-AH-006, BR-006                   | P4-AH04                            | SRS-F4-513                              |
| AC-AH-001–004                       | P4-AH01–AH04                       | SRS-F4-512–513                          |
| SRS-UI4-001–003                     | P4-AS01, P4-AS05, P4-UI01          | ux-behavior §1.1, §4.5                  |
| SRS-A11Y4-001–007                   | P4-A01–A07                         | SRS §14                                 |
| ux-behavior §8 a11y checklist       | P4-A08–A14                         | ux-behavior §8, ux-requirements §global |
| ux-behavior §5.4 confirm copy       | P4-CC01–CC03                       | SRS-COPY4-030–032                       |
| ux-behavior §5.4 reject (no dialog) | P4-CC04                            | ux-behavior §3.8                        |
| feature-rules, project-structure    | P4-SC01–SC08                       | SRS-F4-520–523, arch docs               |
| BRD §14 S4–S6                       | P4-D04–D06                         | §17.6                                   |

## 8. Risks

| ID  | Risk                                | Mitigation                                            |
| --- | ----------------------------------- | ----------------------------------------------------- |
| R-1 | Carlos SRS approved 2026-07-06      | Test plan aligned to approved SRS                     |
| R-2 | Phase 3 Ivan sign-off pending       | Phase 4 E2E assumes profile tab exists (Phase 3 done) |
| R-3 | Assignment history type drift       | PLAN §0 type alignment before implementation          |
| R-4 | Warning demo seed not deterministic | Document demo person IDs in `phase4-data.ts` fixture  |

## 9. Definition Of Done (exit / sign-off)

Phase 4 validation is **done** when:

- [ ] §6.1 gates pass (exit 0).
- [ ] §6.2–6.11 and §6.13 functional cases pass.
- [ ] §6.12 source-confirmed rows recorded by code inspection.
- [ ] Demo Scenarios 4, 5, 6 pass end-to-end.
- [ ] Execution results recorded under `tests/test_reports/phase4/`.
- [ ] `.planning/STATE.md` and Phase 4 `STATUS.md` updated.
- [x] Carlos signs off product review against SRS — Carlos Nunes, 2026-07-06.
- [ ] Ivan signs off Phase 4 validation before Phase 5 starts.

## 10. Out of Scope for Phase 4 QA

Do **not** block Phase 4 on: custom list builder (Phase 5), FR-AH-004 Assignments section (Phase 5), profile sharing polish (Phase 5), mobile/tablet responsive breakpoints, or backend/persistence.
