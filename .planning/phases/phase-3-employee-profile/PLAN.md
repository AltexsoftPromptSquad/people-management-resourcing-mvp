# Phase 3 — Employee Profile

**Phase:** 3 of 5  
**Owner:** Volodymyr (development), Ivan (QA/validation)  
**Depends on:** Phase 2 complete ✅  
**BRD version:** v1.1  
**Validation checklist:** `.planning/phases/phase-3-employee-profile/VALIDATION.md` (to be created by Ivan)  
**Test plan:** `.planning/phases/phase-3-employee-profile/phase-3-test-plan.md`  
**SRS:** `.planning/phases/phase-3-employee-profile/SRS.md`  
**Product approval:** Carlos Nunes, 2026-07-02

---

## Goal

Replace the `/people/:id` Phase 2 stub with a full managerial employee profile (header + seven tabs + UM editing). Deliver the Employee personal view at `/my-profile` with self-service contact, IDP, and certificate flows.

After Phase 3, Demo Scenario 2 (view profile tabs) and Demo Scenario 7 (employee self-service) must be demonstrable.

---

## Scope

### 1. Mock Data Gaps (`src/mocks/data`)

| File                  | Status      | Phase 3 target                                                                                                            |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `documents.ts`        | **Missing** | 2+ records per demo persona (`person-um-001`, `person-dm-001`, `person-employee-001`); types Certificate, Contract, Other |
| `idp.ts`              | **Missing** | 1 IDP record per demo persona with `status` and `documentReference`                                                       |
| `feedbacks.ts`        | Exists      | No seed change (6 entries)                                                                                                |
| `scheduled-leaves.ts` | Exists      | No seed change (4 entries)                                                                                                |
| `people.ts`           | Exists      | PATCH handler updates in memory                                                                                           |

Faker seed: keep `faker.seed(20260625)` unchanged.

### 2. MSW Handlers (`src/mocks/handlers.ts`)

| Endpoint                                 | Status      | Phase 3 use                                                                |
| ---------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `GET /api/people/:id`                    | Exists      | Profile header + tabs                                                      |
| `GET/POST /api/people/:id/feedbacks`     | Exists      | Feedbacks tab                                                              |
| `GET /api/people/:id/scheduled-leaves`   | Exists      | Overview tab                                                               |
| `GET /api/people/:id/risks`              | Exists      | Risks tab + Overview counts                                                |
| `GET /api/people/:id/action-items`       | Exists      | Risks tab + Overview counts                                                |
| `GET /api/people/:id/project-history`    | Exists      | Project History tab                                                        |
| `GET /api/people/:id/assignment-history` | Exists      | Resourcing History tab                                                     |
| `PATCH /api/people/:id`                  | **Missing** | Contact edit, English level, skills, management notes, custom field values |
| `GET /api/people/:id/documents`          | **Missing** | Documents tab                                                              |
| `POST /api/people/:id/documents`         | **Missing** | Add certificate (employee)                                                 |
| `GET /api/people/:id/idp`                | **Missing** | Documents and IDP tab                                                      |
| `PATCH /api/people/:id/idp`              | **Missing** | UM IDP reference edit + employee IDP status update                         |

### 3. Query Keys (`src/lib/query/query-keys.ts`)

Extend with:

```ts
documents: (personId: string) => ['documents', personId],
idp: (personId: string) => ['idp', personId],
```

Invalidate `person`, `feedbacks`, `documents`, and `idp` keys after relevant mutations.

### 4. Feature Module (`src/features/employee-profile/`)

