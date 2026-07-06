# Software Requirements Specification

# Phase 4 - Resourcing E2E Flow

## 1. Document Control

| Field                | Value                                                          |
| -------------------- | -------------------------------------------------------------- |
| Product              | People Management & Resourcing MVP                             |
| Phase                | Phase 4 - Resourcing E2E Flow                                  |
| Document type        | Software Requirements Specification                            |
| Status               | Approved for implementation — Carlos Nunes, 2026-07-06         |
| Implementation owner | Volodymyr                                                      |
| QA owner             | Ivan                                                           |
| Product / BA owner   | Carlos                                                         |
| Source BRD           | `docs/requirements/# Business Requirements Document.md` (v1.1) |
| Phase plan           | `.planning/phases/phase-4-resourcing/PLAN.md`                  |
| Phase test plan      | `.planning/phases/phase-4-resourcing/phase-4-test-plan.md`     |
| Phase UX flow        | `.planning/phases/phase-4-resourcing/UX-FLOW.md`               |
| Phase validation     | `.planning/phases/phase-4-resourcing/VALIDATION.md`            |

## 2. Purpose

This SRS translates BRD v1.1 and the Phase 4 plan into implementation-ready software requirements for the full resourcing E2E increment.

Phase 4 must deliver DM request creation/submission/cancellation, UM incoming queue and candidate proposal with warnings and shared profiles, DM candidate approve/reject, and assignment history write on decision. It must stay frontend-only and desktop-focused.

Phase 4 is not expected to deliver custom list builder UX, FR-AH-004 dedicated Assignments section, or profile sharing polish beyond MVP generation and public view.

## 3. Source Inputs

| Source                                                     | Used for                                          |
| ---------------------------------------------------------- | ------------------------------------------------- |
| BRD FR-RR-001 through FR-RR-007                            | DM request creation requirements                  |
| BRD FR-CP-001 through FR-CP-012                            | UM candidate proposal requirements                |
| BRD FR-CD-001 through FR-CD-009                            | DM candidate review requirements                  |
| BRD FR-PS-001 through FR-PS-007                            | Profile sharing requirements                      |
| BRD FR-AH-001 through FR-AH-003, FR-AH-005, FR-AH-006      | Assignment history write and display rules        |
| BRD AC-RR-001 through AC-RR-004                            | Request acceptance criteria                       |
| BRD AC-CP-001 through AC-CP-004                            | Proposal acceptance criteria                      |
| BRD AC-CD-001 through AC-CD-004                            | Review acceptance criteria                        |
| BRD AC-PS-001 through AC-PS-004                            | Shared profile acceptance criteria                |
| BRD AC-AH-001 through AC-AH-004                            | Assignment history acceptance criteria            |
| BRD BR-004, BR-010, BR-011, BR-012 through BR-014          | Rejection reason, cancel, withdraw, warning rules |
| BRD AS-009, D-1                                            | One approval per request                          |
| `.planning/phases/phase-4-resourcing/PLAN.md`              | Deliverables, mock gaps, feature boundaries       |
| `.planning/phases/phase-4-resourcing/phase-4-test-plan.md` | P4-\* test traceability                           |
| `.planning/phases/phase-4-resourcing/UX-FLOW.md`           | Layouts, click budgets, interaction contracts     |
| `docs/architecture/ux-requirements.md`                     | Screen content for resourcing and shared profile  |
| `docs/architecture/ux-behavior.md`                         | Interaction sequences §3.5–3.10, copy §5.3–5.6    |
| `docs/architecture/data-models.md`                         | Type-level data shapes                            |
| `docs/architecture/feature-rules.md`                       | Feature ownership and candidate warning placement |
| `docs/architecture/component-structure.md`                 | Async state and composition rules                 |
| `docs/architecture/shared-ui.md`                           | Shared primitive ownership                        |
| `docs/architecture/state-and-rendering.md`                 | Query keys and mutation invalidation              |

## 4. Phase Objective

Deliver a desktop-first resourcing E2E experience where:

- DM can create, submit, and cancel resourcing requests.
- Submitted requests appear immediately in the assigned UM incoming queue.
- UM can browse unit employees, select candidates, see non-blocking warnings, generate shared profiles, and submit proposals.
- DM can review proposed candidates, open shared profile links, approve one candidate per request, and reject others with a required reason.
- Assignment history records are created on decision and appear on the employee Resourcing History tab.
- Demo Scenarios 4, 5, and 6 pass end-to-end.

