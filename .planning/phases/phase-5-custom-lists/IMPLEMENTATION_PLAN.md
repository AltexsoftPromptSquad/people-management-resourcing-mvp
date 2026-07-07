# Phase 5 Custom Lists & Assignments Implementation Plan

## Purpose

This document is the implementation plan for `.planning/phases/phase-5-custom-lists/SRS.md`. It translates the Phase 5 SRS into an execution-ready sequence for delivering custom fields and lists, the UM Assignments section (FR-AH-004), and profile-sharing polish.

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
- `.planning/phases/phase-5-custom-lists/SRS.md`
- `.planning/phases/phase-5-custom-lists/VALIDATION.md`
- `.planning/phases/phase-5-custom-lists/phase-5-test-plan.md`
- `.planning/phases/phase-5-custom-lists/UX-FLOW.md`
- `.planning/phases/phase-5-custom-lists/PRE-BUILD-FINAL.md`

Phase 5 must implement custom lists + FR-AH-004 Assignments + profile-sharing polish only. It is the final MVP increment; there is no deferred successor phase.

## Implementation Defaults And Decisions

| Area                          | Decision                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Custom lists feature location | Use `src/features/custom-lists/` for fields, lists, builder, inline edit, sharing.                           |
| Assignments location          | Use `src/features/resourcing/components/assignments-table/` for the FR-AH-004 read table.                    |
| Page ownership                | Keep pages thin in `src/pages/custom-lists-page/` and `src/pages/resourcing-assignments-page/`.              |
| Builder / share / field forms | `Sheet` (match Phase 3/4 form pattern).                                                                      |
| Form validation               | React Hook Form + Zod schemas under `custom-lists/schemas/`.                                                 |
| Inline edit commit            | Commit on blur / Enter / Tab; `Escape` cancels; one cell at a time.                                          |
| Inline edit strategy          | Optimistic update; rollback + error toast on failure; no success toast per cell.                             |
| Inline edit endpoint          | `PATCH /api/people/:personId/custom-field-values` with `{ fieldId, value }`; invalidate `person(id)` + rows. |
| Type migration                | Migrate `custom-list.ts` to `fieldConfigs`, update seeds and consumers in the same change.                   |
| Second UM persona             | Seed `person-um-002` as a real `Person` (share recipient); `person-manager-002/003` are not seeded people.   |
| Assignments route             | `/resourcing/assignments`, UM-only guard; add nav entry.                                                     |
| Navigation                    | Add Custom Lists and Assignments to `navigationItemsByRole['unit-manager']`.                                 |
| Shared-profile polish         | On sheet open, `GET /api/shared-profiles/active?personId=`; show existing link if present.                   |
| Mutation pattern              | `useMutation` with targeted invalidation (fields, lists, rows, person, assignments).                         |
| Seed determinism              | Keep `faker.seed(20260625)` unchanged and use stable generated IDs.                                          |
| Dependencies                  | Do not add npm dependencies.                                                                                 |

## Step-By-Step Implementation Plan

### 1. Migrate Custom List / Field Types

Implementation requirements:

- Update `src/types/custom-list.ts` to `fieldConfigs: CustomListFieldConfig[]`, optional `defaultSort`, `employeeFilter: Record<string, string | string[]>`.
- Add `export type CustomFieldUsage = 'filter' | 'column' | 'both'` (in `custom-field.ts` or `custom-list.ts` per import direction).
- Update all consumers of `visibleColumns` / `filterableFields` if any exist.

Acceptance checks:

- SRS-F5-001, SRS-F5-002.
- `npm run build` compiles.

### 2. Align Types And Seed Data

Implementation requirements:

- Add `src/mocks/data/custom-fields.ts` (4 fields, §11.4 of SRS).
- Add `src/mocks/data/custom-lists.ts` (Bench, Booked, Needs Conversation; §11.5).
- Migrate `src/mocks/data/people.ts` and `person-factory.ts` `customFieldValues` keys to field IDs.
- Set `person-employee-001` Bench Status `Available` and Bench-compatible `currentProjectStatus` for Scenario 3.
- Seed `person-um-002` as a real `Person` in its own unit (share recipient).
- Keep `faker.seed(20260625)`.

