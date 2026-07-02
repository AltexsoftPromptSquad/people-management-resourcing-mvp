# Software Requirements Specification

# Phase 3 - Employee Profile

## 1. Document Control

| Field                | Value                                                              |
| -------------------- | ------------------------------------------------------------------ |
| Product              | People Management & Resourcing MVP                                 |
| Phase                | Phase 3 - Employee Profile (Managerial + Personal views)           |
| Document type        | Software Requirements Specification                                |
| Status               | Approved for implementation — Carlos Nunes, 2026-07-02             |
| Implementation owner | Volodymyr                                                          |
| QA owner             | Ivan                                                               |
| Product / BA owner   | Carlos                                                             |
| Source BRD           | `docs/requirements/# Business Requirements Document.md` (v1.1)     |
| Phase plan           | `.planning/phases/phase-3-employee-profile/PLAN.md`                |
| Phase test plan      | `.planning/phases/phase-3-employee-profile/phase-3-test-plan.md`   |
| Phase validation     | `.planning/phases/phase-3-employee-profile/VALIDATION.md` (TBD)    |

## 2. Purpose

This SRS translates BRD v1.1 and the Phase 3 plan into implementation-ready software requirements for the full Employee Profile increment.

Phase 3 must replace the Phase 2 `/people/:id` stub with a managerial profile (header + seven tabs + UM editing) and deliver the Employee personal view at `/my-profile`. It must stay frontend-only and desktop-focused.

Phase 3 is not expected to deliver resourcing candidate workflows, custom list builder UX, profile sharing generation, or assignment history write paths.

## 3. Source Inputs

| Source                                                         | Used for                                              |
| -------------------------------------------------------------- | ----------------------------------------------------- |
| BRD FR-EP-001 through FR-EP-014                                | Managerial profile requirements                       |
| BRD FR-PV-001 through FR-PV-007                                | Personal profile requirements                         |
| BRD FR-AH-003, FR-AH-005, FR-AH-006                            | History tab separation and read-only rules            |
| BRD AC-EP-001 through AC-EP-008                                | Profile acceptance criteria                           |
| BRD BR-003, BR-006, BR-016                                     | Role scope, history rules, feedback visibility          |
| BRD section 8 (entities)                                       | Document, IDP, Feedback, ScheduledLeave field shapes    |
| `.planning/phases/phase-3-employee-profile/PLAN.md`            | Deliverables, mock gaps, feature boundaries             |
| `.planning/phases/phase-3-employee-profile/phase-3-test-plan.md` | P3-* test traceability                              |
| `docs/architecture/ux-requirements.md`                         | Screen content, tab list, editable fields             |
| `docs/architecture/ux-behavior.md`                             | Interaction sequences, copy library, UI states        |
| `docs/architecture/data-models.md`                             | Type-level data shapes                                |
| `docs/architecture/feature-rules.md`                           | Feature ownership and layering                          |
| `docs/architecture/component-structure.md`                     | Async state and composition rules                       |
| `docs/architecture/shared-ui.md`                               | Shared primitive ownership                            |
| `docs/architecture/state-and-rendering.md`                     | Query keys and mutation invalidation                  |

## 4. Phase Objective

Deliver a desktop-first employee profile experience where:

- Unit Manager drilldown from Subordinates opens a full managerial profile (not the Phase 2 stub).
- Profile header shows name, position, grade, unit, manager, status, availability, and risk badge.
- Seven tabs render with correct content, loading, empty, and error states.
- Feedbacks tab supports add-entry flow with immediate list update.
- Resourcing History and Project History are separate tabs with different data.
- Scheduled Leaves appear on the Overview tab.
- UM can edit English level, IDP reference, skills, management notes, and custom field values.
- Employee personal view supports contact edit, IDP status update, and certificate add.
- Manager-only data is hidden from the personal view.

## 5. Scope

### 5.1 In Scope

1. Add `documents.ts` and `idp.ts` seed data under `src/mocks/data/`.
2. Add MSW handlers for documents, IDP, and `PATCH /api/people/:id`.
3. Extend query keys for documents and IDP.
4. Add shared UI primitives: `tabs`, `sheet`, `textarea`, `toast` (if missing).
5. Implement `src/features/employee-profile/` modules.
6. Replace `EmployeeProfilePage` stub with full managerial profile.
7. Replace `MyProfilePage` placeholder with full personal profile.
8. Preserve Phase 1/2 role guards on `/people/:id` and `/my-profile`.
9. Keep loading, empty, and error states per page and per tab.

