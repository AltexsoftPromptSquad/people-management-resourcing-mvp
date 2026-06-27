# UX Requirements

Implementation-ready UX guidance for all MVP screens. Derived from BRD v1.1, `visual-theme.md`, and `page-structure.md`.

Read this document before building any feature screen. It defines required sections, mandatory states, navigation expectations, and consistency rules.

**Companion document:** [`ux-behavior.md`](./ux-behavior.md) — exact interaction sequences, component state machines, all copy strings (empty states, toasts, confirm dialogs, validation errors), timing constants, keyboard behavior, and accessibility checklist. Read both before implementing any interactive feature.

---

## Global UX Rules

- Every page has exactly one `<h1>` landmark heading.
- Every page has a `<main>` element wrapping the primary content.
- All async-data sections must handle **loading**, **error**, and **empty** states explicitly using shared primitives (`LoadingState`, `ErrorState`, `EmptyState`).
- All form submissions must show a **success confirmation** or a **validation error** message.
- Sensitive data sections (feedbacks, scheduled leaves, risks, manager notes, documents) must **never** appear in the Employee personal view.
- Navigation state (`aria-current="page"`) and role state (`aria-pressed`) must be correct on every role/nav transition.
- Actions that are destructive or irreversible (withdraw candidate, cancel request, reject candidate) must show a **confirm dialog** before proceeding.
- All tables must show an **empty state** when no rows match the active filter.
- Desktop viewport (≥ 1280px) is the primary target. Do not block on mobile.

---

## Manager Dashboard (`/dashboard`)

**Role:** Unit Manager only.

### Required Sections

| Section           | BRD ref       | Description                                                               |
| ----------------- | ------------- | ------------------------------------------------------------------------- |
| Page header       | —             | Role name + persona name (small), page title "Manager Dashboard"          |
| Widget row        | FR-DB-001–004 | 4 stat cards: Headcount, Active Risks, Open Action Items, Active Requests |
| Action items list | FR-DB-005–006 | Sorted by due date ascending; overdue rows highlighted with warning tone  |
| Quick nav         | FR-DB-007     | Link cards or buttons to: Subordinates, Custom Lists, Resourcing, Risks   |

### Widget Cards (4)

Each card shows: label, seeded count value, icon or tone indicator.

| Widget            | Tone    | Value source                                                                                                      |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| Headcount         | neutral | Count of `people` where `unitId` matches active manager's unit                                                    |
| Active Risks      | danger  | Count of `risks` with `status = 'Open'` across all subordinates                                                   |
| Open Action Items | warning | Count of `actionItems` with `status = 'Open'` across all subordinates                                             |
| Active Requests   | info    | Count of `resourcingRequests` where `assignedUnitManagerId` matches and `status` is not Closed/Cancelled/Rejected |

### Action Items List

- Columns: title, assignee name, due date, priority badge, status pill.
- Sorted ascending by `dueDate`.
- Overdue: `dueDate < today` → row highlighted with `warning` tone or `danger` badge.
- Empty state: "No open action items. All caught up."

### States

| State   | Trigger            | Component                              |
| ------- | ------------------ | -------------------------------------- |
| Loading | Data query pending | `LoadingState` covering the widget row |
| Error   | Query fails        | `ErrorState` with retry hint           |
| Empty   | No action items    | `EmptyState` with descriptive message  |

### Navigation Expectations

- Quick nav links navigate within the app (React Router `<Link>`).
- Clicking an action item row navigates to the relevant employee profile.

---

## Subordinates List (`/subordinates`)

**Role:** Unit Manager only.

### Required Sections

| Section     | BRD ref       | Description                                                                      |
| ----------- | ------------- | -------------------------------------------------------------------------------- |
| Page header | —             | Title "Subordinates", employee count label                                       |
| Filter bar  | FR-SL-004     | Filters: position (select), grade (select), status (select), risk level (select) |
| Data table  | FR-SL-001–005 | See columns below                                                                |

### Table Columns

| Column         | Sortable | Filterable | Notes                                                                     |
| -------------- | -------- | ---------- | ------------------------------------------------------------------------- |
| Full name      | Yes      | No         | Link → employee profile                                                   |
| Position       | Yes      | Yes        | Plain text                                                                |
| Grade          | Yes      | Yes        | Plain text                                                                |
| Project/Status | Yes      | Yes        | `currentProjectStatus` field                                              |
| Risk Level     | Yes      | Yes        | `Badge` with tone: danger=High/Critical, warning=Medium, neutral=Low/None |

- Clicking any row opens the Employee Profile in managerial view.
- Only employees where `unitId` matches the active Unit Manager's unit are shown.

### States

| State   | Trigger                           | Component                                                                            |
| ------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| Loading | People query pending              | Skeleton rows or `LoadingState`                                                      |
| Error   | Query fails                       | `ErrorState`                                                                         |
| Empty   | No employees match current filter | `EmptyState`: "No employees match the current filter." with a "Clear filters" action |

