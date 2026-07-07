# Software Requirements Specification

# Phase 5 - Custom Lists, Assignments & MVP Hardening

## 1. Document Control

| Field                | Value                                                          |
| -------------------- | -------------------------------------------------------------- |
| Product              | People Management & Resourcing MVP                             |
| Phase                | Phase 5 - Custom Lists, Assignments & MVP Hardening            |
| Document type        | Software Requirements Specification                            |
| Status               | Draft — pending Carlos Nunes approval                          |
| Implementation owner | Volodymyr                                                      |
| QA owner             | Ivan                                                           |
| Product / BA owner   | Carlos                                                         |
| Source BRD           | `docs/requirements/# Business Requirements Document.md` (v1.1) |
| Phase plan           | `.planning/phases/phase-5-custom-lists/PLAN.md`                |
| Phase test plan      | `.planning/phases/phase-5-custom-lists/phase-5-test-plan.md`   |
| Phase UX flow        | `.planning/phases/phase-5-custom-lists/UX-FLOW.md`             |
| Phase validation     | `.planning/phases/phase-5-custom-lists/VALIDATION.md`          |

## 2. Purpose

This SRS translates BRD v1.1 and the Phase 5 plan into implementation-ready software requirements for the custom lists increment, the Unit Manager Assignments section (FR-AH-004), and profile-sharing polish.

Phase 5 must deliver custom field definitions, a custom list builder with filter/column/both designation, list tabs, inline editing of custom values that reflect on the employee profile, view-only list sharing, the UM Assignments read view, and re-opening of an existing shared-profile link. It must stay frontend-only and desktop-focused.

Phase 5 is the final MVP increment. After Phase 5, all seven demo scenarios must pass. There is no deferred scope beyond Phase 5.

## 3. Source Inputs

| Source                                                       | Used for                                           |
| ------------------------------------------------------------ | -------------------------------------------------- |
| BRD FR-CL-001 through FR-CL-013                              | Custom fields and custom lists requirements        |
| BRD FR-AH-004                                                | UM Assignments section                             |
| BRD AC-CL-001 through AC-CL-006                              | Custom list acceptance criteria                    |
| BRD AC-AH-002 through AC-AH-004                              | Assignment history acceptance criteria             |
| BRD AC-EP-005                                                | Custom field value save reflected on profile       |
| BRD BR-006                                                   | Assignment vs project history separation           |
| BRD BR-007, BR-008, BR-009                                   | Inline edit scope; shared list view-only rules     |
| `docs/requirements/DECISION-LOG.md` (G-3)                    | Filter/column/both designation                     |
| `.planning/phases/phase-5-custom-lists/PLAN.md`              | Deliverables, mock gaps, feature boundaries        |
| `.planning/phases/phase-5-custom-lists/phase-5-test-plan.md` | P5-\* test traceability                            |
| `.planning/phases/phase-5-custom-lists/UX-FLOW.md`           | Layouts, click budgets, interaction contracts      |
| `docs/architecture/ux-requirements.md` §190–229              | Custom Lists screen content                        |
| `docs/architecture/ux-behavior.md` §3.4, §4.4, §5.1–5.3      | Inline edit sequence, tabs, empty/error/toast copy |
| `docs/architecture/data-models.md` §Custom List/Field        | Type-level data shapes                             |
| `docs/architecture/feature-rules.md`                         | Feature ownership and mutation side-effect rules   |
| `docs/architecture/state-and-rendering.md`                   | Query keys and mutation invalidation               |
| `docs/architecture/shared-ui.md`                             | Shared primitive ownership                         |

## 4. Phase Objective

Deliver a desktop-first custom lists and assignments experience where:

- UM can define custom fields (Text, Number, Date, Single Select, Boolean).
- UM can build a named custom list, filter employees, and designate each custom field as filter, column, or both.
- Saved lists appear as tabs; the three seeded demo lists (Bench, Booked, Needs Conversation) are pre-loaded.
- UM can inline-edit custom field values in the list; changes reflect on the employee profile.
- UM can share a list view-only with other managers; recipients edit only their own direct reports' custom values.
- UM can view assignment history aggregated in a Resourcing Assignments section, separate from project history.
- UM can re-open an existing shared-profile link without generating a new one.
- Demo Scenario 3 and all seven demo scenarios pass end-to-end.

## 5. Scope

### 5.1 In Scope