### 5.2 Out of Scope

- Resourcing request creation, candidate proposal, approval/rejection (Phase 4).
- Assignment history write on resourcing decision (Phase 4).
- Generate Shared Profile UX (`ux-behavior` §3.5).
- Custom list builder and sharing UX (Phase 5).
- Custom list inline cell edit (`ux-behavior` §3.4).
- Backend, database, auth, file upload, or external integrations.
- Mobile/tablet responsive validation.

## 6. Users And Access Context

### 6.1 Supported Roles In Phase 3

| Role                 | Route            | Access                                              |
| -------------------- | ---------------- | --------------------------------------------------- |
| Unit Manager         | `/people/:id`    | Full managerial profile for any person ID in seed   |
| Employee             | `/my-profile`    | Personal profile for active employee persona only   |
| Sales / Delivery Mgr | —                | No profile routes; redirect to DM landing           |

### 6.2 Role Access Rules

- `/people/:id` remains UM-only (`RoleRoute` guard).
- `/my-profile` remains Employee-only.
- DM direct URL to `/people/:id` redirects to `/resourcing/requests`.
- Employee direct URL to `/people/:id` redirects to `/my-profile`.
- Unit scoping is a data concern, not a route concern: profile renders for any valid person ID.

## 7. Functional Requirements

### 7.1 Mock Data

| ID         | Requirement                                                                                              | Source              |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F3-001 | `src/mocks/data/documents.ts` shall export seeded documents for demo personas with name, type, visibility, uploadedAt, mockFileName. | PLAN §1, test §5 |
| SRS-F3-002 | `src/mocks/data/idp.ts` shall export one IDP record per demo persona with status and documentReference.  | PLAN §1             |
| SRS-F3-003 | Faker seed shall remain `faker.seed(20260625)`.                                                            | PLAN §1             |

### 7.2 Mock API Endpoints

| ID         | Requirement                                                                                              | Source    |
| ---------- | -------------------------------------------------------------------------------------------------------- | --------- |
| SRS-F3-010 | MSW shall expose `GET /api/people/:id/documents` returning person-scoped document list.                  | PLAN §2   |
| SRS-F3-011 | MSW shall expose `POST /api/people/:id/documents` creating a certificate record in memory.             | PLAN §2   |
| SRS-F3-012 | MSW shall expose `GET /api/people/:id/idp` returning the person's IDP record.                            | PLAN §2   |
| SRS-F3-013 | MSW shall expose `PATCH /api/people/:id/idp` updating IDP status and/or documentReference.               | PLAN §2   |
| SRS-F3-014 | MSW shall expose `PATCH /api/people/:id` updating allowed fields: personalPhone, personalEmail, address, englishLevel, skills, managementNotes, customFieldValues. | PLAN §2 |
| SRS-F3-015 | Existing read endpoints (person, feedbacks, leaves, risks, action-items, histories) shall remain functional. | Phase 2 |

### 7.3 Query Keys

| ID         | Requirement                                                                                              | Source  |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------- |
| SRS-F3-020 | Query keys shall include `documents(personId)` and `idp(personId)`.                                      | PLAN §3 |
| SRS-F3-021 | Successful person/feedback/document/idp mutations shall invalidate affected query keys.                  | PLAN §3 |

### 7.4 Profile Header

| ID         | Requirement                                                                                              | Source              |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F3-030 | `/people/:id` shall render a header with initials, full name, position, grade, unit, manager, status pill, availability %, risk badge. | FR-EP-001, AC-EP-001 |
| SRS-F3-031 | Header values shall match `GET /api/people/:id` response.                                              | FR-EP-001           |

### 7.5 Profile Tabs Shell

| ID         | Requirement                                                                                              | Source              |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F3-040 | Profile shall render seven tabs: Overview, Job and Skills, Risks and Action Items, Feedbacks, Resourcing History, Project History, Documents and IDP. | FR-EP-002, AC-EP-002 |
| SRS-F3-041 | Tabs shall use `src/shared/ui/tabs` primitive.                                                           | ux-requirements     |
| SRS-F3-042 | Overview tab shall be active on first mount.                                                             | ux-behavior §4.4    |

