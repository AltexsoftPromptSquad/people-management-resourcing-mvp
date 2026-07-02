# Phase 3 — Employee Profile — Test Plan

## 1. Document Control

| Field            | Value                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Product          | People Management & Resourcing MVP                                                                   |
| Phase            | Phase 3 — Employee Profile (Managerial + Personal views)                                             |
| Document type    | Test plan (QA design, pre-execution)                                                                 |
| Status           | Ready for execution (SRS linked)                                                                     |
| QA owner         | Ivan                                                                                                 |
| Dev owner        | Volodymyr                                                                                            |
| Product / BA     | Carlos                                                                                               |
| Planning sources | `.planning/phases/phase-3-employee-profile/` (PLAN, SRS, phase-3-test-plan); `.planning/STATE.md`    |
| Source BRD       | `docs/requirements/# Business Requirements Document.md` (v1.1)                                       |
| Architecture     | `docs/architecture/ux-behavior.md`, `ux-requirements.md`, `data-models.md`, `component-structure.md` |
| Precedent        | `tests/test_reports/phase2/phase-2-test-plan.md`, `tests/e2e/phase2/*`                               |

## 2. Purpose & Scope

This plan defines how Phase 3 (the full Employee Profile) is verified before QA
sign-off. Phase 2 delivered `/people/:id` as a stub; Phase 3 replaces it with a full
managerial profile (header + tabs + editing) and delivers the personal `/my-profile`
self-service view.

This plan is grounded in Phase 3 `PLAN.md` and `SRS.md`, BRD v1.1 functional requirements
(`FR-EP-*`, `FR-PV-*`, `FR-AH-*`), business rules (`BR-003`, `BR-006`, `BR-016`),
acceptance criteria (`AC-EP-*`), and interaction contracts in `docs/architecture/ux-behavior.md`.
Test cases in §6 reference SRS IDs; §7 maps BRD requirements to P3 tests and SRS IDs.

### 2.1 In scope

- Build / lint / format gates (same gate as Phase 1/2).
- Managerial Employee Profile at `/people/:id` (UM-only): header + all seven tabs
  (`FR-EP-001`, `FR-EP-002`, `AC-EP-001`, `AC-EP-002`).
- Overview tab incl. contact/employment/English info, risk & action-item summary counts,
  and the **Scheduled Leaves** section (`FR-EP-003`, `AC-EP-008`, G-2).
- Job & Skills tab (`FR-EP-004`).
- Risks & Action Items tab (`FR-EP-005`).
- **Feedbacks** tab — chronological list + Add Feedback form (`FR-EP-013`, `FR-EP-014`,
  `AC-EP-006`, `AC-EP-007`, `BR-016`, G-1).
- Resourcing History vs Project History separation (`FR-EP-006`, `FR-EP-007`,
  `FR-EP-008`, `AC-EP-003`, `FR-AH-003/005/006`).
- Documents & IDP tab (`FR-EP-009`).
- Custom fields display + inline edit on profile (`FR-EP-010`, `AC-EP-005`).
- Managerial editing of English level, IDP reference, skills, management notes, custom
  fields (`FR-EP-012`).
- Manager-only notes hidden from personal view (`FR-EP-011`, `AC-EP-004`, `BR-016`).
- Personal profile `/my-profile` (Employee-only): edit contact, update IDP status, add
  certificate, success confirmations, sensitive data hidden (`FR-PV-001`..`FR-PV-007`).
- Async states (loading / empty / error) for the profile page and each tab.
- Accessibility (tabs, forms, headings, keyboard).
- Demo Scenario 2 (view profile tabs) and Demo Scenario 7 (employee self-service).

### 2.2 Out of scope

- Resourcing request creation / candidate proposal / review workflows (Phase 4).
- Custom **list builder** and list sharing UX (Phase 5) — Phase 3 covers only custom
  **field values** shown/edited on the profile.
- Profile sharing generation and public token view (Phase 4/5) — verify only that no
  sharing UX regressions leak into Phase 3 tabs.
- Assignment-history _write_ path (created during a resourcing decision) — Phase 3 shows
  seeded assignment history read-only; creation is Phase 4.
- Mobile / tablet / responsive breakpoints (desktop-only per BRD `AS-016`).
- Backend / persistence (frontend-only MVP).

## 3. Test Approach

Three complementary verification methods, consistent with the Phase 1/2 reports:

1. **Static gates** — `npm run build`, `npm run lint`, `npm run format:check`; exit code 0
   required. Note the `build` script also runs `playwright test`, so the E2E suite is part
   of the build gate.
2. **Automated E2E (Playwright)** — new specs under `tests/e2e/phase3/` reusing the
   existing harness (`support/test.ts`, `page-objects/`, `console-monitor.ts`). Expected
   values derive from the mock layer via a new `tests/e2e/fixtures/phase3-data.ts`
   (mirroring `phase2-data.ts`) rather than hardcoded literals, so re-seeding cannot
   silently drift expectations.