1. Migrate `custom-list.ts` to `fieldConfigs` per `data-models.md`; add `CustomFieldUsage` to `custom-field.ts`.
2. Add seed modules: `custom-fields.ts` (4 fields), `custom-lists.ts` (3 lists); migrate `people.ts` custom value keys; seed a second Unit Manager persona `person-um-002`.
3. Add MSW handlers for custom fields, custom lists, list rows, inline value edit, list sharing, resourcing assignments, and active shared profile.
4. Extend query keys for custom fields, lists, list, list rows, assignments, and active shared profile.
5. Implement `src/features/custom-lists/` module and `AssignmentsTable` under `src/features/resourcing/`.
6. Replace the placeholder `/custom-lists` page; add `/resourcing/assignments` page and navigation entries.
7. Implement inline edit per `ux-behavior §3.4` (optimistic, blur/Enter/Escape, no success toast).
8. Implement list sharing with BR-008/BR-009 semantics.
9. Implement profile-sharing re-open of existing active link.
10. Verify seed counts (20 risks; document action-item count vs BRD 30).
11. Preserve Phase 1–4 role guards; keep loading, empty, and error states per screen.

### 5.2 Out of Scope

- Backend, database, auth, file upload, or external integrations.
- Mobile/tablet responsive validation (desktop-only per BRD AS-016).
- New npm dependencies (custom controls follow Phase 4 precedent).
- Any feature not listed in §5.1 — Phase 5 has no deferred successor phase.

## 6. Users And Access Context

### 6.1 Supported Roles In Phase 5

| Role                     | Route                     | Access                                                                    |
| ------------------------ | ------------------------- | ------------------------------------------------------------------------- |
| Unit Manager (owner)     | `/custom-lists`           | Create/edit fields and lists; inline edit; share lists                    |
| Unit Manager (recipient) | `/custom-lists`           | View shared list tab; inline edit own direct reports only                 |
| Unit Manager             | `/resourcing/assignments` | View aggregated assignment history (read-only)                            |
| Sales / Delivery Mgr     | —                         | No custom-lists or assignments routes; redirect to `/resourcing/requests` |
| Employee                 | —                         | No custom-lists or assignments routes; redirect to `/my-profile`          |

### 6.2 Role Access Rules

- `/custom-lists` remains UM-only (`RoleRoute` guard, already registered).
- `/resourcing/assignments` is UM-only (new `RoleRoute` guard).
- A shared list appears in the recipient UM's tabs (FR-CL-011); its structure is read-only for recipients (BR-008).
- Recipients may inline-edit custom values only for employees they directly manage (BR-009); other rows are read-only.
- DM and Employee cannot access custom-lists or assignments routes (existing guard pattern).

## 7. Functional Requirements

### 7.1 Mock Data And Types

| ID         | Requirement                                                                                                                         | Source    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------- |
| SRS-F5-001 | `custom-list.ts` shall use `fieldConfigs: CustomListFieldConfig[]` and optional `defaultSort`.                                      | PLAN §0   |
| SRS-F5-002 | `custom-field.ts` shall export `CustomFieldUsage = 'filter' \| 'column' \| 'both'`.                                                 | PLAN §0   |
| SRS-F5-003 | `custom-fields.ts` shall seed the four demo fields (see §11.4).                                                                     | PLAN §1   |
| SRS-F5-004 | `custom-lists.ts` shall seed Bench, Booked, and Needs Conversation lists owned by `person-um-001`.                                  | FR-CL-012 |
| SRS-F5-005 | `people.ts` custom values shall be keyed by custom-field IDs.                                                                       | PLAN §1   |
| SRS-F5-006 | `person-employee-001` shall have Bench Status `Available` and `currentProjectStatus` compatible with the Bench list for Scenario 3. | PLAN §1   |
| SRS-F5-007 | A second Unit Manager persona `person-um-002` shall be seeded as a real `Person` record in its own unit.                            | PLAN §1   |
| SRS-F5-008 | The person factory shall emit deterministic custom values keyed by field IDs.                                                       | PLAN §1   |
| SRS-F5-009 | Faker seed shall remain `faker.seed(20260625)`.                                                                                     | PLAN §1   |

### 7.2 Mock API Endpoints

