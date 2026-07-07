# Phase 5 — Custom Lists, Assignments & MVP Hardening — Test Plan

## 1. Document Control

| Field            | Value                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product          | People Management & Resourcing MVP                                                                                                                          |
| Phase            | Phase 5 — Custom Lists, Assignments & MVP Hardening                                                                                                         |
| Document type    | Test plan (QA design, pre-execution)                                                                                                                        |
| Status           | Draft — pending SRS approval (Carlos Nunes)                                                                                                                 |
| QA owner         | Ivan                                                                                                                                                        |
| Dev owner        | Volodymyr                                                                                                                                                   |
| Product / BA     | Carlos                                                                                                                                                      |
| Planning sources | `.planning/phases/phase-5-custom-lists/` (PLAN, SRS, UX-FLOW, IMPLEMENTATION_PLAN); `.planning/STATE.md`                                                    |
| Source BRD       | `docs/requirements/# Business Requirements Document.md` (v1.1)                                                                                              |
| Architecture     | `docs/architecture/ux-behavior.md`, `ux-requirements.md`, `data-models.md`, `feature-rules.md`, `state-and-rendering.md`, `shared-ui.md`, `visual-theme.md` |
| Precedent        | `.planning/phases/phase-4-resourcing/phase-4-test-plan.md`, `tests/e2e/phase4/*`                                                                            |

## 2. Purpose & Scope

This plan defines how Phase 5 (custom lists, FR-AH-004 Assignments, and profile-sharing polish) is verified before QA sign-off and MVP close. Phase 4 delivered the resourcing E2E and assignment-history write path; Phase 5 adds custom field/list management, inline edit, sharing, the UM Assignments read view, and re-opening an existing shared-profile link.

This plan is grounded in Phase 5 `PLAN.md` and `SRS.md`, BRD v1.1 (`FR-CL-*`, `FR-AH-004`), business rules (`BR-006`, `BR-007`, `BR-008`, `BR-009`), acceptance criteria (`AC-CL-*`, `AC-AH-002`–`004`, `AC-EP-005`), and interaction contracts in `ux-behavior.md` §3.4, §4.4, §5. Test cases in §6 reference SRS and ux-behavior IDs; §7 maps BRD requirements to P5 tests and SRS IDs.

### 2.1 In scope

- Build / lint / format gates.
- Routing & role guards for `/custom-lists` and `/resourcing/assignments`; navigation entries.
- Seeded list tabs (Bench, Booked, Needs Conversation) (`FR-CL-003`, `FR-CL-012`, `AC-CL-001`).
- List builder with filter/column/both designation (`FR-CL-002`, `AC-CL-006`, G-3).
- Inline edit for all five field types; system columns read-only; optimistic update and error revert (`FR-CL-004`–`008`, `AC-CL-002`–`004`, `BR-007`, ux-behavior §3.4).
- Profile sync: inline edits reflect on the employee profile (`FR-CL-005`, `AC-CL-003`, `AC-EP-005`).
- List sharing view-only structure and BR-009 edit scope (`FR-CL-010`–`011`, `AC-CL-005`, `BR-008`, `BR-009`).
- UM Assignments section, read-only, separate from project history (`FR-AH-004`, `AC-AH-002`–`004`, `BR-006`).
- Profile-sharing re-open of an existing active link.
- Async states (loading/empty/error) per screen.
- Accessibility: inline-edit keyboard, tabs, form labels, `aria-busy`/`role="alert"`, table navigation.
- Source-confirmed architecture: feature boundaries, thin pages, query keys, mutation invalidation.
- Demo Scenario 3 and full Phases 1–4 regression.

### 2.2 Out of scope

- Backend / persistence (frontend-only MVP).
- Mobile / tablet / responsive breakpoints (desktop-only per BRD `AS-016`).
- New npm dependencies.
- Any feature not in Phase 5 SRS §5.1 — Phase 5 has no successor phase.

## 3. Test Approach

