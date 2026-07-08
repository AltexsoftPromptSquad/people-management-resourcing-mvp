# Phase 5 — Custom Lists, Assignments & MVP Hardening

**Phase:** 5 of 5
**Owner:** Volodymyr (development), Ivan (QA/validation)
**Depends on:** Phase 4 complete ✅ (Ivan sign-off `.planning/phases/phase-4-resourcing/VALIDATION.md`, 2026-07-06)
**BRD version:** v1.1
**Validation checklist:** `.planning/phases/phase-5-custom-lists/VALIDATION.md`
**Test plan:** `.planning/phases/phase-5-custom-lists/phase-5-test-plan.md`
**SRS:** `.planning/phases/phase-5-custom-lists/SRS.md`
**UX flow:** `.planning/phases/phase-5-custom-lists/UX-FLOW.md`
**Pre-build package:** `.planning/phases/phase-5-custom-lists/PRE-BUILD-FINAL.md`
**Product approval:** Carlos Nunes, 2026-07-07 (SRS scope)

---

## Goal

Deliver custom fields and custom lists (definition, builder, tabs, inline edit, sharing), the Unit Manager Assignments section (FR-AH-004), and profile-sharing polish. After Phase 5, **Demo Scenario 3** passes and **all 7 demo scenarios** pass end-to-end — the MVP is complete.

Phase 5 is additive. It must not regress Phase 1–4 routes, guards, resourcing flows, or profile behavior.

---

## Scope

### 0. Type Alignment (`src/types/`)

| Type file         | Current                                                                      | Phase 5 target                                                                                                                           | Source                            |
| ----------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `custom-list.ts`  | `visibleColumns: string[]`, `filterableFields: string[]`, `defaultSort` req. | Replace with `fieldConfigs: CustomListFieldConfig[]`; make `defaultSort?` optional; `employeeFilter: Record<string, string \| string[]>` | data-models.md §Custom List (G-3) |
| `custom-field.ts` | Exists (5 types, `isSensitive`, `isActive`)                                  | Add exported `CustomFieldUsage = 'filter' \| 'column' \| 'both'`                                                                         | data-models.md §Custom Field      |
| `person.ts`       | `customFieldValues: Record<string, CustomFieldValue>`                        | No shape change; migrate seed **keys** to custom-field IDs                                                                               | —                                 |

`CustomFieldValue = string | number | boolean | null` is already defined in `person.ts`.

### 1. Mock Data Gaps (`src/mocks/data`)

| File                  | Status      | Phase 5 target                                                                                                                                                                                                    |
| --------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `custom-fields.ts`    | **Missing** | Seed 4 fields (see Demo Seed Registry); owner `person-um-001`                                                                                                                                                     |
| `custom-lists.ts`     | **Missing** | Seed 3 lists: Bench, Booked, Needs Conversation (FR-CL-012)                                                                                                                                                       |
| `people.ts`           | Exists      | Migrate `customFieldValues` keys from `benchReadiness`/`lastConversationDate` to field IDs; set `person-employee-001` Bench Status = `Available` for Scenario 3                                                   |
| `person-factory.ts`   | Exists      | Emit generated custom values keyed by field IDs (keep deterministic)                                                                                                                                              |
| **Second UM persona** | **Missing** | Seed `person-um-002` as a real `Person` record in its own unit — `person-manager-002`/`-003` are referenced in `unitAssignments` but are **not** seeded people; a real recipient is required for the sharing demo |

Faker seed: keep `faker.seed(20260625)` unchanged.

### 2. MSW Handlers (`src/mocks/handlers.ts`)

| Endpoint                                          | Status      | Use                                                |
| ------------------------------------------------- | ----------- | -------------------------------------------------- |
| `GET /api/custom-fields?ownerManagerId=`          | **Missing** | Builder field picker (FR-CL-001)                   |
| `POST /api/custom-fields`                         | **Missing** | Create field                                       |
| `PATCH /api/custom-fields/:id`                    | **Missing** | Edit / deactivate field                            |
| `GET /api/custom-lists?managerId=`                | **Missing** | Owned + shared-with lists                          |
| `POST /api/custom-lists`                          | **Missing** | Create list                                        |
| `PATCH /api/custom-lists/:id`                     | **Missing** | Edit structure (owner only, BR-008)                |
| `POST /api/custom-lists/:id/share`                | **Missing** | Share with managers `{ managerIds[] }` (FR-CL-010) |
| `GET /api/custom-lists/:id/rows?managerId=`       | **Missing** | Filtered rows + column values + `editable`         |
| `PATCH /api/people/:personId/custom-field-values` | **Missing** | Inline edit `{ fieldId, value }` (FR-CL-005)       |
| `GET /api/resourcing/assignments?managerId=`      | **Missing** | FR-AH-004 aggregated read                          |
| `GET /api/shared-profiles/active?personId=`       | **Missing** | Polish: re-open existing link                      |

