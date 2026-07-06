# Phase 4 Resourcing E2E Implementation Plan

## Purpose

This document is the implementation plan for `.planning/phases/phase-4-resourcing/SRS.md`. It translates the Phase 4 SRS into an execution-ready sequence for delivering the full resourcing E2E journey.

The implementation must follow:

- `AGENTS.md`
- `.planning/PROJECT.md`
- `docs/architecture/project-structure.md`
- `docs/architecture/component-structure.md`
- `docs/architecture/page-structure.md`
- `docs/architecture/state-and-rendering.md`
- `docs/architecture/shared-ui.md`
- `docs/architecture/feature-rules.md`
- `docs/architecture/ux-requirements.md`
- `docs/architecture/ux-behavior.md`
- `docs/architecture/data-models.md`
- `.planning/phases/phase-4-resourcing/SRS.md`
- `.planning/phases/phase-4-resourcing/VALIDATION.md`
- `.planning/phases/phase-4-resourcing/phase-4-test-plan.md`
- `.planning/phases/phase-4-resourcing/UX-FLOW.md`

Phase 4 must implement resourcing E2E + profile sharing + assignment history write only. It must not implement deferred Phase 5 custom list workflows or FR-AH-004 dedicated Assignments section.

## Implementation Defaults And Decisions

| Area                        | Decision                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Resourcing feature location | Use `src/features/resourcing/` for requests, proposals, decisions, warnings.                            |
| Profile sharing location    | Use `src/features/profile-sharing/` for generation sheet and public view.                               |
| Page ownership              | Keep pages thin in `src/pages/resourcing-*-page/` and `src/pages/shared-profile-page/`.                 |
| Request form container      | Sheet (match Phase 3 Add Feedback pattern).                                                             |
| Request detail layout       | Master-detail per UX-FLOW §2: DM 55/45, UM 40/60. No detail routes.                                     |
| New Request submit          | Single Submit button (POST + PATCH Submitted in one mutation). Demo happy path: 2 clicks.               |
| Public shared profile route | `/shared/:token` outside AppLayout; no role switcher.                                                   |
| Allocation warning          | `currentAllocation = 100 - availabilityPercent`; warn when `currentAllocation + workloadPercent > 100`. |
| Assignment history write    | MSW creates records on approve/reject/withdraw PATCH (not client-only).                                 |
| Shared profile entry points | Candidate proposal panel and profile header button.                                                     |
| Candidate warning logic     | `src/features/resourcing/utils/candidate-warnings.ts` per feature-rules.                                |
| Mutation pattern            | `useMutation` with targeted invalidation (requests, proposals, assignment history, shared profile).     |
| Seed determinism            | Keep `faker.seed(20260625)` unchanged and use stable generated IDs.                                     |
| Shared primitives           | Add missing generic primitives before feature usage (`checkbox`, `dialog`, `warning-badge`).            |
| Dependencies                | Do not add npm dependencies unless strictly required and approved.                                      |

## Step-By-Step Implementation Plan

### 1. Add Required Shared UI Primitives

Audit and close shared UI gaps before resourcing UI work.

Implementation requirements:

- Evaluate inventory in `docs/architecture/shared-ui.md`.
- Add missing primitives required by Phase 4 SRS:
  - `src/shared/ui/checkbox`
  - `src/shared/ui/dialog` (ConfirmDialog pattern)
  - `src/shared/ui/warning-badge`
- Reuse existing primitives: `sheet`, `textarea`, `toast`, `status-pill`, `data-table`, `select`, `input`, `button`, async states.
- Keep primitives app-agnostic and typed.
- Update shared UI inventory when new primitives are added.

Acceptance checks:

- No duplicated generic control styling in feature/page files.
- ConfirmDialog, sheets, and checkboxes are keyboard operable with visible focus.
- Warning badges render warning/danger tones with text labels.

### 2. Align Types And Seed Data

Establish type contracts and demo seed before handlers.

Implementation requirements:

- Update `src/types/assignment-history.ts`:
  - Add `proposedById`
  - Add `'Proposed'` to status enum
  - Add optional `requestTitle` for display
- Add seed modules:
  - `src/mocks/data/candidate-proposals.ts` (proposals for `request-003`)
  - `src/mocks/data/shared-profiles.ts` (in-memory store)
- Ensure demo warning candidates exist (low availability subordinate, leave overlap, High/Critical risk link).
- Keep `faker.seed(20260625)` unchanged.

Acceptance checks:

- Types compile against `data-models.md`.
- Demo requests `request-001`, `request-003`, `request-004` usable in tests.

### 3. Extend API Client And Query Key Boundary

Prepare typed write/read boundaries before feature modules.

Implementation requirements:

- Extend `src/lib/query/query-keys.ts` with:
  - `resourcingRequest(id)`
  - `candidateProposals(requestId)`
  - `sharedProfile(token)`
- Define mutation invalidation rules:
  - Request create/submit/cancel → invalidate `resourcingRequests`, `resourcingRequest`
  - Proposal submit → invalidate `candidateProposals`, `resourcingRequest`, `resourcingRequests`
  - Approve/reject/withdraw → invalidate `candidateProposals`, `resourcingRequest`, `assignmentHistory(employeeId)`
  - Shared profile create → invalidate `sharedProfile(token)` if cached

Acceptance checks:

- API client supports all Phase 4 write endpoints without direct mock imports in UI.
- Query hooks use query key helpers consistently.

### 4. Add MSW Write Handlers

Close mock gaps required by SRS §7.2.

Implementation requirements:

- Extend `src/mocks/handlers.ts` with:
  - `GET /api/resourcing/requests/:id`
  - `POST /api/resourcing/requests`
  - `PATCH /api/resourcing/requests/:id`
  - `GET /api/resourcing/requests/:id/candidates`
  - `POST /api/candidate-proposals`
  - `PATCH /api/candidate-proposals/:id` (approve/reject/withdraw + assignment history write)
  - `POST /api/shared-profiles`
  - `GET /api/shared-profiles/:token`
- Preserve existing `GET /api/resourcing/requests` read handler.
- Keep in-memory mutation behavior deterministic within session.

Acceptance checks:

- All Phase 4 endpoints respond with typed data.
- Assignment history records created on decision PATCH.

### 5. Implement Candidate Warning Utility

Isolate business logic before UI integration.

Implementation requirements:

- Create `src/features/resourcing/utils/candidate-warnings.ts`.
- Input: `Person`, `ScheduledLeave[]`, `ResourcingRequest`, optional current risk level.
- Output: `CandidateWarning[]` with type, tone, message per SRS §11.6 and ux-behavior §5.6.
- Allocation: `100 - availabilityPercent + workloadPercent > 100`.
- Leave overlap: scheduled leave date range overlaps request start/end.
- Risk: level is High or Critical.

Acceptance checks:

- Utility is pure and unit-testable.
- Components render warnings from utility output only.

### 6. Implement DM Resourcing Requests Page

Replace placeholder at `/resourcing/requests`.

Implementation requirements:

- Expand `src/features/resourcing/` with API wrappers, hooks, and components:
  - `RequestsTable`, `RequestFormSheet`, `RequestDetailPanel`, `CandidateReviewList`
- Upgrade `ResourcingRequestsPage` to master-detail compose.
- Implement New Request sheet with all required fields and inline validation.
- Implement submit (Draft → Submitted) and cancel (Draft/Submitted → Cancelled) flows.
- Implement candidate review when status is Candidates Proposed (approve/reject).

Acceptance checks:

- FR-RR-001–007 and AC-RR-001–004 met.
- Demo Scenario 4 demonstrable.

### 7. Implement UM Incoming Queue And Proposal Panel

Replace placeholder at `/resourcing/incoming`.

Implementation requirements:

- Add `IncomingQueueTable`, `CandidateProposalPanel`, `CandidateRow` components.
- Upgrade `ResourcingIncomingPage` to queue + proposal panel compose.
- Employee browser loads unit subordinates via existing people query.
- Wire warnings from `candidate-warnings.ts` into candidate rows.
- Implement fit summary, external URL, shared profile generation per candidate.
- Implement submit candidates (ConfirmDialog) and withdraw flows.

Acceptance checks:

- FR-CP-001–012 and AC-CP-001–004 met.
- Warnings visible and non-blocking.
- Demo Scenario 5 demonstrable.

### 8. Implement Profile Sharing And Public Route

Deliver generation and public token view.

Implementation requirements:

- Create `src/features/profile-sharing/` module.
- Implement `GenerateSharedProfileSheet` with section checkboxes (sensitive off by default).
- Add `getSharedProfilePagePath(token)` to `routes.ts`.
- Register `/shared/:token` in `router.tsx` outside AppLayout.
- Create `SharedProfilePage` composing `SharedProfileSections`.
- Integrate generation into candidate proposal panel and `ProfileHeader`.

Acceptance checks:

- FR-PS-001–007 and AC-PS-001–004 met.
- Public view requires no login.

### 9. Wire Approve/Reject And Assignment History Write

Complete decision flow and history visibility.

Implementation requirements:

- DM approve: optional note, one approval per request (AS-009).
- DM reject: required reason, blocks when empty.
- MSW PATCH creates assignment history with request title, status, feedback/rejection reason.
- Invalidate `assignmentHistory(employeeId)` after decision.
- Verify new records appear on Phase 3 Resourcing History tab.

Acceptance checks:

- FR-CD-001–009 and AC-CD-001–004 met.
- FR-AH-001–003 and AC-AH-001–004 met.
- Demo Scenario 6 demonstrable.

### 10. Add Profile Header Generate Shared Profile Button

Close Phase 3 deferred item.

Implementation requirements:

- Add "Generate Shared Profile" action to `ProfileHeader` (UM managerial view only).
- Reuse `GenerateSharedProfileSheet` from profile-sharing feature.

Acceptance checks:

- AC-PS-001 satisfied from profile header entry point.

### 11. Finalize Planning Handoff And Validation Artifacts

Record implementation status and QA-ready guidance.

Implementation requirements:

- Update `.planning/STATE.md` with Phase 4 implementation status.
- Update `.planning/phases/phase-4-resourcing/STATUS.md`.
- Ensure `VALIDATION.md` maps to SRS and test plan checks.
- Add Playwright specs under `tests/e2e/phase4/` and fixture `phase4-data.ts`.

Acceptance checks:

- Ivan can execute validation without extra requirement interpretation.
- Deferred Phase 5 scope is explicit.

## Data, Model, And API Contracts

See SRS §11 for full payload shapes.

### Core Phase 4 Endpoints

| Method | Endpoint                                  | Primary phase usage                   |
| ------ | ----------------------------------------- | ------------------------------------- |
| GET    | `/api/resourcing/requests`                | DM list + UM queue                    |
| GET    | `/api/resourcing/requests/:id`            | Request detail                        |
| POST   | `/api/resourcing/requests`                | DM create Draft                       |
| PATCH  | `/api/resourcing/requests/:id`            | Submit, cancel, status                |
| GET    | `/api/resourcing/requests/:id/candidates` | Proposal list for review              |
| POST   | `/api/candidate-proposals`                | UM batch submit                       |
| PATCH  | `/api/candidate-proposals/:id`            | Approve, reject, withdraw + history   |
| POST   | `/api/shared-profiles`                    | Generate link                         |
| GET    | `/api/shared-profiles/:token`             | Public shared profile view            |
| GET    | `/api/people/:id/assignment-history`      | Read history (invalidate after write) |

## Routing And UI Behavior

| User action                        | Expected behavior                          |
| ---------------------------------- | ------------------------------------------ |
| DM clicks New Request              | Sheet opens with required fields           |
| DM submits valid request           | Status Submitted; appears in UM queue      |
| UM opens incoming request          | Proposal panel with employee browser       |
| UM selects candidate with warnings | Warnings show inline; submit still enabled |
| UM generates shared profile        | Link created; copy toast on copy           |
| UM submits candidates              | ConfirmDialog → status Candidates Proposed |
| DM approves one candidate          | Request Approved; history updated          |
| DM rejects without reason          | Validation blocks submit                   |
| UM opens employee profile history  | New assignment history record visible      |
| Public opens `/shared/:token`      | Selected sections only; no app shell       |

## Validation Checklist

Run before considering Phase 4 implementation complete:

```bash
npm run build
npm run lint
npm run format:check
```

Manual validation checks:

- DM: create, submit, cancel requests
- UM: propose with warnings, shared profile, external URL, submit, withdraw
- DM: approve one, reject with reason
- Assignment history on profile after decision
- Demo Scenarios 4, 5, 6 end-to-end

Optional e2e validation:

```bash
npx playwright install chromium
npm run test:e2e -- tests/e2e/phase4
```

## Assumptions And Non-Goals

Assumptions:

- Phase 3 profile and Resourcing History tab are stable and reused.
- BRD v1.1, Phase 4 SRS, and decision log are approved source of truth.
- Validation is desktop-only (1280px+).
- Carlos approves SRS scope before implementation starts.

Non-goals:

- Do not implement custom list builder/sharing UX in Phase 4.
- Do not implement FR-AH-004 dedicated Assignments section.
- Do not add backend/database/auth/integration components.
- Do not introduce unrelated refactors outside Phase 4 scope.
