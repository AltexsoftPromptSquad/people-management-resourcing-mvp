# Phase 5 — Validation Checklist

**Owner:** Ivan (QA / validation / test cases)

**Status:** Browser MCP validation complete — **53 PASS / 5 FAIL / 2 PARTIAL / 4 BLOCKED** (64 rows). Automated specs: 6 / 11 files.

**Last updated:** 2026-07-08 (Playwright MCP browser run)

## Scope

Validate the custom lists, Assignments, and profile-sharing polish increment against:

- `.planning/phases/phase-5-custom-lists/phase-5-test-plan.md`
- `.planning/phases/phase-5-custom-lists/SRS.md`
- `.planning/phases/phase-5-custom-lists/PLAN.md`
- BRD v1.1 (`FR-CL-*`, `FR-AH-004`, `AC-CL-*`, `AC-AH-002`–`004`, `AC-EP-005`, `BR-006`, `BR-007`, `BR-008`, `BR-009`)

Phase 5 delivers custom field/list management, list builder (filter/column/both), inline edit with profile sync, view-only list sharing, the UM Assignments read view, and re-opening an existing shared-profile link. Phase 5 closes the MVP.

## Validation environment

Desktop browser only (Chromium), viewport 1280 × 800. MSW active with deterministic Faker seed `faker.seed(20260625)`. Personas: UM `person-um-001` (Olena), UM recipient `person-um-002`, DM `person-dm-001` (Marcus), Employee `person-employee-001` (Nazar).

## Playwright spec map

| Spec file                                        | Coverage                   | Status      |
| ------------------------------------------------ | -------------------------- | ----------- |
| `tests/e2e/phase5/routing-guards.spec.ts`        | P5-R01–R03                 | Not present |
| `tests/e2e/phase5/custom-list-tabs.spec.ts`      | P5-CL01–CL04               | P5-CL01     |
| `tests/e2e/phase5/list-builder.spec.ts`          | P5-LB01–LB06               | P5-LB01     |
| `tests/e2e/phase5/inline-edit.spec.ts`           | P5-IE01–IE10, P5-SY01–SY02 | P5-IE01     |
| `tests/e2e/phase5/list-sharing.spec.ts`          | P5-LS01–LS05               | P5-LS01     |
| `tests/e2e/phase5/assignments-section.spec.ts`   | P5-AH01–AH04               | P5-AH01     |
| `tests/e2e/phase5/shared-profile-polish.spec.ts` | P5-PS01–PS03               | P5-PS01     |
| `tests/e2e/phase5/async-states.spec.ts`          | P5-AS01–AS05               | Not present |
| `tests/e2e/phase5/accessibility.spec.ts`         | P5-A01–A12                 | Not present |
| `tests/e2e/phase5/demo-scenarios.spec.ts`        | P5-D03                     | Not present |
| `tests/e2e/phase5/source-confirmed.spec.ts`      | P5-SC01–SC08               | Not present |

Fixtures: `tests/e2e/fixtures/phase5-data.ts`. Page objects: `CustomListsPage`, `ResourcingAssignmentsPage`.

### E2E coverage snapshot (2026-07-08)

Implemented tests map to these validation rows:

| Test ref | Spec                            | Rows checked                                                      |
| -------- | ------------------------------- | ----------------------------------------------------------------- |
| P5-CL01  | `custom-list-tabs.spec.ts`      | #4                                                                |
| P5-LB01  | `list-builder.spec.ts`          | #8                                                                |
| P5-IE01  | `inline-edit.spec.ts`           | #18 (Single Select via Bench Status combobox; test id is P5-IE01) |
| P5-LS01  | `list-sharing.spec.ts`          | #26                                                               |
| P5-AH01  | `assignments-section.spec.ts`   | #31, #33                                                          |
| P5-PS01  | `shared-profile-polish.spec.ts` | #35, #36, #37                                                     |

**6 automated specs** cover 11 rows. **Playwright MCP browser validation (2026-07-08)** exercised all 64 rows: 53 PASS, 5 FAIL, 2 PARTIAL, 4 BLOCKED. Report: `tests/test_reports/phase5/2026-07-08-playwright-mcp-validation.md`.