| ID         | Requirement                                                                                                                      | Source               |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| SRS-F5-010 | MSW shall expose `GET /api/custom-fields?ownerManagerId=`.                                                                       | FR-CL-001            |
| SRS-F5-011 | MSW shall expose `POST /api/custom-fields` creating a field definition.                                                          | FR-CL-001            |
| SRS-F5-012 | MSW shall expose `PATCH /api/custom-fields/:id` for edit/deactivate.                                                             | FR-CL-001            |
| SRS-F5-013 | MSW shall expose `GET /api/custom-lists?managerId=` returning owned and shared-with lists.                                       | FR-CL-003, FR-CL-011 |
| SRS-F5-014 | MSW shall expose `POST /api/custom-lists` creating a list.                                                                       | FR-CL-002            |
| SRS-F5-015 | MSW shall expose `PATCH /api/custom-lists/:id` for structure edits by the owner only.                                            | FR-CL-002, BR-008    |
| SRS-F5-016 | MSW shall expose `POST /api/custom-lists/:id/share` with `{ managerIds[] }`.                                                     | FR-CL-010            |
| SRS-F5-017 | MSW shall expose `GET /api/custom-lists/:id/rows?managerId=` returning filtered rows with values and an `editable` flag per row. | FR-CL-004, BR-009    |
| SRS-F5-018 | MSW shall expose `PATCH /api/people/:personId/custom-field-values` accepting `{ fieldId, value }`.                               | FR-CL-005            |
| SRS-F5-019 | The custom-field-value PATCH shall update `Person.customFieldValues` in the in-memory store.                                     | FR-CL-005, AC-CL-003 |
| SRS-F5-020 | MSW shall expose `GET /api/resourcing/assignments?managerId=` returning aggregated assignment history for the unit.              | FR-AH-004            |
| SRS-F5-021 | MSW shall expose `GET /api/shared-profiles/active?personId=` returning the active shared profile if one exists.                  | FR-PS-004            |
| SRS-F5-022 | New handlers shall be appended without altering existing Phase 1–4 handler response shapes.                                      | PRE-BUILD §2         |

### 7.3 Query Keys And Invalidation

| ID         | Requirement                                                                                                                      | Source  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| SRS-F5-023 | Query keys shall include `customFields(managerId)`, `customLists(managerId)`, `customList(id)`, `customListRows(id, managerId)`. | PLAN §3 |
| SRS-F5-024 | Query keys shall include `assignments(managerId)` and `activeSharedProfile(personId)`.                                           | PLAN §3 |
| SRS-F5-025 | Inline edit shall invalidate `person(id)` and `customListRows(*)`.                                                               | PLAN §3 |
| SRS-F5-026 | List create/edit shall invalidate `customLists`, `customList`, `customListRows`.                                                 | PLAN §3 |
| SRS-F5-027 | Share shall invalidate `customLists`.                                                                                            | PLAN §3 |
| SRS-F5-028 | Field CRUD shall invalidate `customFields`.                                                                                      | PLAN §3 |

### 7.4 Custom Field Definition (FR-CL-001)

| ID         | Requirement                                                                                             | Source               |
| ---------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| SRS-F5-100 | UM shall create custom fields of type Text, Number, Date, Single Select, and Boolean.                   | FR-CL-001            |
| SRS-F5-101 | Single Select fields shall define their allowed options.                                                | FR-CL-001, FR-CL-008 |
| SRS-F5-102 | A field shall carry `isSensitive` and `isActive` flags.                                                 | data-models          |
| SRS-F5-103 | The field form shall validate name required and options required for Single Select.                     | FR-CL-001            |
| SRS-F5-104 | Custom fields shall be owner-scoped by `createdByManagerId`.                                            | AS (manager-owned)   |
| SRS-F5-105 | Deactivating a field shall exclude it from new list configuration but preserve existing values.         | FR-CL-001            |
| SRS-F5-106 | The field form shall use React Hook Form with a Zod schema in `custom-lists/schemas/`.                  | feature-rules        |
| SRS-F5-107 | Custom field CRUD logic shall live under `src/features/custom-lists/`.                                  | feature-rules        |
| SRS-F5-108 | Sensitive custom fields shall be excluded from shared profiles by default (consistency with FR-PS-003). | FR-PS-003            |
| SRS-F5-109 | Field creation shall show a success toast; failure an error toast.                                      | ux-behavior §5.3     |
| SRS-F5-110 | Field type shall not be editable after creation if values already exist (avoid type coercion).          | data integrity       |

### 7.5 List Builder (FR-CL-002, AC-CL-006)

