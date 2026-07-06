# Phase 4 — Validation Checklist

## Static Gates

```bash
npm run build
npm run lint
npm run format:check
```

All must exit 0.

## Phase 3 Regression

```bash
npm run test:e2e -- tests/e2e/phase3
```

Expected: 78/78 pass (no regressions from Phase 4 work).

## Phase 4 E2E

```bash
npx playwright install chromium
npm run test:e2e -- tests/e2e/phase4
```

## Manual Demo Scenarios

### Scenario 4 — DM creates request

1. Switch to Delivery Manager (`person-dm-001`).
2. Open `/resourcing/requests`.
3. Confirm EmptyState renders: title "No requests yet", description "Create your first resourcing request to get started." (`SRS-COPY4-001`).
4. Click **New Request**; confirm sheet opens and first field receives focus automatically.
5. Fill required fields; attempt to submit with start date in the past — confirm inline error "Start date cannot be in the past." blocks submission.
6. Set start date to a future date; submit.
7. Request appears in table with status **Submitted**; success toast fires.
8. Switch to Unit Manager; open `/resourcing/incoming`.
9. New request appears in queue.

### Scenario 5 — UM proposes candidates

1. As UM, select `request-001` (or newly submitted request).
2. Confirm employee browser shows unit subordinates only, with columns: availability, skills, grade, English level, risk level, leave warnings (`BR-001`, `FR-CP-002`).
3. Select one employee with low availability, overlapping leave, and/or High/Critical risk; confirm all applicable warnings appear inline in the candidate row (allocation / leave / risk badges with text labels, not color-only).
4. Add fit summary text for each internal candidate; confirm placeholder "Summarise why this candidate is a good fit…" is present.
5. Add an external candidate with a valid URL.
6. Attempt to add external candidate with an invalid URL; confirm inline error SRS-COPY4-041 and submit blocked.
7. Generate shared profile from proposal panel:
   - Confirm "Name, position, grade" checkbox is checked and **disabled** (cannot be unchecked).
   - Confirm sensitive sections (contact info, risks, manager notes, feedbacks, scheduled leaves, documents) are **unchecked** by default.
   - Confirm non-sensitive sections (skills, English level, availability, project history) are **checked** by default.
   - Copy link; confirm info toast "Link copied to clipboard." fires (`SRS-COPY4-011`).
8. Click **Submit Candidates**; confirm ConfirmDialog appears with exact copy:
   - Title: "Submit candidates?"
   - Description: "The Sales / Delivery Manager will be notified that candidates have been proposed for this request."
   - Cancel: "Keep editing" | Confirm: "Submit"
9. Confirm; status becomes **Candidates Proposed**; success toast fires.

### Scenario 6 — DM approves / rejects

1. As DM, select `request-003` (or proposed request).
2. Confirm each candidate row shows shared profile link (internal) or external URL.
3. Approve one candidate with optional note; confirm candidate status **Approved** and request status **Approved**; success toast fires.
4. Confirm **Approve** action is no longer rendered for remaining Proposed candidates (not disabled — not rendered at all).
5. Attempt to reject another candidate without a reason; confirm inline error SRS-COPY4-040 blocks submit.
6. Reject another candidate with a required reason; confirm candidate status **Rejected** and reason recorded.
7. **All-rejected path** (separate test): reject all candidates with no prior approval; confirm request status transitions to **Rejected**.
8. As UM, open employee profile **Resourcing History** tab.
9. New assignment history records visible; confirm records include request title, status, and feedback/rejection reason.
10. Open **Project History** tab; confirm no assignment history records appear there (`BR-006`).

### Scenario — Shared profile public view

1. Generate link from proposal panel or profile header.
2. Open `/shared/:token` in new tab.
3. Confirm no app nav, role switcher, or login is required.
4. Confirm only selected sections render.

### Scenario — UM empty incoming

1. Switch to a Unit Manager with no assigned requests (or clear all via mock).
2. Open `/resourcing/incoming`.
3. Confirm EmptyState: title "No incoming requests", description "Resourcing requests assigned to you will appear here." (`SRS-COPY4-002`).

### Scenario — Cancel request