### 7.6 Overview Tab

| ID         | Requirement                                                                                              | Source              |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F3-050 | Overview shall show basic info, contact info, employment type, English level, current status.            | FR-EP-003           |
| SRS-F3-051 | Overview shall show summary counts for risks and open action items.                                      | FR-EP-003           |
| SRS-F3-052 | Overview shall include a Scheduled Leaves section with leave type, start date, end date, status.         | FR-EP-003, AC-EP-008 |
| SRS-F3-053 | Scheduled Leaves section shall be read-only.                                                             | ux-requirements     |

### 7.7 Job and Skills Tab

| ID         | Requirement                                                                                              | Source    |
| ---------- | -------------------------------------------------------------------------------------------------------- | --------- |
| SRS-F3-060 | Tab shall show position, grade, unit, manager, hire date, employment status, work location, English level. | FR-EP-004 |
| SRS-F3-061 | Tab shall show skills list with level badges.                                                            | FR-EP-004 |

### 7.8 Risks and Action Items Tab

| ID         | Requirement                                                                                              | Source    |
| ---------- | -------------------------------------------------------------------------------------------------------- | --------- |
| SRS-F3-070 | Tab shall show current risk level, risk history, and risk notes.                                         | FR-EP-005 |
| SRS-F3-071 | Tab shall show all open and closed action items for the person.                                          | FR-EP-005 |

### 7.9 Feedbacks Tab

| ID         | Requirement                                                                                              | Source              |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F3-080 | Tab shall list feedback entries newest first with type, content, author name, date.                         | FR-EP-013, AC-EP-006 |
| SRS-F3-081 | Tab shall provide "Add Feedback" action opening the add-feedback flow.                                     | FR-EP-014           |
| SRS-F3-082 | Saved feedback entries shall be read-only (no edit/delete in MVP).                                       | ux-requirements     |

### 7.10 History Tabs

| ID         | Requirement                                                                                              | Source              |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F3-090 | Resourcing History tab shall show assignment history only (request name, proposed date, proposed by, reviewed by, decision, feedback). | FR-EP-006, FR-AH-002 |
| SRS-F3-091 | Project History tab shall show project history only (project name, role, dates, allocation %).             | FR-EP-007           |
| SRS-F3-092 | Assignment history and project history shall never appear in the same tab or mixed list.                 | FR-EP-008, AC-EP-003, FR-AH-005 |
| SRS-F3-093 | Resourcing History shall be read-only (no edit/delete).                                                 | FR-AH-006           |

### 7.11 Documents and IDP Tab

| ID         | Requirement                                                                                              | Source    |
| ---------- | -------------------------------------------------------------------------------------------------------- | --------- |
| SRS-F3-100 | Tab shall list documents with name, type, visibility, upload date.                                       | FR-EP-009 |
| SRS-F3-101 | Tab shall display IDP status with tone per ux-behavior §4.5.                                             | FR-EP-009 |

### 7.12 Custom Fields and UM Editing

| ID         | Requirement                                                                                              | Source              |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F3-110 | Profile shall display all custom field values for the employee.                                          | FR-EP-010           |
| SRS-F3-111 | UM shall edit English level, IDP reference, skills, management notes, and custom field values for subordinates. | FR-EP-012      |
| SRS-F3-112 | Custom field edit shall persist via PATCH and reflect updated value after save.                          | AC-EP-005           |

### 7.13 Visibility Rules

| ID         | Requirement                                                                                              | Source              |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| SRS-F3-120 | Management notes shall render on managerial profile only.                                                  | FR-EP-011           |
| SRS-F3-121 | `/my-profile` shall not display manager notes, risks, assignment history, feedbacks, or scheduled leaves. | FR-PV-006, AC-EP-004, BR-016 |

### 7.14 Personal Profile

