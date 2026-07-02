# Phase 3 Employee Profile Implementation Plan

## Purpose

This document is the implementation plan for `.planning/phases/phase-3-employee-profile/SRS.md`. It translates the Phase 3 SRS into an execution-ready sequence for delivering the full managerial employee profile (`/people/:id`) and the Employee personal profile (`/my-profile`).

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
- `.planning/phases/phase-3-employee-profile/SRS.md`
- `.planning/phases/phase-3-employee-profile/VALIDATION.md`
- `.planning/phases/phase-3-employee-profile/phase-3-test-plan.md`

Phase 3 must implement managerial profile + personal profile + mock write paths only. It must not implement deferred Phase 4+ resourcing workflows, shared profile generation, or custom list builder UX.

## Implementation Defaults And Decisions

| Area                         | Decision                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Profile feature location     | Use `src/features/employee-profile/` as source of truth for profile APIs/hooks/components.                     |
| Page ownership               | Keep pages thin in `src/pages/employee-profile-page/` and `src/pages/my-profile-page/`.                        |
| Route changes                | No new routes; upgrade existing `/people/:id` and `/my-profile` pages only.                                    |
| Data boundary                | Keep server-like data in TanStack Query + typed API wrappers + MSW handlers.                                   |
| Mutation pattern             | Introduce first `useMutation` flows with targeted query invalidation (person, feedbacks, documents, idp).      |
| Person update endpoint       | Single `PATCH /api/people/:id` for allowed person fields per SRS §11.3.                                        |
| IDP update endpoint          | `PATCH /api/people/:id/idp` for status and documentReference.                                                  |
| UM field edit pattern        | `EditableSection` with Save/Cancel (match contact edit in personal view).                                      |
| Custom field edit on profile | Click-to-edit cell; blur/Enter commits; Escape reverts.                                                        |
| Add Feedback / Certificate   | Use shared `Sheet` container (not dialog).                                                                     |
| Tab state                    | Overview active on first mount; reset to Overview on profile re-entry (local tab state, not URL).              |
| Seed determinism             | Keep `faker.seed(20260625)` unchanged and use stable generated IDs.                                            |
| Shared primitives            | Add missing generic primitives in shared layer before feature usage (`tabs`, `sheet`, `textarea`, `toast`).    |
| Dependencies                 | Do not add npm dependencies unless strictly required and approved (toast provider may require one dependency). |

## Step-By-Step Implementation Plan

### 1. Add Required Shared UI Primitives

Audit and close shared UI gaps before profile UI work.

Implementation requirements:

- Evaluate inventory in `docs/architecture/shared-ui.md`.
- Add missing primitives required by Phase 3 SRS:
  - `src/shared/ui/tabs`
  - `src/shared/ui/sheet`
  - `src/shared/ui/textarea`
  - `src/shared/ui/toast`
- Reuse existing primitives where available:
  - `input`, `select`, `button`, `badge`, `status-pill`, `page-header`
  - `loading-state`, `empty-state`, `error-state`, `skeleton`, `data-table`
- Keep primitives app-agnostic and typed.
- Update shared UI inventory statuses/documentation when new primitives are added.

Acceptance checks:

- No duplicated generic control styling in feature/page files.
- Tab strip, sheets, and form fields are keyboard operable with visible focus.
- Toast success/error behavior is available for mutation flows.

### 2. Extend API Client And Query Key Boundary For Mutations

Prepare typed write/read boundaries before feature modules.

Implementation requirements:

- Extend `src/lib/api/api-client.ts` with typed `POST` and `PATCH` helpers (JSON body support).
- Extend `src/lib/query/query-keys.ts` with:
  - `documents(personId)`
  - `idp(personId)`
- Keep query keys serializable and normalized (no raw `URLSearchParams`, no draft input state).
- Define mutation invalidation rules:
  - `PATCH /api/people/:id` -> invalidate `person(personId)` and related tab keys as needed
  - `POST /api/people/:id/feedbacks` -> invalidate `feedbacks(personId)`
  - `POST /api/people/:id/documents` -> invalidate `documents(personId)`
  - `PATCH /api/people/:id/idp` -> invalidate `idp(personId)`

Acceptance checks:

- API client supports all Phase 3 write endpoints without direct mock imports in UI.
- Query hooks use query key helpers consistently.
- Invalidation refreshes affected tab content without full-page reload.

### 3. Add Phase 3 Mock Seed Data And Write Handlers

Close mock gaps required by SRS §7.1–7.2.

Implementation requirements:

- Add seed modules:
  - `src/mocks/data/documents.ts` (2+ records per demo persona)
  - `src/mocks/data/idp.ts` (1 IDP record per demo persona)
- Extend `src/mocks/handlers.ts` with:
  - `GET /api/people/:id/documents`
  - `POST /api/people/:id/documents`
  - `GET /api/people/:id/idp`
  - `PATCH /api/people/:id/idp`
  - `PATCH /api/people/:id` for allowed fields:
    - `personalPhone`, `personalEmail`, `address`
    - `englishLevel`, `skills`, `managementNotes`, `customFieldValues`
