# Phase 2 — Validation

**Owner:** Ivan (QA / validation / test cases)

**Validation environment:** Desktop browser only (Chrome or modern equivalent), viewport >= 1280px. Do not block on mobile/tablet/narrow-viewport responsive behavior, back-end persistence, production auth, file storage, or external integrations (BRD QA scope).

QA checklist for manager dashboard and subordinates phase. Reference BRD acceptance criteria where applicable.

## Build / Lint / Format

| Check            | Command                | Pass criteria               |
| ---------------- | ---------------------- | --------------------------- |
| TypeScript build | `npm run build`        | Exit 0, no type errors      |
| ESLint           | `npm run lint`         | Exit 0, no errors           |
| Prettier         | `npm run format:check` | Exit 0, no formatting drift |

## Unit Manager Dashboard (FR-DB-_, AC-DB-_)

| #   | Check                                | Expected result                                                         | BRD ref              |
| --- | ------------------------------------ | ----------------------------------------------------------------------- | -------------------- |
| 1   | Dashboard route accessible for UM    | Unit Manager can load dashboard without role mismatch redirect failures | FR-DB-001            |
| 2   | Subordinate headcount widget         | Count is shown and matches seeded data baseline                         | FR-DB-001, AC-DB-001 |
| 3   | Active risks widget                  | Count is shown and matches seeded data baseline                         | FR-DB-002, AC-DB-001 |
| 4   | Open action items widget             | Count is shown and matches seeded data baseline                         | FR-DB-003, AC-DB-001 |
| 5   | Active resourcing requests widget    | Count is shown and matches seeded data baseline                         | FR-DB-004, AC-DB-001 |
| 6   | Action items sorted by due date      | Earliest due items appear first                                         | FR-DB-005, AC-DB-002 |
| 7   | Overdue action item visual treatment | Overdue items are visually distinct                                     | FR-DB-006, AC-DB-003 |
| 8   | Quick nav actions                    | Links/cards to Subordinates, Custom Lists, Resourcing, Risks are usable | FR-DB-007, AC-DB-004 |

## Subordinates List (FR-SL-_, AC-SL-_)

| #   | Check                                | Expected result                                           | BRD ref              |
| --- | ------------------------------------ | --------------------------------------------------------- | -------------------- |
| 9   | Subordinates route accessible for UM | Unit Manager can open the list page                       | FR-SL-001            |
| 10  | Unit-scoped dataset                  | Only subordinate records from manager scope are displayed | FR-SL-001, AC-SL-001 |
| 11  | Required columns rendered            | Name, position, grade, status, risk columns are visible   | FR-SL-002, AC-SL-002 |
| 12  | Sorting behavior                     | Sorting controls work and reorder rows correctly          | FR-SL-003, AC-SL-003 |
| 13  | Filtering behavior                   | Filtering narrows rows without breaking sort state        | FR-SL-004, AC-SL-003 |
| 14  | Empty-state handling                 | Clear empty-state UI appears when filters return no rows  | FR-SL-006, AC-SL-004 |
| 15  | Row click/navigation to profile stub | Selecting a row opens the intended profile entry route    | FR-SL-005, AC-SL-005 |

## Role And Routing Guardrails

| #   | Check                                  | Expected result                                                           |
| --- | -------------------------------------- | ------------------------------------------------------------------------- |
| 16  | Dashboard not exposed to wrong role    | Non-UM role does not gain unauthorized manager workflow access            |
| 17  | Subordinates not exposed to wrong role | Non-UM role does not gain unauthorized subordinate list access            |
| 18  | Browser back/forward state stability   | Navigating dashboard/list/history does not produce blank or broken states |

## Mock Data / Seed Validation

| #   | Check                                      | Expected result                                                         |
| --- | ------------------------------------------ | ----------------------------------------------------------------------- |
| 19  | Employee seed expansion applied            | Seed data grows from Phase 1 baseline toward 500+ employee target       |
| 20  | Unit distribution sanity                   | Employees are distributed across seeded units in a realistic way        |
| 21  | Dashboard backing datasets present         | Risks, action items, and requests have enough records for meaningful UI |
| 22  | No hard-coded large datasets in components | Dashboard/list data comes from mock layer and query hooks               |

## Browser Behavior (manual)

| #   | Scenario                             | Steps                              | Expected                                                |
| --- | ------------------------------------ | ---------------------------------- | ------------------------------------------------------- |
| 23  | Unit Manager dashboard smoke         | Open app as UM -> dashboard        | Widgets and action items load with no layout breakage   |
| 24  | Dashboard to subordinates navigation | Use nav/quick link to subordinates | Subordinates page loads with valid data                 |
| 25  | Sort + filter combination            | Apply filter then sort             | Results remain consistent and deterministic             |
| 26  | Subordinates row to profile stub     | Open first subordinate row         | Profile entry/stub route opens and remains navigable    |
| 27  | Desktop usability                    | 1280px+ viewport                   | Header, nav, cards, table, and controls remain usable   |
| 28  | Keyboard flow on dashboard/list      | Tab through links/buttons/controls | Focus ring visible; controls are reachable and operable |

## Accessibility (smoke)

| #   | Check                                     | Expected result                                          |
| --- | ----------------------------------------- | -------------------------------------------------------- |
| 29  | Widgets have semantic labels              | Card/widget titles are announced and understandable      |
| 30  | Table headers and controls are accessible | Column headers and filter controls are keyboard-usable   |
| 31  | Navigation links have visible focus       | Focus state is visible in header and dashboard quick nav |

## Definition of Done

Phase 2 is **done** when:

- [ ] All build/lint/format checks pass
- [ ] Dashboard checks (#1-8) pass
- [ ] Subordinates checks (#9-15) pass
- [ ] Role/routing checks (#16-18) pass
- [ ] Mock data checks (#19-22) pass
- [ ] Browser scenarios (#23-28) pass
- [ ] Accessibility smoke (#29-31) pass
- [ ] No regressions to Phase 1 role-switch and role-aware route behavior
- [ ] `.planning/STATE.md` updated with Phase 2 implementation and validation status
- [ ] Ivan signs off validation -> Phase 3 may begin

## Out of Scope for Phase 2 QA

Do **not** block Phase 2 on full profile tabs/editing, employee self-service editing flows, resourcing proposal/review workflow, assignment history implementation, custom list builder/share workflows, or profile-sharing token UX.