The existing `PATCH /api/people/:id` handler already merges `customFieldValues` (handlers.ts ~L159–162); the dedicated custom-field-values endpoint implements the inline-edit contract in `ux-behavior §3.4` and must invalidate the same `person(id)` cache so the profile reflects edits.

### 3. Query Keys (`src/lib/query/query-keys.ts`) — append only

```ts
customFields: (managerId: string) => ['custom-fields', managerId] as const,
customLists: (managerId: string) => ['custom-lists', managerId] as const,
customList: (id: string) => ['custom-list', id] as const,
customListRows: (id: string, managerId: string) => ['custom-list-rows', id, managerId] as const,
assignments: (managerId: string) => ['assignments', managerId] as const,
activeSharedProfile: (personId: string) => ['shared-profile', 'active', personId] as const,
```

Invalidation:

- Inline edit → `person(id)`, `customListRows(*)`.
- List create/edit → `customLists`, `customList`, `customListRows`.
- Share → `customLists`.
- Field CRUD → `customFields`.

### 4. Feature Modules

```
src/features/custom-lists/
  api/
    get-custom-fields.ts
    post-custom-field.ts
    patch-custom-field.ts
    get-custom-lists.ts
    post-custom-list.ts
    patch-custom-list.ts
    post-share-custom-list.ts
    get-custom-list-rows.ts
    patch-custom-field-value.ts
  hooks/
    use-custom-fields-query.ts
    use-custom-lists-query.ts
    use-custom-list-rows-query.ts
    (mutation hooks: field create/edit, list create/edit, share, inline edit)
  components/
    custom-list-tabs/CustomListTabs.tsx
    custom-list-table/CustomListTable.tsx
    custom-list-filter-bar/CustomListFilterBar.tsx
    inline-edit-cell/InlineEditCell.tsx
    list-builder-sheet/ListBuilderSheet.tsx
    share-list-sheet/ShareListSheet.tsx
    custom-field-form-sheet/CustomFieldFormSheet.tsx
  utils/
    list-filter.ts          # apply employeeFilter + URL filter state
    field-config.ts         # filter vs column vs both resolution
  schemas/
    custom-field.schema.ts  # RHF + Zod (Phase 4 resourcing pattern)
    custom-list.schema.ts

src/features/resourcing/components/assignments-table/AssignmentsTable.tsx   # FR-AH-004 (read-only)
```

Pages stay thin:

- `src/pages/custom-lists-page/CustomListsPage.tsx` — replace placeholder body; compose tabs + filters + table.
- `src/pages/resourcing-assignments-page/ResourcingAssignmentsPage.tsx` — new; compose `AssignmentsTable`.

### 5. Custom Lists Page (`/custom-lists`)

Per `ux-requirements.md` §190–229:

| Section      | Content                                                                       |
| ------------ | ----------------------------------------------------------------------------- |
| Page header  | Title "Custom Lists", "New List" button                                       |
| List tabs    | One tab per saved list; seeded Bench, Booked, Needs Conversation (FR-CL-003)  |
| Filter bar   | Filters for fields with `usage` ∈ {filter, both} (FR-CL-002)                  |
| List table   | System columns (read-only) + custom columns (inline editable) (FR-CL-004–008) |
| Empty states | "List not configured" / "No employees match" (FR-CL-013)                      |

### 6. List Builder Sheet (FR-CL-002, AC-CL-006, G-3)

Sheet with: Name (required), employee filter (position/grade/status/risk dropdowns), per custom field a usage control (**Filter | Column | Both**), Save. Any field may be filter, column, or both simultaneously.

### 7. Inline Edit (FR-CL-004–008, BR-007)

Per `ux-behavior §3.4`:

- Click a custom-field cell → edit mode with the type's control (Text/Number/Date `Input`, Boolean `Checkbox`, Single Select `Select`).
- Only one cell in edit mode at a time.
- Commit on blur / Enter / Tab; `Escape` cancels.
- Optimistic update; rollback + error toast (`SRS-COPY5-005`) on failure; **no success toast** for cell saves.
- System columns (name, position, grade, status, risk) are `cursor-default`, no edit mode.

### 8. List Sharing (FR-CL-010–011, BR-008, BR-009, AC-CL-005)