3. **Source-confirmed** — used only for non-visual architectural/ownership constraints
   (feature/layering placement, shared-ui reuse, planning artifacts). Async UI states are
   runtime-asserted where practical (forced query delay/failure).

Every case is traceable to a BRD requirement (`FR-*`/`AC-*`/`BR-*`), a ux-behavior flow,
or a ROADMAP Phase 3 deliverable.

## 4. Test Environments

| Item       | Value                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Local dev  | `npm run dev` → `http://localhost:5173` (MSW active)                                            |
| Viewport   | 1280 × 800 desktop (BRD `AS-016`); no responsive validation                                     |
| Mock layer | MSW service worker; deterministic Faker seed `faker.seed(20260625)`                             |
| Browsers   | Chromium (primary, matches Playwright default project)                                          |
| Personas   | UM `person-um-001` (Olena), DM `person-dm-001` (Marcus), Employee `person-employee-001` (Nazar) |

## 5. Test Data Baseline (deterministic)

Derived from `src/mocks/data/*`. Tests must import these via `phase3-data.ts` and assert
against computed values, not literals.

| Dataset                  | Expected                                                                                                                                                                | Source                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Feedbacks (total)        | 6; `person-employee-001` = 2, `person-um-001` = 2, `person-dm-001` = 2                                                                                                  | `feedbacks.ts`                 |
| Feedback fields          | each has `type` (HR Note / Performance / General), `content`, `authorId`, `createdAt`, `visibility`                                                                     | `feedbacks.ts` / `feedback.ts` |
| Scheduled leaves (total) | 4; `person-employee-001` = 2, `person-um-001` = 1, `person-dm-001` = 1                                                                                                  | `scheduled-leaves.ts`          |
| Scheduled leave fields   | `leaveType`, `startDate`, `endDate`, `status` (+ optional `notes`)                                                                                                      | `scheduled-leaves.ts`          |
| Risks (total)            | 20 (`Open`/`Monitoring`), all `unit-platform` subordinate-scoped; incl. High + Critical                                                                                 | `risks.ts`                     |
| Action items (total)     | 31 (26 subordinate-linked + 5 manager-owned); mix overdue/upcoming                                                                                                      | `action-items.ts`              |
| Project history          | present, person-scoped (`personId`)                                                                                                                                     | `project-history.ts`           |
| Assignment history       | present, person-scoped (`employeeId`); read-only                                                                                                                        | `assignment-history.ts`        |
| Custom field values      | `Person.customFieldValues` map                                                                                                                                          | `person.ts`                    |
| Documents seed           | Phase 3 target (PLAN §1): ≥2 per demo persona (`person-um-001`, `person-dm-001`, `person-employee-001`); types Certificate / Contract / Other. Not yet seeded — see R-1 | PLAN §1, SRS-F3-001            |
| Document fields          | each has `name`, `type`, `visibility`, `uploadedAt`, `mockFileName`                                                                                                     | SRS-F3-001 / `documents.ts`    |
| IDP seed                 | Phase 3 target (PLAN §1): 1 IDP record per demo persona. Not yet seeded — see R-1                                                                                       | PLAN §1, SRS-F3-002            |
| IDP fields               | each has `status` (Not Started / In Progress / Completed) + `documentReference`                                                                                         | SRS-F3-002 / `idp.ts`          |

### 5.1 Demo target persons

- **Managerial profile target:** any `unit-platform` subordinate; the demo default is the
  first subordinate returned by `getSubordinatesForManager('person-um-001')`. Feedbacks/
  leaves demos should also cover `person-employee-001` because it has the richest seeded
  sub-resources (2 feedbacks, 2 scheduled leaves).
- **Personal profile:** `person-employee-001` (Nazar) via the Employee role at
  `/my-profile`.

## 6. Test Suites

### 6.1 Build / Lint / Format (gate)

| ID     | Case                   | Expected                                                              | Ref                       |
| ------ | ---------------------- | --------------------------------------------------------------------- | ------------------------- |
| P3-B01 | `npm run build`        | Exit 0; `tsc -b` clean; Vite bundle produced; Playwright suite passes | quality gate, SRS-NF3-003 |
| P3-B02 | `npm run lint`         | Exit 0; no new errors (documented TanStack Table warning acceptable)  | quality gate, SRS-NF3-004 |
| P3-B03 | `npm run format:check` | Exit 0 (`All matched files use Prettier code style!`)                 | quality gate, SRS-NF3-005 |

### 6.2 Routing & Role Guards

Default active role is UM; role state is session-only (resets to UM on reload).

