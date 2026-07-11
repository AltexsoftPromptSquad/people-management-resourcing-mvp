# Phase 5 Manual QA Fix Plan

## Source And Scope

- Defect baseline: [tests/test_reports/phase5/manual-testing-results.md](../../../tests/test_reports/phase5/manual-testing-results.md).
- Phase 5 product/SRS baseline: [SRS.md](./SRS.md), [UX-FLOW.md](./UX-FLOW.md), [VALIDATION.md](./VALIDATION.md).
- Approach: fix in waves, from P0/P1 functionality to UX/performance, with mandatory regression runs after each wave.

## Ordering Principles

- First, fixes that break business flows (P0/P1): custom lists behavior, incoming requests detail, shared profile integrity.
- Then low-risk data/display defects (IDP seed, profile fields, author name, candidate profile links).
- After that — UX harmonization (dashboard/nav), then performance.
- Large changes (Action Items CRUD) — separate final wave with an expanded test plan.

## Stage 0 — Triage And Acceptance Matrix

- Classify each issue from the report as `bug / expected / product-decision / follow-up`.
- Record mapping `Issue ID -> FR/SRS/BRD` in the working tracker.
- Special decision gates:
  - F-EP-09 (shared profile regeneration): expected Phase 5 behavior vs new requirement.
  - F-EP-04 (Assignment vs Resourcing label): verify BRD terminology alignment.
  - U-IR-01 (filter unit employees by required role): product confirmation.

Verification:

- Updated triage doc with decisions for all 31 items.

## Stage 1 — Core Custom Lists Functional Gaps (P0/P1)

Target issues:

- F-CL-01, F-CL-02, F-CL-03, F-CL-04.

Primary code areas:

- [src/features/custom-lists/components/list-builder-sheet/ListBuilderSheet.tsx](../../../src/features/custom-lists/components/list-builder-sheet/ListBuilderSheet.tsx)
- [src/features/custom-lists/components/custom-lists-workspace/CustomListsWorkspace.tsx](../../../src/features/custom-lists/components/custom-lists-workspace/CustomListsWorkspace.tsx)
- [src/features/custom-lists/components/custom-list-table/CustomListTable.tsx](../../../src/features/custom-lists/components/custom-list-table/CustomListTable.tsx)
- [src/features/custom-lists/components/share-list-sheet/ShareListSheet.tsx](../../../src/features/custom-lists/components/share-list-sheet/ShareListSheet.tsx)
- [src/features/roles/components/role-switcher/RoleSwitcher.tsx](../../../src/features/roles/components/role-switcher/RoleSwitcher.tsx)
- [src/store/role-store.ts](../../../src/store/role-store.ts)
- [src/mocks/custom-lists-handlers.ts](../../../src/mocks/custom-lists-handlers.ts)

Plan:

- Implement `usage: filter|column|both` end-to-end in UI/flow (not only schema/storage).
- Synchronize table columns and filter capabilities (including Risk consistency).
- Add a verifiable recipient flow for sharing (persona switching in UI or an approved test mechanism).
- Complete custom field lifecycle (create/edit/delete) per agreed scope.

Verification:

- Extend Phase 5 e2e:
  - [tests/e2e/phase5/list-builder.spec.ts](../../../tests/e2e/phase5/list-builder.spec.ts)
  - [tests/e2e/phase5/custom-list-tabs.spec.ts](../../../tests/e2e/phase5/custom-list-tabs.spec.ts)
  - [tests/e2e/phase5/list-sharing.spec.ts](../../../tests/e2e/phase5/list-sharing.spec.ts)
  - new `custom-field-management.spec.ts`.
- Manual smoke: owner share -> recipient sees tab -> recipient edit scope limited to direct reports.

## Stage 2 — Shared Profile Integrity And Reopen Flow

Target issues:

- F-EP-07, F-EP-08, F-EP-09.

Primary code areas:

- [src/features/profile-sharing/components/GenerateSharedProfileSheet.tsx](../../../src/features/profile-sharing/components/GenerateSharedProfileSheet.tsx)
- [src/features/profile-sharing/hooks/use-shared-profile-hooks.ts](../../../src/features/profile-sharing/hooks/use-shared-profile-hooks.ts)
- [src/features/profile-sharing/api/shared-profile-api.ts](../../../src/features/profile-sharing/api/shared-profile-api.ts)
- [src/mocks/resourcing-handlers.ts](../../../src/mocks/resourcing-handlers.ts)
- [src/pages/shared-profile-page/SharedProfilePage.tsx](../../../src/pages/shared-profile-page/SharedProfilePage.tsx)