| ID         | Requirement                                                                                           | Source                    |
| ---------- | ----------------------------------------------------------------------------------------------------- | ------------------------- |
| SRS-F5-200 | UM shall create a named custom list via "New List" opening a Sheet.                                   | FR-CL-002                 |
| SRS-F5-201 | The builder shall require a list name.                                                                | FR-CL-002                 |
| SRS-F5-202 | The builder shall provide an employee filter section (position, grade, status, risk).                 | FR-CL-002                 |
| SRS-F5-203 | For each custom field, the builder shall provide a usage control with values Filter, Column, or Both. | FR-CL-002, AC-CL-006, G-3 |
| SRS-F5-204 | A field designated Column or Both shall render as a table column.                                     | AC-CL-006                 |
| SRS-F5-205 | A field designated Filter or Both shall render a filter control in the filter bar.                    | AC-CL-006                 |
| SRS-F5-206 | Saving a list shall persist `employeeFilter` and `fieldConfigs`.                                      | FR-CL-002                 |
| SRS-F5-207 | Editing a list (owner) shall update its structure via PATCH.                                          | FR-CL-002, BR-008         |
| SRS-F5-208 | Recipients shall not see structure-edit controls for shared lists.                                    | BR-008                    |
| SRS-F5-209 | The builder shall use React Hook Form with a Zod schema.                                              | feature-rules             |
| SRS-F5-210 | The builder shall show a success toast on save; error toast on failure.                               | ux-behavior §5.3          |
| SRS-F5-211 | The name field placeholder shall be "e.g. Bench — Q3 2026".                                           | SRS-COPY5-006             |
| SRS-F5-212 | The list shall respect the usage designation when rendering filter controls and columns.              | AC-CL-006                 |
| SRS-F5-213 | System fields shall not be selectable as custom columns in the builder.                               | BR-007                    |
| SRS-F5-214 | A newly created list shall appear immediately as a tab without page reload.                           | FR-CL-003                 |
| SRS-F5-215 | List builder logic shall live under `src/features/custom-lists/`.                                     | feature-rules             |

### 7.6 List Tabs And Table (FR-CL-003, FR-CL-013)

| ID         | Requirement                                                                         | Source               |
| ---------- | ----------------------------------------------------------------------------------- | -------------------- |
| SRS-F5-300 | Each saved list shall appear as a tab on `/custom-lists`.                           | FR-CL-003            |
| SRS-F5-301 | The three seeded demo lists shall be pre-loaded and usable.                         | FR-CL-012, AC-CL-001 |
| SRS-F5-302 | The list table shall render system columns and configured custom columns.           | FR-CL-004            |
| SRS-F5-303 | The filter bar shall render controls for filter/both fields and apply them to rows. | FR-CL-002            |
| SRS-F5-304 | Date fields shall use one consistent date format across the app.                    | FR-CL-009            |
| SRS-F5-305 | Boolean fields shall display as checkbox/toggle in edit mode.                       | FR-CL-007            |
| SRS-F5-306 | Single Select fields shall display a dropdown of configured options in edit mode.   | FR-CL-008            |
| SRS-F5-307 | An empty list (no matching employees) shall show the empty state SRS-COPY5-001.     | FR-CL-013            |
| SRS-F5-308 | A list with no configured fields shall show the empty state SRS-COPY5-002.          | FR-CL-013            |
| SRS-F5-309 | Table rows shall be keyboard navigable per `ux-behavior §6.3`.                      | a11y                 |
| SRS-F5-310 | Tabs shall follow the shared tab primitive and `ux-behavior §4.4` behavior.         | shared-ui            |
| SRS-F5-311 | Active tab shall persist within a single page visit.                                | ux-behavior §4.4     |
| SRS-F5-312 | The page shall show page-tier loading, section loading, empty, and error states.    | SRS-UI5-001          |

### 7.7 Inline Edit (FR-CL-004–008, BR-007)