| ID     | Case                                       | Expected                                                                            | Ref                                                         |
| ------ | ------------------------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| P3-R01 | UM row-click / drilldown → `/people/:id`   | Full managerial profile renders (not the Phase 2 stub)                              | FR-SL-005, SRS-UX3-001, SRS-UX3-002, SRS-F3-030, SRS-F3-040 |
| P3-R02 | UM opens `/people/:id` with unknown id     | `ErrorState` "Profile not found." (no crash)                                        | ux-behavior 3.2, SRS-UX3-005, SRS-COPY3-022                 |
| P3-R03 | DM direct-navigates to `/people/:id`       | Redirected to DM landing (`/resourcing/requests`); DM cannot browse profiles        | BR-002, AS-004, SRS §6.2                                    |
| P3-R04 | Employee direct-navigates to `/people/:id` | Redirected to `/my-profile`                                                         | BR-003, SRS-F3-121, SRS §6.2                                |
| P3-R05 | Employee opens `/my-profile`               | Personal profile renders for the employee's own record only                         | FR-PV-001, AS-005, SRS-F3-130                               |
| P3-R06 | UM/DM direct-navigate to `/my-profile`     | Redirected to their own role landing (my-profile is Employee-only)                  | Phase 1 guard, SRS §6.2                                     |
| P3-R07 | Back navigation from profile               | Returns to previous page (`navigate(-1)` / "Back to Subordinates")                  | ux-behavior 3.2, SRS-UX3-006                                |
| P3-R08 | Reload on `/people/:id`                    | Role resets to UM; profile still resolves (no blank screen)                         | Phase 1 reload, SRS-UX3-002                                 |
| P3-R09 | Person outside UM's unit via direct URL    | Profile still renders — `RoleRoute` checks role, not unit (documented data concern) | ux-behavior 3.2, SRS-UX3-002                                |

### 6.3 Managerial Profile Header (FR-EP-001, AC-EP-001)

| ID     | Case                           | Expected                                                                                                          | Ref                                  |
| ------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| P3-H01 | Header fields render           | Photo placeholder/initials, full name, position, grade, unit, manager, current status, availability %, risk badge | FR-EP-001, AC-EP-001, SRS-F3-030     |
| P3-H02 | Values match seed              | Header values equal the person's seeded fields (from `phase3-data.ts`)                                            | FR-EP-001, SRS-F3-031                |
| P3-H03 | Risk badge tone not color-only | Risk level conveyed with text label in the badge, not color alone                                                 | a11y, SRS-UI3-006, SRS-A11Y3-005     |
| P3-H04 | Generate Shared Profile absent | No "Generate Shared Profile" action on the Phase 3 header (deferred to Phase 4)                                   | SRS §5.2, PLAN "Deferred to Phase 4" |

### 6.4 Profile Tabs Presence (FR-EP-002, AC-EP-002)

| ID     | Case                       | Expected                                                                                                            | Ref                                          |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| P3-T01 | Seven tabs present         | Overview, Job and Skills, Risks and Action Items, Feedbacks, Resourcing History, Project History, Documents and IDP | FR-EP-002, AC-EP-002, SRS-F3-040, SRS-F3-041 |
| P3-T02 | Overview active by default | First tab (Overview) is active on mount                                                                             | ux-behavior 4.4, SRS-F3-042                  |
| P3-T03 | Tab switch has no reload   | Switching tabs renders content without full page reload                                                             | ux-behavior 4.4, SRS-UI3-003, SRS-UX3-050    |
| P3-T04 | Tab resets on re-entry     | Navigating away and back resets to the Overview tab                                                                 | ux-behavior 4.4, SRS-UI3-005, SRS-UX3-051    |

### 6.5 Overview Tab & Scheduled Leaves (FR-EP-003, AC-EP-008)

| ID     | Case                              | Expected                                                                                        | Ref                                                       |
| ------ | --------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| P3-O01 | Basic + contact + employment info | Overview shows basic info, contact info, employment type, English level, current status         | FR-EP-003, SRS-F3-050                                     |
| P3-O02 | Summary counts                    | Overview shows summary counts for risks and open action items matching seeded counts            | FR-EP-003, SRS-F3-051                                     |
| P3-O03 | Scheduled Leaves section          | Section lists upcoming/recent leaves; each row shows leave type, start date, end date, status   | FR-EP-003, AC-EP-008, SRS-F3-052, SRS-F3-053, SRS-UI3-007 |
| P3-O04 | Scheduled Leaves seeded entry     | For a person with seeded leave (e.g. `person-employee-001`), ≥1 leave entry displays            | AC-EP-008, SRS-F3-052                                     |
| P3-O05 | Scheduled Leaves empty state      | Person with no leaves shows "No scheduled leaves" / "Scheduled leave records will appear here." | ux-behavior 5 empty, SRS-COPY3-007                        |

### 6.6 Job & Skills Tab (FR-EP-004)

| ID     | Case               | Expected                                                                                   | Ref                   |
| ------ | ------------------ | ------------------------------------------------------------------------------------------ | --------------------- |
| P3-J01 | Job fields render  | Position, grade, unit, manager, hire date, employment status, work location, English level | FR-EP-004, SRS-F3-060 |
| P3-J02 | Skills list render | Skills list displays the person's seeded skills, each with its level badge                 | FR-EP-004, SRS-F3-061 |

