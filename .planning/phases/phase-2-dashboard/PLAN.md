# Phase 2 — Manager Dashboard & Subordinates

**Phase:** 2 of 5  
**Owner:** Volodymyr (development), Ivan (QA/validation)  
**Depends on:** Phase 1 complete ✅  
**Prerequisite:** Carlos approval of remediation decisions (`docs/requirements/DECISION-LOG.md`)  
**BRD version:** v1.1  
**Validation checklist:** `.planning/phases/phase-2-dashboard/VALIDATION.md` (to be created by Ivan)

---

## Goal

Deliver a functional Manager Dashboard with real seeded data, a working Subordinates table with sort/filter, and a full domain type and seed data foundation for all subsequent phases.

After Phase 2, Demo Scenario 1 (dashboard) and the navigation portion of Scenario 2 (list → profile row click) must be demonstrable.

---

## Scope

### 1. Domain Types (src/types)

Add all missing types from `docs/architecture/data-models.md`. These are needed by Phase 2 UI and all later phases.

| Type file               | Status                  | Notes                                                                                                                                                                              |
| ----------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `person.ts`             | Partial — must complete | Add all BRD §8.1 fields (dateOfBirth, address, emergencyContact, employmentType, englishLevel, hireDate, workLocation, personalEmail, personalPhone, workPhone, customFieldValues) |
| `resourcing-request.ts` | Partial — must complete | Add clientName, requiredSkills, gradeLevel, englishLevel, expectedCompensationLevel, workloadPercent, startDate, endDate, durationText, businessReason                             |
| `feedback.ts`           | Missing — create        | New entity from G-1                                                                                                                                                                |
| `scheduled-leave.ts`    | Missing — create        | New entity from G-2                                                                                                                                                                |
| `risk.ts`               | Missing — create        | id, personId, level, category, description, ownerId, dueDate, status, createdAt, updatedAt                                                                                         |
| `action-item.ts`        | Missing — create        | id, personId, title, description, assigneeId, ownerId, dueDate, priority, status                                                                                                   |
| `assignment-history.ts` | Missing — create        | See data-models.md                                                                                                                                                                 |
| `project-history.ts`    | Missing — create        | See data-models.md                                                                                                                                                                 |
| `document.ts`           | Missing — create        | id, personId, name, type, uploadedById, uploadedAt, visibility, mockFileName                                                                                                       |
| `idp.ts`                | Missing — create        | id, personId, documentReference, status, lastUpdatedAt                                                                                                                             |
| `custom-field.ts`       | Missing — create        | See data-models.md                                                                                                                                                                 |
| `custom-list.ts`        | Missing — create        | See data-models.md (includes G-3 fieldConfigs)                                                                                                                                     |
| `candidate-proposal.ts` | Missing — create        | See BRD §8.11                                                                                                                                                                      |
| `shared-profile.ts`     | Missing — create        | See BRD §8.13                                                                                                                                                                      |
| `allocation.ts`         | Missing — create        | id, personId, projectId, allocationPercent, startDate, endDate, role                                                                                                               |

### 2. Seed Data Expansion (src/mocks/data)

| Data file                | Current state      | Phase 2 target                                      |
| ------------------------ | ------------------ | --------------------------------------------------- |
| `people.ts`              | 75 (3 + 72 gen)    | 500+ (3 named + 497+ generated with full field set) |
| `feedbacks.ts`           | Missing            | 2+ per demo persona (min 6 total)                   |
| `scheduled-leaves.ts`    | Missing            | 1–2 per demo persona; at least 1 overlap scenario   |
| `risks.ts`               | Missing            | 20 total; 2+ High/Critical for demo                 |
| `action-items.ts`        | Missing            | 30 total; mix of overdue and upcoming               |
| `project-history.ts`     | Missing            | 2+ per demo persona; 1+ per generated person        |
| `resourcing-requests.ts` | 2 (partial fields) | 10 total with full field set                        |

Faker seed: use `faker.seed(20260625)` (existing) — do not change it. All Faker calls must be deterministic.

### 3. MSW Handlers (src/mocks/handlers.ts)

Add handlers for new endpoints:

```
GET  /api/people                           — list all people (unit filter via query param)
GET  /api/people/:id                       — single person
GET  /api/people/:id/feedbacks             — list feedbacks for person
POST /api/people/:id/feedbacks             — add feedback entry (Phase 3 uses this)
GET  /api/people/:id/scheduled-leaves      — list scheduled leaves for person
GET  /api/people/:id/risks                 — list risks for person
GET  /api/people/:id/action-items          — list action items for person
GET  /api/people/:id/project-history       — list project history items
GET  /api/people/:id/assignment-history    — list assignment history items
GET  /api/resourcing/requests              — DM: list requests by createdById; UM: list by assignedUnitManagerId
```