| ID         | Requirement                                                                                         | Source                          |
| ---------- | --------------------------------------------------------------------------------------------------- | ------------------------------- |
| SRS-F5-400 | Clicking a custom-field cell shall enter inline edit mode.                                          | FR-CL-004, AC-CL-002            |
| SRS-F5-401 | Edit mode shall render the control matching the field type.                                         | FR-CL-007, FR-CL-008            |
| SRS-F5-402 | Only one cell shall be in edit mode at any time.                                                    | ux-behavior §3.4                |
| SRS-F5-403 | Enter or Tab shall commit; Escape shall cancel and revert.                                          | ux-behavior §3.4                |
| SRS-F5-404 | Clicking outside the cell shall commit the value.                                                   | ux-behavior §3.4                |
| SRS-F5-405 | Commit shall PATCH `/api/people/:personId/custom-field-values` and update the value optimistically. | FR-CL-005, AC-CL-003            |
| SRS-F5-406 | On error, the cell shall revert and an error toast SRS-COPY5-005 shall fire.                        | ux-behavior §3.4                |
| SRS-F5-407 | Individual cell saves shall not show a success toast.                                               | SRS-COPY5-004                   |
| SRS-F5-408 | System field cells shall not enter edit mode and shall use `cursor-default`.                        | FR-CL-006, AC-CL-004, BR-007    |
| SRS-F5-409 | Number cells shall reject non-numeric input and revert invalid values on blur.                      | ux-behavior §3.4                |
| SRS-F5-410 | Saving a cell shall update the value visible on the employee profile.                               | FR-CL-005, AC-CL-003, AC-EP-005 |
| SRS-F5-411 | Boolean cells shall commit on toggle.                                                               | FR-CL-007                       |
| SRS-F5-412 | Single Select cells shall commit on option selection.                                               | FR-CL-008                       |
| SRS-F5-413 | For shared lists, cells shall be editable only for the viewer's direct reports.                     | BR-009                          |
| SRS-F5-414 | Inline edit logic shall live under `src/features/custom-lists/`.                                    | feature-rules                   |
| SRS-F5-415 | Optimistic update shall roll back on failure without losing other cell state.                       | ux-behavior §3.4                |

### 7.8 List Sharing (FR-CL-010–011, BR-008, BR-009)

| ID         | Requirement                                                                      | Source               |
| ---------- | -------------------------------------------------------------------------------- | -------------------- |
| SRS-F5-500 | UM shall share a list with selected managers via a Share sheet.                  | FR-CL-010            |
| SRS-F5-501 | Shared lists shall appear in the recipient's Custom Lists tabs.                  | FR-CL-011, AC-CL-005 |
| SRS-F5-502 | Recipients shall not be able to change the list structure or settings.           | BR-008               |
| SRS-F5-503 | Recipients shall inline-edit custom values only for their own direct reports.    | BR-009               |
| SRS-F5-504 | Rows for employees not managed by the recipient shall be read-only.              | BR-009               |
| SRS-F5-505 | The Share sheet shall list eligible managers (e.g. `person-um-002`).             | FR-CL-010            |
| SRS-F5-506 | Sharing shall update `sharedWithManagerIds` on the list.                         | FR-CL-010            |
| SRS-F5-507 | The owner shall retain full edit control after sharing.                          | BR-008               |
| SRS-F5-508 | Sharing shall show a success toast; failure an error toast.                      | ux-behavior §5.3     |
| SRS-F5-509 | Unsharing (removing a manager) shall remove the list from that recipient's tabs. | FR-CL-010            |
| SRS-F5-510 | Sharing logic shall live under `src/features/custom-lists/`.                     | feature-rules        |

### 7.9 UM Assignments Section (FR-AH-004)

| ID         | Requirement                                                                                     | Source               |
| ---------- | ----------------------------------------------------------------------------------------------- | -------------------- |
| SRS-F5-600 | UM shall access an Assignments section at `/resourcing/assignments`.                            | FR-AH-004            |
| SRS-F5-601 | The section shall display aggregated assignment history for the manager's unit.                 | FR-AH-004            |
| SRS-F5-602 | Each record shall show request title, candidate type, decision, decision date, and status.      | AC-AH-002            |
| SRS-F5-603 | The Assignments section shall be read-only.                                                     | AC-AH-004, FR-AH-006 |
| SRS-F5-604 | Assignment history shall never be shown in the same view as project history.                    | BR-006, AC-AH-003    |
| SRS-F5-605 | The section shall show loading, empty, and error states.                                        | SRS-UI5-001          |
| SRS-F5-606 | The Assignments table shall live under `src/features/resourcing/components/assignments-table/`. | feature-rules        |

### 7.10 Profile Sharing Polish (FR-PS-004)

| ID         | Requirement                                                                                     | Source           |
| ---------- | ----------------------------------------------------------------------------------------------- | ---------------- |
| SRS-F5-700 | On sheet open, the app shall query `activeSharedProfile(personId)`.                             | ux-behavior §3.5 |
| SRS-F5-701 | If an active link exists, the sheet shall display it with Copy instead of forcing regeneration. | ux-behavior §3.5 |
| SRS-F5-702 | Copy shall show the info toast SRS-COPY4-011 (existing copy string reused).                     | ux-behavior §3.5 |
| SRS-F5-703 | If no active link exists, the sheet shall behave as in Phase 4 (generate flow).                 | Phase 4          |

### 7.11 Feature Ownership