## 5. Scope

### 5.1 In Scope

1. Align `assignment-history.ts` type with `data-models.md` (add `proposedById`, `'Proposed'` status, optional `requestTitle`).
2. Add seed modules: `candidate-proposals.ts`, `shared-profiles.ts`.
3. Add MSW write handlers for requests, proposals, shared profiles, and assignment history.
4. Extend query keys for single request, candidate proposals, and shared profile by token.
5. Add shared UI primitives: `checkbox`, `dialog`, `warning-badge` (if missing).
6. Implement `src/features/resourcing/` and `src/features/profile-sharing/` modules.
7. Replace placeholder pages at `/resourcing/requests` and `/resourcing/incoming`.
8. Add public route `/shared/:token` outside AppLayout.
9. Add "Generate Shared Profile" to managerial profile header.
10. Preserve Phase 1–3 role guards; keep loading, empty, and error states per screen.

### 5.2 Out of Scope

- Custom list builder and sharing UX (Phase 5).
- FR-AH-004 UM Resourcing > Assignments dedicated section (Phase 5).
- Profile sharing UX polish beyond MVP (Phase 5).
- Backend, database, auth, file upload, or external integrations.
- Mobile/tablet responsive validation.

## 6. Users And Access Context

### 6.1 Supported Roles In Phase 4

| Role                 | Route                  | Access                                                 |
| -------------------- | ---------------------- | ------------------------------------------------------ |
| Sales / Delivery Mgr | `/resourcing/requests` | Create, submit, cancel own requests; review candidates |
| Unit Manager         | `/resourcing/incoming` | View assigned queue; propose and withdraw candidates   |
| Public (no login)    | `/shared/:token`       | View shared profile sections selected by UM            |
| Employee             | —                      | No resourcing routes; redirect to `/my-profile`        |

### 6.2 Role Access Rules

- `/resourcing/requests` remains DM-only (`RoleRoute` guard).
- `/resourcing/incoming` remains UM-only.
- `/shared/:token` has no role guard and no AppLayout shell.
- UM and DM cannot access each other's resourcing routes (existing guard pattern).

## 7. Functional Requirements

### 7.1 Mock Data And Types

| ID         | Requirement                                                                                             | Source  |
| ---------- | ------------------------------------------------------------------------------------------------------- | ------- |
| SRS-F4-001 | `assignment-history.ts` shall include `proposedById`, status `'Proposed'`, and optional `requestTitle`. | PLAN §0 |
| SRS-F4-002 | `candidate-proposals.ts` shall seed proposals for `request-003`; none for `request-001`.                | PLAN §1 |
| SRS-F4-003 | `shared-profiles.ts` shall support in-memory create via POST.                                           | PLAN §1 |
| SRS-F4-004 | Faker seed shall remain `faker.seed(20260625)`.                                                         | PLAN §1 |
| SRS-F4-005 | Demo requests: `request-001` (Submitted), `request-003` (Candidates Proposed), `request-004` (Draft).   | PLAN §1 |

### 7.2 Mock API Endpoints

| ID         | Requirement                                                                                       | Source                   |
| ---------- | ------------------------------------------------------------------------------------------------- | ------------------------ |
| SRS-F4-010 | MSW shall expose `GET /api/resourcing/requests/:id`.                                              | PLAN §2                  |
| SRS-F4-011 | MSW shall expose `POST /api/resourcing/requests` creating Draft status.                           | FR-RR-001                |
| SRS-F4-012 | MSW shall expose `PATCH /api/resourcing/requests/:id` for submit, cancel, and status transitions. | FR-RR-003, FR-RR-006     |
| SRS-F4-013 | MSW shall expose `GET /api/resourcing/requests/:id/candidates`.                                   | FR-CD-001                |
| SRS-F4-014 | MSW shall expose `POST /api/candidate-proposals` batch submit.                                    | FR-CP-011                |
| SRS-F4-015 | MSW shall expose `PATCH /api/candidate-proposals/:id` for approve, reject, withdraw.              | FR-CD-004–008, FR-CP-012 |
| SRS-F4-016 | MSW shall expose `POST /api/shared-profiles` with `{ personId, allowedSections }`.                | FR-PS-001–004            |
| SRS-F4-017 | MSW shall expose `GET /api/shared-profiles/:token` returning filtered profile sections.           | FR-PS-005–007            |
| SRS-F4-018 | Approve/reject/withdraw PATCH shall create assignment history records in MSW.                     | FR-AH-001–002            |

