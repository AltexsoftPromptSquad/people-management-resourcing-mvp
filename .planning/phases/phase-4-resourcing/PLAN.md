# Phase 4 — Resourcing E2E Flow

**Phase:** 4 of 5  
**Owner:** Volodymyr (development), Ivan (QA/validation)  
**Depends on:** Phase 3 complete (Ivan formal sign-off pending)  
**BRD version:** v1.1  
**Validation checklist:** `.planning/phases/phase-4-resourcing/VALIDATION.md` (TBD)  
**Test plan:** `.planning/phases/phase-4-resourcing/phase-4-test-plan.md`  
**SRS:** `.planning/phases/phase-4-resourcing/SRS.md`  
**UX flow:** `.planning/phases/phase-4-resourcing/UX-FLOW.md`  
**Product approval:** Carlos Nunes, 2026-07-06 (SRS scope + Demo Scenarios 4–6)

---

## Goal

Deliver the full resourcing journey: DM creates and submits a request, UM proposes candidates with warnings and shared profiles, DM approves one candidate and rejects another with a required reason, and assignment history appears on the employee profile.

After Phase 4, Demo Scenarios 4 (create request), 5 (propose candidate), and 6 (approve/reject + history) must pass end-to-end.

---

## Scope

### 0. Type Alignment (`src/types/`)

| Type file               | Status  | Phase 4 target                                                                               |
| ----------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `assignment-history.ts` | Partial | Add `proposedById`; add `'Proposed'` to status enum; add optional `requestTitle` for display |
| `candidate-proposal.ts` | Exists  | No schema change; verify fields match BRD §8.11                                              |
| `shared-profile.ts`     | Exists  | No schema change                                                                             |
| `resourcing-request.ts` | Exists  | No schema change                                                                             |
| `allocation.ts`         | Exists  | Optional; use if richer allocation demo needed beyond `Person.availabilityPercent`           |

### 1. Mock Data Gaps (`src/mocks/data`)

| File                     | Status      | Phase 4 target                                                                                                                                     |
| ------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resourcing-requests.ts` | Exists (10) | Keep 10 records; support in-memory POST/PATCH; primary demo: `request-001` (Submitted), `request-003` (Candidates Proposed), `request-004` (Draft) |
| `candidate-proposals.ts` | **Missing** | Seed 2+ proposals for `request-003`; empty for `request-001` (proposal flow demo)                                                                  |
| `shared-profiles.ts`     | **Missing** | In-memory store; created via POST during demo                                                                                                      |
| `assignment-history.ts`  | Exists      | MSW write on approve/reject/withdraw decision                                                                                                      |
| `scheduled-leaves.ts`    | Exists      | Use for leave-overlap warning demo (extend overlap on a UM subordinate if needed)                                                                  |
| `risks.ts`               | Exists      | High/Critical at indices 0–1 for risk warning demo                                                                                                 |
| `people.ts`              | Exists      | Identify subordinates with low `availabilityPercent` (≤20) for allocation warning demo                                                             |

Faker seed: keep `faker.seed(20260625)` unchanged.

**Demo personas:** DM `person-dm-001` (Marcus Reed), UM `person-um-001` (Olena Kovalenko).

**Warning demo candidates** (UM unit `unit-platform`, manager `person-um-001`, against `request-001` workload 100%, start `2026-07-10`):

| Warning            | FR        | Seed action                                                                 |
| ------------------ | --------- | --------------------------------------------------------------------------- |
| Allocation >100%   | FR-CP-006 | Subordinate with `availabilityPercent ≤ 20`                                 |
| Leave overlap      | FR-CP-007 | Scheduled leave overlapping request period (pattern: `person-employee-001`) |
| High/Critical risk | FR-CP-008 | Subordinate linked to High/Critical risk record                             |

### 2. MSW Handlers (`src/mocks/handlers.ts`)

| Endpoint                                      | Status      | Phase 4 use                           |
| --------------------------------------------- | ----------- | ------------------------------------- |
| `GET /api/resourcing/requests`                | Exists      | DM list + UM incoming queue           |
| `GET /api/resourcing/requests/:id`            | **Missing** | Request detail                        |
| `POST /api/resourcing/requests`               | **Missing** | DM create (Draft)                     |
| `PATCH /api/resourcing/requests/:id`          | **Missing** | Submit, cancel, status transitions    |
| `GET /api/resourcing/requests/:id/candidates` | **Missing** | Proposal list for DM review           |
| `POST /api/candidate-proposals`               | **Missing** | Batch submit from UM proposal panel   |
| `PATCH /api/candidate-proposals/:id`          | **Missing** | Approve, reject, withdraw             |
| `POST /api/shared-profiles`                   | **Missing** | Generate shared profile link          |
| `GET /api/shared-profiles/:token`             | **Missing** | Public shared profile view            |
| `GET /api/people?managerId=`                  | Exists      | UM employee browser in proposal panel |
| `GET /api/people/:id/scheduled-leaves`        | Exists      | Leave overlap warning calculation     |
| `GET /api/people/:id/risks`                   | Exists      | Risk warning calculation              |
| `GET /api/people/:id/assignment-history`      | Exists      | Read; invalidate after decision write |

Assignment history records shall be created by MSW on approve/reject/withdraw PATCH (not client-only).

### 3. Query Keys (`src/lib/query/query-keys.ts`)

Extend with:

```ts
resourcingRequest: (id: string) => ['resourcing-request', id],
candidateProposals: (requestId: string) => ['candidate-proposals', requestId],
sharedProfile: (token: string) => ['shared-profile', token],
```

Invalidate after mutations: `resourcingRequests`, `resourcingRequest`, `candidateProposals`, `assignmentHistory`, `sharedProfile`.

### 4. Feature Modules

```
src/features/resourcing/
  api/
    get-resourcing-requests.ts
    get-resourcing-request.ts
    post-resourcing-request.ts
    patch-resourcing-request.ts
    get-candidate-proposals.ts
    post-candidate-proposals.ts
    patch-candidate-proposal.ts
  hooks/
    use-resourcing-requests-query.ts
    use-resourcing-request-query.ts
    use-candidate-proposals-query.ts
    (mutation hooks for create/submit/cancel/propose/approve/reject/withdraw)
  components/
    requests-table/RequestsTable.tsx
    request-form-sheet/RequestFormSheet.tsx
    request-detail-panel/RequestDetailPanel.tsx
    incoming-queue-table/IncomingQueueTable.tsx
    candidate-proposal-panel/CandidateProposalPanel.tsx
    candidate-row/CandidateRow.tsx
    candidate-review-list/CandidateReviewList.tsx
  utils/
    candidate-warnings.ts