| ID         | Requirement                                                                                              | Source    |
| ---------- | -------------------------------------------------------------------------------------------------------- | --------- |
| SRS-F3-130 | `/my-profile` shall show only the active employee's own record.                                          | FR-PV-001 |
| SRS-F3-131 | Employee shall edit personal phone, personal email, and address.                                         | FR-PV-002 |
| SRS-F3-132 | Employee shall view own action items (read-only).                                                        | FR-PV-003 |
| SRS-F3-133 | Employee shall update IDP status via dropdown (Not Started, In Progress, Completed).                     | FR-PV-004 |
| SRS-F3-134 | Employee shall add a certificate document with name and mock file name.                                  | FR-PV-005 |
| SRS-F3-135 | Every employee save shall show a visible success confirmation.                                           | FR-PV-007 |

### 7.15 Feature Ownership

| ID         | Requirement                                                                                              | Source           |
| ---------- | -------------------------------------------------------------------------------------------------------- | ---------------- |
| SRS-F3-140 | Profile domain logic shall live under `src/features/employee-profile/`.                                  | PLAN §4          |
| SRS-F3-141 | Route pages shall remain thin composition layers.                                                        | component-structure |

## 8. UX Interaction Requirements

Each row: Trigger | Component | API | Success | Failure

### 8.1 Navigate to Profile (`ux-behavior` §3.2)

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-001 | User clicks subordinates row | React Router | none | Navigate to `/people/:personId` | — |
| SRS-UX3-002 | Profile page mounts | `LoadingState` Page tier | `GET /api/people/:id` (+ parallel reads) | Header + tabs render; Overview active | — |
| SRS-UX3-003 | Person query pending | `LoadingState label="Loading profile…"` | GET person | — | — |
| SRS-UX3-004 | Person query fails | `ErrorState` | GET person | — | Title SRS-COPY3-020; description SRS-COPY3-021; "Back to Subordinates" link below |
| SRS-UX3-005 | Unknown person ID | `ErrorState` | GET person 404 | — | Title SRS-COPY3-022 |
| SRS-UX3-006 | User clicks Back | Button | none | `navigate(-1)` returns to prior page | — |

### 8.2 Add Feedback (`ux-behavior` §3.3)

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-010 | User clicks "Add Feedback" | `Sheet` | none | Sheet opens titled "Add Feedback"; first field focused | — |
| SRS-UX3-011 | Sheet open | `Select` + `Textarea` | none | Type options: HR Note, Performance, General; Content placeholder SRS-COPY3-070 | — |
| SRS-UX3-012 | User clicks "Save Feedback" | Button inline loading | `POST /api/people/:id/feedbacks` | Sheet closes; entry prepended; toast SRS-COPY3-030; focus to trigger | Sheet stays open; toast SRS-COPY3-031; button re-enabled |
| SRS-UX3-013 | User clicks Cancel or Escape | Sheet | none | Sheet closes; draft discarded (no confirm) | — |
| SRS-UX3-014 | Submit without Type | Inline validation | none | — | SRS-COPY3-050 below Type field |
| SRS-UX3-015 | Submit with Content under 10 chars | Inline validation | none | — | SRS-COPY3-051 below Content field |

### 8.3 Edit Personal Contact (`ux-behavior` §3.11)

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-030 | User clicks Contact "Edit" | In-place form | none | Fields become editable Inputs | — |
| SRS-UX3-031 | User clicks Save | Button inline loading | `PATCH /api/people/:id` | View mode with new values; toast SRS-COPY3-032 | Edit mode stays; toast SRS-COPY3-033 |
| SRS-UX3-032 | User clicks Cancel | Button | none | View mode with original values (no confirm) | — |
| SRS-UX3-033 | Invalid email on blur | Inline validation | none | — | SRS-COPY3-052 |

### 8.4 Add Certificate (`ux-behavior` §3.12)

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-040 | User clicks "Add Certificate" | `Sheet` | none | Sheet opens with name + file name fields | — |
| SRS-UX3-041 | User clicks "Save Certificate" | Button inline loading | `POST /api/people/:id/documents` | Row prepended; toast SRS-COPY3-034; sheet closes | Toast SRS-COPY3-035; sheet stays open |
| SRS-UX3-042 | Submit with empty name | Inline validation | none | — | SRS-COPY3-053 |
| SRS-UX3-043 | Submit with empty file name | Inline validation | none | — | SRS-COPY3-054 |