### 6.7 Risks & Action Items Tab (FR-EP-005)

| ID     | Case                   | Expected                                                            | Ref                                               |
| ------ | ---------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| P3-K01 | Current risk + history | Tab shows current risk level, risk history, and risk notes          | FR-EP-005, SRS-F3-070                             |
| P3-K02 | Open & closed actions  | All open and closed action items for the person display             | FR-EP-005, SRS-F3-071, SRS-UI3-008                |
| P3-K03 | Empty states           | No risks → "No risks recorded"; no action items → "No action items" | ux-behavior 5 empty, SRS-COPY3-004, SRS-COPY3-005 |

### 6.8 Feedbacks Tab — Display & Add (FR-EP-013/014, AC-EP-006/007, BR-016)

| ID     | Case                          | Expected                                                                                                | Ref                                                                        |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| P3-F01 | Chronological list            | Feedbacks display newest-first, each showing type, content, author name, date                           | FR-EP-013, AC-EP-006, SRS-F3-080, SRS-F3-082, SRS-UI3-012                  |
| P3-F02 | ≥2 seeded entries             | Target with seeded feedbacks (e.g. `person-employee-001`) shows ≥2 entries                              | AC-EP-006, SRS-F3-080                                                      |
| P3-F03 | Add Feedback opens sheet      | "Add Feedback" opens a sheet titled "Add Feedback"; first field auto-focused                            | FR-EP-014, ux-behavior 3.3, SRS-F3-081, SRS-UX3-010, SRS-UX3-060           |
| P3-F04 | Add form fields               | Type `<Select>` (HR Note/Performance/General, required) + Content `<Textarea>` (required, min 10 chars) | ux-behavior 3.3, SRS-UX3-011, SRS-COPY3-070                                |
| P3-F05 | Type required validation      | Submitting without a type shows "Type is required."                                                     | ux-behavior 3.3 edge, SRS-UX3-014, SRS-COPY3-050                           |
| P3-F06 | Content min-length validation | Content < 10 chars shows "Feedback must be at least 10 characters."                                     | ux-behavior 3.3 edge, SRS-UX3-015, SRS-COPY3-051                           |
| P3-F07 | Save prepends without reload  | On save, sheet closes, new entry appears at top of list without page reload, toast "Feedback saved."    | FR-EP-014, AC-EP-007, SRS-UX3-012, SRS-COPY3-030, SRS-UI3-010              |
| P3-F08 | Save error path               | On forced `POST` failure, sheet stays open, toast "Failed to save feedback. Try again."                 | ux-behavior 3.3, SRS-UX3-012, SRS-COPY3-031                                |
| P3-F09 | Cancel/Escape discards        | Cancel or Escape closes the sheet and discards the draft (no confirm dialog)                            | ux-behavior 3.3 edge, SRS-UX3-013, SRS-UX3-061, SRS-A11Y3-007, SRS-UI3-014 |
| P3-F10 | Feedbacks empty state         | Person with no feedback shows "No feedback recorded"                                                    | ux-behavior 5 empty, SRS-COPY3-001                                         |
| P3-F11 | Feedback entries read-only    | Seeded feedback entries show no edit/delete controls (add-only in MVP)                                  | SRS-F3-082                                                                 |

### 6.9 Resourcing vs Project History Separation (FR-EP-006/007/008, AC-EP-003)

| ID      | Case                         | Expected                                                                                                 | Ref                                                      |
| ------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| P3-RH01 | Resourcing History content   | Tab shows assignment attempts: request name, proposed date, proposed by, reviewed by, decision, feedback | FR-EP-006, FR-AH-002/003, SRS-F3-090                     |
| P3-RH02 | Project History content      | Tab shows projects: project name, role, start date, end date, allocation %                               | FR-EP-007, SRS-F3-091                                    |
| P3-RH03 | Two tabs are separate        | Resourcing History and Project History are distinct tabs showing different data — never mixed            | FR-EP-008, AC-EP-003, FR-AH-005, SRS-F3-092, SRS-UI3-013 |
| P3-RH04 | Assignment history read-only | No edit/delete controls in Resourcing History                                                            | FR-AH-006, SRS-F3-093                                    |
| P3-RH05 | Empty states                 | No resourcing history / no project history render their respective empty messages                        | ux-behavior 5 empty, SRS-COPY3-002, SRS-COPY3-003        |

### 6.10 Documents & IDP Tab (FR-EP-009)

| ID     | Case                  | Expected                                                                               | Ref                                |
| ------ | --------------------- | -------------------------------------------------------------------------------------- | ---------------------------------- |
| P3-D01 | Document list         | Documents show name, type, visibility, and upload date                                 | FR-EP-009, SRS-F3-100              |
| P3-D02 | IDP status            | IDP status displays (tone per ux-behavior 4.5: Completed/In Progress/Not Started)      | FR-EP-009, SRS-F3-101              |
| P3-D03 | Documents empty state | No documents → "No documents" / "Document records for this employee will appear here." | ux-behavior 5 empty, SRS-COPY3-006 |