### 7.3 Query Keys

| ID         | Requirement                                                                                                | Source  |
| ---------- | ---------------------------------------------------------------------------------------------------------- | ------- |
| SRS-F4-020 | Query keys shall include `resourcingRequest(id)`, `candidateProposals(requestId)`, `sharedProfile(token)`. | PLAN §3 |
| SRS-F4-021 | Mutations shall invalidate affected request, proposal, assignment history, and shared profile keys.        | PLAN §3 |

### 7.4 DM Request Creation (`/resourcing/requests`)

| ID         | Requirement                                                                                                                      | Source                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| SRS-F4-110 | DM shall create a new resourcing request via "New Request" opening a Sheet form.                                                 | FR-RR-001, AC-RR-001                          |
| SRS-F4-111 | Form shall include all required fields per FR-RR-002; optional client name and business reason.                                  | FR-RR-002                                     |
| SRS-F4-112 | Single **Submit** click shall create and submit the request (internal POST + PATCH Submitted); block when required fields empty. | FR-RR-003, FR-RR-007, AC-RR-004, UX-FLOW §4.1 |
| SRS-F4-113 | Submitted request shall appear in assigned UM incoming queue immediately.                                                        | FR-RR-004, AC-RR-003                          |
| SRS-F4-114 | DM shall see all requests they created in My Requests table.                                                                     | FR-RR-005                                     |
| SRS-F4-115 | DM shall cancel Draft or Submitted requests; Cancel action hidden for other statuses.                                            | FR-RR-006, BR-010                             |
| SRS-F4-116 | DM page shall use master-detail layout (table + detail panel); no separate detail route.                                         | UX-FLOW §2.1                                  |

### 7.5 UM Candidate Proposal (`/resourcing/incoming`)

| ID         | Requirement                                                                                          | Source               |
| ---------- | ---------------------------------------------------------------------------------------------------- | -------------------- |
| SRS-F4-210 | UM shall open assigned requests and view requirements summary.                                       | FR-CP-001            |
| SRS-F4-211 | UM shall browse unit employees with availability, skills, grade, English level, risk level, status.  | FR-CP-002, AC-CP-001 |
| SRS-F4-212 | UM shall select one or more internal employees as candidates.                                        | FR-CP-003            |
| SRS-F4-213 | UM shall add one external candidate via valid URL.                                                   | FR-CP-004, AC-CP-003 |
| SRS-F4-214 | UM shall add fit summary textarea per internal candidate.                                            | FR-CP-005            |
| SRS-F4-215 | Warning utils in `candidate-warnings.ts` shall compute allocation, leave overlap, and risk warnings. | FR-CP-006–008        |
| SRS-F4-216 | Warnings shall render inline per candidate row and not block submission.                             | FR-CP-009            |
| SRS-F4-217 | UM shall generate shared profile per internal candidate before submit.                               | FR-CP-010            |
| SRS-F4-218 | Submit shall change request status to Candidates Proposed after ConfirmDialog.                       | FR-CP-011, AC-CP-004 |
| SRS-F4-219 | UM shall withdraw proposed candidate before DM decision.                                             | FR-CP-012, BR-011    |
| SRS-F4-220 | UM page shall use master-detail layout (queue table + proposal panel); no separate detail route.     | UX-FLOW §2.2         |
| SRS-F4-221 | Employee selection shall use row checkbox; warnings render on candidate card on add.                 | UX-FLOW §4.2         |

### 7.6 Profile Sharing

| ID         | Requirement                                                                                    | Source                          |
| ---------- | ---------------------------------------------------------------------------------------------- | ------------------------------- |
| SRS-F4-310 | UM shall generate shared profile from proposal panel and profile header.                       | FR-PS-001, FR-CP-010, AC-PS-001 |
| SRS-F4-311 | Generation sheet shall show per-section checkboxes; sensitive sections unchecked by default.   | FR-PS-002–003, AC-PS-002        |
| SRS-F4-312 | Default included: name, position, grade, skills, English level, availability, project history. | FR-PS-006                       |
| SRS-F4-313 | Generated link shall be accessible at `/shared/:token` without login.                          | FR-PS-004–007, AC-PS-003–004    |
| SRS-F4-314 | Public view shall display only explicitly selected sections.                                   | FR-PS-005                       |

### 7.7 DM Candidate Review