```
src/features/employee-profile/
  api/
    get-person.ts
    get-person-feedbacks.ts
    get-person-documents.ts
    get-person-idp.ts
    get-person-scheduled-leaves.ts
    get-person-risks.ts
    get-person-action-items.ts
    get-person-project-history.ts
    get-person-assignment-history.ts
    patch-person.ts
    post-feedback.ts
    post-document.ts
    patch-idp.ts
  hooks/
    use-person-query.ts
    use-person-feedbacks-query.ts
    use-person-documents-query.ts
    use-person-idp-query.ts
    (one hook per tab data source)
  components/
    profile-header/ProfileHeader.tsx
    profile-tabs/ProfileTabs.tsx
    tabs/overview-tab/OverviewTab.tsx
    tabs/job-skills-tab/JobSkillsTab.tsx
    tabs/risks-action-items-tab/RisksActionItemsTab.tsx
    tabs/feedbacks-tab/FeedbacksTab.tsx
    tabs/resourcing-history-tab/ResourcingHistoryTab.tsx
    tabs/project-history-tab/ProjectHistoryTab.tsx
    tabs/documents-idp-tab/DocumentsIdpTab.tsx
    personal-profile/PersonalProfileView.tsx
    editable-section/EditableSection.tsx
```

Pages stay thin:

- `src/pages/employee-profile-page/EmployeeProfilePage.tsx` — composes header + tabs
- `src/pages/my-profile-page/MyProfilePage.tsx` — composes `PersonalProfileView`

### 5. Managerial Profile (`/people/:id`)

Seven tabs per `FR-EP-002` (see `ux-requirements.md`):

| Tab                    | FR ref        | Content                                                                                      |
| ---------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| Overview               | FR-EP-003     | Basic info, contact, employment, English level, status, risk/action counts, Scheduled Leaves |
| Job and Skills         | FR-EP-004     | Position, grade, hire date, employment status, work location, English level, skills          |
| Risks and Action Items | FR-EP-005     | Current risk, risk history, open + closed action items                                       |
| Feedbacks              | FR-EP-013–014 | Chronological list + Add Feedback                                                            |
| Resourcing History     | FR-EP-006     | Assignment history only (read-only)                                                          |
| Project History        | FR-EP-007     | Project history only (read-only)                                                             |
| Documents and IDP      | FR-EP-009     | Documents list + IDP status                                                                  |

UM editable fields (`FR-EP-012`): English level, IDP reference, skills, management notes, custom field values.

### 6. Personal Profile (`/my-profile`)

Sections per `ux-requirements.md`:

- Profile header (read-only name, position, grade)
- Contact section (editable phone, email, address)
- Action items (read-only)
- IDP status (editable dropdown)
- Documents (list + Add Certificate)

Must NOT show: manager notes, risks, assignment history, feedbacks, scheduled leaves (`FR-PV-006`, `BR-016`).

### 7. Shared UI Primitives

Audit before implementation:

| Primitive                                     | Status      | Action                                             |
| --------------------------------------------- | ----------- | -------------------------------------------------- |
| `tabs`                                        | **Missing** | Add `src/shared/ui/tabs` per ux-requirements       |
| `sheet`                                       | **Missing** | Add for Add Feedback and Add Certificate forms     |
| `textarea`                                    | **Missing** | Add for feedback content field                     |
| `toast`                                       | **Missing** | Add per ux-behavior §1.2 (Sonner or Radix wrapper) |
| `input`, `select`, `button`                   | Exists      | Reuse                                              |
| `loading-state`, `empty-state`, `error-state` | Exists      | Reuse per tab                                      |

### 8. Routing

No new routes. Upgrade existing pages:

- `/people/:id` — UM only (existing guard)
- `/my-profile` — Employee only (existing guard)

---

## Requirements Traceability

| Deliverable                   | FR / BR / AC                        |
| ----------------------------- | ----------------------------------- |
| Profile header                | FR-EP-001, AC-EP-001                |
| Seven tabs                    | FR-EP-002, AC-EP-002                |
| Overview + Scheduled Leaves   | FR-EP-003, AC-EP-008, G-2           |
| Job and Skills                | FR-EP-004                           |
| Risks and Action Items        | FR-EP-005                           |
| Separate history tabs         | FR-EP-006–008, AC-EP-003, FR-AH-005 |
| Documents and IDP             | FR-EP-009                           |
| Custom fields display + edit  | FR-EP-010, AC-EP-005                |
| Manager notes visibility      | FR-EP-011, AC-EP-004, BR-016        |
| UM field editing              | FR-EP-012                           |
| Feedbacks list + add          | FR-EP-013–014, AC-EP-006–007, G-1   |
| Personal profile              | FR-PV-001–007                       |
| Subordinates drilldown target | FR-SL-005, AC-SL-005                |

