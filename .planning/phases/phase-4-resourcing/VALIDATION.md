# Phase 4 — Validation Checklist

**Owner:** Ivan (QA / validation / test cases)

**Status:** Signed off

**Last updated:** 2026-07-06

## Scope

Validate the full Resourcing E2E increment against:

- `.planning/phases/phase-4-resourcing/phase-4-test-plan.md`
- `.planning/phases/phase-4-resourcing/SRS.md`
- `.planning/phases/phase-4-resourcing/PLAN.md`
- BRD v1.1 (`FR-RR-*`, `FR-CP-*`, `FR-CD-*`, `FR-PS-*`, `FR-AH-*`, `BR-006`, `BR-010`–`BR-015`)

Phase 4 delivers DM request creation, UM candidate proposal with warnings and shared profiles, DM approve/reject, assignment history write on decision, and public `/shared/:token` view.

## Validation environment

Desktop browser only (Chromium), viewport 1280 × 800. MSW active with deterministic Faker seed `faker.seed(20260625)`. Personas: UM `person-um-001` (Olena), DM `person-dm-001` (Marcus), Employee `person-employee-001` (Nazar).

## Playwright spec map

| Spec file                                        | Coverage                 |
| ------------------------------------------------ | ------------------------ |
| `tests/e2e/phase4/routing-guards.spec.ts`        | P4-R01–R06               |
| `tests/e2e/phase4/dm-request-creation.spec.ts`   | P4-RR01–RR07             |
| `tests/e2e/phase4/um-candidate-proposal.spec.ts` | P4-CP01–CP09, P4-W01–W04 |
| `tests/e2e/phase4/shared-profile.spec.ts`        | P4-PS01–PS07             |
| `tests/e2e/phase4/dm-candidate-review.spec.ts`   | P4-CD01–CD06             |
| `tests/e2e/phase4/assignment-history.spec.ts`    | P4-AH01–AH04             |
| `tests/e2e/phase4/async-states.spec.ts`          | P4-AS01–AS05, P4-UI01    |
| `tests/e2e/phase4/accessibility.spec.ts`         | P4-A01–A14               |
| `tests/e2e/phase4/confirm-dialog-copy.spec.ts`   | P4-CC01–CC04             |
| `tests/e2e/phase4/demo-scenarios.spec.ts`        | P4-D04–D06               |
| `tests/e2e/phase4/source-confirmed.spec.ts`      | P4-SC01–SC08             |

Fixtures: `tests/e2e/fixtures/phase4-data.ts`. Page objects: `ResourcingRequestsPage`, `ResourcingIncomingPage`, `SharedProfilePublicPage`.

## Static Gates

```bash
npm run build
npm run lint
npm run format:check
```

| Check            | Command                | Pass criteria | Test ref | Spec | Result |
| ---------------- | ---------------------- | ------------- | -------- | ---- | ------ |
| TypeScript build | `npm run build`        | Exit 0        | P4-B01   | —    | PASS   |
| ESLint           | `npm run lint`         | Exit 0        | P4-B02   | —    | PASS   |
| Prettier         | `npm run format:check` | Exit 0        | P4-B03   | —    | PASS   |

- [x] `npm run build` passes (exit 0).
- [x] `npm run lint` passes (exit 0).
- [x] `npm run format:check` passes (exit 0).

## Phase 1, 2, 3 Regression

```bash
npm run test:e2e -- tests/e2e/phase1 tests/e2e/phase2 tests/e2e/phase3
```

- [x] Previous phases still working (no regressions introduced by Phase 4 routes or shared UI changes).

## Phase 4 E2E

```bash
npm run test:e2e -- tests/e2e/phase4
```

- [x] **78 passed / 0 failed** across 11 spec files (Chromium, 2026-07-06).

## Routing & role guards