| ID         | Requirement                                                                        | Source                                      |
| ---------- | ---------------------------------------------------------------------------------- | ------------------------------------------- |
| SRS-F4-410 | DM shall open Candidates Proposed request and see all proposed candidates.         | FR-CD-001, AC-CD-001                        |
| SRS-F4-411 | Internal candidates shall show shared profile link; external shall show URL.       | FR-CD-002–003                               |
| SRS-F4-412 | DM shall approve one candidate per request; optional note allowed.                 | FR-CD-004–005, FR-CD-009, AC-CD-002, AS-009 |
| SRS-F4-413 | After approval, Approve action shall not appear for remaining Proposed candidates. | FR-CD-004, AS-009                           |
| SRS-F4-414 | DM shall reject with required written reason; empty reason blocks submit.          | FR-CD-006–007, AC-CD-003                    |
| SRS-F4-415 | Reject with reason shall record status Rejected and reason on candidate.           | AC-CD-004                                   |
| SRS-F4-416 | Rejecting all with no approval shall change request status to Rejected.            | FR-CD-008                                   |

### 7.8 Assignment History

| ID         | Requirement                                                                                                                   | Source                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| SRS-F4-510 | Every approve/reject/withdraw decision shall create assignment history record at decision time.                               | FR-AH-001                    |
| SRS-F4-511 | Record shall include request title, candidate type, proposed date, proposed by, decision date, decision by, status, feedback. | FR-AH-002                    |
| SRS-F4-512 | Record shall appear on employee Resourcing History tab (Phase 3 read path).                                                   | FR-AH-003, AC-AH-001         |
| SRS-F4-513 | Assignment history shall remain read-only; never mixed with project history.                                                  | FR-AH-005–006, AC-AH-003–004 |

### 7.9 Feature Ownership

| ID         | Requirement                                                                     | Source              |
| ---------- | ------------------------------------------------------------------------------- | ------------------- |
| SRS-F4-520 | Resourcing domain logic shall live under `src/features/resourcing/`.            | feature-rules       |
| SRS-F4-521 | Profile sharing logic shall live under `src/features/profile-sharing/`.         | feature-rules       |
| SRS-F4-522 | Candidate warning logic shall live in `resourcing/utils/candidate-warnings.ts`. | feature-rules       |
| SRS-F4-523 | Route pages shall remain thin composition layers.                               | component-structure |

## 8. UX Interaction Requirements

Each row: Trigger | Component | API | Success | Failure

### 8.1 Generate Shared Profile (`ux-behavior` §3.5)

| ID          | Trigger                             | Component             | API                         | Success                                                                  | Failure                                     |
| ----------- | ----------------------------------- | --------------------- | --------------------------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| SRS-UX4-001 | User clicks Generate Shared Profile | `Sheet`               | none                        | Sheet opens with section checklist; name/position/grade disabled checked | —                                           |
| SRS-UX4-002 | User clicks Generate Link           | Button inline loading | `POST /api/shared-profiles` | Link shown; Copy Link + Done; info toast SRS-COPY4-011 on copy           | error toast SRS-COPY4-012; sheet stays open |
| SRS-UX4-003 | User closes sheet before copy       | `Sheet`               | none                        | Link stored; re-open shows existing active link if present               | —                                           |

### 8.2 Submit Candidate Proposal (`ux-behavior` §3.6)

| ID          | Trigger                       | Component      | API                                            | Success                                         | Failure                                   |
| ----------- | ----------------------------- | -------------- | ---------------------------------------------- | ----------------------------------------------- | ----------------------------------------- |
| SRS-UX4-010 | User clicks Submit Candidates | ConfirmDialog  | `POST /api/candidate-proposals` + status PATCH | Status Candidates Proposed; toast SRS-COPY4-012 | toast SRS-COPY4-013; panel stays editable |
| SRS-UX4-011 | No candidates present         | Inline error   | none                                           | —                                               | SRS-COPY4-020 below candidates section    |
| SRS-UX4-012 | Warnings present              | `WarningBadge` | none                                           | Warnings visible inline; submit still enabled   | —                                         |

### 8.3 Approve Candidate (`ux-behavior` §3.7)

| ID          | Trigger               | Component             | API                                  | Success                                                   | Failure                               |
| ----------- | --------------------- | --------------------- | ------------------------------------ | --------------------------------------------------------- | ------------------------------------- |
| SRS-UX4-020 | User clicks Approve   | `Sheet`               | none                                 | Sheet opens with optional note field                      | —                                     |
| SRS-UX4-021 | User confirms Approve | Button inline loading | `PATCH /api/candidate-proposals/:id` | Candidate Approved; request Approved; toast SRS-COPY4-014 | toast SRS-COPY4-015; sheet stays open |