src/features/profile-sharing/
  api/
    post-shared-profile.ts
    get-shared-profile-by-token.ts
  hooks/
    use-create-shared-profile-mutation.ts
    use-shared-profile-query.ts
  components/
    generate-shared-profile-sheet/GenerateSharedProfileSheet.tsx
    shared-profile-sections/SharedProfileSections.tsx
```

Pages stay thin:

- `src/pages/resourcing-requests-page/ResourcingRequestsPage.tsx` — DM master-detail compose
- `src/pages/resourcing-incoming-page/ResourcingIncomingPage.tsx` — UM queue + proposal panel compose
- `src/pages/shared-profile-page/SharedProfilePage.tsx` — public view, no AppLayout

Profile header integration:

- Add "Generate Shared Profile" to `src/features/employee-profile/components/profile-header/ProfileHeader.tsx` (Phase 3 deferred)

### 5. DM Resourcing Requests (`/resourcing/requests`)

Per `UX-FLOW.md` §2.1 and `ux-requirements.md` §233–270:

- **Layout:** Master-detail (table 55% + detail panel 45%). No separate detail route.
- **New Request:** Sheet with single **Submit** action (internal POST + PATCH Submitted). Demo happy path: 2 clicks.

Per `FR-RR-001`–`FR-RR-007`:

| Section        | Content                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| Page header    | Title "My Requests", "New Request" button                                  |
| Requests table | Request code, title, project, priority, status, created date, actions      |
| New Request    | Sheet form with all required fields; inline validation on submit           |
| Request detail | Read-only request fields + candidate review list (when status allows)      |
| Cancel action  | Draft or Submitted only (`FR-RR-006`, `BR-010`)                            |
| Approve/Reject | Per candidate when status is Candidates Proposed (`FR-CD-001`–`FR-CD-009`) |

Required form fields: title, project name, required role, required skills (multi), grade level, English level, expected compensation level, workload %, start date, duration/end date, assigned Unit Manager, priority (default Medium). Optional: client name, business reason.

### 6. UM Incoming Queue (`/resourcing/incoming`)

Per `UX-FLOW.md` §2.2 and `ux-requirements.md` §274–299:

- **Layout:** Master-detail (queue table 40% + proposal panel 60%).
- **Employee pick:** Checkbox per subordinate row; warnings show on candidate card immediately.
- **Demo happy path:** 7 clicks (internal only) or 9 clicks (internal + external). See `UX-FLOW.md` §3.

Per `FR-CP-001`–`FR-CP-012`:

| Section          | Content                                                           |
| ---------------- | ----------------------------------------------------------------- |
| Page header      | Title "Incoming Requests"                                         |
| Queue table      | Requests where `assignedUnitManagerId` matches active UM          |
| Proposal panel   | Opened from row click                                             |
| Employee browser | Unit subordinates with availability, skills, grade, English, risk |
| Warnings         | Allocation, leave overlap, High/Critical risk (non-blocking)      |
| Fit summary      | Textarea per internal candidate                                   |
| External URL     | One optional external candidate per request                       |
| Shared profile   | Generate link per internal candidate before submit                |
| Submit           | ConfirmDialog → status Candidates Proposed                        |
| Withdraw         | Before DM decision (`FR-CP-012`)                                  |

### 7. Profile Sharing (`FR-PS-001`–`FR-PS-007`, `FR-CP-010`)

Per `ux-behavior.md` §3.5:

- Sheet with section checkboxes; sensitive sections off by default (`FR-PS-003`)
- `POST /api/shared-profiles` → copy link toast
- Public route `/shared/:token` outside AppLayout; no login required
- Entry points: candidate proposal panel **and** profile header button

### 8. Assignment History Write (`FR-AH-001`–`FR-AH-003`)

On approve/reject/withdraw:

- MSW creates `AssignmentHistoryItem` with request title, status, feedback/rejection reason
- Invalidate `assignmentHistory(employeeId)` query
- Display on existing Resourcing History tab (Phase 3 read path)

FR-AH-004 (UM Resourcing > Assignments section): **deferred to Phase 5**.

### 9. Shared UI Primitives

| Primitive       | Status      | Action                                       |
| --------------- | ----------- | -------------------------------------------- |
| `checkbox`      | **Missing** | Section toggles in shared profile generation |
| `dialog`        | **Missing** | ConfirmDialog for cancel, withdraw, submit   |
| `warning-badge` | **Missing** | Candidate warning display                    |
| `sheet`         | Exists      | Request form, shared profile, approve/reject |
| `textarea`      | Exists      | Fit summary, rejection reason, optional note |
| `toast`         | Exists      | All mutation confirmations                   |
| `status-pill`   | Exists      | Request and candidate status                 |
| `data-table`    | Exists      | Requests tables                              |

### 10. Routing

Add to `src/app/routes.ts` and `src/app/router.tsx`:

```ts
getSharedProfilePagePath(token: string) => `/shared/${token}`
```

| Route                  | Guard            | Layout     |
| ---------------------- | ---------------- | ---------- |
| `/resourcing/requests` | DM only (exists) | AppLayout  |
| `/resourcing/incoming` | UM only (exists) | AppLayout  |
| `/shared/:token`       | None (public)    | Standalone |

---

## Requirements Traceability

| Deliverable              | FR / BR / AC                            |
| ------------------------ | --------------------------------------- |
| DM request create/submit | FR-RR-001–007, AC-RR-001–004            |
| DM cancel request        | FR-RR-006, BR-010                       |
| UM incoming queue        | FR-CP-001, FR-RR-004                    |
| Candidate selection      | FR-CP-002–005, AC-CP-001                |
| Candidate warnings       | FR-CP-006–009, AC-CP-002, BR-012–014    |
| External candidate URL   | FR-CP-004, AC-CP-003                    |
| Submit candidates        | FR-CP-011, AC-CP-004                    |
| Withdraw candidate       | FR-CP-012, BR-011                       |
| Shared profile generate  | FR-PS-001–007, FR-CP-010, AC-PS-001–004 |
| DM approve one           | FR-CD-004–005, AC-CD-002, AS-009, D-1   |
| DM reject with reason    | FR-CD-006–008, AC-CD-003–004, BR-004    |
| Assignment history write | FR-AH-001–003, AC-AH-001–004, BR-006    |
| One approval per request | FR-CD-004, AS-009                       |

---

## Acceptance Criteria

### Build / Lint / Format

| Check            | Command                | Pass criteria | Test ref |
| ---------------- | ---------------------- | ------------- | -------- |
| TypeScript build | `npm run build`        | Exit 0        | P4-B01   |
| ESLint           | `npm run lint`         | Exit 0        | P4-B02   |
| Prettier         | `npm run format:check` | Exit 0        | P4-B03   |

### DM Requests

| #   | Check                  | Expected                                 | Test ref |
| --- | ---------------------- | ---------------------------------------- | -------- |
| 1   | New Request form       | Opens sheet; all required fields present | P4-RR01  |
| 2   | Required validation    | Empty required fields block submit       | P4-RR02  |
| 3   | Submit request         | Status → Submitted                       | P4-RR03  |
| 4   | UM queue visibility    | Submitted request in UM incoming queue   | P4-RR04  |
| 5   | Cancel Draft/Submitted | Status → Cancelled; action hidden after  | P4-RR05  |
| 6   | DM sees own requests   | Table filtered by `createdById`          | P4-RR06  |

### UM Proposal

| #   | Check                 | Expected                                 | Test ref |
| --- | --------------------- | ---------------------------------------- | -------- |
| 7   | Open assigned request | Requirements summary visible             | P4-CP01  |
| 8   | Employee browser      | Unit subordinates listed with key fields | P4-CP02  |
| 9   | Select internal       | At least one candidate selectable        | P4-CP03  |
| 10  | Allocation warning    | Shows when total allocation > 100%       | P4-W01   |
| 11  | Leave overlap warning | Shows when leave overlaps request period | P4-W02   |
| 12  | Risk warning          | Shows for High/Critical                  | P4-W03   |
| 13  | Warnings non-blocking | Submit allowed with warnings present     | P4-W04   |
| 14  | External URL          | Valid URL accepted                       | P4-CP04  |
| 15  | Shared profile link   | Generated per internal candidate         | P4-PS01  |
| 16  | Submit candidates     | Status → Candidates Proposed             | P4-CP05  |
| 17  | Withdraw candidate    | Status → Withdrawn before DM decision    | P4-CP06  |

### Shared Profile

| #   | Check                 | Expected                                  | Test ref |
| --- | --------------------- | ----------------------------------------- | -------- |
| 18  | Sensitive default off | Contact, risks, feedbacks unchecked       | P4-PS02  |
| 19  | Public link           | `/shared/:token` shows selected sections  | P4-PS03  |
| 20  | No login required     | Public view renders without role switcher | P4-PS04  |
| 21  | Profile header action | Generate Shared Profile on `/people/:id`  | P4-PS05  |

### DM Review

| #   | Check              | Expected                                    | Test ref |
| --- | ------------------ | ------------------------------------------- | -------- |
| 22  | Candidate list     | Shared profile link or external URL per row | P4-CD01  |
| 23  | Approve one        | Candidate Approved; request Approved        | P4-CD02  |
| 24  | One approval limit | Approve hidden for remaining Proposed       | P4-CD03  |
| 25  | Reject no reason   | Validation blocks submit                    | P4-CD04  |
| 26  | Reject with reason | Candidate Rejected; reason recorded         | P4-CD05  |

### Assignment History

| #   | Check              | Expected                                  | Test ref |
| --- | ------------------ | ----------------------------------------- | -------- |
| 27  | History on approve | New record on employee Resourcing History | P4-AH01  |
| 28  | History fields     | Request title, status, feedback visible   | P4-AH02  |
| 29  | Read-only          | No edit action on history records         | P4-AH03  |

### Demo Scenarios

| #   | Check      | Expected              | Test ref |
| --- | ---------- | --------------------- | -------- |
| 30  | Scenario 4 | Create request E2E    | P4-D04   |
| 31  | Scenario 5 | Propose candidate E2E | P4-D05   |
| 32  | Scenario 6 | Approve/reject E2E    | P4-D06   |

---

## Dependencies

| Dependency                             | Status            |
| -------------------------------------- | ----------------- |
| Phase 3 complete on `main`             | Done              |
| Phase 3 Ivan formal sign-off           | Pending           |
| Phase 4 SRS (Carlos approval)          | Done (2026-07-06) |
| `docs/architecture/ux-behavior.md`     | Done              |
| `docs/architecture/ux-requirements.md` | Done              |
| `docs/architecture/data-models.md`     | Done              |
| `docs/architecture/feature-rules.md`   | Done              |
| Resourcing History tab (Phase 3)       | Done (read-only)  |

---

## Deferred to Phase 5

- Custom lists builder and inline edit (Scenario 3)
- FR-AH-004 UM Resourcing > Assignments dedicated section
- Profile sharing UX polish beyond MVP (re-open existing link styling)
- Full AC-\* regression pass across all requirement groups
- Bench, Booked, Needs Conversation seeded lists

---

## Definition of Done

Phase 4 is **done** when:

- [ ] All build/lint/format checks pass
- [ ] Type alignment and seed files complete
- [ ] MSW write handlers for requests, proposals, shared profiles, assignment history
- [ ] DM request create/submit/cancel flows work
- [ ] UM proposal flow with warnings and shared profiles works
- [ ] DM approve/reject with required rejection reason works
- [ ] Assignment history written on decision and visible on profile
- [ ] Demo Scenarios 4, 5, 6 pass
- [ ] Acceptance checks #1–32 pass
- [ ] `STATUS.md` updated
- [ ] Ivan signs off Phase 4 validation before Phase 5 starts