## Static Gates

```bash
npm run build
npm run lint
npm run format:check
```

| Check            | Command                | Pass criteria | Test ref | Result |
| ---------------- | ---------------------- | ------------- | -------- | ------ |
| TypeScript build | `npm run build`        | Exit 0        | P5-B01   | PASS   |
| ESLint           | `npm run lint`         | Exit 0        | P5-B02   | PASS   |
| Prettier         | `npm run format:check` | Exit 0        | P5-B03   | PASS   |

- [x] `npm run build` passes (exit 0).
- [x] `npm run lint` passes (exit 0).
- [x] `npm run format:check` passes (exit 0).

## Phase 1, 2, 3, 4 Regression

```bash
npm run test:e2e -- tests/e2e/phase1 tests/e2e/phase2 tests/e2e/phase3 tests/e2e/phase4
```

- [x] Previous phases still working (no regressions introduced by Phase 5 routes, nav, or type migration).

## Phase 5 E2E

```bash
npm run test:e2e -- tests/e2e/phase5
```

- [x] 6 passed / 0 failed across 6 implemented spec files (Chromium, 2026-07-08). Five planned spec files not yet added.

## Routing & role guards

| #   | Check                              | Expected result           | Test ref | Spec                     | Result |
| --- | ---------------------------------- | ------------------------- | -------- | ------------------------ | ------ |
| 1   | UM opens `/custom-lists`           | Custom Lists page renders | P5-R01   | `routing-guards.spec.ts` | PASS   |
| 2   | UM opens `/resourcing/assignments` | Assignments page renders  | P5-R02   | `routing-guards.spec.ts` | PASS   |
| 3   | DM/Employee blocked                | Redirect to landing       | P5-R03   | `routing-guards.spec.ts` | PASS   |

## Custom list tabs

| #   | Check             | Expected result                           | Test ref | Spec                       | Result  |
| --- | ----------------- | ----------------------------------------- | -------- | -------------------------- | ------- |
| 4   | Three seeded tabs | Bench, Booked, Needs Conversation present | P5-CL01  | `custom-list-tabs.spec.ts` | PASS    |
| 5   | Tab switch        | Table re-renders per active list          | P5-CL02  | `custom-list-tabs.spec.ts` | PASS    |
| 6   | Filter bar        | Filters only for usage ∈ {filter, both}   | P5-CL03  | `custom-list-tabs.spec.ts` | FAIL    |
| 7   | Empty list        | EmptyState SRS-COPY5-001/002              | P5-CL04  | `custom-list-tabs.spec.ts` | PARTIAL |

## List builder

| #   | Check                | Expected result                | Test ref | Spec                   | Result  |
| --- | -------------------- | ------------------------------ | -------- | ---------------------- | ------- |
| 8   | New List opens sheet | Name + filter + usage controls | P5-LB01  | `list-builder.spec.ts` | PASS    |
| 9   | Name required        | Empty name blocks save         | P5-LB02  | `list-builder.spec.ts` | PASS    |
| 10  | Usage designation    | Filter/Column/Both persists    | P5-LB03  | `list-builder.spec.ts` | PASS    |
| 11  | Column renders       | Column field in table          | P5-LB04  | `list-builder.spec.ts` | PASS    |
| 12  | Filter renders       | Filter field in filter bar     | P5-LB05  | `list-builder.spec.ts` | FAIL    |
| 13  | Both                 | Field in table and filter bar  | P5-LB06  | `list-builder.spec.ts` | PARTIAL |

## Inline edit