### 4. Query Keys (src/lib/query/query-keys.ts)

Extend `queryKeys` to cover all new entity queries:

```ts
people: (managerId?: string) => ['people', { managerId }],
person: (id: string) => ['person', id],
feedbacks: (personId: string) => ['feedbacks', personId],
scheduledLeaves: (personId: string) => ['scheduled-leaves', personId],
risks: (personId: string) => ['risks', personId],
actionItems: (personId: string) => ['action-items', personId],
projectHistory: (personId: string) => ['project-history', personId],
assignmentHistory: (personId: string) => ['assignment-history', personId],
resourcingRequests: (filter: { createdById?: string; assignedManagerId?: string }) => ['resourcing-requests', filter],
```

### 5. Manager Dashboard (`/dashboard`)

**Feature:** `src/features/dashboard`  
**Page:** `src/pages/dashboard-page/DashboardPage.tsx` (replace placeholder)

Required UI sections (see `ux-requirements.md#manager-dashboard`):

- **4 widget cards:** Headcount, Active Risks, Open Action Items, Active Requests
- **Action items list:** sorted by `dueDate` ascending; overdue rows highlighted; `EmptyState` when no open items
- **Quick nav:** links to Subordinates, Custom Lists, Resourcing, Risks

Feature API functions:

```
src/features/dashboard/api/get-dashboard-stats.ts
src/features/dashboard/hooks/use-dashboard-stats-query.ts
src/features/dashboard/components/stat-card/StatCard.tsx
src/features/dashboard/components/action-items-list/ActionItemsList.tsx
src/features/dashboard/components/quick-nav/QuickNav.tsx
```

### 6. Subordinates List (`/subordinates`)

**Feature:** `src/features/people`  
**Page:** `src/pages/subordinates-page/SubordinatesPage.tsx` (new page)

Required UI sections (see `ux-requirements.md#subordinates-list`):

- **Filter bar:** position, grade, current project status, risk level (all multi-select or select dropdowns using `src/shared/ui/select`)
- **Data table:** name (link), position, grade, project/status, risk badge — all 5 columns, all sortable
- Row click → navigate to `/people/:id`
- `EmptyState` when filter returns no results
- `LoadingState` while query is pending

Feature files:

```
src/features/people/api/get-subordinates.ts
src/features/people/hooks/use-subordinates-query.ts
src/features/people/components/subordinates-table/SubordinatesTable.tsx
src/features/people/tables/subordinates.columns.tsx
```

### 7. Route Registration

Add new routes to `src/app/router.tsx`:

```
/subordinates          → SubordinatesPage (UM only)
/people/:id            → EmployeeProfilePage stub (UM only) — placeholder, full UI in Phase 3
```

Add path helpers to `src/app/routes.ts`:

- `getSubordinatesPagePath()`
- `getEmployeeProfilePagePath(id: string)`

Update `src/app/navigation.ts` to include the Subordinates nav link for UM.

### 8. Shared UI Primitives to Add (if missing)

Before building feature components, check and add if missing:

| Primitive     | Needed for                                |
| ------------- | ----------------------------------------- |
| `select`      | Filter bar dropdowns                      |
| `data-table`  | Subordinates table (wraps TanStack Table) |
| `status-pill` | Project status column, request status     |
| `page-header` | Consistent page title + action area       |
| `skeleton`    | Loading state for table rows              |

---

## Requirements Traceability

| Deliverable                 | FR / BR / AC                 |
| --------------------------- | ---------------------------- |
| Dashboard widgets           | FR-DB-001–004, AC-DB-001     |
| Dashboard action items list | FR-DB-005–006, AC-DB-002–003 |
| Dashboard quick nav         | FR-DB-007, AC-DB-004         |
| Subordinates table          | FR-SL-001–005, AC-SL-001–005 |
| Subordinates filter         | FR-SL-004                    |
| Subordinates empty state    | FR-SL-006                    |
| Domain types (all)          | BRD §8, `data-models.md`     |
| Seed data (500+)            | BRD §7.1                     |
| New entity seed data        | BRD §7.1, G-1, G-2           |

---

## Acceptance Criteria

### Build / Lint / Format