### 6.11 Custom Fields (FR-EP-010, AC-EP-005)

| ID     | Case                  | Expected                                                                                           | Ref                                                                                    |
| ------ | --------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| P3-C01 | Custom fields display | Custom fields section shows all custom field values for the employee                               | FR-EP-010, SRS-F3-110                                                                  |
| P3-C02 | Edit + save reflects  | Editing a custom field value saves and displays the updated value after save (persists in-session) | FR-EP-012, AC-EP-005, SRS-F3-112, SRS-UX3-090, SRS-UX3-091, SRS-UX3-092, SRS-COPY3-037 |

### 6.12 Managerial Editing (FR-EP-012)

| ID     | Case                        | Expected                                                                                                     | Ref                                                                                                   |
| ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| P3-M01 | Editable fields for reports | UM can edit English level, IDP reference, skills, management notes, and custom field values for subordinates | FR-EP-012, SRS-F3-111, SRS-UX3-070, SRS-UX3-075, SRS-UX3-080, SRS-UX3-085, SRS-UX3-086, SRS-COPY3-073 |
| P3-M02 | Save confirmation           | Successful edits show a visible success confirmation and updated value                                       | FR-EP-012, SRS-COPY3-036, SRS-UX3-071, SRS-UX3-076, SRS-UX3-081, SRS-COPY3-033                        |

### 6.13 Manager-Only Notes Visibility (FR-EP-011, AC-EP-004, BR-016)

| ID     | Case                                   | Expected                                                   | Ref                              |
| ------ | -------------------------------------- | ---------------------------------------------------------- | -------------------------------- |
| P3-V01 | Manager notes shown in managerial view | HR/management notes visible on `/people/:id`               | FR-EP-011, SRS-F3-120            |
| P3-V02 | Manager notes hidden in personal view  | HR/management notes NOT present anywhere in `/my-profile`  | FR-EP-011, AC-EP-004, SRS-F3-121 |
| P3-V03 | Feedbacks hidden in personal view      | Feedback entries never shown in the Employee personal view | BR-016, SRS-F3-121               |

### 6.14 Personal Profile — Self-Service (FR-PV-001..007, Scenario 7)

| ID      | Case                      | Expected                                                                                                  | Ref                                                                                                                                                                                   |
| ------- | ------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P3-PV01 | Own profile only          | `/my-profile` shows only the employee's own record                                                        | FR-PV-001, BR-003, SRS-F3-130                                                                                                                                                         |
| P3-PV02 | Edit contact in place     | Contact section toggles to edit mode (phone/email/address); Save/Cancel appear                            | FR-PV-002, ux-behavior 3.11, SRS-F3-131, SRS-UX3-030                                                                                                                                  |
| P3-PV03 | Email format validation   | Invalid personal email on blur shows validation error; valid or empty allowed                             | ux-behavior 3.11, SRS-UX3-033, SRS-COPY3-052, SRS-UI3-009                                                                                                                             |
| P3-PV04 | Contact save confirmation | On save, section returns to view mode with updated values, toast "Contact information saved."             | FR-PV-002/007, SRS-UX3-031, SRS-COPY3-032                                                                                                                                             |
| P3-PV05 | Contact cancel            | Cancel restores original values, no confirm dialog                                                        | ux-behavior 3.11, SRS-UX3-032, SRS-UI3-015                                                                                                                                            |
| P3-PV06 | View own action items     | Employee can view their own action items ("assigned to you by your manager" empty copy when none)         | FR-PV-003, SRS-F3-132, SRS-COPY3-008                                                                                                                                                  |
| P3-PV07 | Update IDP status         | IDP dropdown offers Not Started / In Progress / Completed; on change, toast "IDP status updated."         | FR-PV-004, SRS-F3-133, SRS-UX3-100, SRS-UX3-101, SRS-COPY3-038                                                                                                                        |
| P3-PV08 | Add certificate           | Add Certificate form (name + mock file name, both required) adds a row at top; toast "Certificate added." | FR-PV-005, ux-behavior 3.12, SRS-F3-134, SRS-UX3-040, SRS-UX3-041, SRS-COPY3-034, SRS-UX3-042, SRS-UX3-043, SRS-COPY3-053, SRS-COPY3-054, SRS-COPY3-071, SRS-COPY3-072, SRS-COPY3-009 |
| P3-PV09 | Certificate error path    | On forced failure, toast "Could not add certificate. Try again."; form stays open                         | ux-behavior 3.12, SRS-UX3-041, SRS-COPY3-035, SRS-COPY3-033                                                                                                                           |
| P3-PV10 | Sensitive data hidden     | Personal view shows no manager notes, no risk records, no assignment history                              | FR-PV-006, AS-011, SRS-F3-121                                                                                                                                                         |
| P3-PV11 | Save confirmation generic | Every employee-saved change surfaces a visible success message                                            | FR-PV-007, SRS-F3-135                                                                                                                                                                 |