1. As DM, select a request in Draft or Submitted status.
2. Click **Cancel Request**; confirm ConfirmDialog appears with exact copy:
   - Title: "Cancel request?"
   - Description: "This request will be cancelled and removed from the Unit Manager's queue. This cannot be undone."
   - Cancel: "Keep request" | Confirm: "Cancel request"
3. Confirm; status updates to **Cancelled**; **Cancel Request** action no longer renders.
4. Confirm **Cancel Request** does not appear for a request in Candidates Proposed or Approved status.

### Scenario — Withdraw candidate

1. As UM, on a request with a Proposed candidate, click **Withdraw**.
2. Confirm ConfirmDialog appears with exact copy:
   - Title: "Withdraw candidate?"
   - Description: "The proposed candidate will be removed from this request. The Sales / Delivery Manager will no longer see them."
   - Cancel: "Keep candidate" | Confirm: "Withdraw"
3. Confirm; candidate status updates to **Withdrawn**; Withdraw action no longer renders.

### Scenario — Reject candidate (no ConfirmDialog)

1. As DM, click **Reject** on a candidate.
2. Confirm a Sheet opens directly (no ConfirmDialog fires before the sheet).
3. Confirm the sheet has a required "Rejection reason" field.

## Accessibility Validation

Run against each Phase 4 screen (`/resourcing/requests`, `/resourcing/incoming`, `/shared/:token`) manually or via automated a11y tooling:

| Check                                         | Expected result                                                                                   | Ref                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Exactly one `<h1>`                            | Each resourcing screen has exactly one `<h1>`                                                     | P4-A01, SRS-A11Y4-001                               |
| `<h1>` programmatic focus on route change     | `<h1>` has `tabIndex={-1}` and receives `focus()` after mount so screen readers announce the page | P4-A13, ux-behavior §2.2                            |
| `<main>` landmark                             | `<main>` element wraps all primary content on every screen                                        | P4-A08, ux-requirements §global                     |
| Sheet / dialog: open → focus first element    | Focus moves to first focusable element on open                                                    | P4-A02, ux-behavior §6.2                            |
| Sheet / dialog: Tab trap + Shift+Tab backward | Focus stays inside; Shift+Tab reverses                                                            | P4-A02, ux-behavior §6.2                            |
| Sheet / dialog: Escape closes                 | Escape closes sheet/dialog; discards unsaved state                                                | P4-A02, ux-behavior §6.2                            |
| Sheet / dialog: focus returns to trigger      | After close, focus returns to the element that opened the sheet/dialog                            | P4-A02, ux-behavior §6.2                            |
| Form field labels                             | Every `<input>`, `<select>`, `<textarea>` has an associated `<label>`                             | P4-A04, SRS-A11Y4-003                               |
| Validation error association                  | Errors linked to field via `aria-describedby`; error border (`border-red-500`) applied            | P4-A05, SRS-A11Y4-004                               |
| Warning badges text labels                    | Warnings use text labels, not color alone                                                         | P4-A03, SRS-A11Y4-005                               |
| Table keyboard row activation                 | Tab to row, Enter activates (open detail)                                                         | P4-A06, SRS-A11Y4-006                               |
| Checkbox keyboard in employee browser         | Space toggles selection; checkbox state readable by screen reader                                 | P4-A14, ux-behavior §6.3                            |
| Loading button `aria-busy`                    | Submit/confirm buttons: `aria-busy="true"` + `disabled` while mutation pending                    | P4-A07, SRS-A11Y4-007                               |
| `aria-busy` on LoadingState root              | Page-tier and Section-tier `<LoadingState>` root has `aria-busy="true"`                           | P4-A09, ux-behavior §8                              |
| `role="alert"` on ErrorState root             | `<ErrorState>` root has `role="alert"` for automatic screen reader announcement                   | P4-A10, ux-behavior §8                              |
| Icon-only buttons labeled                     | All icon-only buttons have `aria-label` or visible text                                           | P4-A11, ux-behavior §8                              |
| Visible focus ring                            | All interactive elements show focus ring; no `outline-none` without ring replacement              | P4-A12, ux-behavior §8, visual-theme §accessibility |
| Status pills: text + color                    | Request and candidate status pills show text label and semantic color tone per ux-behavior §4.5   | P4-UI01, SRS-UI4-003                                |

## Architecture Inspection

These are **code inspection** checks performed by reading source files — not automated E2E assertions. Record pass/fail for each before sign-off.