### 8.5 UM Field Edits (pattern: match §3.11)

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-070 | UM clicks Edit on English level (Job and Skills tab) | `EditableSection` | none | Select/Input edit mode | — |
| SRS-UX3-071 | UM saves English level | Button inline loading | `PATCH /api/people/:id` | View mode; updated value; toast SRS-COPY3-036 | Toast SRS-COPY3-033 |
| SRS-UX3-075 | UM clicks Edit on skills | `EditableSection` | none | Skills edit controls | — |
| SRS-UX3-076 | UM saves skills | Button inline loading | `PATCH /api/people/:id` | View mode; updated skills; toast SRS-COPY3-036 | Toast SRS-COPY3-033 |
| SRS-UX3-080 | UM clicks Edit on management notes | `EditableSection` | none | Textarea edit mode | — |
| SRS-UX3-081 | UM saves management notes | Button inline loading | `PATCH /api/people/:id` | View mode; toast SRS-COPY3-036 | Toast SRS-COPY3-033 |
| SRS-UX3-085 | UM clicks Edit on IDP reference (Documents tab) | `EditableSection` | none | Input edit mode | — |
| SRS-UX3-086 | UM saves IDP reference | Button inline loading | `PATCH /api/people/:id/idp` | View mode; toast SRS-COPY3-036 | Toast SRS-COPY3-033 |

### 8.6 Profile Custom Field Edit

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-090 | UM clicks custom field value cell | Inline input (type-appropriate) | none | Cell enters edit mode; auto-focused | — |
| SRS-UX3-091 | UM commits (Enter or blur) | Inline input | `PATCH /api/people/:id` | Cell shows new value; no toast | Cell reverts; toast SRS-COPY3-037 |
| SRS-UX3-092 | UM presses Escape | Inline input | none | Cell reverts to previous value | — |

### 8.7 Employee IDP Status Update

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-100 | Employee changes IDP status dropdown | `Select` | none | — | — |
| SRS-UX3-101 | Dropdown value changes | `Select` | `PATCH /api/people/:id/idp` | Toast SRS-COPY3-038 | Toast SRS-COPY3-033 |

### 8.8 Tab Behavior (`ux-behavior` §4.4)

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-050 | User switches tab | `Tabs` | Lazy GET if not cached | Tab content renders without page reload | Section `ErrorState` SRS-COPY3-023 pattern |
| SRS-UX3-051 | User navigates away and returns to profile | `Tabs` | none | Overview tab active again | — |
| SRS-UX3-052 | Unvisited tab activated | `LoadingState` Section tier | Tab-specific GET | Tab content renders | Tab `ErrorState` |

### 8.9 Sheet Accessibility (`ux-behavior` §6.2)

| ID | Trigger | Component | API | Success | Failure |
| -- | ------- | --------- | --- | ------- | ------- |
| SRS-UX3-060 | Sheet opens | `Sheet` | none | Focus moves to first field; focus trapped | — |
| SRS-UX3-061 | User presses Escape | `Sheet` | none | Sheet closes; focus returns to trigger | — |

## 9. UI State Requirements

| ID | Requirement | Source |
| -- | ----------- | ------ |
| SRS-UI3-001 | Page load shall use Page-tier `LoadingState label="Loading profile…"`. | ux-behavior §1.1 |
| SRS-UI3-002 | Tab content shall use Section-tier loading. Header and tab strip render during load. | ux-behavior §1.1 |
| SRS-UI3-003 | Tab switch shall not reload the page. Use cached query data when available. | ux-behavior §4.4 |
| SRS-UI3-004 | Unvisited tab shall fetch on activation with Section-tier loading. | ux-behavior §4.4 |
| SRS-UI3-005 | Re-entry to profile shall reset active tab to Overview. | ux-behavior §4.4 |
| SRS-UI3-006 | Risk badge shall use §4.5 tone table and include text label (not color alone). | ux-behavior §4.5 |
| SRS-UI3-007 | Leave status pills: Confirmed = success tone; Tentative = warning tone. | ux-behavior §4.5 |
| SRS-UI3-008 | Overdue action items: `bg-amber-50` with left border accent. | ux-behavior §4.3 |
| SRS-UI3-009 | Required fields validate on submit; format fields validate on blur. | ux-behavior §1.4 |
| SRS-UI3-010 | Mutations shall fire toast. Query failures shall use inline `ErrorState` (not toast). | ux-behavior §1.2 |
| SRS-UI3-011 | Each tab shall handle loading, empty, and error independently. | ux-requirements |
| SRS-UI3-012 | Feedbacks list shall sort by `createdAt` descending. | ux-requirements |
| SRS-UI3-013 | Resourcing History and Project History tabs shall never share or mix data. | FR-EP-008 |
| SRS-UI3-014 | Sheet shall trap focus; Escape closes; focus returns to trigger on close. | ux-behavior §6.2 |
| SRS-UI3-015 | Unsaved contact edits discarded silently on navigate away (no guard dialog). | ux-behavior §2.3 |