### 6.15 Async States (loading / empty / error)

| ID      | Case                   | Expected                                                                                     | Ref                                                                          |
| ------- | ---------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| P3-AS01 | Profile loading state  | `<LoadingState label="Loading profile…">` while person query pending (forced delay)          | ux-behavior 3.2, SRS-UX3-003, SRS-UI3-001, SRS-UI3-002                       |
| P3-AS02 | Profile error state    | Forced person-query failure → `ErrorState` "Could not load profile" + "Back to Subordinates" | ux-behavior 3.2, SRS-UX3-004, SRS-COPY3-020, SRS-COPY3-021                   |
| P3-AS03 | Per-tab section states | Each tab renders its loading/empty/error state without crashing the page                     | component-structure.md, SRS-UI3-011, SRS-UI3-004, SRS-UX3-052, SRS-COPY3-023 |

### 6.16 Accessibility

| ID     | Case                           | Expected                                                                                  | Ref                                                              |
| ------ | ------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| P3-A01 | Single `h1`, semantic headings | One `h1` per profile page; sections have labels/headings                                  | a11y precedent, SRS-A11Y3-001                                    |
| P3-A02 | Tabs keyboard operable         | Tab strip is keyboard reachable; arrow/Enter/Space activate tabs; visible focus           | ux-behavior 4.4, SRS-A11Y3-002                                   |
| P3-A03 | Form fields labelled           | Add Feedback / contact edit / certificate forms have associated labels and error announce | a11y, SRS-A11Y3-003, SRS-A11Y3-004, SRS-A11Y3-007, SRS-A11Y3-008 |
| P3-A04 | State containers readable      | Loading/empty/error use text + semantic containers, not color-only                        | a11y, SRS-A11Y3-005, SRS-A11Y3-006                               |
| P3-A05 | No console errors              | Zero console errors/warnings across profile + my-profile flows                            | Phase 1/2 precedent, SRS-NF3-001                                 |

### 6.17 Demo Scenarios

| ID       | Case                               | Steps / expected                                                                                                      | Ref                                                                       |
| -------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| P3-E2E01 | Scenario 2 — View Profile          | UM → Subordinates → filter/sort → click row → review all seven tabs with seeded content                               | BRD §14 S2, SRS-F3-030, SRS-F3-040, SRS-UX3-001, SRS-UX3-002, SRS-UX3-050 |
| P3-E2E02 | Scenario 7 — Employee Self-Service | Employee → My Profile → edit phone → update IDP status → add certificate → each change confirmed with success message | BRD §14 S7, SRS-F3-131, SRS-F3-133, SRS-F3-134, SRS-UX3-030, SRS-UX3-100  |

### 6.18 Non-Functional

| ID     | Case                     | Expected                                              | Ref                                 |
| ------ | ------------------------ | ----------------------------------------------------- | ----------------------------------- |
| P3-N01 | Frontend-only            | No backend/persistence; all data via MSW              | MVP scope, SRS-NF3-001, SRS-NF3-007 |
| P3-N02 | Desktop layout at 1280px | Profile + my-profile usable, no clipping/overflow     | AS-016, SRS-NF3-002                 |
| P3-N03 | Deterministic reruns     | Repeated runs yield identical seed-derived assertions | seed rule, SRS-NF3-006              |

### 6.19 Source-Confirmed Architecture & Ownership

Non-visual constraints verified by inspecting source / planning artifacts (§3 method 3),
recorded as source-confirmed rows in the execution report (matching Phase 1/2 practice).

| ID      | Case                      | Expected                                                                                      | Ref                 |
| ------- | ------------------------- | --------------------------------------------------------------------------------------------- | ------------------- |
| P3-SC01 | Query keys extended       | `query-keys.ts` exposes `documents(personId)` and `idp(personId)`                             | SRS-F3-020, PLAN §3 |
| P3-SC02 | Mutation invalidation     | Person / feedback / document / IDP mutations invalidate the affected query keys               | SRS-F3-021, PLAN §3 |
| P3-SC03 | Feature ownership         | Profile domain logic lives under `src/features/employee-profile/`; pages hold no domain logic | SRS-F3-140, PLAN §4 |
| P3-SC04 | Thin route pages          | `EmployeeProfilePage` / `MyProfilePage` are thin composition layers                           | SRS-F3-141          |
| P3-SC05 | Tabs use shared primitive | Profile tabs use `src/shared/ui/tabs` (not a bespoke tab implementation)                      | SRS-F3-041          |

## 7. Traceability Matrix (BRD → P3 → SRS)