### 8.4 Reject Candidate (`ux-behavior` §3.8)

| ID          | Trigger              | Component             | API                                  | Success                                          | Failure                               |
| ----------- | -------------------- | --------------------- | ------------------------------------ | ------------------------------------------------ | ------------------------------------- |
| SRS-UX4-030 | User clicks Reject   | `Sheet`               | none                                 | Sheet opens with required rejection reason field | —                                     |
| SRS-UX4-031 | Empty reason submit  | Inline validation     | none                                 | —                                                | SRS-COPY4-021 below reason field      |
| SRS-UX4-032 | User confirms Reject | Button inline loading | `PATCH /api/candidate-proposals/:id` | Candidate Rejected; toast SRS-COPY4-016          | toast SRS-COPY4-017; sheet stays open |

### 8.5 Cancel Resourcing Request (`ux-behavior` §3.9)

| ID          | Trigger                    | Component     | API                                  | Success                               | Failure             |
| ----------- | -------------------------- | ------------- | ------------------------------------ | ------------------------------------- | ------------------- |
| SRS-UX4-040 | User clicks Cancel Request | ConfirmDialog | `PATCH /api/resourcing/requests/:id` | Status Cancelled; toast SRS-COPY4-018 | toast SRS-COPY4-019 |

### 8.6 Withdraw Candidate (`ux-behavior` §3.10)

| ID          | Trigger              | Component     | API                                  | Success                               | Failure             |
| ----------- | -------------------- | ------------- | ------------------------------------ | ------------------------------------- | ------------------- |
| SRS-UX4-050 | User clicks Withdraw | ConfirmDialog | `PATCH /api/candidate-proposals/:id` | Status Withdrawn; toast SRS-COPY4-022 | toast SRS-COPY4-023 |

### 8.7 DM New Request Form

| ID          | Trigger                 | Component             | API                           | Success                             | Failure                                    |
| ----------- | ----------------------- | --------------------- | ----------------------------- | ----------------------------------- | ------------------------------------------ |
| SRS-UX4-060 | User clicks New Request | `Sheet`               | none                          | Form opens with all required fields | —                                          |
| SRS-UX4-061 | User submits valid form | Button inline loading | `POST` then `PATCH` Submitted | Request in table; toast success     | Inline validation per empty required field |

## 9. UI State Requirements

| ID          | Requirement                                                                       | Source           |
| ----------- | --------------------------------------------------------------------------------- | ---------------- |
| SRS-UI4-001 | Resourcing pages shall use Page-tier loading while requests load.                 | ux-behavior §1.1 |
| SRS-UI4-002 | Proposal panel shall use Section-tier loading for employee browser.               | ux-behavior §1.1 |
| SRS-UI4-003 | Request and candidate status pills shall use visual-theme tone mapping.           | visual-theme     |
| SRS-UI4-004 | Warnings shall use warning (amber) or danger (red) tone per ux-behavior §5.6.     | ux-behavior §5.6 |
| SRS-UI4-005 | ConfirmDialog required for cancel request, withdraw candidate, submit candidates. | ux-behavior §1.3 |
| SRS-UI4-006 | Mutations shall fire toast; query failures shall use inline ErrorState.           | ux-behavior §1.2 |
| SRS-UI4-007 | Empty states for DM no requests and UM no incoming per ux-behavior §5.1.          | ux-behavior §5.1 |
| SRS-UI4-008 | Shared profile invalid token shall show ErrorState per ux-behavior §5.1.          | ux-behavior §5.1 |

## 10. Copy Requirements

All strings verbatim from `ux-behavior.md` §5. Reference by ID in §8/§9.

### 10.1 Empty States

| ID            | Context                | Title                   | Description                                                       |
| ------------- | ---------------------- | ----------------------- | ----------------------------------------------------------------- |
| SRS-COPY4-001 | DM no requests         | "No requests yet"       | "Create your first resourcing request to get started."            |
| SRS-COPY4-002 | UM no incoming         | "No incoming requests"  | "Resourcing requests assigned to you will appear here."           |
| SRS-COPY4-003 | Shared profile invalid | "Profile not available" | "This shared profile link is no longer active or does not exist." |

### 10.2 Error States