- Preserve existing read endpoints:
  - person, feedbacks, scheduled-leaves, risks, action-items, project-history, assignment-history
- Keep in-memory mutation behavior deterministic and stable across reload within session.
- Keep `faker.seed(20260625)` unchanged.

Acceptance checks:

- Documents and IDP seed data exist for demo personas.
- Write handlers update in-memory stores and return typed responses.
- Existing Phase 2 read endpoints remain functional.

### 4. Create Employee Profile Feature Module

Establish feature ownership before page composition.

Implementation requirements:

- Create `src/features/employee-profile/` with:
  - `api/` read/write wrappers
  - `hooks/` query and mutation hooks
  - `components/` profile shell, tab panels, editable sections, personal view
- Add API modules (minimum):
  - `get-person.ts`
  - `get-person-feedbacks.ts`
  - `get-person-documents.ts`
  - `get-person-idp.ts`
  - `get-person-scheduled-leaves.ts`
  - `get-person-risks.ts`
  - `get-person-action-items.ts`
  - `get-person-project-history.ts`
  - `get-person-assignment-history.ts`
  - `patch-person.ts`
  - `post-feedback.ts`
  - `post-document.ts`
  - `patch-idp.ts`
- Add hooks for each tab data source plus mutation hooks with invalidation.
- Add reusable components:
  - `profile-header/ProfileHeader.tsx`
  - `profile-tabs/ProfileTabs.tsx`
  - seven tab panel components under `tabs/*`
  - `personal-profile/PersonalProfileView.tsx`
  - `editable-section/EditableSection.tsx`
- Keep domain logic inside feature module; pages compose only.

Acceptance checks:

- Feature module follows architecture ownership rules.
- No page-level parsing/validation/business logic duplication.
- Components are controlled via props and do not call router APIs directly.

### 5. Implement Managerial Profile Page (`/people/:id`)

Replace Phase 2 stub with full managerial profile experience.

Implementation requirements:

- Upgrade `src/pages/employee-profile-page/EmployeeProfilePage.tsx` to compose:
  - `ProfileHeader`
  - `ProfileTabs` with seven tabs
- Implement tab content per SRS/UX:
  - Overview (basic info, counts, scheduled leaves)
  - Job and Skills (employment + skills)
  - Risks and Action Items (risk history + action items)
  - Feedbacks (list + Add Feedback sheet)
  - Resourcing History (assignment history only)
  - Project History (project history only)
  - Documents and IDP (documents list + IDP status)
- Implement UM editable flows:
  - English level
  - skills
  - management notes
  - custom field values
  - IDP reference
- Enforce visibility rules:
  - management notes visible on managerial profile only
  - assignment/project histories never mixed in one tab
- Provide page-level and per-tab async states:
  - loading
  - empty
  - error

Acceptance checks:

- FR-EP-001..014 and AC-EP-001..008 requirements are met.
- Seven tabs present; Overview default; tab switch without page reload.
- Add Feedback persists and prepends without full reload.
- Resourcing History and Project History show separate datasets.

### 6. Implement Personal Profile Page (`/my-profile`)

Deliver employee self-service profile with strict visibility boundaries.

Implementation requirements:

- Upgrade `src/pages/my-profile-page/MyProfilePage.tsx` to compose `PersonalProfileView`.
- Resolve active employee persona via existing role/persona hooks.
- Implement personal sections:
  - read-only profile header (name, position, grade)
  - editable contact section (phone, email, address)
  - read-only action items
  - editable IDP status dropdown
  - documents list + Add Certificate sheet
- Enforce exclusions from personal view:
  - manager notes
  - risks
  - assignment history
  - feedbacks
  - scheduled leaves
- Provide mutation success toasts for all employee save actions.

Acceptance checks:

- FR-PV-001..007 requirements are met.
- Employee sees own profile only.
- Contact edit, IDP update, and certificate add persist in mock layer.
- Sensitive managerial data is not visible in personal view.

### 7. Align UX Behavior, Copy, And Accessibility

Apply exact interaction and copy requirements from architecture docs.

Implementation requirements:

- Follow `docs/architecture/ux-behavior.md` sequences for:
  - profile load/back navigation
  - Add Feedback
  - contact edit
  - Add Certificate
  - UM field edits
  - employee IDP status update
  - tab activation behavior
- Use SRS §10 copy verbatim for empty/error/toast/validation/placeholder strings.
- Apply accessibility requirements:
  - one page `h1` and semantic tab/section headings
  - keyboard-operable tabs
  - labeled form controls in sheets/edit sections
  - validation errors associated with fields
  - sheet focus trap and focus return to trigger
  - `aria-busy="true"` on loading save actions

Acceptance checks:

- Copy strings match SRS §10 exactly.
- Required interaction flows match ux-behavior sequences.
- Accessibility checklist items P3-A01..A05 are satisfied.

### 8. Finalize Planning Handoff And Validation Artifacts

Record implementation status and QA-ready guidance.

Implementation requirements:

- Update `.planning/STATE.md` with:
  - Phase 3 implementation status
  - validation status
  - blockers
  - deferred scope