| BRD reference                     | Requirement summary                                         | Test case(s)                   | SRS IDs                                                                                |
| --------------------------------- | ----------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| FR-EP-001 / AC-EP-001             | Profile header                                              | P3-H01–H04                     | SRS-F3-030, SRS-F3-031, SRS-UI3-006, SRS-A11Y3-005, SRS §5.2                           |
| FR-EP-002 / AC-EP-002             | All seven tabs present                                      | P3-T01–T04                     | SRS-F3-040, SRS-F3-041, SRS-F3-042, SRS-UI3-003, SRS-UX3-050, SRS-UI3-005, SRS-UX3-051 |
| FR-EP-003 / AC-EP-008 (G-2)       | Overview + Scheduled Leaves                                 | P3-O01–O05                     | SRS-F3-050–052, SRS-COPY3-007                                                          |
| FR-EP-004                         | Job & Skills tab                                            | P3-J01, P3-J02                 | SRS-F3-060, SRS-F3-061                                                                 |
| FR-EP-005                         | Risks & Action Items tab                                    | P3-K01–K03                     | SRS-F3-070, SRS-F3-071, SRS-COPY3-004, SRS-COPY3-005                                   |
| FR-EP-006 / FR-AH-002/003         | Resourcing History content                                  | P3-RH01, P3-RH04               | SRS-F3-090, SRS-F3-093                                                                 |
| FR-EP-007                         | Project History content                                     | P3-RH02                        | SRS-F3-091                                                                             |
| FR-EP-008 / AC-EP-003 / FR-AH-005 | History separation                                          | P3-RH03                        | SRS-F3-092, SRS-UI3-013                                                                |
| FR-EP-009                         | Documents & IDP tab                                         | P3-D01–D03                     | SRS-F3-100, SRS-F3-101, SRS-COPY3-006                                                  |
| FR-EP-010 / AC-EP-005             | Custom fields display + edit                                | P3-C01, P3-C02                 | SRS-F3-110, SRS-F3-112, SRS-UX3-090, SRS-UX3-091                                       |
| FR-EP-011 / AC-EP-004             | Manager notes visibility                                    | P3-V01, P3-V02                 | SRS-F3-120, SRS-F3-121                                                                 |
| FR-EP-012                         | Managerial editing                                          | P3-M01, P3-M02, P3-C02         | SRS-F3-111, SRS-UX3-070–086, SRS-COPY3-036                                             |
| FR-EP-013 / AC-EP-006             | Feedbacks list                                              | P3-F01, P3-F02, P3-F10, P3-F11 | SRS-F3-080, SRS-F3-082, SRS-UI3-012, SRS-COPY3-001                                     |
| FR-EP-014 / AC-EP-007             | Add feedback                                                | P3-F03–F09                     | SRS-F3-081, SRS-UX3-010–015, SRS-COPY3-030–031, SRS-COPY3-050–051                      |
| BR-016                            | Feedback visibility (manager-only, not personal)            | P3-V03, P3-F01                 | SRS-F3-121, SRS-F3-080                                                                 |
| FR-PV-001 / BR-003 / AS-005       | Personal view own profile                                   | P3-PV01, P3-R04, P3-R05        | SRS-F3-130, SRS-F3-121, SRS §6.2                                                       |
| FR-PV-002 / FR-PV-007             | Edit contact + confirmation                                 | P3-PV02–PV05, P3-PV11          | SRS-F3-131, SRS-F3-135, SRS-UX3-030–032, SRS-COPY3-032                                 |
| FR-PV-003                         | View own action items                                       | P3-PV06                        | SRS-F3-132, SRS-COPY3-008                                                              |
| FR-PV-004                         | Update IDP status                                           | P3-PV07                        | SRS-F3-133, SRS-UX3-100–101, SRS-COPY3-038                                             |
| FR-PV-005 / AS-008                | Add certificate                                             | P3-PV08, P3-PV09               | SRS-F3-134, SRS-UX3-040–043, SRS-COPY3-034–035                                         |
| FR-PV-006 / AS-011                | Sensitive data hidden in personal view                      | P3-PV10, P3-V02                | SRS-F3-121                                                                             |
| FR-AH-006                         | Assignment history read-only                                | P3-RH04                        | SRS-F3-093                                                                             |
| BR-002 / AS-004                   | DM cannot browse profiles                                   | P3-R03                         | SRS §6.2                                                                               |
| BRD §14 Scenario 2                | View a person's profile tabs                                | P3-E2E01                       | SRS-F3-030, SRS-F3-040, SRS-UX3-001, SRS-UX3-002                                       |
| BRD §14 Scenario 7                | Employee self-service                                       | P3-E2E02                       | SRS-F3-131, SRS-F3-133, SRS-F3-134, SRS-UX3-030, SRS-UX3-100                           |
| PLAN §3–4 (architecture)          | Query keys, invalidation, feature ownership, tabs primitive | P3-SC01–SC05                   | SRS-F3-020, SRS-F3-021, SRS-F3-041, SRS-F3-140, SRS-F3-141                             |

## 8. Proposed Automated Test Layout

Mirror the Phase 2 harness; keep expected values derived from the mock layer.