| ID         | Requirement                                                                                | Source              |
| ---------- | ------------------------------------------------------------------------------------------ | ------------------- |
| SRS-F5-800 | Custom lists domain logic shall live under `src/features/custom-lists/`.                   | feature-rules       |
| SRS-F5-801 | Assignments read table shall live under `src/features/resourcing/`.                        | feature-rules       |
| SRS-F5-802 | Route pages shall remain thin composition layers.                                          | component-structure |
| SRS-F5-803 | Cross-feature data shall come from `src/types/` and the mock layer, not feature internals. | feature-rules       |

## 8. UX Interaction Requirements

### 8.1 Custom List Inline Edit (`ux-behavior` §3.4)

| ID          | Trigger                 | UI                  | API                             | Success                                    | Error                             |
| ----------- | ----------------------- | ------------------- | ------------------------------- | ------------------------------------------ | --------------------------------- |
| SRS-UX5-001 | Click custom-field cell | Cell → edit control | none                            | Edit mode; auto-focus                      | —                                 |
| SRS-UX5-002 | Enter/Tab/blur          | Commit              | `PATCH .../custom-field-values` | Optimistic value; no toast (SRS-COPY5-004) | Revert; error toast SRS-COPY5-005 |
| SRS-UX5-003 | Escape                  | Cancel              | none                            | Revert to prior value                      | —                                 |

### 8.2 List Builder (Sheet)

| ID          | Trigger               | UI           | API                            | Success                        | Error                       |
| ----------- | --------------------- | ------------ | ------------------------------ | ------------------------------ | --------------------------- |
| SRS-UX5-010 | Click New List / Edit | Sheet        | `POST/PATCH /api/custom-lists` | New/updated tab; success toast | Toast; sheet stays open     |
| SRS-UX5-011 | Save with empty name  | Inline error | none                           | —                              | Validation under name field |

### 8.3 Share List (Sheet)

| ID          | Trigger       | UI    | API                                | Success                      | Error                   |
| ----------- | ------------- | ----- | ---------------------------------- | ---------------------------- | ----------------------- |
| SRS-UX5-020 | Confirm share | Sheet | `POST /api/custom-lists/:id/share` | Success toast; recipient tab | Toast; sheet stays open |

### 8.4 Assignments View

| ID          | Trigger                        | UI        | API                               | Success         | Error      |
| ----------- | ------------------------------ | --------- | --------------------------------- | --------------- | ---------- |
| SRS-UX5-030 | Open `/resourcing/assignments` | Page load | `GET /api/resourcing/assignments` | Read-only table | ErrorState |

### 8.5 Shared Profile Re-open

| ID          | Trigger             | UI    | API                               | Success                       | Error         |
| ----------- | ------------------- | ----- | --------------------------------- | ----------------------------- | ------------- |
| SRS-UX5-040 | Open generate sheet | Sheet | `GET /api/shared-profiles/active` | Existing link shown with Copy | Generate flow |

## 9. UI State Requirements

| ID          | Requirement                                                                                 | Source           |
| ----------- | ------------------------------------------------------------------------------------------- | ---------------- |
| SRS-UI5-001 | `/custom-lists` and `/resourcing/assignments` shall use page-tier loading while data loads. | ux-behavior §1.1 |
| SRS-UI5-002 | List rows shall show section-tier loading (skeleton) while rows load.                       | ux-behavior §1.1 |
| SRS-UI5-003 | Empty custom list shall render `EmptyState` per SRS-COPY5-001/002.                          | ux-behavior §5.1 |
| SRS-UI5-004 | Load failure shall render `ErrorState` per SRS-COPY5-003.                                   | ux-behavior §5.2 |
| SRS-UI5-005 | Status/domain values shall use tones from `ux-behavior §4.5`.                               | visual-theme     |
| SRS-UI5-006 | Inline edit shall update the cell optimistically and revert on error.                       | ux-behavior §3.4 |
| SRS-UI5-007 | Assignments empty state shall reuse the resourcing-history empty copy pattern.              | ux-behavior §5.1 |

## 10. Copy Requirements

| ID            | String                                                                                                      | Source                  |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------- |
| SRS-COPY5-001 | Title "No employees match"; Description "No employees in this unit match the list's filters."               | ux-behavior §5.1        |
| SRS-COPY5-002 | Title "List not configured"; Description "Add columns to this list to start tracking employees."            | ux-behavior §5.1        |
| SRS-COPY5-003 | Title "Could not load list"; Description "Refresh the page to try again."                                   | ux-behavior §5.2        |
| SRS-COPY5-004 | Custom field cell saved — (no toast)                                                                        | ux-behavior §5.3        |
| SRS-COPY5-005 | Error toast: `Could not save "[field name]". Change was not applied.`                                       | ux-behavior §5.3        |
| SRS-COPY5-006 | Custom list name placeholder: "e.g. Bench — Q3 2026"                                                        | ux-behavior form fields |
| SRS-COPY5-007 | Assignments empty: Title "No assignments"; Description "Assignment history for your unit will appear here." | derived §5.1            |