1. **Static gates** — `npm run build`, `npm run lint`, `npm run format:check`; exit code 0 required.
2. **Automated E2E (Playwright)** — new specs under `tests/e2e/phase5/` reusing the existing harness. Expected values derive from the mock layer via `tests/e2e/fixtures/phase5-data.ts`.
3. **Source-confirmed** — architectural constraints (feature ownership, import direction, thin pages, query keys, invalidation, inline-edit placement) verified by code inspection.

Every case is traceable to a BRD requirement, SRS ID, or architecture doc reference.

## 4. Test Environments

| Item       | Value                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Local dev  | `npm run dev` → `http://localhost:5173` (MSW active)                                                                          |
| Viewport   | 1280 × 800 desktop (BRD `AS-016`)                                                                                             |
| Mock layer | MSW; deterministic Faker seed `faker.seed(20260625)`                                                                          |
| Browsers   | Chromium (primary)                                                                                                            |
| Personas   | UM `person-um-001` (Olena), UM recipient `person-um-002`, DM `person-dm-001` (Marcus), Employee `person-employee-001` (Nazar) |

> **Persona ID note:** IDs above are `personId` values (person record IDs). The persona entity IDs are `persona-um-001`, `persona-dm-001`, `persona-employee-001`. `person-um-002` is a new Phase 5 record added specifically as a share recipient. E2E fixtures resolve by role; see `tests/e2e/fixtures/phase5-data.ts`.

## 5. Test Data Baseline (deterministic)

| Dataset            | Expected                                                                        | Source                  |
| ------------------ | ------------------------------------------------------------------------------- | ----------------------- |
| Custom fields      | 4 seeded (bench status, bench readiness, last conversation, booking notes)      | `custom-fields.ts`      |
| Custom lists       | 3 seeded (Bench, Booked, Needs Conversation) owned by `person-um-001`           | `custom-lists.ts`       |
| Second UM persona  | `person-um-002` real Person record (share recipient)                            | `people.ts`             |
| People             | 540 + `person-um-002`; `person-employee-001` on Bench, Bench Status `Available` | `people.ts`             |
| Assignment history | Written on decision in Phase 4; read for Assignments section                    | `assignment-history.ts` |
| Shared profiles    | Created in-memory; active link retrievable via `GET .../active`                 | `shared-profiles.ts`    |

### 5.1 Demo target records

- **Scenario 3 anchor:** `person-employee-001` in `list-bench-001`; edit Bench Status `Available → Interviewing`; verify at `/people/person-employee-001`.
- **Share demo:** `list-bench-001` shared with `person-um-002`.
- **Assignments demo:** unit `unit-platform` records from Phase 4 decisions.

## 6. Test Cases

### 6.1 Build / Lint / Format (§6.1)

| Check            | Command                | Pass criteria | Test ref | SRS ref     |
| ---------------- | ---------------------- | ------------- | -------- | ----------- |
| TypeScript build | `npm run build`        | Exit 0        | P5-B01   | SRS-NF5-001 |
| ESLint           | `npm run lint`         | Exit 0        | P5-B02   | SRS-NF5-002 |
| Prettier         | `npm run format:check` | Exit 0        | P5-B03   | SRS-NF5-003 |

### 6.2 Routing & Role Guards (§6.2)

| #   | Check                              | Expected                  | Test ref | SRS ref    |
| --- | ---------------------------------- | ------------------------- | -------- | ---------- |
| 1   | UM opens `/custom-lists`           | Custom Lists page renders | P5-R01   | SRS-F5-300 |
| 2   | UM opens `/resourcing/assignments` | Assignments page renders  | P5-R02   | SRS-F5-600 |
| 3   | DM/Employee blocked from UM routes | Redirect to role landing  | P5-R03   | §6.2       |

### 6.3 Seeded List Tabs (§6.3)

| #   | Check             | Expected                                  | Test ref | SRS ref    |
| --- | ----------------- | ----------------------------------------- | -------- | ---------- |
| 4   | Three seeded tabs | Bench, Booked, Needs Conversation present | P5-CL01  | SRS-F5-301 |
| 5   | Tab switch        | Table re-renders per active list          | P5-CL02  | SRS-F5-310 |
| 6   | Filter bar        | Filters only for usage ∈ {filter, both}   | P5-CL03  | SRS-F5-303 |
| 7   | Empty list        | EmptyState SRS-COPY5-001/002              | P5-CL04  | SRS-F5-307 |