| #   | Check                   | Expected result                    | Test ref | Spec                  | Result  |
| --- | ----------------------- | ---------------------------------- | -------- | --------------------- | ------- |
| 14  | Text edit               | Commits on blur/Enter              | P5-IE01  | `inline-edit.spec.ts` | PASS    |
| 15  | Number edit             | Numeric; invalid reverts           | P5-IE02  | `inline-edit.spec.ts` | BLOCKED |
| 16  | Date edit               | Date input commits                 | P5-IE03  | `inline-edit.spec.ts` | PASS    |
| 17  | Boolean edit            | Checkbox toggles + commits         | P5-IE04  | `inline-edit.spec.ts` | PASS    |
| 18  | Single Select           | Options only from config           | P5-IE05  | `inline-edit.spec.ts` | PASS    |
| 19  | Escape cancels          | Cell reverts                       | P5-IE06  | `inline-edit.spec.ts` | PASS    |
| 20  | One cell at a time      | Opening another commits first      | P5-IE07  | `inline-edit.spec.ts` | PASS    |
| 21  | System column read-only | No edit on system columns          | P5-IE08  | `inline-edit.spec.ts` | PASS    |
| 22  | No success toast        | No toast on cell save              | P5-IE09  | `inline-edit.spec.ts` | PASS    |
| 23  | Save failure            | Revert + error toast SRS-COPY5-005 | P5-IE10  | `inline-edit.spec.ts` | PASS    |

## Profile sync

| #   | Check              | Expected result               | Test ref | Spec                  | Result |
| --- | ------------------ | ----------------------------- | -------- | --------------------- | ------ |
| 24  | Sync to profile    | Edited value on `/people/:id` | P5-SY01  | `inline-edit.spec.ts` | FAIL   |
| 25  | Query invalidation | `person(id)` refetched        | P5-SY02  | `inline-edit.spec.ts` | FAIL   |

## List sharing

| #   | Check                         | Expected result                     | Test ref | Spec                   | Result  |
| --- | ----------------------------- | ----------------------------------- | -------- | ---------------------- | ------- |
| 26  | Share list                    | Recipient selected; shared          | P5-LS01  | `list-sharing.spec.ts` | PASS    |
| 27  | Recipient sees tab            | Appears for `person-um-002`         | P5-LS02  | `list-sharing.spec.ts` | BLOCKED |
| 28  | Recipient view-only structure | No structure-edit controls (BR-008) | P5-LS03  | `list-sharing.spec.ts` | BLOCKED |
| 29  | Recipient edit scope          | Only own direct reports (BR-009)    | P5-LS04  | `list-sharing.spec.ts` | BLOCKED |
| 30  | Owner unaffected              | Owner retains control               | P5-LS05  | `list-sharing.spec.ts` | PASS    |

## Assignments (FR-AH-004)

| #   | Check             | Expected result                         | Test ref | Spec                          | Result |
| --- | ----------------- | --------------------------------------- | -------- | ----------------------------- | ------ |
| 31  | Assignments route | Renders for UM                          | P5-AH01  | `assignments-section.spec.ts` | PASS   |
| 32  | Records shown     | Aggregated unit assignment history      | P5-AH02  | `assignments-section.spec.ts` | PASS   |
| 33  | Read-only         | No edit actions                         | P5-AH03  | `assignments-section.spec.ts` | PASS   |
| 34  | Separation        | Not mixed with project history (BR-006) | P5-AH04  | `assignments-section.spec.ts` | PASS   |

## Shared profile polish

| #   | Check                 | Expected result                 | Test ref | Spec                            | Result |
| --- | --------------------- | ------------------------------- | -------- | ------------------------------- | ------ |
| 35  | Re-open shows link    | Existing active link shown      | P5-PS01  | `shared-profile-polish.spec.ts` | PASS   |
| 36  | No duplicate generate | Regenerate not forced           | P5-PS02  | `shared-profile-polish.spec.ts` | PASS   |
| 37  | Copy existing         | Copy works from re-opened sheet | P5-PS03  | `shared-profile-polish.spec.ts` | PASS   |

## Async states & UI rendering

| #   | Check         | Expected result                    | Test ref | Spec                   | Result |
| --- | ------------- | ---------------------------------- | -------- | ---------------------- | ------ |
| 38  | Page loading  | Page-tier LoadingState             | P5-AS01  | `async-states.spec.ts` | PASS   |
| 39  | Rows loading  | Section skeleton                   | P5-AS02  | `async-states.spec.ts` | PASS   |
| 40  | Empty         | EmptyState per copy                | P5-AS03  | `async-states.spec.ts` | PASS   |
| 41  | Error         | ErrorState per copy                | P5-AS04  | `async-states.spec.ts` | PASS   |
| 42  | Optimistic UI | Cell updates then reverts on error | P5-AS05  | `async-states.spec.ts` | PASS   |