---

## Employee Profile — Managerial View (`/people/:id`)

**Role:** Unit Manager only.

### Profile Header (always visible)

Fields: initials avatar, full name, position, grade, unit name, manager name, `currentProjectStatus` pill, `availabilityPercent` bar or label, `riskLevel` badge.

### Tabs

Render as a `Tabs` primitive from `src/shared/ui/tabs`.

| Tab                    | FR ref        | Content summary                                                                                                                           |
| ---------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Overview               | FR-EP-003     | Basic info, contact info, employment type, English level, current status, risk & action item summary counts, **Scheduled Leaves section** |
| Job and Skills         | FR-EP-004     | Position, grade, hire date, employment status, work location, English level, skills list with level badges                                |
| Risks and Action Items | FR-EP-005     | Current risk level, risk history list, all action items (open + closed)                                                                   |
| **Feedbacks**          | FR-EP-013–014 | Chronological list of feedback entries; "Add Feedback" action button                                                                      |
| Resourcing History     | FR-EP-006     | Assignment history items (read-only, separate from Project History)                                                                       |
| Project History        | FR-EP-007     | Project history items (read-only, separate from Resourcing History)                                                                       |
| Documents and IDP      | FR-EP-009     | Document list with type/visibility/date; IDP status                                                                                       |

### Overview Tab — Scheduled Leaves Section

- Heading: "Scheduled Leaves"
- Columns: leave type, start date, end date, status pill (Confirmed = success tone, Tentative = warning tone)
- Empty state: "No scheduled leaves recorded."
- Read-only. No edit or delete in MVP.

### Feedbacks Tab

- Heading: "Feedbacks"
- List layout: each entry shows type badge, content, author name (small/muted), date (small/muted)
- Sorted: newest first (descending `createdAt`)
- Empty state: "No feedback entries recorded."
- "Add Feedback" button: opens an inline form or sheet with fields: Type (select, required), Content (textarea, required). On save, new entry appears at the top of the list.
- Feedback entries are read-only once saved (no edit/delete in MVP).

### Resourcing History Tab vs Project History Tab

- These two tabs must never be merged or combined.
- Each must have its own heading: "Resourcing History" and "Project History".
- If the tab has no records: display `EmptyState` with a descriptive message per tab.

### Editable Fields (Unit Manager)

English level, IDP reference, skills, management notes, custom field values. All other fields are read-only in this view.

### States per Tab

Each tab handles loading, error, and empty independently. Use the shared primitives; do not show a blank tab.

---

## Employee Profile — Personal View (`/my-profile`)

**Role:** Employee only.

### Required Sections

| Section         | FR ref    | Description                                                        |
| --------------- | --------- | ------------------------------------------------------------------ |
| Profile header  | FR-PV-001 | Name, position, grade (read-only)                                  |
| Contact section | FR-PV-002 | Personal phone, personal email, address — all editable             |
| Action items    | FR-PV-003 | Read-only list of action items assigned to the employee            |
| IDP status      | FR-PV-004 | Editable IDP status dropdown (Not Started, In Progress, Completed) |
| Documents       | FR-PV-005 | List of employee-visible documents; Add Certificate action         |

### What Must NOT Appear

- Manager notes (`FR-EP-011`, `FR-PV-006`)
- Risks records
- Assignment history
- Feedback entries (`BR-016`)
- Scheduled leaves
- Resourcing History tab
- Any "HR-only" data

### Save Confirmation

Every save action (contact update, IDP update, add certificate) must show a visible success message (`toast` or `alert` using `success` tone).

---

## Custom Lists (`/custom-lists`)

**Role:** Unit Manager only.

### Required Sections

| Section     | FR ref        | Description                                                                     |
| ----------- | ------------- | ------------------------------------------------------------------------------- |
| Page header | —             | Title "Custom Lists", "New List" button                                         |
| List tabs   | FR-CL-003     | Each saved list as a tab; seeded: Bench, Booked, Needs Conversation             |
| List table  | FR-CL-004–008 | Table with system + custom field columns                                        |
| Filter bar  | FR-CL-002     | Filters rendered for custom fields designated as `usage = 'filter'` or `'both'` |

### List Builder (New / Edit List)

When creating or editing a list:

1. Name field (required)
2. Employee filter section (system field dropdowns: position, grade, status, risk level)
3. Custom fields section: for each custom field, a row with:
   - Field name
   - Usage radio/checkbox group: `Filter`, `Column`, `Both`
4. Save action

This directly implements G-3 (FR-CL-002 updated).

### Inline Edit

- Clicking a cell in a custom-field column enters edit mode (input, select, checkbox, or date picker per field type).
- System field cells (name, position, grade, status) are read-only — no click-to-edit.
- Saving updates `Person.customFieldValues` in the in-memory store.
- The updated value must be reflected on the Employee Profile if opened.

