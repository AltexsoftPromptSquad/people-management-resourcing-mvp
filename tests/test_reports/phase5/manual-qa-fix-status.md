# Phase 5 Manual QA Fix Status

Date: 2026-07-11
Owner: Engineering
Source report: `tests/test_reports/phase5/manual-testing-results.md`
Triage: `tests/test_reports/phase5/manual-testing-triage.md`
Fix plan: `.planning/phases/phase-5-custom-lists/MANUAL-QA-FIX-PLAN.md`
Phase 5 baseline: `.planning/phases/phase-5-custom-lists/SRS.md`

## Summary

This document records what has been implemented in the current working tree after the manual QA report. It is separate from the original QA findings so the original report remains an immutable defect baseline.

Current status:

| Status                 | Count | Meaning                                                            |
| ---------------------- | ----: | ------------------------------------------------------------------ |
| Fixed                  |    29 | Code changes address the reported issue and relevant e2e now pass. |
| Expected               |     1 | No code change needed based on current product terminology.        |
| Needs Product Decision |     1 | UX/product direction should be confirmed before further work.      |
| Needs Verification     |     1 | Code appears relevant, but status cannot be closed without retest. |

E2E note: automated verification has now been completed for Phase 1 through Phase 5. Phase 5 itself passed without additional code changes after the earlier manual QA fixes.

Latest verification:

| Check                                                       | Result                                            |
| ----------------------------------------------------------- | ------------------------------------------------- |
| `npm.cmd run test:e2e -- tests/e2e/phase1`                  | `28 passed`                                       |
| `npm.cmd run test:e2e -- tests/e2e/phase2`                  | `40 passed`                                       |
| `npm.cmd run test:e2e -- tests/e2e/phase3 tests/e2e/phase4` | `156 passed`                                      |
| `npm.cmd run test:e2e -- tests/e2e/phase5`                  | `6 passed`                                        |
| `npm.cmd run build`                                         | Passed                                            |
| `npm.cmd run lint`                                          | Passed with existing warnings in shared controls. |

## Issue Status

