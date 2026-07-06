# Phase 3 — Validation

**Owner:** Ivan (QA / validation / test cases)

**Status:** Signed off

**Last updated:** 2026-07-06

## Scope

Validate the full Employee Profile increment against:

- `.planning/phases/phase-3-employee-profile/phase-3-test-plan.md`
- `.planning/phases/phase-3-employee-profile/SRS.md`
- `.planning/phases/phase-3-employee-profile/PLAN.md`
- BRD v1.1 (`FR-EP-*`, `FR-PV-*`, `FR-AH-*`, `BR-003`, `BR-006`, `BR-016`, `AC-EP-*`)

Phase 3 replaces the Phase 2 `/people/:id` stub with a full managerial profile (header +
seven tabs + UM editing) and delivers the Employee personal view at `/my-profile`.

## Validation environment

Desktop browser only (Chromium / modern equivalent), viewport 1280 × 800. Do not block on
mobile/tablet/narrow-viewport responsive behavior, back-end persistence, production auth,
file storage, or external integrations (BRD §13 QA Validation Scope). MSW active with
deterministic Faker seed `faker.seed(20260625)`. Personas: UM `person-um-001` (Olena),
DM `person-dm-001` (Marcus), Employee `person-employee-001` (Nazar).

## Build / Lint / Format (test plan §6.1)

| Check            | Command                | Pass criteria                                | Test ref |
| ---------------- | ---------------------- | -------------------------------------------- | -------- |
| TypeScript build | `npm run build`        | Exit 0; `tsc -b` clean; Vite bundle produced | P3-B01   |
| ESLint           | `npm run lint`         | Exit 0; only documented TanStack Table warn  | P3-B02   |
| Prettier         | `npm run format:check` | Exit 0; no formatting drift                  | P3-B03   |

- [x] `npm run build` passes (exit 0; Playwright suite green as part of the build gate).
- [x] `npm run lint` passes (0 errors; single known `react-hooks/incompatible-library` warning acceptable).
- [x] `npm run format:check` passes.

Additional validation rerun after shared UI migration (`react-tabs` + `react-toastify`):

- [x] `npm run build` re-pass after migration.
- [x] `npm run lint` re-pass after migration (same single known warning).
- [x] `npm run test:e2e -- tests/e2e/phase3` re-pass (5/5).

## Routing & role guards (test plan §6.2)

| #   | Check                                      | Expected result                                        | Test ref | Ref               |
| --- | ------------------------------------------ | ------------------------------------------------------ | -------- | ----------------- |
| 1   | UM drilldown → `/people/:id`               | Full managerial profile renders (not the Phase 2 stub) | P3-R01   | FR-SL-005         |
| 2   | Unknown person id                          | `ErrorState` "Profile not found." (no crash)           | P3-R02   | SRS-COPY3-022     |
| 3   | DM direct-navigates to `/people/:id`       | Redirected to `/resourcing/requests`                   | P3-R03   | BR-002, AS-004    |
| 4   | Employee direct-navigates to `/people/:id` | Redirected to `/my-profile`                            | P3-R04   | BR-003            |
| 5   | Employee opens `/my-profile`               | Own record only                                        | P3-R05   | FR-PV-001, AS-005 |
| 6   | UM/DM direct-navigate to `/my-profile`     | Redirected to their role landing                       | P3-R06   | Phase 1 guard     |
| 7   | Back navigation from profile               | Returns to prior page (`navigate(-1)`)                 | P3-R07   | ux-behavior 3.2   |
| 8   | Reload on `/people/:id`                    | Role resets to UM; profile still resolves              | P3-R08   | Phase 1 reload    |
| 9   | Person outside UM unit via direct URL      | Profile still renders (role-guard, not unit-guard)     | P3-R09   | ux-behavior 3.2   |