| Check            | Command                | Pass criteria          |
| ---------------- | ---------------------- | ---------------------- |
| TypeScript build | `npm run build`        | Exit 0, no type errors |
| ESLint           | `npm run lint`         | Exit 0, no errors      |
| Prettier         | `npm run format:check` | Exit 0                 |

### Dashboard

| #   | Check                                      | Expected                                                                | BRD ref                |
| --- | ------------------------------------------ | ----------------------------------------------------------------------- | ---------------------- |
| 1   | Four widget cards render                   | Headcount, Active Risks, Open Action Items, Active Requests all visible | AC-DB-001              |
| 2   | Widget values are non-zero                 | All four widgets show seeded counts > 0                                 | AC-DB-001              |
| 3   | Action items list sorted by due date       | Earliest due date at top                                                | AC-DB-002              |
| 4   | Overdue action item highlighted            | At least one item with past due date has distinct visual treatment      | AC-DB-003              |
| 5   | Quick nav links function                   | Each link navigates to the correct page                                 | AC-DB-004              |
| 6   | Dashboard shows LoadingState while pending | Skeleton or LoadingState renders before data arrives                    | component-structure.md |
| 7   | Dashboard shows ErrorState on query fail   | ErrorState renders if mock returns error                                | component-structure.md |

### Subordinates List

| #   | Check                                        | Expected                                          | BRD ref   |
| --- | -------------------------------------------- | ------------------------------------------------- | --------- |
| 8   | List shows only UM's unit employees          | Only employees matching active UM's unitId        | AC-SL-001 |
| 9   | All five columns visible                     | Name, position, grade, project/status, risk level | AC-SL-002 |
| 10  | Sorting by name changes row order            | Rows reorder correctly ascending/descending       | AC-SL-003 |
| 11  | Filtering by risk level returns only matches | Rows not matching filter disappear                | AC-SL-004 |
| 12  | Row click opens employee profile             | Navigates to `/people/:id`; profile page renders  | AC-SL-005 |
| 13  | Empty state when filter returns no results   | EmptyState with message; no blank table body      | FR-SL-006 |

### Domain Types

| #   | Check                                      | Expected                                                                                                                                                                                            |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 14  | `Person` type includes all BRD §8.1 fields | TypeScript build passes with full field set                                                                                                                                                         |
| 15  | All new types exist in `src/types/`        | feedback.ts, scheduled-leave.ts, risk.ts, action-item.ts, assignment-history.ts, project-history.ts, document.ts, idp.ts, custom-field.ts, custom-list.ts, candidate-proposal.ts, shared-profile.ts |
| 16  | People seed has 500+ records               | `people.ts` exports 500+ `Person` objects                                                                                                                                                           |
| 17  | Feedback seed exists                       | 2+ entries per demo persona, typed correctly                                                                                                                                                        |
| 18  | ScheduledLeave seed exists                 | 1+ entry per demo persona with at least 1 overlap scenario                                                                                                                                          |
| 19  | Risk seed has 20+ records                  | `risks.ts` exports ≥ 20 typed `Risk` objects                                                                                                                                                        |
| 20  | ActionItem seed has 30+ records            | `action-items.ts` exports ≥ 30 typed records; mix overdue/upcoming                                                                                                                                  |

---

## Dependencies

| Dependency                             | Status    |
| -------------------------------------- | --------- |
| Phase 1 foundation complete            | ✅ Done   |
| Carlos approval of remediation log     | ⏸ Pending |
| `docs/architecture/data-models.md`     | ✅ Done   |
| `docs/architecture/ux-requirements.md` | ✅ Done   |
| `docs/architecture/feature-rules.md`   | ✅ Done   |

---

## Deferred to Phase 3

- Full Employee Profile tabs (Feedbacks, Scheduled Leaves, Risks, etc.)
- Personal profile editing
- `/people/:id` full implementation (Phase 2 may stub as placeholder)

## Definition of Done

Phase 2 is **done** when:

- [ ] All build/lint/format checks pass
- [ ] Domain types complete (all 16 files)
- [ ] Seed data expanded: 500+ people, feedbacks, scheduled leaves, risks, action items
- [ ] MSW handlers added for new endpoints
- [ ] Dashboard checks #1–7 pass
- [ ] Subordinates list checks #8–13 pass
- [ ] Domain type checks #14–20 pass
- [ ] Navigation updated (Subordinates nav link for UM)
- [ ] `STATUS.md` updated
- [ ] Ivan signs off Phase 2 validation before Phase 3 starts
