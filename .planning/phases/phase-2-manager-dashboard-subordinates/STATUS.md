# Phase 2 Manager Dashboard & Subordinates Status

**Owner:** Volodymyr  
**Last updated:** 2026-06-26  
**Status:** Implemented on branch `phase-2-impl/attempt-1`, pending validation/sign-off

## Done

- Phase 2 planning docs: `PLAN.md`, `SRS.md`, `VALIDATION.md`, `IMPLEMENTATION_PLAN.md`
- Routes and navigation extended for dashboard, subordinates, profile stub, and UM quick-link placeholders
- Dashboard feature: summary widgets, action items list, quick navigation
- Subordinates feature: filters, sortable table, row navigation to profile stub
- Mock seed expanded to 540 people with risks, action items, and resourcing request counts
- MSW endpoints added: `/api/dashboard/summary`, `/api/dashboard/action-items`, `/api/subordinates`
- Shared UI primitives added: `Input`, `Select`
- `QA validation. Artifacts generated under /tests folder`

## QA Handoff Notes

| Item                   | Expected value / behavior                                                           |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Default UM persona     | `persona-um-001` / Olena Kovalenko / `person-um-001`                                |
| Seed count             | 540 people total (3 persona-linked + 537 generated)                                 |
| Unit Manager unit      | `unit-platform`                                                                     |
| Subordinate scope      | People in manager unit excluding manager self (~179 records)                        |
| Dashboard widgets (UM) | Non-zero subordinate, risk, action item, and active request counts                  |
| Action items sort      | Due date ascending; overdue items marked with danger badge                          |
| Subordinates columns   | Name, position, grade, status, risk                                                 |
| Filters                | Search, position, grade, status, risk level                                         |
| Profile stub route     | `/people/:personId`                                                                 |
| Deferred               | Full profile tabs (Phase 3), resourcing workflows (Phase 4), custom lists (Phase 5) |

## Still To Do