```text
tests/e2e/
  fixtures/
    phase3-data.ts            # personas, profile target, seeded feedbacks/leaves/history counts
  page-objects/
    EmployeeProfilePage.ts    # header, tab strip, tab panels, Add Feedback sheet locators
    MyProfilePage.ts          # contact edit, IDP status, add-certificate, action items locators
  phase3/
    routing-guards.spec.ts    # 6.2
    profile-header.spec.ts    # 6.3, 6.4
    profile-tabs.spec.ts      # 6.5, 6.6, 6.7, 6.9, 6.10, 6.11
    feedbacks.spec.ts         # 6.8
    managerial-editing.spec.ts# 6.12, 6.13
    my-profile.spec.ts        # 6.14
    async-states.spec.ts      # 6.15
    accessibility.spec.ts     # 6.16
    demo-scenarios.spec.ts    # 6.17
```

Run: `npm run test:e2e` (or `:ui`); the full gate runs via `npm run build`. Architecture,
shared-UI, and handoff-doc checks are recorded as source-confirmed rows in the execution
report, matching Phase 1/2 practice.

## 9. Risks, Assumptions & Open Items

| ID  | Type       | Item                                                                                                                              | Impact / action                                                                                                                                                                                                                                                      |
| --- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-1 | Risk (P1)  | No `documents.ts` or `idp.ts` seed data exists yet; Documents & IDP tab (FR-EP-009) and personal certificates (FR-PV-005) need it | PLAN §1 now specifies the target seed (≥2 documents per demo persona; 1 IDP per persona with status + documentReference); implementation must add it with MSW handlers per SRS-F3-001/002/010–013. Until then P3-D01/D02, P3-PV07/PV08 can only verify empty states. |
| R-2 | Risk       | Phase 3 `VALIDATION.md` not yet authored; entry/exit cross-ref tables deferred until validation doc exists                        | PLAN and SRS are authored; §6/§7 SRS traceability complete. Update VALIDATION.md when Ivan authors it.                                                                                                                                                               |
| R-3 | Risk       | Action-item "overdue" emphasis (reused from Phase 2) depends on live `Date.now()` vs seed due dates                               | For any overdue assertion in the profile, freeze the clock (Playwright `page.clock`) or use clearly-past seed dates.                                                                                                                                                 |
| R-4 | Assumption | Custom field edit + save persists only in session (frontend-only, MSW)                                                            | Assert the value updates in the current session; do not expect persistence across a hard reload.                                                                                                                                                                     |
| R-5 | Assumption | MSW mutation handlers (`POST feedbacks`, `PATCH contact`, `POST documents`, IDP update) exist or are added in Phase 3             | `POST /api/people/:id/feedbacks` already exists (Phase 2 boundary); contact/IDP/documents handlers must be added.                                                                                                                                                    |
| R-6 | Scope      | Assignment-history records are seeded/read-only in Phase 3; creation is Phase 4                                                   | Verify read-only display only (P3-RH01/RH04); do not test decision-driven creation.                                                                                                                                                                                  |
| R-7 | Risk       | Known lint warning `react-hooks/incompatible-library` (TanStack Table) from Phase 2                                               | Assert "no new errors"; do not fail on this single documented warning.                                                                                                                                                                                               |

## 10. Entry & Exit Criteria

### 10.1 Phase 2 process alignment

After SRS linking (§6 Ref column, §7 SRS column, SRS §16.1), Phase 3 matches Phase 2
traceability practice (PLAN + SRS before execution; SRS IDs in test Ref columns; BRD matrix)
and exceeds Phase 2 on SRS UX depth (§8–§10 interaction flows, copy strings, UI states).
Source-confirmed architecture/ownership checks are now enumerated in §6.19 (recorded as
source-confirmed rows in the execution report). The one remaining gap vs Phase 2 is the
entry/exit cross-ref to `VALIDATION.md`, deferred until Ivan authors it.

**Entry:**

- Phase 2 validation signed off (per `.planning/STATE.md`).
- Phase 3 implemented (managerial profile + personal profile) or the specific increment
  under test is available; local deps installed; `npm run dev` serves the app with MSW.
- Document/IDP seed gap (R-1) resolved or explicitly accepted for the increment.

**Exit (sign-off):**

- §6.1 gates pass (exit 0; only the documented lint warning).
- §6.2–6.14 functional cases pass (or documented, accepted deviations).
- §6.15 async-state cases pass; §6.16 accessibility cases pass with zero console errors.
- §6.17 demo Scenarios 2 and 7 pass end-to-end.
- §6.19 source-confirmed architecture rows recorded (query keys, mutation invalidation,
  feature ownership, thin pages, shared `tabs` primitive).
- All seven tabs render with seeded data; managerial vs personal visibility rules
  (FR-EP-011, BR-016, FR-PV-006) verified.
- R-1 (documents/IDP seed) resolved or explicitly accepted by Carlos/Volodymyr.
- Execution results recorded under `tests/test_reports/phase3/`; `.planning/STATE.md`
  and the Phase 3 `STATUS.md`/`VALIDATION.md` updated.