---

## Acceptance Criteria

### Build / Lint / Format

| Check            | Command                | Pass criteria |
| ---------------- | ---------------------- | ------------- |
| TypeScript build | `npm run build`        | Exit 0        |
| ESLint           | `npm run lint`         | Exit 0        |
| Prettier         | `npm run format:check` | Exit 0        |

### Managerial Profile

| #   | Check              | Expected                           | Test ref     |
| --- | ------------------ | ---------------------------------- | ------------ |
| 1   | Profile header     | All header fields render from seed | P3-H01–H03   |
| 2   | Seven tabs         | Correct names; Overview default    | P3-T01–T04   |
| 3   | Overview + leaves  | Contact, counts, scheduled leaves  | P3-O01–O05   |
| 4   | Job and Skills     | Position, grade, skills list       | P3-J01–J02   |
| 5   | Risks tab          | Risk level, history, action items  | P3-K01–K03   |
| 6   | Feedbacks          | List + add without reload          | P3-F01–F10   |
| 7   | Histories separate | Different data per tab             | P3-RH01–RH05 |
| 8   | Documents + IDP    | List + IDP status                  | P3-D01–D03   |
| 9   | Custom field edit  | Save persists in mock              | P3-C01–C02   |
| 10  | Manager notes      | Visible on managerial view only    | P3-V01–V03   |

### Personal Profile

| #   | Check            | Expected                   | Test ref     |
| --- | ---------------- | -------------------------- | ------------ |
| 11  | Own profile only | Employee sees own record   | P3-PV01      |
| 12  | Contact edit     | In-place edit + toast      | P3-PV02–PV05 |
| 13  | IDP status       | Dropdown update + toast    | P3-PV07      |
| 14  | Add certificate  | Form + prepend row + toast | P3-PV08–PV09 |

### Guards and Async

| #   | Check         | Expected                               | Test ref     |
| --- | ------------- | -------------------------------------- | ------------ |
| 15  | Role guards   | DM/Employee blocked from `/people/:id` | P3-R03–R06   |
| 16  | Loading/error | Page and per-tab async states          | P3-AS01–AS03 |
| 17  | Accessibility | Tabs, forms, headings, keyboard        | P3-A01–A03   |

---

## Dependencies

| Dependency                             | Status  |
| -------------------------------------- | ------- |
| Phase 2 complete + signed off          | ✅ Done |
| Phase 3 test plan                      | ✅ Done |
| Phase 3 SRS (Carlos approved)          | ✅ Done |
| `docs/architecture/ux-behavior.md`     | ✅ Done |
| `docs/architecture/ux-requirements.md` | ✅ Done |
| `docs/architecture/data-models.md`     | ✅ Done |

---

## Deferred to Phase 4

- Resourcing request creation, candidate proposal, approval/rejection flows
- Assignment history write path (created on resourcing decision)
- Profile sharing generation and public token view (`ux-behavior` §3.5)
- Custom list builder and sharing UX
- Generate Shared Profile button on profile header

---

## Definition of Done

Phase 3 is **done** when:

- [ ] All build/lint/format checks pass
- [ ] Documents and IDP seed data + MSW write handlers exist
- [ ] Managerial profile stub replaced with full header + seven tabs
- [ ] Personal profile delivers self-service sections
- [ ] Acceptance checks #1–17 pass
- [ ] `STATUS.md` updated
- [ ] Ivan signs off Phase 3 validation before Phase 4 starts