### 6.4 List Builder (§6.4)

| #   | Check                | Expected                           | Test ref | SRS ref    |
| --- | -------------------- | ---------------------------------- | -------- | ---------- |
| 8   | New List opens sheet | Name + filter + usage controls     | P5-LB01  | SRS-F5-200 |
| 9   | Name required        | Empty name blocks save             | P5-LB02  | SRS-F5-201 |
| 10  | Usage designation    | Filter/Column/Both persists        | P5-LB03  | SRS-F5-203 |
| 11  | Column renders       | Column field appears in table      | P5-LB04  | SRS-F5-204 |
| 12  | Filter renders       | Filter field appears in filter bar | P5-LB05  | SRS-F5-205 |
| 13  | Both                 | Field in table and filter bar      | P5-LB06  | SRS-F5-212 |

### 6.5 Inline Edit (§6.5)

| #   | Check                   | Expected                              | Test ref | SRS ref    |
| --- | ----------------------- | ------------------------------------- | -------- | ---------- |
| 14  | Text edit               | Input commits on blur/Enter           | P5-IE01  | SRS-F5-401 |
| 15  | Number edit             | Numeric input; invalid reverts        | P5-IE02  | SRS-F5-409 |
| 16  | Date edit               | Date input commits                    | P5-IE03  | SRS-F5-401 |
| 17  | Boolean edit            | Checkbox toggles + commits            | P5-IE04  | SRS-F5-411 |
| 18  | Single Select           | Options only from config              | P5-IE05  | SRS-F5-412 |
| 19  | Escape cancels          | Cell reverts                          | P5-IE06  | SRS-F5-403 |
| 20  | One cell at a time      | Opening another commits first         | P5-IE07  | SRS-F5-402 |
| 21  | System column read-only | No edit on name/position/grade/status | P5-IE08  | SRS-F5-408 |
| 22  | No success toast        | Cell save shows no toast              | P5-IE09  | SRS-F5-407 |
| 23  | Save failure            | Revert + error toast SRS-COPY5-005    | P5-IE10  | SRS-F5-406 |

### 6.6 Profile Sync (§6.6)

| #   | Check              | Expected                              | Test ref | SRS ref    |
| --- | ------------------ | ------------------------------------- | -------- | ---------- |
| 24  | Sync to profile    | Edited value visible on `/people/:id` | P5-SY01  | SRS-F5-410 |
| 25  | Query invalidation | `person(id)` refetched after edit     | P5-SY02  | SRS-F5-025 |

### 6.7 List Sharing (§6.7)

| #   | Check                         | Expected                                     | Test ref | SRS ref    |
| --- | ----------------------------- | -------------------------------------------- | -------- | ---------- |
| 26  | Share list                    | Recipient selected; list shared              | P5-LS01  | SRS-F5-500 |
| 27  | Recipient sees tab            | Shared list appears for `person-um-002`      | P5-LS02  | SRS-F5-501 |
| 28  | Recipient view-only structure | No structure-edit controls (BR-008)          | P5-LS03  | SRS-F5-502 |
| 29  | Recipient edit scope          | Inline edit only own direct reports (BR-009) | P5-LS04  | SRS-F5-503 |
| 30  | Owner unaffected              | Owner retains full control                   | P5-LS05  | SRS-F5-507 |

### 6.8 Assignments (§6.8)

| #   | Check             | Expected                                 | Test ref | SRS ref    |
| --- | ----------------- | ---------------------------------------- | -------- | ---------- |
| 31  | Assignments route | `/resourcing/assignments` renders for UM | P5-AH01  | SRS-F5-600 |
| 32  | Records shown     | Aggregated assignment history for unit   | P5-AH02  | SRS-F5-601 |
| 33  | Read-only         | No edit actions                          | P5-AH03  | SRS-F5-603 |
| 34  | Separation        | Not mixed with project history (BR-006)  | P5-AH04  | SRS-F5-604 |

### 6.9 Shared Profile Polish (§6.9)