## 10. Copy Requirements

All strings verbatim from `ux-behavior.md` §5. Reference by ID in §8/§9.

### 10.1 Empty States

| ID | Context | Title | Description |
| -- | ------- | ----- | ----------- |
| SRS-COPY3-001 | Feedbacks tab empty | "No feedback recorded" | "Feedback entries for this employee will appear here." |
| SRS-COPY3-002 | Resourcing History empty | "No resourcing history" | "Assignment history records will appear here after a resourcing decision." |
| SRS-COPY3-003 | Project History empty | "No project history" | "Project history records will appear here." |
| SRS-COPY3-004 | Risks tab empty | "No risks recorded" | "Risk entries for this employee will appear here." |
| SRS-COPY3-005 | Action items empty | "No action items" | "Action items assigned to this employee will appear here." |
| SRS-COPY3-006 | Documents tab empty | "No documents" | "Document records for this employee will appear here." |
| SRS-COPY3-007 | Scheduled Leaves empty | "No scheduled leaves" | "Scheduled leave records will appear here." |
| SRS-COPY3-008 | Personal action items empty | "No action items" | "Action items assigned to you by your manager will appear here." |
| SRS-COPY3-009 | Personal documents empty | "No documents" | "Documents shared with you will appear here." |

### 10.2 Error States

| ID | Context | Title | Description |
| -- | ------- | ----- | ----------- |
| SRS-COPY3-020 | Profile load failure | "Could not load profile" | "Refresh the page or return to the list." |
| SRS-COPY3-021 | (profile error description) | — | "Refresh the page or return to the list." |
| SRS-COPY3-022 | Profile not found | "Profile not found." | — |
| SRS-COPY3-023 | Tab content failure | "Could not load [tab name]" | "Refresh the page to try again." |

### 10.3 Toast Messages

| ID | Action | Type | Message |
| -- | ------ | ---- | ------- |
| SRS-COPY3-030 | Feedback saved | success | "Feedback saved." |
| SRS-COPY3-031 | Feedback save failed | error | "Failed to save feedback. Try again." |
| SRS-COPY3-032 | Contact saved | success | "Contact information saved." |
| SRS-COPY3-033 | Save failed (generic) | error | "Could not save changes. Try again." |
| SRS-COPY3-034 | Certificate added | success | "Certificate added." |
| SRS-COPY3-035 | Certificate add failed | error | "Could not add certificate. Try again." |
| SRS-COPY3-036 | UM field saved | success | "Changes saved." |
| SRS-COPY3-037 | Custom field save failed | error | "Could not save "[field name]". Change was not applied." |
| SRS-COPY3-038 | IDP status updated | success | "IDP status updated." |

### 10.4 Validation Messages

| ID | Field | Message |
| -- | ----- | ------- |
| SRS-COPY3-050 | Feedback type | "Type is required." |
| SRS-COPY3-051 | Feedback content | "Feedback must be at least 10 characters." |
| SRS-COPY3-052 | Personal email | "Enter a valid email address." |
| SRS-COPY3-053 | Certificate name | "Certificate name is required." |
| SRS-COPY3-054 | Certificate file name | "File name is required." |

### 10.5 Placeholders

| ID | Field | Placeholder |
| -- | ----- | ----------- |
| SRS-COPY3-070 | Feedback content | "Write your feedback…" |
| SRS-COPY3-071 | Certificate name | "e.g. AWS Solutions Architect" |
| SRS-COPY3-072 | Certificate file name | "e.g. certificate.pdf (mock — no actual upload)" |
| SRS-COPY3-073 | Manager notes | "Internal notes about this employee…" |