| ID      | Status                 | What changed / decision                                                                                                 | Evidence                                                                                                                                                                                                                                             | Notes                                                                              |
| ------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| F-CL-01 | Fixed                  | Added `Manage Fields` flow with custom field create and archive support on Custom Lists and Employee Profile.           | `src/features/custom-lists/components/custom-field-manager-sheet/CustomFieldManagerSheet.tsx`, `src/pages/employee-profile-page/EmployeeProfilePage.tsx`, `src/mocks/custom-lists-handlers.ts`                                                       | Archive is used as the MVP-safe delete/deactivate operation.                       |
| F-CL-02 | Fixed                  | Added Risk as a system column in Custom Lists.                                                                          | `src/features/custom-lists/components/custom-list-table/CustomListTable.tsx`                                                                                                                                                                         | Aligns with filtering by risk in the list builder.                                 |
| F-CL-03 | Fixed                  | Implemented custom field usage `filter`, `column`, `both` in list configuration, filter bar, and columns.               | `src/features/custom-lists/components/list-builder-sheet/ListBuilderSheet.tsx`, `src/features/custom-lists/components/custom-lists-workspace/CustomListsWorkspace.tsx`, `src/features/custom-lists/components/custom-list-table/CustomListTable.tsx` | Directly supports SRS-F5-203 through SRS-F5-212.                                   |
| F-CL-04 | Fixed                  | Added second UM persona support and made shared-list rendering load owner field definitions, not only recipient fields. | `src/features/roles/components/role-switcher/RoleSwitcher.tsx`, `src/features/custom-lists/components/share-list-sheet/ShareListSheet.tsx`, `src/features/custom-lists/components/custom-lists-workspace/CustomListsWorkspace.tsx`                   | E2E coverage for recipient tab/edit scope remains a separate test commit.          |
| F-EP-01 | Fixed                  | Birthday/date of birth now appears in Basic Information.                                                                | `src/pages/employee-profile-page/EmployeeProfilePage.tsx`                                                                                                                                                                                            | Outside strict Phase 5 SRS, but part of manual QA hardening.                       |
| F-EP-02 | Fixed                  | Emergency contact now appears in Basic Information.                                                                     | `src/pages/employee-profile-page/EmployeeProfilePage.tsx`                                                                                                                                                                                            | Outside strict Phase 5 SRS, but part of manual QA hardening.                       |
| F-EP-03 | Fixed                  | `GET /api/people/:id/idp` now returns fallback IDP data instead of 404.                                                 | `src/mocks/handlers.ts`                                                                                                                                                                                                                              | Supports employee profile stability.                                               |
| F-EP-04 | Expected               | No rename. Triage treats "Resourcing History" as expected terminology.                                                  | `tests/test_reports/phase5/manual-testing-triage.md`, `src/pages/employee-profile-page/EmployeeProfilePage.tsx`                                                                                                                                      | Current BRD/SRS language uses Resourcing History.                                  |
| F-EP-05 | Fixed                  | Added action item create, status update, and resolve controls on the UM profile.                                        | `src/pages/employee-profile-page/EmployeeProfilePage.tsx`, `src/features/employee-profile/api/post-action-item.ts`, `src/features/employee-profile/api/patch-action-item.ts`, `src/mocks/handlers.ts`                                                | This was planned as Stage 7, so plan status should be updated.                     |
| F-EP-06 | Fixed                  | New feedback records use the current timestamp.                                                                         | `src/mocks/handlers.ts`                                                                                                                                                                                                                              | Uses `new Date().toISOString()`.                                                   |
| F-EP-07 | Fixed                  | Shared profile sheet detects section changes and shows "Generate New Link".                                             | `src/features/profile-sharing/components/GenerateSharedProfileSheet.tsx`                                                                                                                                                                             | Enables link update after optional section changes.                                |
| F-EP-08 | Fixed                  | Shared profile tokens include selected sections and public lookup can parse them.                                       | `src/mocks/resourcing-handlers.ts`, `src/features/profile-sharing/components/GenerateSharedProfileSheet.tsx`                                                                                                                                         | Optional section roundtrip is implemented in mock handler.                         |
| F-EP-09 | Fixed                  | Existing link can be reused, and changed optional sections can generate a new active link.                              | `src/features/profile-sharing/components/GenerateSharedProfileSheet.tsx`, `src/mocks/resourcing-handlers.ts`                                                                                                                                         | Triage treats this as a bug, not expected behavior.                                |
| F-SR-01 | Fixed                  | Removed Duration from form state; `durationText` is derived from Start/End dates for the request payload.               | `src/features/resourcing/components/ResourcingRequestsWorkspace.tsx`, `src/features/resourcing/schemas/request-form.schema.ts`                                                                                                                       | E2E references to `Duration *` are intentionally left for the separate e2e commit. |
| F-SR-02 | Fixed                  | Proposed internal candidates now link to employee profiles.                                                             | `src/features/resourcing/components/ResourcingRequestsWorkspace.tsx`, `src/features/resourcing/components/CandidateProposalPanel.tsx`                                                                                                                | Link text currently uses employee id, not display name.                            |
| F-IR-01 | Fixed                  | Approved/Rejected incoming requests render decision details, fit summary, status, rejection reason, and decision note.  | `src/features/resourcing/components/CandidateProposalPanel.tsx`, `src/features/resourcing/components/ResourcingIncomingWorkspace.tsx`                                                                                                                | Covers terminal-state context.                                                     |
| U-D-01  | Fixed                  | Dashboard quick navigation duplication was reduced/removed from the dashboard view.                                     | `src/pages/dashboard-page/DashboardPage.tsx`, `src/app/navigation.ts`                                                                                                                                                                                | Dashboard UX hardening outside strict Phase 5 SRS.                                 |
| U-D-01a | Fixed                  | Overlapping quick links were removed from duplicated dashboard quick navigation.                                        | `src/pages/dashboard-page/DashboardPage.tsx`                                                                                                                                                                                                         | Same area as U-D-01.                                                               |
| U-D-01b | Fixed                  | Navigation label corrected to "Incoming Requests".                                                                      | `src/app/navigation.ts`                                                                                                                                                                                                                              | Copy consistency fix.                                                              |
| U-D-01c | Fixed                  | Assignments route is present in UM navigation and Phase 5 assignments area.                                             | `src/app/navigation.ts`                                                                                                                                                                                                                              | Assignments is in Phase 5 scope.                                                   |
| U-D-01d | Fixed                  | Risks route is present in UM navigation.                                                                                | `src/app/navigation.ts`                                                                                                                                                                                                                              | Supports dashboard/nav consistency.                                                |
| U-D-02  | Fixed                  | "My Action Items" header styling is separated from item rows.                                                           | `src/features/dashboard/components/dashboard-action-items-list/DashboardActionItemsList.tsx`                                                                                                                                                         | Dashboard UX hardening.                                                            |
| U-D-03  | Fixed                  | Assignee filter was removed/reworked; dashboard action items are treated as "my action items".                          | `src/features/dashboard/components/dashboard-action-items-list/DashboardActionItemsList.tsx`                                                                                                                                                         | Matches the reported UX issue.                                                     |
| U-D-04  | Fixed                  | Dashboard action items now include search and pagination.                                                               | `src/features/dashboard/components/dashboard-action-items-list/DashboardActionItemsList.tsx`                                                                                                                                                         | Triage originally marked this follow-up, but implementation appears present.       |
| U-D-05  | Fixed                  | "In Progress" receives a distinct status tone.                                                                          | `src/features/dashboard/components/dashboard-action-items-list/DashboardActionItemsList.tsx`                                                                                                                                                         | Status tone hardening.                                                             |
| U-D-06  | Fixed                  | Dashboard action items expose resolve action.                                                                           | `src/features/dashboard/components/dashboard-action-items-list/DashboardActionItemsList.tsx`, `src/pages/dashboard-page/DashboardPage.tsx`                                                                                                           | Triage originally grouped this with Stage 7.                                       |
| U-CL-01 | Needs Product Decision | No definitive UX redesign beyond adding field usage controls and Manage Fields.                                         | `src/features/custom-lists/components/list-builder-sheet/ListBuilderSheet.tsx`                                                                                                                                                                       | "Confusing form" needs product/design acceptance criteria.                         |
| U-CL-02 | Fixed                  | Added a divider and subtle background on the first custom column to separate system and custom fields.                  | `src/features/custom-lists/components/custom-list-table/CustomListTable.tsx`                                                                                                                                                                         | Keeps table layout stable while making the boundary visible.                       |
| U-S-01  | Fixed                  | Subordinates page now includes pagination.                                                                              | `src/pages/subordinates-page/SubordinatesPage.tsx`, `tests/e2e/page-objects/SubordinatesPage.ts`                                                                                                                                                     | Outside strict Phase 5 SRS, but part of manual QA hardening.                       |
| U-EP-01 | Fixed                  | Feedback author displays human name via people lookup.                                                                  | `src/pages/employee-profile-page/EmployeeProfilePage.tsx`                                                                                                                                                                                            | Falls back to id only if lookup is missing.                                        |
| U-IR-01 | Fixed                  | Unit employee list now strictly filters by requested role and shows an empty message when no unit employees match.      | `src/features/resourcing/components/ResourcingIncomingWorkspace.tsx`, `src/features/resourcing/components/CandidateProposalPanel.tsx`                                                                                                                | Removes the previous fallback that returned every unit employee.                   |
| B-01    | Needs Verification     | Subordinates state/query behavior was changed, including pagination/search handling.                                    | `src/pages/subordinates-page/SubordinatesPage.tsx`, `src/features/people/components/subordinates-filters/SubordinatesFilters.tsx`                                                                                                                    | Needs network/request-count verification to close.                                 |