| ID            | Context               | Title                     | Description                      |
| ------------- | --------------------- | ------------------------- | -------------------------------- |
| SRS-COPY4-010 | Requests load failure | "Could not load requests" | "Refresh the page to try again." |

### 10.3 Toast Messages

| ID            | Action               | Type    | Message                                                                |
| ------------- | -------------------- | ------- | ---------------------------------------------------------------------- |
| SRS-COPY4-011 | Link copied          | info    | "Link copied to clipboard."                                            |
| SRS-COPY4-012 | Generate failed      | error   | "Could not generate link. Try again."                                  |
| SRS-COPY4-013 | Candidates submitted | success | "Candidates submitted. Request status updated to Candidates Proposed." |
| SRS-COPY4-014 | Submission failed    | error   | "Submission failed. Your candidates were not saved. Try again."        |
| SRS-COPY4-015 | Candidate approved   | success | "[Name] approved. Assignment history updated."                         |
| SRS-COPY4-016 | Approval failed      | error   | "Could not record approval. Try again."                                |
| SRS-COPY4-017 | Candidate rejected   | success | "[Name] rejected."                                                     |
| SRS-COPY4-018 | Rejection failed     | error   | "Could not record rejection. Try again."                               |
| SRS-COPY4-019 | Request cancelled    | success | "Request cancelled."                                                   |
| SRS-COPY4-020 | Cancel failed        | error   | "Could not cancel the request. Try again."                             |
| SRS-COPY4-021 | Candidate withdrawn  | success | "Candidate withdrawn."                                                 |
| SRS-COPY4-022 | Withdraw failed      | error   | "Could not withdraw candidate. Try again."                             |

### 10.4 Confirm Dialog Copy

| ID            | Action             | Title                 | Description                                                                                                       | Cancel           | Confirm          |
| ------------- | ------------------ | --------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------- |
| SRS-COPY4-030 | Cancel request     | "Cancel request?"     | "This request will be cancelled and removed from the Unit Manager's queue. This cannot be undone."                | "Keep request"   | "Cancel request" |
| SRS-COPY4-031 | Withdraw candidate | "Withdraw candidate?" | "The proposed candidate will be removed from this request. The Sales / Delivery Manager will no longer see them." | "Keep candidate" | "Withdraw"       |
| SRS-COPY4-032 | Submit candidates  | "Submit candidates?"  | "The Sales / Delivery Manager will be notified that candidates have been proposed for this request."              | "Keep editing"   | "Submit"         |

### 10.5 Validation Messages

| ID            | Field            | Message                                                 |
| ------------- | ---------------- | ------------------------------------------------------- |
| SRS-COPY4-040 | Rejection reason | "A rejection reason is required."                       |
| SRS-COPY4-041 | External URL     | "Enter a valid URL (e.g. https://example.com/profile)." |
| SRS-COPY4-042 | Request title    | "Request title is required."                            |
| SRS-COPY4-043 | Required role    | "Required role is required."                            |
| SRS-COPY4-044 | Grade level      | "Grade level is required."                              |
| SRS-COPY4-045 | English level    | "English level is required."                            |
| SRS-COPY4-046 | Assigned UM      | "Assigned Unit Manager is required."                    |
| SRS-COPY4-047 | Workload %       | "Workload must be between 1 and 100."                   |
| SRS-COPY4-048 | No candidates    | "Add at least one candidate before submitting."         |

### 10.6 Candidate Warning Messages

| ID            | Warning          | Tone    | Message                                                               |
| ------------- | ---------------- | ------- | --------------------------------------------------------------------- |
| SRS-COPY4-050 | Allocation >100% | warning | "Allocation would reach [N]% — exceeds 100%."                         |
| SRS-COPY4-051 | Leave overlap    | warning | "Has scheduled leave overlapping the request period ([leave dates])." |
| SRS-COPY4-052 | High risk        | danger  | "Risk level is High."                                                 |
| SRS-COPY4-053 | Critical risk    | danger  | "Risk level is Critical."                                             |

## 11. Data Contracts

### 11.1 Create Resourcing Request Payload

```ts
export type CreateResourcingRequestPayload = {
  title: string
  projectName: string
  clientName?: string
  requiredRole: string
  requiredSkills: string[]
  gradeLevel: string
  englishLevel: string
  expectedCompensationLevel: string
  workloadPercent: number
  startDate: string
  endDate: string
  durationText: string
  assignedUnitManagerId: string
  priority: string
  businessReason?: string
  createdById: string
}
```