Acceptance checks:

- SRS-F5-003–009.
- Seeds compile against migrated types.

### 3. Extend Query Keys And API Client

Implementation requirements:

- Append to `src/lib/query/query-keys.ts`: `customFields`, `customLists`, `customList`, `customListRows`, `assignments`, `activeSharedProfile`.
- Add typed API wrappers in `src/features/custom-lists/api/` and `src/features/resourcing/api/` (assignments, active shared profile) without direct mock imports in UI.

Acceptance checks:

- SRS-F5-023–028.
- Hooks use query key helpers consistently.

### 4. Add MSW Handlers

Implementation requirements:

- Append to `src/mocks/handlers.ts` (or a dedicated custom-lists handlers module imported by the worker):
  - `GET/POST /api/custom-fields`, `PATCH /api/custom-fields/:id`
  - `GET/POST /api/custom-lists`, `PATCH /api/custom-lists/:id`, `POST /api/custom-lists/:id/share`
  - `GET /api/custom-lists/:id/rows?managerId=` (rows with `values` + `editable`)
  - `PATCH /api/people/:personId/custom-field-values`
  - `GET /api/resourcing/assignments?managerId=`
  - `GET /api/shared-profiles/active?personId=`
- Rows must compute `editable` per BR-009 (viewer's direct reports only).
- Do not alter existing handler shapes.

Acceptance checks:

- SRS-F5-010–022.

### 5. Scaffold `custom-lists` Feature Module

Implementation requirements:

- Create `src/features/custom-lists/` with `api/`, `hooks/`, `components/`, `utils/`, `schemas/` per PLAN §4.
- Add `list-filter.ts` (apply employeeFilter + URL filter state) and `field-config.ts` (usage resolution).

Acceptance checks:

- SRS-F5-800–803.
- Import direction respects feature-rules.

### 6. Implement Custom Lists Page (Tabs + Filters + Table)

Implementation requirements:

- Replace `CustomListsPage` placeholder body; compose `CustomListTabs`, `CustomListFilterBar`, `CustomListTable`.
- Render system columns (read-only) + configured custom columns.
- Wire URL-driven filter state per state-and-rendering.
- Loading/empty/error states per SRS-UI5-001–004.

Acceptance checks:

- SRS-F5-300–312; FR-CL-003, FR-CL-013.
- P5-CL01–CL04.

### 7. Implement Inline Edit Cell

Implementation requirements:

- Build `InlineEditCell` supporting Text/Number/Date `Input`, Boolean `Checkbox`, Single Select `Select`.
- Commit on blur/Enter/Tab; Escape cancels; one cell open at a time.
- Optimistic mutation via `patch-custom-field-value`; rollback + error toast SRS-COPY5-005; no success toast.
- System columns render read-only.

Acceptance checks:

- SRS-F5-400–415; FR-CL-004–008, BR-007, ux-behavior §3.4.
- P5-IE01–IE10; P5-SY01–SY02.

### 8. Implement List Builder Sheet

Implementation requirements:

- Build `ListBuilderSheet` (RHF + Zod): name, employee filter, per-field usage matrix (Filter/Column/Both).
- POST on create, PATCH on edit (owner only).
- New/updated list appears as a tab without reload.

Acceptance checks:

- SRS-F5-200–215; FR-CL-002, AC-CL-006.
- P5-LB01–LB06.

### 9. Implement Custom Field CRUD Sheet

Implementation requirements:

- Build `CustomFieldFormSheet` (RHF + Zod): name, type, options (Single Select), sensitive flag.
- POST create; PATCH edit/deactivate; block type change when values exist.

Acceptance checks:

- SRS-F5-100–110; FR-CL-001.

### 10. Implement List Sharing

Implementation requirements:

- Build `ShareListSheet`: eligible managers (e.g. `person-um-002`); POST share.
- Recipient sees list tab; structure read-only (BR-008).
- Rows editable only for recipient's direct reports (BR-009) via `editable` flag.

Acceptance checks:

- SRS-F5-500–510; FR-CL-010–011, BR-008–009.
- P5-LS01–LS05.

### 11. Implement Assignments Section, Nav & Shared-Profile Polish

Implementation requirements:

- Add `getResourcingAssignmentsPagePath` in `routes.ts`; register UM-only `/resourcing/assignments` in `router.tsx`.
- Create `ResourcingAssignmentsPage` composing `AssignmentsTable` (read-only, separate from project history).
- Add Custom Lists + Assignments to `navigationItemsByRole['unit-manager']`.
- Update `GenerateSharedProfileSheet` to query `activeSharedProfile(personId)` on open and show the existing link if present.

Acceptance checks:

- SRS-F5-600–606, SRS-F5-700–703; FR-AH-004, BR-006, FR-PS-004.
- P5-AH01–AH04; P5-PS01–PS03; P5-R01–R03.

### 12. Finalize Planning Handoff And Validation Artifacts

Implementation requirements:

- Update `.planning/STATE.md`, `.planning/PROJECT.md`, and `phase-5-custom-lists/STATUS.md` with implementation status.
- Ensure `VALIDATION.md` maps to SRS and test plan checks.
- Add Playwright specs under `tests/e2e/phase5/`, fixture `phase5-data.ts`, and page objects `CustomListsPage`, `ResourcingAssignmentsPage`.
- Record execution results under `tests/test_reports/phase5/`.

Acceptance checks:

- Ivan can execute validation without extra requirement interpretation.
- Demo Scenarios 1–7 pass; Phases 1–4 regression green.

## Data, Model, And API Contracts

See SRS §11 for full payload shapes.

| Method | Endpoint                                    | Primary phase usage                 |
| ------ | ------------------------------------------- | ----------------------------------- |
| GET    | `/api/custom-fields?ownerManagerId=`        | Builder field picker                |
| POST   | `/api/custom-fields`                        | Create field                        |
| PATCH  | `/api/custom-fields/:id`                    | Edit / deactivate field             |
| GET    | `/api/custom-lists?managerId=`              | Owned + shared lists                |
| POST   | `/api/custom-lists`                         | Create list                         |
| PATCH  | `/api/custom-lists/:id`                     | Edit structure (owner only)         |
| POST   | `/api/custom-lists/:id/share`               | Share with managers                 |
| GET    | `/api/custom-lists/:id/rows?managerId=`     | Filtered rows + values + `editable` |
| PATCH  | `/api/people/:personId/custom-field-values` | Inline edit                         |
| GET    | `/api/resourcing/assignments?managerId=`    | FR-AH-004 aggregated read           |
| GET    | `/api/shared-profiles/active?personId=`     | Shared-profile re-open              |

## Routing And UI Behavior

| User action                         | Expected behavior                                   |
| ----------------------------------- | --------------------------------------------------- |
| UM clicks New List                  | Sheet opens with name, filter, field usage matrix   |
| UM saves list                       | New tab appears; success toast                      |
| UM clicks a custom cell             | Cell enters inline edit mode                        |
| UM commits a cell                   | Optimistic value; no toast; profile reflects change |
| UM shares a list                    | Recipient sees the list tab; structure read-only    |
| Recipient edits non-report row      | No edit mode (read-only)                            |
| UM opens `/resourcing/assignments`  | Read-only assignment history table                  |
| UM re-opens Generate Shared Profile | Existing active link shown with Copy                |

## Validation Checklist

Run before considering Phase 5 implementation complete:

```bash
npm run build
npm run lint
npm run format:check
```

Optional e2e validation:

```bash
npx playwright install chromium
npm run test:e2e -- tests/e2e/phase5
npm run test:e2e -- tests/e2e/phase1 tests/e2e/phase2 tests/e2e/phase3 tests/e2e/phase4
```

## Assumptions And Non-Goals

Assumptions:

- Phase 4 resourcing, profile, and assignment-history read path are stable and reused.
- BRD v1.1, Phase 5 SRS, and decision log are approved source of truth.
- Validation is desktop-only (1280px+).
- Carlos approves SRS scope before implementation starts.

Non-goals:

- Do not add backend/database/auth/integration components.
- Do not introduce new npm dependencies.
- Do not refactor Phase 1–4 code outside the minimal-touch list in `PRE-BUILD-FINAL.md`.