### States

| State   | Trigger                    | Component                                               |
| ------- | -------------------------- | ------------------------------------------------------- |
| Loading | List data pending          | `LoadingState`                                          |
| Empty   | No employees match filters | `EmptyState`: "No employees match this list's filters." |
| Error   | Query fails                | `ErrorState`                                            |

---

## Resourcing Requests — DM View (`/resourcing/requests`)

**Role:** Sales / Delivery Manager only.

### Required Sections

| Section        | FR ref    | Description                                   |
| -------------- | --------- | --------------------------------------------- |
| Page header    | —         | Title "My Requests", "New Request" button     |
| Requests table | FR-RR-005 | All requests created by the active DM persona |
| Request detail | FR-CD-001 | Opened on row click; shows candidates         |

### Requests Table Columns

| Column       | Notes                          |
| ------------ | ------------------------------ |
| Request code | `REQ-NNN`                      |
| Title        | —                              |
| Project      | `projectName`                  |
| Priority     | `Badge` with tone              |
| Status       | `StatusPill` with tone         |
| Created date | Formatted date                 |
| Actions      | Cancel (if Draft or Submitted) |

### New Request Form

Required fields (block submission if empty): title, project name, required role, required skills (multi-value), grade level, English level, expected compensation level, workload %, start date, duration, assigned Unit Manager, priority.

Optional: client name, business reason.

Inline validation: show error below each empty required field on submit attempt.

### Request Detail / Candidate Review

- Shows request fields (read-only).
- Shows candidate list (each with: type badge, name or external URL, status, shared profile link if internal).
- Approve / Reject actions per candidate.
- Rejection requires written reason (required field, blocks action if empty).

---

## Resourcing — UM View (`/resourcing/incoming`)

**Role:** Unit Manager only.

### Required Sections

| Section              | FR ref        | Description                                        |
| -------------------- | ------------- | -------------------------------------------------- |
| Page header          | —             | Title "Incoming Requests"                          |
| Requests queue table | FR-CP-001     | All requests where `assignedUnitManagerId` matches |
| Candidate proposal   | FR-CP-003–012 | Opened from request row; see below                 |

### Candidate Proposal Panel

1. Request requirements (read-only summary)
2. Employee browser: list of subordinates with availability, skills, grade, English level, risk level, and leave warnings
3. Candidate fit warnings (non-blocking, FR-CP-006–008):
   - `WarningBadge` (warning tone): "Allocation would exceed 100%" if `candidate.availabilityPercent + request.workloadPercent > 100`
   - `WarningBadge` (warning tone): "Scheduled leave overlaps request period" if a `ScheduledLeave` record overlaps `request.startDate`–`request.endDate`
   - `WarningBadge` (danger tone): "High or Critical risk" if `candidate.riskLevel` is `'High'` or `'Critical'`
4. Fit summary textarea (per candidate)
5. External candidate URL input (optional, one per request)
6. Generate Shared Profile action (per internal candidate)
7. Submit button → changes status to Candidates Proposed

All three warnings are visible but non-blocking. Submission is always allowed.

---

## Shared Profile View (`/shared/:token`)

**Role:** No login required (public token link).

### Required Sections

- Display only the sections the Unit Manager selected during generation.
- Default included sections: name, position, grade, skills, English level, availability, project history.
- Default excluded sections: contact info, risks, manager notes, feedbacks, scheduled leaves, documents.
- No navigation shell from the app (no role switcher, no nav bar).
- Show "Profile not found" error state if token is invalid or `isActive = false`.

---

## Consistency Rules

| Rule               | Where it applies          | Detail                                                                                                 |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Status pill tones  | All status fields         | Approved/Active = success, Rejected/Critical = danger, Proposed/Medium = warning, Draft/None = neutral |
| Risk level tones   | Risk badges everywhere    | High/Critical = danger, Medium = warning, Low/None = neutral                                           |
| Dates              | All date displays         | Use a consistent format (e.g. `dd MMM yyyy`). Define once in `src/lib/formatting/`                     |
| Empty states       | Every table and list      | Use `EmptyState` primitive. Include a contextual message. Never show a blank area.                     |
| Loading states     | Every async section       | Use `LoadingState` or skeleton. Never show a blank area.                                               |
| Error states       | Every async section       | Use `ErrorState`. Include a retry suggestion.                                                          |
| Confirm dialogs    | Destructive actions only  | Withdraw, Cancel Request, Reject Candidate. Use `ConfirmDialog`.                                       |
| Save confirmations | All form saves            | Toast or inline alert with success tone.                                                               |
| Section visibility | Manager vs Employee views | Use role-based conditional rendering, not CSS hiding.                                                  |
| Sensitive sections | Shared profile generation | Feedbacks, risks, notes, scheduled leaves, contact info default unchecked.                             |