### 11.2 Patch Resourcing Request Payload

```ts
export type PatchResourcingRequestPayload = {
  status?: ResourcingRequestStatus
  // or full form fields for draft edit
}
```

### 11.3 Submit Candidate Proposals Payload

```ts
export type SubmitCandidateProposalsPayload = {
  requestId: string
  candidates: Array<{
    candidateType: 'Internal' | 'External'
    employeeId?: string
    externalProfileUrl?: string
    fitSummary: string
    sharedProfileId?: string
    proposedById: string
  }>
}
```

### 11.4 Patch Candidate Proposal Payload

```ts
export type PatchCandidateProposalPayload = {
  status: 'Approved' | 'Rejected' | 'Withdrawn'
  feedback?: string
  rejectionReason?: string
  reviewedById: string
}
```

### 11.5 Create Shared Profile Payload

```ts
export type CreateSharedProfilePayload = {
  personId: string
  allowedSections: SharedProfileSection[]
  createdById: string
}
```

### 11.6 Candidate Warning Output

```ts
export type CandidateWarning = {
  type: 'allocation' | 'leave-overlap' | 'risk'
  tone: 'warning' | 'danger'
  message: string
}
```

Allocation calculation: `currentAllocation = 100 - person.availabilityPercent`; warn when `currentAllocation + request.workloadPercent > 100`.

## 12. Page And Route Requirements

| Route                  | Helper                            | Allowed role | Page folder                           | Purpose                   |
| ---------------------- | --------------------------------- | ------------ | ------------------------------------- | ------------------------- |
| `/resourcing/requests` | `getResourcingRequestsPagePath()` | DM           | `src/pages/resourcing-requests-page/` | My Requests + review      |
| `/resourcing/incoming` | `getResourcingIncomingPagePath()` | UM           | `src/pages/resourcing-incoming-page/` | Incoming queue + proposal |
| `/shared/:token`       | `getSharedProfilePagePath(token)` | Public       | `src/pages/shared-profile-page/`      | Token-based profile view  |

## 13. Non-Functional Requirements

| ID          | Requirement                                            | Source     |
| ----------- | ------------------------------------------------------ | ---------- |
| SRS-NF4-001 | App remains frontend-only with mocked data boundaries. | BRD        |
| SRS-NF4-002 | Phase 4 UI validated for desktop at 1280px+ viewport.  | BRD AS-016 |
| SRS-NF4-003 | `npm run build` must pass.                             | PLAN AC    |
| SRS-NF4-004 | `npm run lint` must pass.                              | PLAN AC    |
| SRS-NF4-005 | `npm run format:check` must pass.                      | PLAN AC    |
| SRS-NF4-006 | Seed and API responses must be deterministic.          | PLAN §1    |
| SRS-NF4-007 | No backend or persistence dependencies introduced.     | Scope      |

## 14. Accessibility Requirements

| ID            | Requirement                                                               |
| ------------- | ------------------------------------------------------------------------- |
| SRS-A11Y4-001 | Resourcing pages shall have one `h1` per screen.                          |
| SRS-A11Y4-002 | ConfirmDialog and Sheet shall trap focus; Escape closes where specified.  |
| SRS-A11Y4-003 | Form fields shall have associated labels.                                 |
| SRS-A11Y4-004 | Validation errors shall be readable and associated with fields.           |
| SRS-A11Y4-005 | Warning badges shall include text labels (not color alone).               |
| SRS-A11Y4-006 | Data tables shall support keyboard row activation where row opens detail. |
| SRS-A11Y4-007 | Save/confirm buttons in loading state shall set `aria-busy="true"`.       |

## 15. Implementation Constraints

1. Keep route pages thin; resourcing logic in `src/features/resourcing/`, sharing in `src/features/profile-sharing/`.
2. Route helpers and registration remain in `src/app/routes.ts` and `src/app/router.tsx`.
3. Use TanStack Query for server-like data; Zustand only for role/persona and local UI state.
4. Candidate warning logic belongs in `candidate-warnings.ts`, not inline in components.
5. Assignment history writes happen in MSW handlers on decision PATCH.
6. Reuse shared UI primitives; update `shared-ui.md` when adding checkbox, dialog, warning-badge.
7. Keep faker seed fixed at `20260625`.
8. Do not implement Phase 5 custom list workflows in Phase 4.

## 16. Traceability Matrix