## 11. Data Contracts

### 11.1 Custom List (migrated)

```ts
// src/types/custom-list.ts
export type CustomFieldUsage = 'filter' | 'column' | 'both'

export type CustomListFieldConfig = {
  customFieldId: string
  usage: CustomFieldUsage
}

export type CustomList = {
  id: string
  name: string
  description?: string
  ownerManagerId: string
  sharedWithManagerIds: string[]
  employeeFilter: Record<string, string | string[]>
  fieldConfigs: CustomListFieldConfig[]
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
}
```

### 11.2 Inline edit payload

```ts
type PatchCustomFieldValueBody = { fieldId: string; value: string | number | boolean | null }
```

### 11.3 List rows response

```ts
type CustomListRow = {
  person: Person
  values: Record<string, CustomFieldValue> // keyed by customFieldId
  editable: boolean // BR-009: true only for the viewer's direct reports
}
```

### 11.4 Seeded custom fields

| ID                            | Name                   | Type          | Options                          |
| ----------------------------- | ---------------------- | ------------- | -------------------------------- |
| `field-bench-status-001`      | Bench Status           | Single Select | Available, Interviewing, On Hold |
| `field-bench-readiness-002`   | Bench Readiness        | Boolean       | —                                |
| `field-last-conversation-003` | Last Conversation Date | Date          | —                                |
| `field-booking-notes-004`     | Booking Notes          | Text          | —                                |

### 11.5 Seeded custom lists (owner `person-um-001`)

| ID                            | Name               | Filter                         | fieldConfigs (usage)                          |
| ----------------------------- | ------------------ | ------------------------------ | --------------------------------------------- |
| `list-bench-001`              | Bench              | `currentProjectStatus: Bench`  | bench-status (both), bench-readiness (column) |
| `list-booked-001`             | Booked             | `currentProjectStatus: Booked` | booking-notes (column)                        |
| `list-needs-conversation-001` | Needs Conversation | last conversation older than N | last-conversation (both)                      |

## 12. Page And Route Requirements

| Route                     | Guard   | Layout    | Notes                    |
| ------------------------- | ------- | --------- | ------------------------ |
| `/custom-lists`           | UM only | AppLayout | Replace placeholder body |
| `/resourcing/assignments` | UM only | AppLayout | New route + nav item     |

Navigation: add **Custom Lists** and **Assignments** to `navigationItemsByRole['unit-manager']`.

## 13. Non-Functional Requirements

| ID          | Requirement                                                      |
| ----------- | ---------------------------------------------------------------- |
| SRS-NF5-001 | `npm run build` exits 0.                                         |
| SRS-NF5-002 | `npm run lint` exits 0.                                          |
| SRS-NF5-003 | `npm run format:check` exits 0.                                  |
| SRS-NF5-004 | No new npm dependencies.                                         |
| SRS-NF5-005 | Desktop-only 1280×800; deterministic Faker seed; stable renders. |

## 14. Accessibility Requirements

| ID            | Requirement                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| SRS-A11Y5-001 | Inline edit shall be keyboard operable (Enter/Tab commit, Escape cancel).        |
| SRS-A11Y5-002 | Focus shall move into the cell control on edit and return to the cell on commit. |
| SRS-A11Y5-003 | Tabs shall expose correct roles and be keyboard navigable.                       |
| SRS-A11Y5-004 | Builder/share/field forms shall associate labels and validation with inputs.     |
| SRS-A11Y5-005 | Async states shall use `aria-busy` (loading) and `role="alert"` (error).         |
| SRS-A11Y5-006 | Checkboxes and selects shall be keyboard operable.                               |
| SRS-A11Y5-007 | Tables shall be keyboard navigable per `ux-behavior §6.3`.                       |
| SRS-A11Y5-008 | No console errors during custom-lists and assignments flows.                     |

## 15. Implementation Constraints

- Keep pages thin; put domain logic in `src/features/custom-lists/` and `src/features/resourcing/`.
- MSW-only writes; no client-only persistence for shared state.
- Append-only handlers and query keys; do not alter Phase 1–4 shapes.
- Migrate the `custom-list.ts` type, its seeds, and any consumers in one coherent change.
- No Phase 1–4 regressions; run the regression gate after each major step.

