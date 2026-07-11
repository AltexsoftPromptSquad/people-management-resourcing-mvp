# Phase 5 — Manual Testing Results

| Field     | Value                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Date**  | 2026-07-10                                                                                                                            |
| **Owner** | Ivan (QA)                                                                                                                             |
| **Scope** | Entire application (current state)                                                                                                    |
| **Goal**  | Compare the end solution against the original specs (_Test Assignment.pdf_) and find issues in implementation not caught by AI agents |

---

## Functional / Product Issues

Issues where behavior, data, or capabilities do not match requirements or expected product logic.

### Custom Lists

| #       | Issue                                                                                      |
| ------- | ------------------------------------------------------------------------------------------ |
| F-CL-01 | UM cannot create/delete custom fields on the Employee profile page — only edit them.       |
| F-CL-02 | Risk column is absent, although the user can filter by it.                                 |
| F-CL-03 | All custom fields can only be used as columns, not as filters (or both).                   |
| F-CL-04 | "Share List" button exists but cannot be tested — only one hard-coded UM is in the system. |

### Employee Profile (UM view)

| #       | Issue                                                                          |
| ------- | ------------------------------------------------------------------------------ |
| F-EP-01 | Birthday field is missing.                                                     |
| F-EP-02 | Emergency contact is missing.                                                  |
| F-EP-03 | `GET /idp` returns 404 for every profile.                                      |
| F-EP-04 | "Assignment History" is labeled "Resourcing History" in the UI.                |
| F-EP-05 | Action Items are view-only — cannot be added, edited, or resolved.             |
| F-EP-06 | Added feedback shows July 1st date instead of the current date.                |
| F-EP-07 | Shared Profile link does not update after checking/unchecking optional fields. |
| F-EP-08 | Shared Profile link does not work when any optional field is checked.          |
| F-EP-09 | Shared Profile link cannot be generated for the same user twice.               |

### Sales/DM — Requests

| #       | Issue                                                                                       |
| ------- | ------------------------------------------------------------------------------------------- |
| F-SR-01 | Separate End Date and Duration fields are both present — redundant; no reason to have both. |
| F-SR-02 | No links to Proposed Candidates' profiles.                                                  |

### UM — Incoming Requests

| #       | Issue                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------- |
| F-IR-01 | Approved/Rejected requests show almost no detail — reason and candidate(s) details are missing. |

---

## UX Issues

Issues where the interface is confusing, inconsistent, or hard to use, but underlying product logic may be correct.

### Dashboard

| #       | Issue                                                                                                 |
| ------- | ----------------------------------------------------------------------------------------------------- |
| U-D-01  | "Quick navigation" section is duplicated — at the top of the page and in the middle.                  |
| U-D-01a | Two buttons match between sections (Subordinates, Custom Lists).                                      |
| U-D-01b | Middle section "Resourcing" is labeled "Incomming Requtests" in the top bar.                          |
| U-D-01c | "Assignments" appears only in the top nav bar, not in the middle section.                             |
| U-D-01d | "Risks" appears only in the middle section, not in the top bar.                                       |
| U-D-02  | "My Action Items" section header uses the same style as the action items below it.                    |
| U-D-03  | "Assignee" filter serves no purpose — list is always "my action items", not anyone else's.            |
| U-D-04  | No pagination or search for "My Action Items" (may be intentional if volume is expected to stay low). |
| U-D-05  | "In Progress" status uses the same background color as "Open".                                        |
| U-D-06  | User has no control over their action items — view-only list.                                         |

### Custom Lists

| #       | Issue                                                                           |
| ------- | ------------------------------------------------------------------------------- |
| U-CL-01 | Add/Edit list form is confusing and likely requires additional training.        |
| U-CL-02 | No visual separation between default and custom fields — all appear as columns. |

### Subordinates

| #      | Issue                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------ |
| U-S-01 | No pagination for the subordinates list — all records load by default (potential performance concern). |

### Employee Profile (UM view)

| #       | Issue                                                  |
| ------- | ------------------------------------------------------ |
| U-EP-01 | Added feedback shows author ID instead of author name. |

### UM — Incoming Requests

| #       | Issue                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------- |
| U-IR-01 | "Unit employees" section is not filtered for the requested position — all unit profiles appear. |

---

## Backend / Performance Issues

| #    | Issue                                                                                                    |
| ---- | -------------------------------------------------------------------------------------------------------- |
| B-01 | `GET /subordinates` is called on every search/filter action — may cause unnecessary backend/DB overhead. |

---

## Issue Summary

| Category              |  Count |
| --------------------- | -----: |
| Functional / Product  |     16 |
| UX                    |     14 |
| Backend / Performance |      1 |
| **Total**             | **31** |

---

## Engineering Status Update

| Field                    | Value                                                  |
| ------------------------ | ------------------------------------------------------ |
| **Updated**              | 2026-07-11                                             |
| **Branch**               | `fix/phase5-manual-qa`                                 |
| **Manual QA fix commit** | `74350cb Fix manual QA findings for phase 5`           |
| **E2E fix commit**       | `28de759 Fix phase 3 and 4 e2e coverage`               |
| **Status source**        | [manual-qa-fix-status.md](./manual-qa-fix-status.md)   |
| **Triage source**        | [manual-testing-triage.md](./manual-testing-triage.md) |

Current engineering status:

| Status                 | Count | Notes                                                                                          |
| ---------------------- | ----: | ---------------------------------------------------------------------------------------------- |
| Fixed                  |    29 | Code changes are implemented and relevant regression suites now pass.                          |
| Expected               |     1 | `F-EP-04`: current product terminology uses "Resourcing History".                              |
| Needs Product Decision |     1 | `U-CL-01`: broader list-builder UX simplification needs product/design acceptance criteria.    |
| Needs Verification     |     1 | `B-01`: subordinates request-count/performance behavior needs a targeted network verification. |

Verification completed after fixes:

| Check                                                                 | Result                                            |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| `npm.cmd run test:e2e -- tests/e2e/phase1`                            | `28 passed`                                       |
| `npm.cmd run test:e2e -- tests/e2e/phase2`                            | `40 passed`                                       |
| `npm.cmd run test:e2e -- tests/e2e/phase3 tests/e2e/phase4`           | `156 passed`                                      |
| `npm.cmd run test:e2e -- tests/e2e/phase5`                            | `6 passed`                                        |
| `npm.cmd run build`                                                   | Passed                                            |
| `npm.cmd run lint`                                                    | Passed with existing warnings in shared controls. |
| Prettier check for files changed in the Phase 3/4 e2e coverage commit | Passed                                            |

Notes:

- The original QA findings above are kept as the immutable baseline from QA.
- Detailed issue-by-issue closure evidence is tracked in [manual-qa-fix-status.md](./manual-qa-fix-status.md).
- The original summary count is retained from the QA report; the engineering status table tracks the individual issue rows, including the `U-D-01a`..`U-D-01d` dashboard sub-items.