| SRS area           | BRD / plan                   | ux-behavior | P4 tests                 |
| ------------------ | ---------------------------- | ----------- | ------------------------ |
| DM request create  | FR-RR-001–007, AC-RR-001–004 | §3.9        | P4-RR01–RR06             |
| UM proposal        | FR-CP-001–012, AC-CP-001–004 | §3.6, §3.10 | P4-CP01–CP09, P4-W01–W04 |
| Warnings           | FR-CP-006–009, BR-012–014    | §3.6, §5.6  | P4-W01–W04               |
| Shared profile     | FR-PS-001–007, AC-PS-001–004 | §3.5        | P4-PS01–PS05             |
| DM review          | FR-CD-001–009, AC-CD-001–004 | §3.7–3.8    | P4-CD01–CD05             |
| Assignment history | FR-AH-001–003, AC-AH-001–004 | —           | P4-AH01–AH03             |
| Demo scenarios     | BRD §14 Scenarios 4–6        | —           | P4-D04–D06               |

## 17. Acceptance Criteria

### 17.1 Build / Lint / Format

- `npm run build` exits with code 0.
- `npm run lint` exits with code 0.
- `npm run format:check` exits with code 0.

### 17.2 DM Requests

1. New Request form validates required fields and submits to Submitted status.
2. Submitted request appears in UM incoming queue.
3. Cancel works for Draft/Submitted only.

### 17.3 UM Proposal

1. UM can select internal and external candidates.
2. All three warning types display when conditions met; submission not blocked.
3. Shared profile link generated per internal candidate.
4. Submit changes status to Candidates Proposed.

### 17.4 DM Review

1. DM sees candidates with shared profile link or external URL.
2. Approve one candidate updates request to Approved.
3. Reject without reason blocked; reject with reason recorded.

### 17.5 Assignment History

1. Decision creates record visible on employee Resourcing History tab.
2. Records are read-only.

### 17.6 Demo Scenarios

1. Scenario 4 (create request) passes end-to-end.
2. Scenario 5 (propose candidate) passes end-to-end.
3. Scenario 6 (approve/reject + history) passes end-to-end.

## 18. QA Validation Mapping

| Validation area    | Covered by SRS sections |
| ------------------ | ----------------------- |
| Build/lint/format  | §17.1, SRS-NF4-003–005  |
| DM requests        | §7.4, §8.5, §8.7, §17.2 |
| UM proposal        | §7.5, §8.2, §17.3       |
| Warnings           | §7.5, §10.6, §17.3      |
| Shared profile     | §7.6, §8.1, §17.3       |
| DM review          | §7.7, §8.3–8.4, §17.4   |
| Assignment history | §7.8, §17.5             |
| Demo scenarios     | §17.6                   |
| Copy verbatim      | §10                     |
| Accessibility      | §14                     |

## 19. Open Decisions

| Decision                      | Owner     | Resolution (Phase 4 default)                                   |
| ----------------------------- | --------- | -------------------------------------------------------------- |
| Request form container        | Volodymyr | Sheet (match Phase 3 Add Feedback pattern)                     |
| Request detail layout         | Volodymyr | Master-detail: table + side panel on same page                 |
| Allocation warning source     | Volodymyr | `100 - availabilityPercent + workloadPercent > 100`            |
| Assignment history write      | Volodymyr | MSW handler on proposal PATCH (approve/reject/withdraw)        |
| Shared profile entry points   | Carlos    | Both proposal panel and profile header (Phase 3 deferred item) |
| FR-AH-004 Assignments section | Carlos    | Defer to Phase 5; profile tab satisfies Scenario 6             |
| Profile sharing Phase 4 vs 5  | Carlos    | Phase 4 = full generation + public view; Phase 5 = polish only |

## 20. Deferred to Phase 5+

- Custom list builder and inline edit (Scenario 3).
- FR-AH-004 UM Resourcing > Assignments dedicated section.
- Profile sharing UX polish beyond MVP.
- Full AC-\* regression pass.
- Bench, Booked, Needs Conversation seeded lists.

## 21. Definition Of Done

Phase 4 is done when:

- In-scope requirements in this SRS are implemented.
- Build/lint/format checks pass.
- Acceptance criteria §17 pass.
- Demo Scenarios 4, 5, and 6 pass in Playwright.
- MSW write handlers for requests, proposals, shared profiles, and assignment history exist.
- Planning handoff files (`STATE.md`, `STATUS.md`, `VALIDATION.md`) updated.
- Ivan can execute Phase 4 validation without additional requirement interpretation.