| #   | Check                 | Expected                                 | Test ref | SRS ref    |
| --- | --------------------- | ---------------------------------------- | -------- | ---------- |
| 35  | Re-open shows link    | Existing active link shown on sheet open | P5-PS01  | SRS-F5-701 |
| 36  | No duplicate generate | Regenerate not forced                    | P5-PS02  | SRS-F5-701 |
| 37  | Copy existing         | Copy works from re-opened sheet          | P5-PS03  | SRS-F5-702 |

### 6.10 Async States & UI Rendering (§6.10)

| #   | Check         | Expected                                | Test ref | SRS ref     |
| --- | ------------- | --------------------------------------- | -------- | ----------- |
| 38  | Page loading  | Page-tier LoadingState while data loads | P5-AS01  | SRS-UI5-001 |
| 39  | Rows loading  | Section skeleton while rows load        | P5-AS02  | SRS-UI5-002 |
| 40  | Empty         | EmptyState per copy                     | P5-AS03  | SRS-UI5-003 |
| 41  | Error         | ErrorState per copy                     | P5-AS04  | SRS-UI5-004 |
| 42  | Optimistic UI | Cell updates then reverts on error      | P5-AS05  | SRS-UI5-006 |

### 6.11 Accessibility (§6.11)

| #   | Check                    | Expected                                   | Test ref | SRS ref        |
| --- | ------------------------ | ------------------------------------------ | -------- | -------------- |
| 43  | Inline edit keyboard     | Enter/Tab commit; Escape cancel            | P5-A01   | SRS-A11Y5-001  |
| 44  | Focus into cell          | Control focused on edit                    | P5-A02   | SRS-A11Y5-002  |
| 45  | Focus return             | Focus returns to cell on commit            | P5-A03   | SRS-A11Y5-002  |
| 46  | Tabs roles               | Tabs keyboard navigable                    | P5-A04   | SRS-A11Y5-003  |
| 47  | Form labels              | Builder/share/field inputs labeled         | P5-A05   | SRS-A11Y5-004  |
| 48  | aria-busy loading        | LoadingState has `aria-busy`               | P5-A06   | SRS-A11Y5-005  |
| 49  | role=alert error         | ErrorState has `role="alert"`              | P5-A07   | SRS-A11Y5-005  |
| 50  | Checkbox/select keyboard | Boolean/Single Select operable by keyboard | P5-A08   | SRS-A11Y5-006  |
| 51  | Table navigation         | Rows keyboard navigable                    | P5-A09   | SRS-A11Y5-007  |
| 52  | No console errors        | Zero console errors in flows               | P5-A10   | SRS-A11Y5-008  |
| 53  | Main landmark            | `<main>` present on pages                  | P5-A11   | ux-behavior §8 |
| 54  | Icon button labels       | Icon-only actions have accessible names    | P5-A12   | ux-behavior §8 |

### 6.12 Demo Scenario 3 (§6.12)

| #   | Check      | Expected                                         | Test ref | SRS ref |
| --- | ---------- | ------------------------------------------------ | -------- | ------- |
| 55  | Scenario 3 | Bench tab → edit Bench Status → profile confirms | P5-D03   | §17.8   |

### 6.13 Full Regression P1–P4 (§6.13)

| #   | Check          | Expected                  | Test ref | SRS ref |
| --- | -------------- | ------------------------- | -------- | ------- |
| 56  | Phases 1–4 E2E | All previous suites green | P5-RG01  | §15     |

### 6.14 Source-Confirmed Architecture (§6.14)

| #   | Check                 | Expected                                                    | Test ref | SRS ref     |
| --- | --------------------- | ----------------------------------------------------------- | -------- | ----------- |
| 57  | Feature ownership     | Custom lists logic in `features/custom-lists`               | P5-SC01  | SRS-F5-800  |
| 58  | Assignments ownership | Assignments table in `features/resourcing`                  | P5-SC02  | SRS-F5-801  |
| 59  | Thin pages            | Pages compose only                                          | P5-SC03  | SRS-F5-802  |
| 60  | Query keys            | New keys used consistently                                  | P5-SC04  | SRS-F5-023  |
| 61  | Invalidation          | Inline edit invalidates person + rows                       | P5-SC05  | SRS-F5-025  |
| 62  | Type migration        | `fieldConfigs` used; no `visibleColumns`/`filterableFields` | P5-SC06  | SRS-F5-001  |
| 63  | MSW append-only       | Existing handler shapes unchanged                           | P5-SC07  | SRS-F5-022  |
| 64  | No new deps           | `package.json` deps unchanged                               | P5-SC08  | SRS-NF5-004 |