Plan:

- Verify/fix token+sections roundtrip for optional sections.
- Remove cases where the link becomes invalid when optional fields are enabled.
- Explicitly implement and document regenerate vs reuse active link policy (per Stage 0 decision).

Verification:

- Extend:
  - [tests/e2e/phase5/shared-profile-polish.spec.ts](../../../tests/e2e/phase5/shared-profile-polish.spec.ts)
  - [tests/e2e/phase4/shared-profile.spec.ts](../../../tests/e2e/phase4/shared-profile.spec.ts)
  - [tests/e2e/phase4/demo-scenarios.spec.ts](../../../tests/e2e/phase4/demo-scenarios.spec.ts)
- Verify public page `/shared/:token` for all allowed section combinations.

## Stage 3 — Incoming Requests Completeness

Target issues:

- F-IR-01, U-IR-01.

Primary code areas:

- [src/features/resourcing/components/ResourcingIncomingWorkspace.tsx](../../../src/features/resourcing/components/ResourcingIncomingWorkspace.tsx)
- [src/features/resourcing/components/CandidateProposalPanel.tsx](../../../src/features/resourcing/components/CandidateProposalPanel.tsx)
- [src/mocks/resourcing-handlers.ts](../../../src/mocks/resourcing-handlers.ts)

Plan:

- Add detail rendering for terminal states (Approved/Rejected) with reason/candidate context.
- Align Unit employees filtering to the approved product rule (all unit vs requested role).

Verification:

- Update:
  - [tests/e2e/phase4/um-candidate-proposal.spec.ts](../../../tests/e2e/phase4/um-candidate-proposal.spec.ts)
  - [tests/e2e/phase4/demo-scenarios.spec.ts](../../../tests/e2e/phase4/demo-scenarios.spec.ts)
- Add targeted regression for request status transitions.

## Stage 4 — Employee Profile Data And Presentation Fixes

Target issues:

- F-EP-01, F-EP-02, F-EP-03, F-EP-06, U-EP-01, F-EP-04 (if Stage 0 decides to change).

Primary code areas:

- [src/pages/employee-profile-page/EmployeeProfilePage.tsx](../../../src/pages/employee-profile-page/EmployeeProfilePage.tsx)
- [src/features/employee-profile/api/get-person-idp.ts](../../../src/features/employee-profile/api/get-person-idp.ts)
- [src/mocks/handlers.ts](../../../src/mocks/handlers.ts)
- [src/mocks/data/idp.ts](../../../src/mocks/data/idp.ts)
- [src/mocks/data/feedbacks.ts](../../../src/mocks/data/feedbacks.ts)

Plan:

- Fix IDP 404 (seed/handler coverage).
- Restore expected profile fields (birthday, emergency contact).
- Fix feedback metadata (author display + current date behavior).

Verification:

- Update/add checks in:
  - [tests/e2e/phase3/tab-content.spec.ts](../../../tests/e2e/phase3/tab-content.spec.ts)
  - [tests/e2e/phase3/feedback-flow.spec.ts](../../../tests/e2e/phase3/feedback-flow.spec.ts)
  - [tests/e2e/phase3/editing-and-visibility.spec.ts](../../../tests/e2e/phase3/editing-and-visibility.spec.ts)

## Stage 5 — DM Requests Cleanup

Target issues:

- F-SR-01, F-SR-02.

Primary code areas:

- [src/features/resourcing/components/ResourcingRequestsWorkspace.tsx](../../../src/features/resourcing/components/ResourcingRequestsWorkspace.tsx)
- [src/features/resourcing/schemas/request-form.schema.ts](../../../src/features/resourcing/schemas/request-form.schema.ts)
- [src/app/routes.ts](../../../src/app/routes.ts)

Plan:

- Add link to internal candidate profile.
- Per agreement, remove End Date vs Duration duplication or formalize dual-field behavior in copy/validation.

Verification:

- Update:
  - [tests/e2e/phase4/dm-request-creation.spec.ts](../../../tests/e2e/phase4/dm-request-creation.spec.ts)
  - [tests/e2e/phase4/dm-candidate-review.spec.ts](../../../tests/e2e/phase4/dm-candidate-review.spec.ts)

## Stage 6 — Dashboard UX Harmonization

Target issues:

- U-D-01..U-D-06.

Primary code areas:

- [src/app/navigation.ts](../../../src/app/navigation.ts)
- [src/app/layouts/app-layout/AppLayout.tsx](../../../src/app/layouts/app-layout/AppLayout.tsx)
- [src/features/dashboard/components/dashboard-quick-links/DashboardQuickLinks.tsx](../../../src/features/dashboard/components/dashboard-quick-links/DashboardQuickLinks.tsx)
- [src/features/dashboard/components/dashboard-action-items-list/DashboardActionItemsList.tsx](../../../src/features/dashboard/components/dashboard-action-items-list/DashboardActionItemsList.tsx)

Plan:

- Remove duplicates and inconsistencies between top nav and quick links.
- Align labels/copy/visual hierarchy/status tones.
- Decide the fate of the Assignee line for "my action items".

Verification:

- Run/update:
  - [tests/e2e/phase2/dashboard.spec.ts](../../../tests/e2e/phase2/dashboard.spec.ts)
  - [tests/e2e/phase2/routing-guards.spec.ts](../../../tests/e2e/phase2/routing-guards.spec.ts)
  - [tests/e2e/phase2/accessibility.spec.ts](../../../tests/e2e/phase2/accessibility.spec.ts)

## Stage 7 — Performance And Large-Scope Backlog

Target issues:

- B-01, U-S-01, U-D-04, F-EP-05.

Plan:

- Prepare separate wave-based implementation:
  - query optimization for subordinates (debounce/query strategy/cache-key policy),
  - pagination strategy,
  - action items CRUD (large feature wave).
- Run this stage as separate PRs due to high regression risk.

Primary code areas:

- [src/pages/subordinates-page/SubordinatesPage.tsx](../../../src/pages/subordinates-page/SubordinatesPage.tsx)
- [src/features/people/hooks/use-subordinates-page-state.ts](../../../src/features/people/hooks/use-subordinates-page-state.ts)
- [src/lib/query/query-keys.ts](../../../src/lib/query/query-keys.ts)
- [src/features/dashboard](../../../src/features/dashboard)
- [src/pages/employee-profile-page/EmployeeProfilePage.tsx](../../../src/pages/employee-profile-page/EmployeeProfilePage.tsx)

Verification:

- Extended perf + regression run for phase2/phase3.

## Verification Strategy Per Stage

- Per-stage gates:
  - `npm run build`
  - `npm run lint`
  - `npm run format:check`
  - targeted `npm run test:e2e -- <relevant spec files>`
- Milestone gates (after Stage 3 and after Stage 6):
  - `npm run test:e2e -- tests/e2e/phase1 tests/e2e/phase2 tests/e2e/phase3 tests/e2e/phase4 tests/e2e/phase5`
- Manual checkpoints:
  - update [tests/test_reports/phase5/manual-testing-results.md](../../../tests/test_reports/phase5/manual-testing-results.md) with statuses `Open / Fixed / Won't Fix / Needs Product Decision`.

## Delivery Model (PR Sequence)

- PR-1: Stage 1 (Custom Lists core).
- PR-2: Stage 2 (Shared profile integrity).
- PR-3: Stage 3 + Stage 5 (Incoming + DM requests).
- PR-4: Stage 4 (Employee profile data/presentation).
- PR-5: Stage 6 (Dashboard UX harmonization).
- PR-6+: Stage 7 backlog slices (perf/action-items CRUD).

This sequence minimizes cross-feature conflicts, keeps each PR reviewable, and provides clear checkpoints for QA re-test against the original manual report.

## Stage Checklist

Current engineering status: code fixes are complete for Stages 0-6, Stage 7 code is complete except B-01 verification, and all e2e assertion updates are intentionally deferred to a separate commit.

| Stage | Scope                                                                                             | Status  |
| ----- | ------------------------------------------------------------------------------------------------- | ------- |
| 0     | Triage: confirm status of all 31 issues (bug/expected/decision/follow-up) and lock decision gates | Pending |
| 1     | F-CL-01..04: field lifecycle, usage filter/column/both, risk consistency, recipient flow          | Pending |
| 2     | F-EP-07..09: optional sections + active-link policy                                               | Pending |
| 3     | F-IR-01, U-IR-01: incoming requests behavior per product decision                                 | Pending |
| 4     | F-EP-01/02/03/06, U-EP-01, (optional) F-EP-04 per triage                                          | Pending |
| 5     | F-SR-01, F-SR-02: schema and e2e updates                                                          | Pending |
| 6     | U-D-01..06: top nav and quick links sync                                                          | Pending |
| 7     | B-01, U-S-01, U-D-04, F-EP-05 (Action Items CRUD) — separate PRs                                  | Pending |