- Update/create phase status handoff file under `.planning/phases/phase-3-employee-profile/`.
- Ensure `.planning/phases/phase-3-employee-profile/VALIDATION.md` maps to SRS and test plan checks.
- Provide QA handoff notes:
  - managerial vs personal visibility boundaries
  - supported edit flows
  - tab behavior and async state expectations
  - explicit deferred Phase 4 items

Acceptance checks:

- Ivan can execute validation without extra requirement interpretation.
- Deferred scope is explicit and non-ambiguous.

## Data, Model, And API Contracts

### Profile Header View

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

### Add Feedback Payload

```ts
export type AddFeedbackPayload = {
  type: 'HR Note' | 'Performance' | 'General'
  content: string
  authorId: string
  visibility: 'Manager Only'
}
```

### Patch Person Payload

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

### Add Document Payload

```ts
export type AddDocumentPayload = {
  name: string
  type: 'Certificate'
  mockFileName: string
  uploadedById: string
  visibility: 'Employee Visible'
}
```

### Patch IDP Payload

```ts
export type PatchIdpPayload = {
  status?: 'Not Started' | 'In Progress' | 'Completed'
  documentReference?: string
}
```

### Core Phase 3 Endpoints

| Method | Endpoint                             | Primary phase usage                                 |
| ------ | ------------------------------------ | --------------------------------------------------- |
| GET    | `/api/people/:id`                    | Profile header + tab context                        |
| PATCH  | `/api/people/:id`                    | Contact/UM field updates                            |
| GET    | `/api/people/:id/feedbacks`          | Feedbacks tab                                       |
| POST   | `/api/people/:id/feedbacks`          | Add Feedback flow                                   |
| GET    | `/api/people/:id/scheduled-leaves`   | Overview scheduled leaves section                   |
| GET    | `/api/people/:id/risks`              | Risks tab + Overview counts                         |
| GET    | `/api/people/:id/action-items`       | Risks tab + Overview counts + personal action items |
| GET    | `/api/people/:id/project-history`    | Project History tab only                            |
| GET    | `/api/people/:id/assignment-history` | Resourcing History tab only                         |
| GET    | `/api/people/:id/documents`          | Documents tab + personal documents                  |
| POST   | `/api/people/:id/documents`          | Add Certificate flow                                |
| GET    | `/api/people/:id/idp`                | Documents and IDP tab + personal IDP section        |
| PATCH  | `/api/people/:id/idp`                | UM IDP reference edit + employee IDP status update  |

## Routing And UI Behavior

| User action                                | Expected behavior                                          |
| ------------------------------------------ | ---------------------------------------------------------- |
| UM clicks subordinate row                  | Opens full managerial profile at `/people/:id` (not stub)  |
| Profile page mounts                        | Page-tier loading, then header + tabs with Overview active |
| User switches tab                          | Tab content loads independently; no full page reload       |
| User navigates away and returns            | Profile re-entry resets active tab to Overview             |
| UM adds feedback                           | Sheet submit prepends entry and shows success toast        |
| UM edits allowed fields                    | Save persists via PATCH and reflects updated values        |
| Employee opens `/my-profile`               | Own profile only with allowed self-service sections        |
| Employee edits contact / IDP / certificate | Save persists with success toast                           |
| DM/Employee opens `/people/:id`            | Redirected by existing role guard                          |
| UM/DM opens `/my-profile`                  | Redirected by existing role guard                          |

## Validation Checklist

Run before considering Phase 3 implementation complete:

```bash
npm run build
npm run lint
npm run format:check
```

Manual validation checks:

- Managerial profile:
  - header fields render from seed
  - seven tabs present with Overview default
  - overview includes scheduled leaves
  - feedbacks list + add flow works
  - resourcing/project histories are separate and read-only
  - documents + IDP section renders
  - UM editable fields persist
- Personal profile:
  - employee sees own record only
  - contact edit saves with toast
  - IDP status update saves with toast
  - add certificate prepends row with toast
  - sensitive managerial data hidden
- Guards and async:
  - role guards remain correct for both routes
  - page and per-tab loading/empty/error states work
  - copy strings match SRS §10
- Architecture:
  - pages remain thin
  - profile domain logic lives in `src/features/employee-profile/`
  - no duplicated generic control styling
  - mutation invalidation behavior is predictable

Optional e2e validation (when Phase 3 specs are present):

```bash
npx playwright install chromium
npm run test:e2e
```

## Assumptions And Non-Goals

Assumptions:

- Phase 2 routing, guards, subordinates drilldown, and read mock endpoints are stable and reused.
- BRD v1.1, Phase 3 SRS, and decision log are approved source of truth.
- Validation is desktop-only (1280px+), no mobile/tablet blocking checks.
- Mocked API boundaries remain authoritative for frontend behavior.

Non-goals:

- Do not implement resourcing request creation/proposal/review workflows in Phase 3.
- Do not implement assignment history write on resourcing decision.
- Do not implement Generate Shared Profile UX or public token view.
- Do not implement custom list builder/sharing UX.
- Do not add backend/database/auth/integration/file-storage components.
- Do not introduce unrelated refactors outside Phase 3 scope.