| Check                               | What to verify                                                                                                                                                                   | Test ref |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Feature ownership — resourcing      | `src/features/resourcing/` contains all request, proposal, decision, and warning logic; no resourcing business logic in pages                                                    | P4-SC01  |
| Feature ownership — profile sharing | `src/features/profile-sharing/` contains generation sheet and public view logic                                                                                                  | P4-SC02  |
| Warning logic placement             | `src/features/resourcing/utils/candidate-warnings.ts` exists; warning conditions (allocation, leave overlap, risk) are computed there, not inline in components                  | P4-SC03  |
| Thin pages                          | Pages in `src/pages/resourcing-*-page/` and `src/pages/shared-profile-page/` contain no form schemas, business logic, or large data arrays — only layout and feature composition | P4-SC04  |
| Query key helpers                   | `src/lib/query/query-keys.ts` exports `resourcingRequest(id)`, `candidateProposals(requestId)`, `sharedProfile(token)` helpers                                                   | P4-SC05  |
| Import direction                    | `pages` → `features` → `shared/lib/types`; no shared UI importing features; no cross-feature internal imports                                                                    | P4-SC06  |
| State ownership                     | Requests, proposals, assignment history, shared profiles are in TanStack Query; active role and persona ID only in Zustand; no server-like data duplicated in Zustand            | P4-SC07  |
| Shared UI inventory updated         | `docs/architecture/shared-ui.md` component inventory shows `checkbox`, `dialog`/`confirm-dialog`, and `warning-badge` as **Available**                                           | P4-SC08  |

## SRS Traceability

Each validation area maps to test plan cases and SRS/architecture sections:

| Validation area       | Test plan cases                        | SRS / arch sections                                                  |
| --------------------- | -------------------------------------- | -------------------------------------------------------------------- |
| Build / lint / format | P4-B01–B03                             | §17.1, SRS-NF4-003–005                                               |
| Routing / role guards | P4-R01–R06                             | SRS §12, ux-behavior §1.5                                            |
| DM requests           | P4-RR01–RR07                           | §7.4, §8.5, §8.7, §17.2, ux-behavior §5.5                            |
| UM proposal           | P4-CP01–CP09, P4-W01–W04               | §7.5, §8.2, §17.3, ux-behavior §5.7                                  |
| Candidate warnings    | P4-W01–W04                             | §7.5, §10.6, SRS-UI4-004, ux-behavior §3.6                           |
| Shared profile        | P4-PS01–PS07                           | §7.6, §8.1, §17.3, ux-behavior §3.5                                  |
| DM candidate review   | P4-CD01–CD06                           | §7.7, §8.3–8.4, §17.4                                                |
| Assignment history    | P4-AH01–AH04                           | §7.8, §17.5                                                          |
| Async / empty / error | P4-AS01–AS05                           | SRS §9, SRS-UI4-001–002, SRS-UI4-007, ux-behavior §5.1–5.2           |
| UI rendering / tones  | P4-UI01                                | SRS-UI4-003, ux-behavior §4.5                                        |
| Accessibility (SRS)   | P4-A01–A07                             | SRS §14, SRS-A11Y4-001–007                                           |
| Accessibility (arch)  | P4-A08–A14                             | ux-behavior §8, ux-requirements §global, visual-theme §accessibility |
| Confirm dialog copy   | P4-CC01–CC04                           | SRS-COPY4-030–032, ux-behavior §5.4                                  |
| Demo scenarios        | P4-D04–D06                             | SRS §17.6                                                            |
| Copy strings verbatim | All P4-_ cases referencing SRS-COPY4-_ | SRS §10                                                              |
| Architecture / source | P4-SC01–SC08                           | SRS §7.9, §15, arch docs                                             |

## Out of Scope (confirm absent)

- Custom list builder (Phase 5)
- UM Assignments section FR-AH-004 (Phase 5)
- Backend / database / auth
- Mobile / tablet responsive breakpoints

## Sign-off

- [ ] Ivan Phase 4 validation complete
- [x] Carlos — SRS scope approved — Carlos Nunes, 2026-07-06
- [x] Carlos — Product sign-off (Demo Scenarios 4, 5, 6) — Carlos Nunes, 2026-07-06