## 11. Data Contracts

### 11.1 Profile Header View

```ts
export type ProfileHeaderView = {
  id: string
  fullName: string
  position: string
  grade: string
  unitName: string
  managerName: string
  currentProjectStatus: string
  availabilityPercent: number
  riskLevel: string
}
```

### 11.2 Add Feedback Payload

```ts
export type AddFeedbackPayload = {
  type: 'HR Note' | 'Performance' | 'General'
  content: string
  authorId: string
  visibility: 'Manager Only'
}
```

### 11.3 Patch Person Payload

```ts
export type PatchPersonPayload = {
  personalPhone?: string
  personalEmail?: string
  address?: string
  englishLevel?: string
  skills?: Array<{ skillId: string; level: string }>
  managementNotes?: string
  customFieldValues?: Record<string, string>
}
```

### 11.4 Add Document Payload

```ts
export type AddDocumentPayload = {
  name: string
  type: 'Certificate'
  mockFileName: string
  uploadedById: string
  visibility: 'Employee Visible'
}
```

### 11.5 Patch Idp Payload

```ts
export type PatchIdpPayload = {
  status?: 'Not Started' | 'In Progress' | 'Completed'
  documentReference?: string
}
```

## 12. Page And Route Requirements

| Route | Helper | Allowed role | Page folder | Purpose |
| ----- | ------ | ------------ | ----------- | ------- |
| `/people/:id` | `getEmployeeProfilePagePath(id)` | Unit Manager | `src/pages/employee-profile-page/` | Full managerial profile |
| `/my-profile` | `getMyProfilePagePath()` | Employee | `src/pages/my-profile-page/` | Personal self-service profile |

## 13. Non-Functional Requirements

| ID | Requirement | Source |
| -- | ----------- | ------ |
| SRS-NF3-001 | App remains frontend-only with mocked data boundaries. | BRD |
| SRS-NF3-002 | Phase 3 UI validated for desktop at 1280px+ viewport. | BRD AS-016 |
| SRS-NF3-003 | `npm run build` must pass. | PLAN AC |
| SRS-NF3-004 | `npm run lint` must pass. | PLAN AC |
| SRS-NF3-005 | `npm run format:check` must pass. | PLAN AC |
| SRS-NF3-006 | Seed and API responses must be deterministic. | PLAN §1 |
| SRS-NF3-007 | No backend or persistence dependencies introduced. | Scope |

## 14. Accessibility Requirements

| ID | Requirement |
| -- | ----------- |
| SRS-A11Y3-001 | Profile page shall have one `h1` and semantic section headings per tab. |
| SRS-A11Y3-002 | Tab strip shall be keyboard operable with visible focus (arrow/Enter/Space). |
| SRS-A11Y3-003 | Form fields in sheets and edit sections shall have associated labels. |
| SRS-A11Y3-004 | Validation errors shall be readable and associated with fields. |
| SRS-A11Y3-005 | Risk and status badges shall not rely on color alone. |
| SRS-A11Y3-006 | Empty, loading, and error states shall use semantic container structure. |
| SRS-A11Y3-007 | Sheet shall trap focus while open per ux-behavior §6.2. |
| SRS-A11Y3-008 | Save buttons in loading state shall set `aria-busy="true"`. |

## 15. Implementation Constraints

1. Keep route pages thin; business logic lives in `src/features/employee-profile/`.
2. Route helpers and registration remain in `src/app/routes.ts` and `src/app/router.tsx`.
3. Use TanStack Query for server-like data; do not move entity data to Zustand.
4. Keep datasets in mocks; do not hard-code large lists in components.
5. Reuse shared UI primitives before adding new ones; update `shared-ui.md` when adding primitives.
6. Do not implement Phase 4+ workflows in Phase 3.
7. Keep faker seed fixed at `20260625`.

## 16. Traceability Matrix