## Accessibility

| #   | Check                    | Expected result                  | Test ref | Spec                    | Result |
| --- | ------------------------ | -------------------------------- | -------- | ----------------------- | ------ |
| 43  | Inline edit keyboard     | Enter/Tab commit; Escape cancel  | P5-A01   | `accessibility.spec.ts` | PASS   |
| 44  | Focus into cell          | Control focused on edit          | P5-A02   | `accessibility.spec.ts` | PASS   |
| 45  | Focus return             | Focus returns to cell on commit  | P5-A03   | `accessibility.spec.ts` | PASS   |
| 46  | Tabs roles               | Tabs keyboard navigable          | P5-A04   | `accessibility.spec.ts` | PASS   |
| 47  | Form labels              | Inputs labeled                   | P5-A05   | `accessibility.spec.ts` | PASS   |
| 48  | aria-busy loading        | LoadingState has `aria-busy`     | P5-A06   | `accessibility.spec.ts` | PASS   |
| 49  | role=alert error         | ErrorState has `role="alert"`    | P5-A07   | `accessibility.spec.ts` | PASS   |
| 50  | Checkbox/select keyboard | Boolean/Single Select operable   | P5-A08   | `accessibility.spec.ts` | PASS   |
| 51  | Table navigation         | Rows keyboard navigable          | P5-A09   | `accessibility.spec.ts` | PASS   |
| 52  | No console errors        | Zero console errors              | P5-A10   | `accessibility.spec.ts` | PASS   |
| 53  | Main landmark            | `<main>` present                 | P5-A11   | `accessibility.spec.ts` | PASS   |
| 54  | Icon button labels       | Accessible names on icon buttons | P5-A12   | `accessibility.spec.ts` | PASS   |

## Demo scenario (BRD §14)

| #   | Check      | Expected result                                  | Test ref | Spec                     | Result |
| --- | ---------- | ------------------------------------------------ | -------- | ------------------------ | ------ |
| 55  | Scenario 3 | Bench tab → edit Bench Status → profile confirms | P5-D03   | `demo-scenarios.spec.ts` | FAIL   |

## Full regression (Phases 1–4)

| #   | Check          | Expected result           | Test ref | Spec  | Result |
| --- | -------------- | ------------------------- | -------- | ----- | ------ |
| 56  | Phases 1–4 E2E | All previous suites green | P5-RG01  | (all) | PASS   |

## Source-confirmed architecture

| #   | Check                 | Expected result                               | Test ref | Spec                       | Result |
| --- | --------------------- | --------------------------------------------- | -------- | -------------------------- | ------ |
| 57  | Feature ownership     | Custom lists logic in `features/custom-lists` | P5-SC01  | `source-confirmed.spec.ts` | PASS   |
| 58  | Assignments ownership | Assignments table in `features/resourcing`    | P5-SC02  | `source-confirmed.spec.ts` | PASS   |
| 59  | Thin pages            | Pages compose only                            | P5-SC03  | `source-confirmed.spec.ts` | PASS   |
| 60  | Query keys            | New keys used consistently                    | P5-SC04  | `source-confirmed.spec.ts` | PASS   |
| 61  | Invalidation          | Inline edit invalidates person + rows         | P5-SC05  | `source-confirmed.spec.ts` | PASS   |
| 62  | Type migration        | `fieldConfigs` used; no legacy fields         | P5-SC06  | `source-confirmed.spec.ts` | PASS   |
| 63  | MSW append-only       | Existing handler shapes unchanged             | P5-SC07  | `source-confirmed.spec.ts` | PASS   |
| 64  | No new deps           | `package.json` deps unchanged                 | P5-SC08  | `source-confirmed.spec.ts` | PASS   |

## SRS traceability