- [x] Route guards (#1–9) pass; DM/Employee blocked from `/people/:id`; UM/DM blocked from `/my-profile`.

## Managerial profile header (test plan §6.3)

| #   | Check                          | Expected result                                                                    | Test ref | Ref                  |
| --- | ------------------------------ | ---------------------------------------------------------------------------------- | -------- | -------------------- |
| 10  | Header fields render           | Initials, name, position, grade, unit, manager, status, availability %, risk badge | P3-H01   | FR-EP-001, AC-EP-001 |
| 11  | Values match seed              | Header values equal seeded fields                                                  | P3-H02   | SRS-F3-031           |
| 12  | Risk badge not color-only      | Risk level carries a text label, not color alone                                   | P3-H03   | SRS-A11Y3-005        |
| 13  | Generate Shared Profile absent | No "Generate Shared Profile" action on the header (deferred Phase 4)               | P3-H04   | SRS §5.2             |

- [x] Header cases (#10–13) pass.

## Profile tabs shell (test plan §6.4)

| #   | Check                      | Expected result                                                                                                     | Test ref | Ref                  |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- | -------------------- |
| 14  | Seven tabs present         | Overview, Job and Skills, Risks and Action Items, Feedbacks, Resourcing History, Project History, Documents and IDP | P3-T01   | FR-EP-002, AC-EP-002 |
| 15  | Overview active by default | Overview is active on mount                                                                                         | P3-T02   | SRS-F3-042           |
| 16  | Tab switch no reload       | Tabs render content without a full page reload                                                                      | P3-T03   | SRS-UX3-050          |
| 17  | Tab resets on re-entry     | Navigating away and back resets to Overview                                                                         | P3-T04   | SRS-UI3-005          |

- [x] Tab-shell cases (#14–17) pass.

## Tab content (test plan §6.5–6.11)

| #   | Check                         | Expected result                                                                                                     | Test ref              | Ref                      |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------ |
| 18  | Overview + Scheduled Leaves   | Basic/contact/employment/English/status; risk + action counts; leaves list with type/start/end/status; empty state  | P3-O01–O05            | FR-EP-003, AC-EP-008     |
| 19  | Job and Skills                | Position, grade, unit, manager, hire date, employment status, work location, English; skills list with level values | P3-J01–J02            | FR-EP-004                |
| 20  | Risks and Action Items        | Risk history entries (with levels), management notes, open + closed action items, and empty states                  | P3-K01–K03            | FR-EP-005                |
| 21  | Feedbacks list + read-only    | Newest-first with type/content/author/date; ≥2 seeded; empty state; no edit/delete controls                         | P3-F01, F02, F10, F11 | FR-EP-013, SRS-F3-082    |
| 22  | Resourcing vs Project History | Two distinct tabs, different data, never mixed; Resourcing History read-only; empty states                          | P3-RH01–RH05          | FR-EP-006–008, AC-EP-003 |
| 23  | Documents and IDP             | Documents (name/type/visibility/upload date); IDP status with tone; empty state                                     | P3-D01–D03            | FR-EP-009                |

- [x] Tab-content cases (#18–23) pass with seeded data.

## Feedbacks add-entry flow (test plan §6.8)

| #   | Check                         | Expected result                                                                     | Test ref | Ref                    |
| --- | ----------------------------- | ----------------------------------------------------------------------------------- | -------- | ---------------------- |
| 24  | Add Feedback opens sheet      | Sheet titled "Add Feedback"; first field auto-focused                               | P3-F03   | FR-EP-014, SRS-UX3-010 |
| 25  | Add form fields               | Type `Select` (HR Note/Performance/General) + Content `Textarea` (min 10)           | P3-F04   | SRS-UX3-011            |
| 26  | Type required validation      | Missing type → "Type is required."                                                  | P3-F05   | SRS-COPY3-050          |
| 27  | Content min-length validation | Content < 10 chars → "Feedback must be at least 10 characters."                     | P3-F06   | SRS-COPY3-051          |
| 28  | Save prepends without reload  | Sheet closes; entry at top; toast "Feedback saved."                                 | P3-F07   | AC-EP-007              |
| 29  | Save error path               | Forced POST failure → sheet stays open; toast "Failed to save feedback. Try again." | P3-F08   | SRS-COPY3-031          |
| 30  | Cancel/Escape discards        | Sheet closes; draft discarded; no confirm dialog                                    | P3-F09   | SRS-UX3-013            |

- [x] Add-feedback flow (#24–30) passes.

## Custom fields & managerial editing (test plan §6.11–6.13)

| #   | Check                           | Expected result                                                                | Test ref | Ref           |
| --- | ------------------------------- | ------------------------------------------------------------------------------ | -------- | ------------- |
| 31  | Custom fields display           | All custom field values shown for the employee                                 | P3-C01   | FR-EP-010     |
| 32  | Custom field edit + save        | Click-to-edit value saves and reflects updated value in-session                | P3-C02   | AC-EP-005     |
| 33  | UM editable fields              | UM edits English level, IDP reference, skills, management notes, custom fields | P3-M01   | FR-EP-012     |
| 34  | Save confirmation               | Successful edits show a visible success confirmation + updated value           | P3-M02   | SRS-COPY3-036 |
| 35  | Manager notes visible (mgr)     | HR/management notes visible on `/people/:id`                                   | P3-V01   | FR-EP-011     |
| 36  | Manager notes hidden (personal) | Notes not present anywhere in `/my-profile`                                    | P3-V02   | AC-EP-004     |
| 37  | Feedbacks hidden (personal)     | Feedback entries never shown in personal view                                  | P3-V03   | BR-016        |

- [x] Custom-field / editing / visibility cases (#31–37) pass.

## Personal profile self-service (test plan §6.14)

| #   | Check                     | Expected result                                                                 | Test ref | Ref               |
| --- | ------------------------- | ------------------------------------------------------------------------------- | -------- | ----------------- |
| 38  | Own profile only          | `/my-profile` shows only the employee's own record                              | P3-PV01  | FR-PV-001, BR-003 |
| 39  | Edit contact in place     | Contact toggles to edit; Save/Cancel appear                                     | P3-PV02  | FR-PV-002         |
| 40  | Email format validation   | Invalid email on blur → "Enter a valid email address."                          | P3-PV03  | SRS-COPY3-052     |
| 41  | Contact save confirmation | View mode with new values; toast "Contact information saved."                   | P3-PV04  | SRS-COPY3-032     |
| 42  | Contact cancel            | Cancel restores original values; no confirm dialog                              | P3-PV05  | SRS-UX3-032       |
| 43  | View own action items     | Read-only; empty copy "...assigned to you by your manager..."                   | P3-PV06  | FR-PV-003         |
| 44  | Update IDP status         | Dropdown offers Not Started/In Progress/Completed; toast "IDP status updated."  | P3-PV07  | FR-PV-004         |
| 45  | Add certificate           | Name + mock file name (required) → row prepended; toast "Certificate added."    | P3-PV08  | FR-PV-005         |
| 46  | Certificate error path    | Forced failure → toast "Could not add certificate. Try again."; form stays open | P3-PV09  | SRS-COPY3-035     |
| 47  | Sensitive data hidden     | No manager notes, risks, or assignment history in personal view                 | P3-PV10  | FR-PV-006, AS-011 |
| 48  | Save confirmation generic | Every employee-saved change surfaces a visible success message                  | P3-PV11  | FR-PV-007         |

- [x] Personal profile cases (#38–48) pass.

## Async states (test plan §6.15)

| #   | Check                  | Expected result                                                                 | Test ref | Ref           |
| --- | ---------------------- | ------------------------------------------------------------------------------- | -------- | ------------- |
| 49  | Profile loading state  | `LoadingState label="Loading profile…"` while person query pending              | P3-AS01  | SRS-UI3-001   |
| 50  | Profile error state    | Forced failure → `ErrorState` "Could not load profile" + "Back to Subordinates" | P3-AS02  | SRS-COPY3-020 |
| 51  | Per-tab section states | Each tab renders its loading/empty/error without crashing the page              | P3-AS03  | SRS-UI3-011   |

- [x] Async-state cases (#49–51) pass.

## Accessibility (test plan §6.16)

| #   | Check                          | Expected result                                                                 | Test ref | Ref                       |
| --- | ------------------------------ | ------------------------------------------------------------------------------- | -------- | ------------------------- |
| 52  | Single `h1`, semantic headings | One `h1` per page; sections labelled                                            | P3-A01   | SRS-A11Y3-001             |
| 53  | Tabs keyboard operable         | Arrow/Enter/Space activate; visible focus                                       | P3-A02   | SRS-A11Y3-002             |
| 54  | Form fields labelled           | Sheets/edit forms have associated labels; errors announced; `aria-busy` on save | P3-A03   | SRS-A11Y3-003/004/007/008 |
| 55  | State containers readable      | Loading/empty/error use text + semantic containers, not color-only              | P3-A04   | SRS-A11Y3-005/006         |
| 56  | No console errors              | Zero console errors/warnings across profile + my-profile flows                  | P3-A05   | SRS-NF3-001               |

- [x] Accessibility cases (#52–56) pass with zero console errors.

## Demo scenarios (test plan §6.17)

| #   | Scenario                  | Steps / expected                                                                          | Test ref | Ref        |
| --- | ------------------------- | ----------------------------------------------------------------------------------------- | -------- | ---------- |
| 57  | Scenario 2 — View Profile | UM → Subordinates → filter/sort → open row → review all seven tabs with seeded content    | P3-E2E01 | BRD §14 S2 |
| 58  | Scenario 7 — Self-Service | Employee → My Profile → edit phone → update IDP status → add certificate → each confirmed | P3-E2E02 | BRD §14 S7 |

- [x] Demo Scenarios 2 and 7 pass end-to-end.

## Non-functional (test plan §6.18)

| #   | Check                    | Expected result                                       | Test ref | Ref             |
| --- | ------------------------ | ----------------------------------------------------- | -------- | --------------- |
| 59  | Frontend-only            | No backend/persistence; all data via MSW              | P3-N01   | SRS-NF3-001/007 |
| 60  | Desktop layout at 1280px | Profile + my-profile usable, no clipping/overflow     | P3-N02   | AS-016          |
| 61  | Deterministic reruns     | Repeated runs yield identical seed-derived assertions | P3-N03   | SRS-NF3-006     |

- [x] Non-functional cases (#59–61) pass.

## Source-confirmed architecture & ownership (test plan §6.19)

| #   | Check                     | Expected result                                                        | Test ref | Ref        |
| --- | ------------------------- | ---------------------------------------------------------------------- | -------- | ---------- |
| 62  | Query keys extended       | `query-keys.ts` exposes `documents(personId)` and `idp(personId)`      | P3-SC01  | SRS-F3-020 |
| 63  | Mutation invalidation     | Person/feedback/document/IDP mutations invalidate affected keys        | P3-SC02  | SRS-F3-021 |
| 64  | Feature ownership         | Domain logic under `src/features/employee-profile/`; no logic in pages | P3-SC03  | SRS-F3-140 |
| 65  | Thin route pages          | `EmployeeProfilePage` / `MyProfilePage` are thin composition layers    | P3-SC04  | SRS-F3-141 |
| 66  | Tabs use shared primitive | Profile tabs use `src/shared/ui/tabs`                                  | P3-SC05  | SRS-F3-041 |

- [x] Source-confirmed rows (#62–66) recorded in the execution report.

## Entry criteria (test plan §10)

- [x] Phase 2 validation signed off (per `.planning/STATE.md`).
- [x] Phase 3 implemented (managerial + personal profile), or the increment under test is available; deps installed; `npm run dev` serves the app with MSW.
- [x] Documents/IDP seed gap (test plan R-1) resolved or explicitly accepted for the increment.

## Definition of Done (exit / sign-off)

Phase 3 validation is **done** when:

- [x] §6.1 gates pass (exit 0; only the documented lint warning).
- [x] §6.2–6.14 functional cases pass (or documented, accepted deviations).
- [x] §6.15 async-state cases pass; §6.16 accessibility cases pass with zero console errors.
- [x] §6.17 demo Scenarios 2 and 7 pass end-to-end.
- [x] §6.19 source-confirmed architecture rows recorded (query keys, invalidation, feature ownership, thin pages, shared `tabs` primitive).
- [x] All seven tabs render with seeded data; managerial vs personal visibility rules (FR-EP-011, BR-016, FR-PV-006) verified.
- [x] Documents/IDP seed (R-1) resolved or explicitly accepted by Carlos/Volodymyr.
- [x] Execution results recorded under `tests/test_reports/phase3/`; `.planning/STATE.md` and Phase 3 `STATUS.md` updated.
- [x] Carlos signs off product review against SRS (PR #22) — Carlos Nunes, 2026-07-06.
- [ ] Ivan signs off Phase 3 validation before Phase 4 starts.

## Evidence

| Check area                    | Command                                | Result | Evidence summary                                                                                       |
| ----------------------------- | -------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| Build gate                    | `npm run build`                        | ✅     | Exit 0; `tsc -b` clean; Vite bundle produced (2026-07-03, Sonnet 4.6)                                  |
| Lint gate                     | `npm run lint`                         | ✅     | Exit 0; 0 errors; 1 known `react-hooks/incompatible-library` warning in `SubordinatesTable.tsx`        |
| Format gate                   | `npm run format:check`                 | ✅     | Exit 0; "All matched files use Prettier code style!"                                                   |
| E2E automated validation gate | `npm run test:e2e -- tests/e2e/phase3` | ✅     | **78 passed / 0 failed** across 12 spec files (Chromium, 2026-07-03)                                   |
| §6.19 source-confirmed        | Code inspection                        | ✅     | query-keys, mutation invalidation, feature ownership, thin pages, shared tabs — all verified in source |
| R-1 Documents/IDP seed gap    | Code inspection                        | ✅     | `src/mocks/data/documents.ts` + `src/mocks/data/idp.ts` seeded; MSW handlers wired for GET/POST/PATCH  |

Supporting test reports (to be produced under `tests/test_reports/phase3/`):

- `phase-3-test-plan.md`

## Out of scope for Phase 3 QA

Do **not** block Phase 3 on: resourcing request creation / candidate proposal / review
(Phase 4), assignment-history write path (Phase 4), profile sharing generation and public
token view (Phase 4/5), custom list builder and sharing UX (Phase 5), mobile/tablet/
responsive breakpoints, or backend/persistence.