| #   | Check                                   | Expected result                      | Test ref | Spec                     | Result |
| --- | --------------------------------------- | ------------------------------------ | -------- | ------------------------ | ------ |
| 1   | DM opens `/resourcing/requests`         | My Requests page renders             | P4-R01   | `routing-guards.spec.ts` | PASS   |
| 2   | UM opens `/resourcing/incoming`         | Incoming Requests page renders       | P4-R02   | `routing-guards.spec.ts` | PASS   |
| 3   | UM direct-nav to `/resourcing/requests` | Redirected to `/dashboard`           | P4-R03   | `routing-guards.spec.ts` | PASS   |
| 4   | DM direct-nav to `/resourcing/incoming` | Redirected to `/resourcing/requests` | P4-R04   | `routing-guards.spec.ts` | PASS   |
| 5   | Public opens `/shared/:token`           | Shared profile renders; no nav shell | P4-R05   | `routing-guards.spec.ts` | PASS   |
| 6   | Invalid shared token                    | ErrorState SRS-COPY4-003             | P4-R06   | `routing-guards.spec.ts` | PASS   |

- [x] Routing & role guards (#1–6) pass.

## DM request creation

| #   | Check                             | Expected result                                                  | Test ref | Spec                          | Result |
| --- | --------------------------------- | ---------------------------------------------------------------- | -------- | ----------------------------- | ------ |
| 7   | New Request opens sheet           | All required fields present; first field receives focus          | P4-RR01  | `dm-request-creation.spec.ts` | PASS   |
| 8   | Submit with empty required fields | Inline validation per field; focus moves to first error field    | P4-RR02  | `dm-request-creation.spec.ts` | PASS   |
| 9   | Submit valid form                 | Status Submitted; success toast                                  | P4-RR03  | `dm-request-creation.spec.ts` | PASS   |
| 10  | Request in UM queue               | Appears in incoming queue immediately                            | P4-RR04  | `dm-request-creation.spec.ts` | PASS   |
| 11  | Cancel Draft request              | Status Cancelled; Cancel action no longer renders                | P4-RR05  | `dm-request-creation.spec.ts` | PASS   |
| 12  | DM table shows own requests       | Filtered by `createdById`                                        | P4-RR06  | `dm-request-creation.spec.ts` | PASS   |
| 13  | Start date in past                | Inline error "Start date cannot be in the past."; submit blocked | P4-RR07  | `dm-request-creation.spec.ts` | PASS   |

- [x] DM request creation (#7–13) pass.

## UM candidate proposal

| #   | Check                      | Expected result                                                                               | Test ref | Spec                            | Result |
| --- | -------------------------- | --------------------------------------------------------------------------------------------- | -------- | ------------------------------- | ------ |
| 14  | Open assigned request      | Requirements summary visible                                                                  | P4-CP01  | `um-candidate-proposal.spec.ts` | PASS   |
| 15  | Employee browser           | Unit subordinates with availability, skills, grade, English level, risk level, leave warnings | P4-CP02  | `um-candidate-proposal.spec.ts` | PASS   |
| 16  | Select internal candidate  | Candidate row added                                                                           | P4-CP03  | `um-candidate-proposal.spec.ts` | PASS   |
| 17  | Add external URL (valid)   | External candidate row with URL                                                               | P4-CP04  | `um-candidate-proposal.spec.ts` | PASS   |
| 18  | Submit candidates          | ConfirmDialog → status Candidates Proposed                                                    | P4-CP05  | `um-candidate-proposal.spec.ts` | PASS   |
| 19  | Submit with no candidates  | Inline error SRS-COPY4-048                                                                    | P4-CP06  | `um-candidate-proposal.spec.ts` | PASS   |
| 20  | Withdraw candidate         | Status Withdrawn before DM decision                                                           | P4-CP07  | `um-candidate-proposal.spec.ts` | PASS   |
| 21  | Fit summary textarea       | Textarea present per candidate; placeholder present; value sent with proposal                 | P4-CP08  | `um-candidate-proposal.spec.ts` | PASS   |
| 22  | Add external URL (invalid) | Inline error SRS-COPY4-041; submit blocked                                                    | P4-CP09  | `um-candidate-proposal.spec.ts` | PASS   |

- [x] UM candidate proposal (#14–22) pass.

## Candidate warnings

| #   | Check              | Expected result                               | Test ref | Spec                            | Result |
| --- | ------------------ | --------------------------------------------- | -------- | ------------------------------- | ------ |
| 23  | Allocation warning | SRS-COPY4-050 inline in candidate row         | P4-W01   | `um-candidate-proposal.spec.ts` | PASS   |
| 24  | Leave overlap      | SRS-COPY4-051 inline in candidate row         | P4-W02   | `um-candidate-proposal.spec.ts` | PASS   |
| 25  | High/Critical risk | SRS-COPY4-052 or SRS-COPY4-053 per risk level | P4-W03   | `um-candidate-proposal.spec.ts` | PASS   |
| 26  | Non-blocking       | Submit enabled with warnings present          | P4-W04   | `um-candidate-proposal.spec.ts` | PASS   |

- [x] Candidate warnings (#23–26) pass.

## Shared profile

| #   | Check                               | Expected result                                                                              | Test ref | Spec                     | Result |
| --- | ----------------------------------- | -------------------------------------------------------------------------------------------- | -------- | ------------------------ | ------ |
| 27  | Generate from proposal              | Link created; copy toast SRS-COPY4-011                                                       | P4-PS01  | `shared-profile.spec.ts` | PASS   |
| 28  | Sensitive default off               | Contact, risks, feedbacks, manager notes, scheduled leaves, documents unchecked              | P4-PS02  | `shared-profile.spec.ts` | PASS   |
| 29  | Default-on sections present         | Name/position/grade, skills, English level, availability, project history checked by default | P4-PS06  | `shared-profile.spec.ts` | PASS   |
| 30  | Name/position/grade always included | Checkbox is checked and disabled (cannot be unchecked)                                       | P4-PS07  | `shared-profile.spec.ts` | PASS   |
| 31  | Public link sections                | Only selected sections visible at `/shared/:token`                                           | P4-PS03  | `shared-profile.spec.ts` | PASS   |
| 32  | No login on public view             | No role switcher or app nav on `/shared/:token`                                              | P4-PS04  | `shared-profile.spec.ts` | PASS   |
| 33  | Profile header action               | "Generate Shared Profile" button visible in UM proposal panel candidate row                  | P4-PS05  | `shared-profile.spec.ts` | PASS   |

- [x] Shared profile (#27–33) pass.

## DM candidate review

| #   | Check                   | Expected result                                                  | Test ref | Spec                          | Result |
| --- | ----------------------- | ---------------------------------------------------------------- | -------- | ----------------------------- | ------ |
| 34  | Candidate list          | Internal shows shared profile link; external shows URL           | P4-CD01  | `dm-candidate-review.spec.ts` | PASS   |
| 35  | Approve candidate       | Candidate Approved; request Approved; assignment history created | P4-CD02  | `dm-candidate-review.spec.ts` | PASS   |
| 36  | One approval limit      | Approve action not rendered for remaining Proposed candidates    | P4-CD03  | `dm-candidate-review.spec.ts` | PASS   |
| 37  | Reject without reason   | Inline error SRS-COPY4-040; submit blocked                       | P4-CD04  | `dm-candidate-review.spec.ts` | PASS   |
| 38  | Reject with reason      | Candidate Rejected; reason recorded                              | P4-CD05  | `dm-candidate-review.spec.ts` | PASS   |
| 39  | All candidates rejected | Request status transitions to Rejected                           | P4-CD06  | `dm-candidate-review.spec.ts` | PASS   |

- [x] DM candidate review (#34–39) pass.

## Assignment history

| #   | Check                         | Expected result                                                                                    | Test ref | Spec                         | Result |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------- | -------- | ---------------------------- | ------ |
| 40  | History on approve            | New record on employee Resourcing History tab after approval                                       | P4-AH01  | `assignment-history.spec.ts` | PASS   |
| 41  | History fields                | Request title, status, feedback/rejection reason visible                                           | P4-AH02  | `assignment-history.spec.ts` | PASS   |
| 42  | Read-only                     | No edit action on history records                                                                  | P4-AH03  | `assignment-history.spec.ts` | PASS   |
| 43  | Separate from project history | No assignment history records on Project History tab; no project entries on Resourcing History tab | P4-AH04  | `assignment-history.spec.ts` | PASS   |

- [x] Assignment history (#40–43) pass.

## Async states & UI rendering

| #   | Check                       | Expected result                                                                                                                                                                                                | Test ref | Spec                   | Result |
| --- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------- | ------ |
| 44  | Page loading                | Page-tier LoadingState while requests pending                                                                                                                                                                  | P4-AS01  | `async-states.spec.ts` | PASS   |
| 45  | Empty DM list               | EmptyState: "No requests yet" / "Create your first resourcing request to get started." (SRS-COPY4-001)                                                                                                         | P4-AS02  | `async-states.spec.ts` | PASS   |
| 46  | Query failure               | ErrorState: "Could not load requests" / "Refresh the page to try again." (SRS-COPY4-010)                                                                                                                       | P4-AS03  | `async-states.spec.ts` | PASS   |
| 47  | Empty UM incoming list      | EmptyState: "No incoming requests" / "Resourcing requests assigned to you will appear here." (SRS-COPY4-002)                                                                                                   | P4-AS04  | `async-states.spec.ts` | PASS   |
| 48  | Proposal panel section load | Section-tier LoadingState while employee browser loads independently                                                                                                                                           | P4-AS05  | `async-states.spec.ts` | PASS   |
| 49  | Status pill tone mapping    | Request status pills: Draft→neutral, Submitted/In Review/Candidates Proposed→info, Approved→success, Rejected/Cancelled→danger; Candidate: Proposed→info, Approved→success, Rejected→danger, Withdrawn→neutral | P4-UI01  | `async-states.spec.ts` | PASS   |

- [x] Async states & UI rendering (#44–49) pass.

## Accessibility

| #   | Check                                 | Expected result                                                                                                                   | Test ref | Spec                    | Result |
| --- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------- | ------ |
| 50  | Page headings                         | Exactly one `<h1>` per resourcing screen                                                                                          | P4-A01   | `accessibility.spec.ts` | PASS   |
| 51  | Sheet / dialog full keyboard contract | On open: focus moves to first focusable element; Tab traps; Shift+Tab reverses; Escape closes; on close: focus returns to trigger | P4-A02   | `accessibility.spec.ts` | PASS   |
| 52  | Warning text labels                   | Candidate warnings use text labels (not color alone)                                                                              | P4-A03   | `accessibility.spec.ts` | PASS   |
| 53  | Form field labels                     | Every `<input>`, `<select>`, `<textarea>` in resourcing forms has an associated `<label>`                                         | P4-A04   | `accessibility.spec.ts` | PASS   |
| 54  | Validation error association          | Validation messages linked to field via `aria-describedby`; error border applied                                                  | P4-A05   | `accessibility.spec.ts` | PASS   |
| 55  | Keyboard table row activation         | Request table rows: Tab to focus, Enter activates (open detail)                                                                   | P4-A06   | `accessibility.spec.ts` | PASS   |
| 56  | Loading button `aria-busy`            | Submit/confirm buttons set `aria-busy="true"` and `disabled` during mutation                                                      | P4-A07   | `accessibility.spec.ts` | PASS   |
| 57  | `<main>` landmark                     | Every resourcing screen has a `<main>` element wrapping primary content                                                           | P4-A08   | `accessibility.spec.ts` | PASS   |
| 58  | `aria-busy` on LoadingState root      | Page-tier and Section-tier `<LoadingState>` root element has `aria-busy="true"`                                                   | P4-A09   | `accessibility.spec.ts` | PASS   |
| 59  | `role="alert"` on ErrorState root     | `<ErrorState>` root element has `role="alert"` so screen readers announce it automatically                                        | P4-A10   | `accessibility.spec.ts` | PASS   |
| 60  | Icon-only buttons have labels         | All icon-only action buttons have `aria-label` or visible text label                                                              | P4-A11   | `accessibility.spec.ts` | PASS   |
| 61  | Visible focus ring                    | All interactive elements show focus ring on keyboard focus                                                                        | P4-A12   | `accessibility.spec.ts` | PASS   |
| 62  | `<h1>` programmatic focus on nav      | Page `<h1>` has `tabIndex={-1}` and receives `focus()` after route mount                                                          | P4-A13   | `accessibility.spec.ts` | PASS   |
| 63  | Checkbox keyboard in employee browser | Space key toggles candidate selection checkbox; checkbox communicates checked state to screen readers                             | P4-A14   | `accessibility.spec.ts` | PASS   |

- [x] Accessibility (#50–63) pass.

## Confirm dialog copy

| #   | Check                          | Expected result                                                                                                                                                                                         | Test ref | Spec                          | Result |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------- | ------ |
| 64  | Cancel Request dialog copy     | Title "Cancel request?"; Description "This request will be cancelled and removed from the Unit Manager's queue. This cannot be undone."; Cancel "Keep request"; Confirm "Cancel request"                | P4-CC01  | `confirm-dialog-copy.spec.ts` | PASS   |
| 65  | Withdraw Candidate dialog copy | Title "Withdraw candidate?"; Description "The proposed candidate will be removed from this request. The Sales / Delivery Manager will no longer see them."; Cancel "Keep candidate"; Confirm "Withdraw" | P4-CC02  | `confirm-dialog-copy.spec.ts` | PASS   |
| 66  | Submit Candidates dialog copy  | Title "Submit candidates?"; Description "The Sales / Delivery Manager will be notified that candidates have been proposed for this request."; Cancel "Keep editing"; Confirm "Submit"                   | P4-CC03  | `confirm-dialog-copy.spec.ts` | PASS   |
| 67  | No dialog for Reject action    | Clicking Reject opens a Sheet with required reason field; no ConfirmDialog fires before the sheet                                                                                                       | P4-CC04  | `confirm-dialog-copy.spec.ts` | PASS   |

- [x] Confirm dialog copy (#64–67) pass.

## Demo scenarios (BRD §14)

| #   | Scenario   | Steps / expected                                                              | Test ref | Spec                     | Result |
| --- | ---------- | ----------------------------------------------------------------------------- | -------- | ------------------------ | ------ |
| 68  | Scenario 4 | DM create + submit request end-to-end; UM sees request in incoming queue      | P4-D04   | `demo-scenarios.spec.ts` | PASS   |
| 69  | Scenario 5 | UM propose with warnings + shared profile + submit                            | P4-D05   | `demo-scenarios.spec.ts` | PASS   |
| 70  | Scenario 6 | DM approve/reject; UM verifies assignment history; shared profile public view | P4-D06   | `demo-scenarios.spec.ts` | PASS   |

- [x] Demo Scenarios 4, 5, and 6 pass end-to-end.

## Source-confirmed architecture

| #   | Check                               | Expected result                                                                                                   | Test ref | Spec                       | Result |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------- | -------------------------- | ------ |
| 71  | Feature ownership — resourcing      | All request/proposal/decision/warning logic in `src/features/resourcing/`                                         | P4-SC01  | `source-confirmed.spec.ts` | PASS   |
| 72  | Feature ownership — profile sharing | All generation and public view logic in `src/features/profile-sharing/`                                           | P4-SC02  | `source-confirmed.spec.ts` | PASS   |
| 73  | Warning logic placement             | `src/features/resourcing/utils/candidate-warnings.ts` exists; warning logic not inline in components              | P4-SC03  | `source-confirmed.spec.ts` | PASS   |
| 74  | Thin pages                          | Route pages in `src/pages/resourcing-*-page/` and `src/pages/shared-profile-page/` contain no business logic      | P4-SC04  | `source-confirmed.spec.ts` | PASS   |
| 75  | Query key helpers                   | `resourcingRequest(id)`, `candidateProposals(requestId)`, `sharedProfile(token)` helpers exist in `query-keys.ts` | P4-SC05  | `source-confirmed.spec.ts` | PASS   |
| 76  | Import direction                    | `pages → features → shared/lib/types`; no reverse imports                                                         | P4-SC06  | `source-confirmed.spec.ts` | PASS   |
| 77  | State ownership                     | Server-like data in TanStack Query only; active role and persona ID only in Zustand                               | P4-SC07  | `source-confirmed.spec.ts` | PASS   |
| 78  | Shared UI inventory updated         | `shared-ui.md` component inventory lists checkbox, dialog/confirm-dialog, and warning-badge as Available          | P4-SC08  | `source-confirmed.spec.ts` | PASS   |

- [x] Source-confirmed architecture (#71–78) pass.

## SRS traceability

| Validation area       | Test plan cases                        | Playwright specs                                                                     | SRS / arch sections                                                  |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Build / lint / format | P4-B01–B03                             | — (manual gates)                                                                     | §17.1, SRS-NF4-003–005                                               |
| Routing / role guards | P4-R01–R06                             | `routing-guards.spec.ts`                                                             | SRS §12, ux-behavior §1.5                                            |
| DM requests           | P4-RR01–RR07                           | `dm-request-creation.spec.ts`                                                        | §7.4, §8.5, §8.7, §17.2, ux-behavior §5.5                            |
| UM proposal           | P4-CP01–CP09, P4-W01–W04               | `um-candidate-proposal.spec.ts`                                                      | §7.5, §8.2, §17.3, ux-behavior §5.7                                  |
| Candidate warnings    | P4-W01–W04                             | `um-candidate-proposal.spec.ts`                                                      | §7.5, §10.6, SRS-UI4-004, ux-behavior §3.6                           |
| Shared profile        | P4-PS01–PS07                           | `shared-profile.spec.ts`                                                             | §7.6, §8.1, §17.3, ux-behavior §3.5                                  |
| DM candidate review   | P4-CD01–CD06                           | `dm-candidate-review.spec.ts`                                                        | §7.7, §8.3–8.4, §17.4                                                |
| Assignment history    | P4-AH01–AH04                           | `assignment-history.spec.ts`                                                         | §7.8, §17.5                                                          |
| Async / empty / error | P4-AS01–AS05                           | `async-states.spec.ts`                                                               | SRS §9, SRS-UI4-001–002, SRS-UI4-007, ux-behavior §5.1–5.2           |
| UI rendering / tones  | P4-UI01                                | `async-states.spec.ts`                                                               | SRS-UI4-003, ux-behavior §4.5                                        |
| Accessibility (SRS)   | P4-A01–A07                             | `accessibility.spec.ts`                                                              | SRS §14, SRS-A11Y4-001–007                                           |
| Accessibility (arch)  | P4-A08–A14                             | `accessibility.spec.ts`                                                              | ux-behavior §8, ux-requirements §global, visual-theme §accessibility |
| Confirm dialog copy   | P4-CC01–CC04                           | `confirm-dialog-copy.spec.ts`                                                        | SRS-COPY4-030–032, ux-behavior §5.4                                  |
| Demo scenarios        | P4-D04–D06                             | `demo-scenarios.spec.ts`                                                             | SRS §17.6                                                            |
| Copy strings verbatim | All P4-_ cases referencing SRS-COPY4-_ | `confirm-dialog-copy.spec.ts`, `dm-request-creation.spec.ts`, `async-states.spec.ts` | SRS §10                                                              |
| Architecture / source | P4-SC01–SC08                           | `source-confirmed.spec.ts`                                                           | SRS §7.9, §15, arch docs                                             |

## Out of scope (confirm absent)

- Custom list builder (Phase 5)
- UM Assignments section FR-AH-004 (Phase 5)
- Backend / database / auth
- Mobile / tablet responsive breakpoints

## Definition of done

Phase 4 validation is **done** when:

- [x] §6.1 gates pass (exit 0).
- [x] §6.2–6.11 and §6.13 functional cases pass (78/78 Playwright tests green).
- [x] §6.12 source-confirmed rows recorded (`source-confirmed.spec.ts`).
- [x] Demo Scenarios 4, 5, 6 pass end-to-end (`demo-scenarios.spec.ts`).
- [x] Carlos signs off product review against SRS — Carlos Nunes, 2026-07-06.
- [x] Ivan Phase 4 validation complete — 2026-07-06.

## Evidence

| Check area                    | Command                                | Result | Evidence summary                                                     |
| ----------------------------- | -------------------------------------- | ------ | -------------------------------------------------------------------- |
| Build gate                    | `npm run build`                        | PASS   | Exit 0; `tsc -b` clean; Vite bundle produced                         |
| Lint gate                     | `npm run lint`                         | PASS   | Exit 0                                                               |
| Format gate                   | `npm run format:check`                 | PASS   | Exit 0                                                               |
| E2E automated validation gate | `npm run test:e2e -- tests/e2e/phase4` | PASS   | **78 passed / 0 failed** across 11 spec files (Chromium, 2026-07-06) |
| Source-confirmed architecture | `source-confirmed.spec.ts`             | PASS   | P4-SC01–SC08 verified via source inspection tests                    |

## Sign-off

- [x] Ivan Phase 4 validation complete — 2026-07-06
- [x] Carlos — SRS scope approved — Carlos Nunes, 2026-07-06
- [x] Carlos — Product sign-off (Demo Scenarios 4, 5, 6) — Carlos Nunes, 2026-07-06