| SRS area | BRD / plan | ux-behavior | P3 tests |
| -------- | ---------- | ------------- | -------- |
| Mock data + MSW | FR-EP-009, PLAN §1–2 | — | P3-D01, seed checks |
| Profile header | FR-EP-001, AC-EP-001 | §3.2 | P3-H01–H03 |
| Tabs shell | FR-EP-002, AC-EP-002 | §4.4 | P3-T01–T04 |
| Overview + leaves | FR-EP-003, AC-EP-008 | §5.1 | P3-O01–O05 |
| Job and Skills | FR-EP-004 | — | P3-J01–J02 |
| Risks tab | FR-EP-005 | §5.1 | P3-K01–K03 |
| Feedbacks | FR-EP-013–014, AC-EP-006–007 | §3.3, §5 | P3-F01–F10 |
| History tabs | FR-EP-006–008, AC-EP-003 | §5.1 | P3-RH01–RH05 |
| Documents + IDP | FR-EP-009 | §5.1 | P3-D01–D03 |
| Custom fields + UM edit | FR-EP-010–012, AC-EP-005 | §3.4 pattern | P3-C01–C02, P3-M01–M02 |
| Visibility | FR-EP-011, FR-PV-006, BR-016 | — | P3-V01–V03 |
| Personal profile | FR-PV-001–007 | §3.11, §3.12 | P3-PV01–PV11 |
| Role guards | BR-003 | — | P3-R03–R06 |
| Async states | component-structure | §1.1, §3.2 | P3-AS01–AS03 |
| Accessibility | AS-016 | §4.4, §6 | P3-A01–A03 |

## 17. Acceptance Criteria

### 17.1 Build / Lint / Format

- `npm run build` exits with code 0.
- `npm run lint` exits with code 0.
- `npm run format:check` exits with code 0.

### 17.2 Managerial Profile

1. Profile header renders all required fields from seed.
2. Seven tabs present with Overview default.
3. Overview shows contact, counts, and Scheduled Leaves.
4. Feedbacks tab shows seeded entries and supports add without reload.
5. Resourcing History and Project History show separate data.
6. UM can edit allowed fields; changes persist in mock layer.
7. Manager notes visible on managerial view only.

### 17.3 Personal Profile

1. Employee sees own profile only.
2. Contact edit saves with success toast.
3. IDP status update saves with success toast.
4. Add Certificate prepends row with success toast.
5. Sensitive data hidden from personal view.

### 17.4 Guards and Quality

1. DM and Employee blocked from `/people/:id`.
2. UM and DM blocked from `/my-profile`.
3. Page and per-tab loading, empty, and error states work.
4. Copy strings match §10 verbatim.

## 18. QA Validation Mapping

| Validation area | Covered by SRS sections |
| --------------- | ----------------------- |
| Build/lint/format | §17.1, SRS-NF3-003–005 |
| Managerial profile | §7.4–7.12, §8, §9, §17.2 |
| Personal profile | §7.14, §8.3–8.4, §8.7, §17.3 |
| Role guards | §6, §12, §17.4 |
| Copy verbatim | §10 |
| Accessibility | §14 |
| Mock gaps | §7.1–7.2 |

## 19. Open Decisions

| Decision | Owner | Default for implementation |
| -------- | ----- | -------------------------- |
| Certificate form container | Volodymyr | Sheet (match Add Feedback) |
| Person update endpoint | Volodymyr | Single `PATCH /api/people/:id` |
| UM field edit pattern | Volodymyr | `EditableSection` with Save/Cancel (match contact edit) |
| Custom field edit on profile | Volodymyr | Click-to-edit cell; blur/Enter commits |
| `tabs` primitive | Volodymyr | New `src/shared/ui/tabs` |
| `sheet` + `toast` | Volodymyr | Add to shared UI if missing |

## 20. Deferred to Phase 4+

- Generate Shared Profile (`ux-behavior` §3.5, FR-PS-*).
- Resourcing candidate flows (`ux-behavior` §3.6–3.10).
- Custom list builder UX (`ux-behavior` §3.4 on `/custom-lists`).
- Assignment history creation on resourcing approval.
- Profile sharing public token view.

## 21. Definition Of Done

Phase 3 is done when:

- In-scope requirements in this SRS are implemented.
- Build/lint/format checks pass.
- Acceptance criteria §17 pass.
- Documents and IDP seed + write handlers exist.
- Phase 2 stub fully replaced on `/people/:id`.
- Personal profile fully implemented on `/my-profile`.
- Planning handoff files (`STATE.md`, `STATUS.md`, `VALIDATION.md`) updated.
- Ivan can execute Phase 3 validation without additional requirement interpretation.