Owner shares a list with selected managers via Share sheet. Recipient sees the list as a tab but cannot change its structure (BR-008). Recipient can inline-edit custom values only for their own direct reports (BR-009); rows for others are read-only (`editable: false`).

### 9. UM Assignments Section (FR-AH-004, AC-AH-002–004)

New UM route `/resourcing/assignments`. Read-only aggregated assignment-history table for the manager's unit. Never mixed with project history (BR-006). Reuses the assignment-history read path.

### 10. Profile Sharing Polish

On `GenerateSharedProfileSheet` open, query `activeSharedProfile(personId)`; if an active link exists, display it (with Copy) instead of forcing regeneration (`ux-behavior §3.5` edge case: "re-open Generate Shared Profile to access the existing link").

### 11. Seed / Data Verification

- Risks = 20 (verify `risks.ts`; indices 0–1 forced High/Critical) ✅.
- Action items ≈ 33 (26 subordinate + 5 manager + 2 employee) vs BRD "30". Document as acceptable in SRS §5.1 or trim to 30. No structural change required.

### 12. Shared UI Primitives

| Primitive                                                                              | Status | Action                                                                                                    |
| -------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `input`, `select`, `checkbox`, `sheet`, `data-table`, `status-pill`, `toast`, `dialog` | Exists | Reuse                                                                                                     |
| Inline-edit cell                                                                       | New    | Build feature-level in `custom-lists/components/inline-edit-cell/` (domain-aware, not a shared primitive) |

No new npm dependencies.

### 13. Routing & Navigation

- `/custom-lists` — UM-only guard already exists in `router.tsx`.
- Add `/resourcing/assignments` — UM-only guard (new route + path helper `getResourcingAssignmentsPagePath`).
- Add **Custom Lists** and **Assignments** to `navigationItemsByRole['unit-manager']` in `src/app/navigation.ts` (currently Dashboard, Subordinates, Incoming Requests only).

---

## Requirements Traceability

| Deliverable                       | FR / BR / AC                             |
| --------------------------------- | ---------------------------------------- |
| Custom field definitions          | FR-CL-001                                |
| List builder (filter/column/both) | FR-CL-002, AC-CL-006, G-3                |
| List tabs + seeded lists          | FR-CL-003, FR-CL-012, AC-CL-001          |
| Inline edit                       | FR-CL-004–008, AC-CL-002, BR-007         |
| Profile sync on save              | FR-CL-005, AC-CL-003, AC-EP-005          |
| System columns read-only          | FR-CL-006, AC-CL-004                     |
| Empty state                       | FR-CL-013                                |
| List sharing                      | FR-CL-010–011, AC-CL-005, BR-008, BR-009 |
| UM Assignments                    | FR-AH-004, AC-AH-002–004, BR-006         |
| Shared profile re-open            | FR-PS-004 (polish)                       |
| Demo Scenario 3                   | BRD §14 Scenario 3                       |

---

## Acceptance Criteria

### Build / Lint / Format

| #   | Check  | Command                | Pass criteria | Test ref |
| --- | ------ | ---------------------- | ------------- | -------- |
| 1   | Build  | `npm run build`        | Exit 0        | P5-B01   |
| 2   | Lint   | `npm run lint`         | Exit 0        | P5-B02   |
| 3   | Format | `npm run format:check` | Exit 0        | P5-B03   |

### Custom lists

| #   | Check             | Expected                                      | Test ref |
| --- | ----------------- | --------------------------------------------- | -------- |
| 4   | Three seeded tabs | Bench, Booked, Needs Conversation present     | P5-CL01  |
| 5   | Tab switch        | Table re-renders per active list              | P5-CL02  |
| 6   | Filter bar        | Filters shown only for usage ∈ {filter, both} | P5-CL03  |
| 7   | Empty list        | EmptyState copy per ux-behavior §5.1          | P5-CL04  |

### List builder

| #   | Check                | Expected                                      | Test ref |
| --- | -------------------- | --------------------------------------------- | -------- |
| 8   | New List opens sheet | Name + filter + per-field usage controls      | P5-LB01  |
| 9   | Name required        | Empty name blocks save                        | P5-LB02  |
| 10  | Usage designation    | Field as Filter / Column / Both persists      | P5-LB03  |
| 11  | Column renders       | Column-designated field appears in table      | P5-LB04  |
| 12  | Filter renders       | Filter-designated field appears in filter bar | P5-LB05  |
| 13  | Both                 | Field appears in table and filter bar         | P5-LB06  |

### Inline edit