## 16. Traceability Matrix

| BRD                                  | SRS-F5          | P5 tests     |
| ------------------------------------ | --------------- | ------------ |
| FR-CL-001                            | SRS-F5-100–110  | P5-LB01      |
| FR-CL-002, AC-CL-006                 | SRS-F5-200–215  | P5-LB01–LB06 |
| FR-CL-003, AC-CL-001, FR-CL-012      | SRS-F5-300–312  | P5-CL01–CL04 |
| FR-CL-004–008, AC-CL-002–004, BR-007 | SRS-F5-400–415  | P5-IE01–IE10 |
| FR-CL-005, AC-CL-003, AC-EP-005      | SRS-F5-405, 410 | P5-SY01–SY02 |
| FR-CL-010–011, AC-CL-005, BR-008–009 | SRS-F5-500–510  | P5-LS01–LS05 |
| FR-CL-013                            | SRS-F5-307–308  | P5-CL04      |
| FR-AH-004, AC-AH-002–004, BR-006     | SRS-F5-600–606  | P5-AH01–AH04 |
| FR-PS-004 (polish)                   | SRS-F5-700–703  | P5-PS01–PS03 |
| BRD §14 Scenario 3                   | §17.8           | P5-D03       |

## 17. Acceptance Criteria

### 17.1 Build / Lint / Format

Build, lint, format exit 0 (P5-B01–B03).

### 17.2 Custom Lists

Three seeded tabs; tab switch; filter bar; empty state (P5-CL01–CL04).

### 17.3 Builder

New list; name required; filter/column/both persist and render (P5-LB01–LB06).

### 17.4 Inline Edit

All 5 field types; escape/cancel; one-at-a-time; system read-only; no success toast; error revert (P5-IE01–IE10).

### 17.5 Profile Sync

Edited value reflected on profile; `person(id)` invalidated (P5-SY01–SY02).

### 17.6 Sharing

Share; recipient tab; view-only structure; BR-009 edit scope; owner unaffected (P5-LS01–LS05).

### 17.7 Assignments

Route renders; records shown; read-only; separate from project history (P5-AH01–AH04).

### 17.8 Demo Scenario 3

Open Custom Lists → Bench tab → edit Bench Status inline → open employee profile → value changed (P5-D03).

## 18. QA Validation Mapping

| SRS section | VALIDATION.md section | Spec file                       |
| ----------- | --------------------- | ------------------------------- |
| §7.4–7.5    | Builder               | `list-builder.spec.ts`          |
| §7.6        | Custom lists          | `custom-list-tabs.spec.ts`      |
| §7.7        | Inline edit           | `inline-edit.spec.ts`           |
| §7.8        | List sharing          | `list-sharing.spec.ts`          |
| §7.9        | Assignments           | `assignments-section.spec.ts`   |
| §7.10       | Shared profile polish | `shared-profile-polish.spec.ts` |
| §8/§9       | Async states          | `async-states.spec.ts`          |
| §14         | Accessibility         | `accessibility.spec.ts`         |
| §17.8       | Demo scenarios        | `demo-scenarios.spec.ts`        |
| §15         | Source-confirmed      | `source-confirmed.spec.ts`      |

## 19. Open Decisions

| Decision                                                    | Owner  | Status                                               |
| ----------------------------------------------------------- | ------ | ---------------------------------------------------- |
| Action item count 33 vs BRD 30                              | Carlos | Accept as-is or trim to 30 in seed (default: accept) |
| Assignments placement (`/resourcing/assignments` new route) | Carlos | Proposed; confirm at SRS approval                    |

## 20. Deferred to Phase 6+

None. Phase 5 closes the MVP scope.

## 21. Definition Of Done

Phase 5 is **done** when:

- [ ] §13 gates pass (exit 0).
- [ ] §7 functional requirements implemented and covered by P5-\* tests.
- [ ] Type migration, seeds, and second UM persona complete.
- [ ] Inline edit, sharing, assignments, and shared-profile re-open verified.
- [ ] Demo Scenarios 1–7 pass; Phases 1–4 regression green.
- [ ] Execution results recorded under `tests/test_reports/phase5/`; `STATE.md`, `PROJECT.md`, `STATUS.md` updated.
- [ ] Carlos signs off product review against this SRS.
- [ ] Ivan signs off Phase 5 validation → MVP complete.