## Current Change Tree Against Phase 5 SRS

### Required Or Directly Justified By Phase 5

These changes are aligned with Phase 5 SRS scope:

- `src/features/custom-lists/**`
  - Custom field management, custom list filter/column/both usage, runtime list filters, inline edit behavior, row height stability.
- `src/lib/custom-fields/**`
  - Shared normalization for Boolean/custom-field values used by list/profile editing.
- `src/mocks/custom-lists-handlers.ts`
  - Custom field/list/list row/share/custom-value mock endpoints.
- `src/features/profile-sharing/components/GenerateSharedProfileSheet.tsx`
  - Active link reopen and optional-section regeneration behavior.
- `src/features/resourcing/components/assignments-table/**` and assignments-related navigation/routes if present in the broader tree.
  - UM Assignments section is Phase 5 scope.
- `src/app/navigation.ts`
  - UM Custom Lists, Assignments, Risks/Incoming copy consistency.
- `src/shared/ui/date-picker/**`
  - Needed by Date custom fields and date forms.
- `src/shared/ui/select/**`, `tests/e2e/support/select.ts`
  - Supports custom Select behavior used by Phase 5 list filters and inline Single Select editing.

### Manual QA Hardening Outside Strict Phase 5

These changes address `manual-testing-results.md`, but are broader than the strict Phase 5 SRS custom-lists/assignments/profile-sharing scope:

- Dashboard action item search/pagination/resolve/status styling:
  - `src/features/dashboard/components/dashboard-action-items-list/DashboardActionItemsList.tsx`
  - `src/pages/dashboard-page/DashboardPage.tsx`
- Employee profile birthday/emergency contact/feedback author/action-item CRUD:
  - `src/pages/employee-profile-page/EmployeeProfilePage.tsx`
  - `src/features/employee-profile/**`
  - `src/mocks/handlers.ts`
- Subordinates pagination/debounce/filter changes:
  - `src/pages/subordinates-page/SubordinatesPage.tsx`
  - `src/features/people/components/subordinates-filters/SubordinatesFilters.tsx`
- Incoming/DM request completeness:
  - `src/features/resourcing/components/CandidateProposalPanel.tsx`
  - `src/features/resourcing/components/ResourcingIncomingWorkspace.tsx`
  - `src/features/resourcing/components/ResourcingRequestsWorkspace.tsx`
  - `src/features/resourcing/schemas/request-form.schema.ts`

Recommendation: keep these changes only if the current branch is intended to close the full manual QA report, not only Phase 5 SRS. If the branch should remain Phase 5-only, split these into follow-up commits/PRs.

### Changes That Need Follow-up Before Sign-off

- DM request duration cleanup:
  - Remove stale `Duration *` references from e2e tests.
- Custom Select migration:
  - Existing tests that use `toHaveValue()` on custom comboboxes must use helper actions/assertions from `tests/e2e/support/select.ts`.

## Verification Notes

Completed validation:

```bash
npm.cmd run build
npm.cmd run lint
npm.cmd run test:e2e -- tests/e2e/phase5
npm.cmd run test:e2e -- tests/e2e/phase1 tests/e2e/phase2 tests/e2e/phase3 tests/e2e/phase4
```

Additional notes:

- `npm.cmd run format:check` for the whole repository still reports unrelated pre-existing formatting warnings outside the touched files.
- Prettier was run and checked on the files changed by the Phase 3/4 e2e coverage commit.
- Browser/Vite commands require running outside the sandbox on this machine because Vite writes temporary files under `node_modules/.vite-temp`.
- Remaining open item: `B-01` requires a targeted request-count/performance verification before it can be marked fixed.