| #   | Check                   | Expected                                   | Test ref |
| --- | ----------------------- | ------------------------------------------ | -------- |
| 14  | Text edit               | Input commits on blur/Enter                | P5-IE01  |
| 15  | Number edit             | Numeric input; invalid reverts             | P5-IE02  |
| 16  | Date edit               | Date input commits                         | P5-IE03  |
| 17  | Boolean edit            | Checkbox toggles + commits                 | P5-IE04  |
| 18  | Single Select           | Select shows configured options only       | P5-IE05  |
| 19  | Escape cancels          | Cell reverts to prior value                | P5-IE06  |
| 20  | One cell at a time      | Opening another commits the first          | P5-IE07  |
| 21  | System column read-only | No edit mode on name/position/grade/status | P5-IE08  |
| 22  | No success toast        | Cell save shows no toast                   | P5-IE09  |
| 23  | Save failure            | Revert + error toast with field name       | P5-IE10  |

### Profile sync

| #   | Check              | Expected                                            | Test ref |
| --- | ------------------ | --------------------------------------------------- | -------- |
| 24  | Sync to profile    | Edited value visible on `/people/:id` custom fields | P5-SY01  |
| 25  | Query invalidation | `person(id)` refetched after edit                   | P5-SY02  |

### List sharing

| #   | Check                         | Expected                                     | Test ref |
| --- | ----------------------------- | -------------------------------------------- | -------- |
| 26  | Share list                    | Recipient manager selected; list shared      | P5-LS01  |
| 27  | Recipient sees tab            | Shared list appears for `person-um-002`      | P5-LS02  |
| 28  | Recipient view-only structure | No builder/edit-structure controls (BR-008)  | P5-LS03  |
| 29  | Recipient edit scope          | Inline edit only own direct reports (BR-009) | P5-LS04  |
| 30  | Owner unaffected              | Owner retains full control                   | P5-LS05  |

### Assignments (FR-AH-004)

| #   | Check             | Expected                                   | Test ref |
| --- | ----------------- | ------------------------------------------ | -------- |
| 31  | Assignments route | `/resourcing/assignments` renders for UM   | P5-AH01  |
| 32  | Records shown     | Aggregated assignment history for the unit | P5-AH02  |
| 33  | Read-only         | No edit actions                            | P5-AH03  |
| 34  | Separation        | Not mixed with project history (BR-006)    | P5-AH04  |

### Shared profile polish

| #   | Check                 | Expected                                 | Test ref |
| --- | --------------------- | ---------------------------------------- | -------- |
| 35  | Re-open shows link    | Existing active link shown on sheet open | P5-PS01  |
| 36  | No duplicate generate | Regenerate not forced                    | P5-PS02  |
| 37  | Copy existing         | Copy works from re-opened sheet          | P5-PS03  |

### Demo, regression & nav

| #   | Check                 | Expected                            | Test ref   |
| --- | --------------------- | ----------------------------------- | ---------- |
| 38  | Scenario 3 E2E        | Bench edit → profile confirms value | P5-D03     |
| 39  | Phases 1–4 regression | Full suite green                    | P5-RG01    |
| 40  | Nav / guards          | Custom Lists + Assignments UM-only  | P5-R01–R03 |

---

## Dependencies

| Dependency                                                                                                  | Status  |
| ----------------------------------------------------------------------------------------------------------- | ------- |
| Phase 4 complete on `main`                                                                                  | Done    |
| Carlos Phase 5 SRS approval                                                                                 | Pending |
| `docs/architecture/ux-behavior.md §3.4`, `ux-requirements.md §190–229`, `data-models.md §Custom List/Field` | Done    |
| Assignment-history read path (Phase 3/4)                                                                    | Done    |

---

## Deferred beyond Phase 5

None — Phase 5 closes the MVP scope.

---

## Definition of Done

Phase 5 is **done** when:

- [ ] Build / lint / format exit 0.
- [ ] Type migration + seeds (fields, 3 lists, `person-um-002`) complete.
- [ ] MSW handlers for fields, lists, rows, inline edit, share, assignments, active shared profile.
- [ ] List builder with filter/column/both works (AC-CL-006).
- [ ] Inline edit for all 5 field types; system columns read-only; profile sync verified.
- [ ] List sharing view-only structure + BR-009 edit scope works.
- [ ] `/resourcing/assignments` (FR-AH-004) works, read-only, separate from project history.
- [ ] Shared profile re-open works.
- [ ] Demo Scenarios 1–7 pass; Phases 1–4 regression green.
- [ ] `STATUS.md`, `STATE.md`, `PROJECT.md` updated.
- [ ] Carlos product sign-off; Ivan validation sign-off → **MVP complete**.