## 7. BRD / Architecture Requirement To Test Mapping

| Source ref                           | P5 tests         | SRS / arch IDs            |
| ------------------------------------ | ---------------- | ------------------------- |
| FR-CL-001                            | P5-LB01          | SRS-F5-100–110            |
| FR-CL-002, AC-CL-006 (G-3)           | P5-LB01–LB06     | SRS-F5-200–215            |
| FR-CL-003, AC-CL-001, FR-CL-012      | P5-CL01–CL04     | SRS-F5-300–312            |
| FR-CL-004–008, AC-CL-002–004, BR-007 | P5-IE01–IE10     | SRS-F5-400–415            |
| FR-CL-005, AC-CL-003, AC-EP-005      | P5-SY01–SY02     | SRS-F5-405, 410           |
| FR-CL-009                            | P5-IE03          | SRS-F5-304                |
| FR-CL-010–011, AC-CL-005, BR-008–009 | P5-LS01–LS05     | SRS-F5-500–510            |
| FR-CL-013                            | P5-CL04, P5-AS03 | SRS-F5-307–308            |
| FR-AH-004, AC-AH-002–004, BR-006     | P5-AH01–AH04     | SRS-F5-600–606            |
| FR-PS-004 (polish)                   | P5-PS01–PS03     | SRS-F5-700–703            |
| ux-behavior §8 a11y                  | P5-A01–A12       | SRS-A11Y5-001–008         |
| feature-rules, project-structure     | P5-SC01–SC08     | SRS-F5-800–803, arch docs |
| BRD §14 Scenario 3                   | P5-D03           | §17.8                     |

## 8. Risks

| ID  | Risk                                               | Mitigation                                                        |
| --- | -------------------------------------------------- | ----------------------------------------------------------------- |
| R-1 | `custom-list.ts` type migration breaks seeds/tests | Migrate type, seeds, and consumers in one change; run build early |
| R-2 | No second UM persona for share demo                | Seed `person-um-002` in Step 2 before sharing tests               |
| R-3 | Inline-edit / profile sync race                    | Invalidate `person(id)` on commit; assert after settle            |
| R-4 | Action-item count 33 vs BRD 30                     | Accept or trim; decision recorded in SRS §19                      |
| R-5 | Carlos SRS approval pending                        | Do not start build until SRS approved                             |

## 9. Definition Of Done (exit / sign-off)

- [ ] §6.1 gates pass (exit 0).
- [ ] §6.2–6.14 cases pass (or documented, accepted deviations).
- [ ] Demo Scenario 3 passes end-to-end (§6.12).
- [ ] Phases 1–4 regression green (§6.13).
- [ ] Source-confirmed rows recorded (§6.14).
- [ ] Carlos signs off product review against SRS.
- [ ] Ivan signs off Phase 5 validation → MVP complete.

## 10. Out of Scope for Phase 5 QA

Do not block Phase 5 on: mobile/tablet responsive breakpoints, backend/persistence, new npm dependencies, or any feature outside Phase 5 SRS §5.1.

## 11. Proposed Automated Test Layout

```
tests/e2e/phase5/
  routing-guards.spec.ts
  custom-list-tabs.spec.ts
  list-builder.spec.ts
  inline-edit.spec.ts
  list-sharing.spec.ts
  assignments-section.spec.ts
  shared-profile-polish.spec.ts
  async-states.spec.ts
  accessibility.spec.ts
  demo-scenarios.spec.ts
  source-confirmed.spec.ts
tests/e2e/fixtures/phase5-data.ts
tests/e2e/page-objects/CustomListsPage.ts
tests/e2e/page-objects/ResourcingAssignmentsPage.ts
```