| Area                  | P5 tests     | SRS / arch IDs    |
| --------------------- | ------------ | ----------------- |
| Custom fields         | P5-LB01      | SRS-F5-100–110    |
| List builder          | P5-LB01–LB06 | SRS-F5-200–215    |
| List tabs / table     | P5-CL01–CL04 | SRS-F5-300–312    |
| Inline edit           | P5-IE01–IE10 | SRS-F5-400–415    |
| Profile sync          | P5-SY01–SY02 | SRS-F5-405, 410   |
| Sharing               | P5-LS01–LS05 | SRS-F5-500–510    |
| Assignments           | P5-AH01–AH04 | SRS-F5-600–606    |
| Shared profile polish | P5-PS01–PS03 | SRS-F5-700–703    |
| Accessibility         | P5-A01–A12   | SRS-A11Y5-001–008 |
| Architecture          | P5-SC01–SC08 | SRS-F5-800–803    |

## Out of scope (confirm absent)

- Backend / database / auth
- Mobile / tablet responsive breakpoints
- New npm dependencies
- Any feature outside Phase 5 SRS §5.1

## Definition of done

Phase 5 validation is **done** when:

- [x] Static gates pass (exit 0).
- [ ] Functional cases (#1–54) pass (or documented, accepted deviations). **53 PASS / 5 FAIL / 2 PARTIAL / 4 BLOCKED** via Playwright MCP (2026-07-08).
- [ ] Demo Scenario 3 passes (#55). **FAIL** — profile does not reflect list inline edit (same root cause as #24).
- [x] Phases 1–4 regression green (#56). **224 passed**.
- [x] Source-confirmed rows recorded (#57–64). Code inspection PASS.
- [x] Execution results recorded under `tests/test_reports/phase5/`.
- [ ] Carlos signs off product review against SRS.
- [ ] Ivan Phase 5 validation complete → MVP complete.

## Evidence

| Check area                    | Command                                                                                   | Result | Evidence summary                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------- |
| Build gate                    | `npm run build`                                                                           | PASS   | Exit 0 (pre-existing)                                      |
| Lint gate                     | `npm run lint`                                                                            | PASS   | Exit 0 (pre-existing)                                      |
| Format gate                   | `npm run format:check`                                                                    | PASS   | Exit 0 (pre-existing)                                      |
| E2E automated validation gate | `npm run test:e2e -- tests/e2e/phase5`                                                    | PASS   | 6 passed, 0 failed, 32.6s (Chromium) — 2026-07-08          |
| Regression gate               | `npm run test:e2e -- tests/e2e/phase1 tests/e2e/phase2 tests/e2e/phase3 tests/e2e/phase4` | PASS   | 224 passed (4.5m, Chromium) — 2026-07-08                   |
| Browser MCP validation        | Playwright MCP `browser_run_code_unsafe` against `npm run dev`                            | MIXED  | 53 PASS / 5 FAIL / 2 PARTIAL / 4 BLOCKED — see report      |
| Source-confirmed architecture | Code inspection (#57–#64)                                                                 | PASS   | `src/features/custom-lists`, `query-keys.ts`, MSW handlers |

## Open failures (2026-07-08 Playwright MCP)

| Rows                   | Issue                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| #6, #12, #13 (partial) | **Filter bar not implemented** — no inline filter controls for `usage: filter \| both` on list tabs.                                                                                 |
| #7 (partial)           | SRS-COPY5-002 verified (`List not configured`); SRS-COPY5-001 (`No employees match`) not observed with seeded filters.                                                               |
| #24, #25, #55          | **Profile sync broken** — PATCH `/api/people/:id/custom-field-values` returns 200 with updated value, but GET `/api/people/:id` and profile UI still show stale `customFieldValues`. |
| #15                    | BLOCKED — no Number-type custom field in seed data.                                                                                                                                  |
| #27–#29                | BLOCKED — no UI persona picker for `persona-um-002`; API confirms share persistence for recipient.                                                                                   |

Full report: [`tests/test_reports/phase5/2026-07-08-playwright-mcp-validation.md`](../../../tests/test_reports/phase5/2026-07-08-playwright-mcp-validation.md)

## Sign-off

- [ ] Ivan Phase 5 validation complete —
- [ ] Carlos — SRS scope approved —
- [ ] Carlos — Product sign-off (Demo Scenario 3 + all-7 regression) —
