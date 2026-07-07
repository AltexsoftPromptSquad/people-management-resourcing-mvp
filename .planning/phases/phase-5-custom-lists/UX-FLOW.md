# Phase 5 — UX Flow Specification

**Purpose:** Minimal, stable custom-lists and assignments UX. Reuse Phase 3/4 interaction primitives (Sheet, Toast, ConfirmDialog, StatusPill, Tabs, DataTable). No new interaction paradigms.

**Sources:** `SRS.md` §8–10, `docs/architecture/ux-behavior.md` §3.4, §4.4, §5.1–5.3, `ux-requirements.md` §190–229.

---

## 1. Global UX Rules (Phase 5)

| Rule                | Decision                                                                    | Why                                     |
| ------------------- | --------------------------------------------------------------------------- | --------------------------------------- |
| Forms               | Always `Sheet` (slide-over) for New/Edit List, Share List, New Field.       | Same as Phase 3/4 forms.                |
| Inline edit         | Click custom cell → edit control. Commit on blur/Enter/Tab; Escape cancels. | ux-behavior §3.4.                       |
| Cell save feedback  | No success toast for cell saves. Error toast only on failure.               | ux-behavior §5.3 (too noisy otherwise). |
| One cell at a time  | Opening a new cell commits the currently open one.                          | ux-behavior §3.4.                       |
| System columns      | Read-only (`cursor-default`); no edit affordance.                           | BR-007, FR-CL-006.                      |
| List tabs           | One tab per saved list; active tab persists within a page visit.            | ux-behavior §4.4.                       |
| Filter bar          | Renders only for fields with usage ∈ {filter, both}.                        | FR-CL-002 / AC-CL-006.                  |
| Destructive confirm | `ConfirmDialog` only for delete list / delete field (if provided).          | ux-requirements consistency rule.       |
| Sharing             | Recipients get view-only structure; edit only own direct reports.           | BR-008, BR-009.                         |
| Assignments         | Read-only table; never mixed with project history.                          | FR-AH-004, BR-006.                      |
| Role switch         | Demo flows assume role switcher in header (1 click per role change).        | Phase 1 pattern.                        |

---

## 2. Screen Layouts

### 2.1 UM — `/custom-lists`

```
┌─────────────────────────────────────────────────────────────────┐
│ h1: Custom Lists                                 [New List] btn  │
├─────────────────────────────────────────────────────────────────┤
│ [ Bench ] [ Booked ] [ Needs Conversation ] [ + shared lists ]   │  ← tabs (FR-CL-003)
├─────────────────────────────────────────────────────────────────┤
│ Filter bar: [ Bench Status ▾ ]  (only filter/both fields)        │  ← FR-CL-002
├─────────────────────────────────────────────────────────────────┤
│ Name | Position | Grade | Status | Bench Status* | Readiness*    │  ← system read-only + custom editable*
│ ───────────────────────────────────────────────────────────      │
│ Nazar P. | SWE | M2 | Bench | [Available ▾]   | [x]             │  ← click custom cell → inline edit
└─────────────────────────────────────────────────────────────────┘
```

- **New List** opens the List Builder Sheet.
- `*` custom columns are inline editable; system columns are read-only.
- Empty states: "List not configured" (no fields) / "No employees match" (no rows).

### 2.2 List Builder Sheet (New / Edit List)

```
┌───────────────────────────────────────┐
│ Sheet: New List / Edit List            │
│ Name*        [ e.g. Bench — Q3 2026 ]  │
│ Employee filter                        │
│   Position [▾]  Grade [▾]              │
│   Status [▾]    Risk [▾]              │
│ Custom fields (usage)                  │
│   Bench Status     ( )Filter (•)Both   │  ← G-3: Filter | Column | Both
│   Bench Readiness  (•)Column ( )Both   │
│   Booking Notes    ( )Column ...       │
│ [ Cancel ]                 [ Save ]    │
└───────────────────────────────────────┘
```

### 2.3 Share List Sheet

```
┌───────────────────────────────────────┐
│ Sheet: Share "Bench"                   │
│ Share with managers                    │
│   [x] Olena Kovalenko (person-um-002)  │  ← eligible managers
│ Note: recipients can view the list and │
│ edit values only for their own reports.│  ← BR-008/BR-009 notice
│ [ Cancel ]                 [ Share ]   │
└───────────────────────────────────────┘
```

### 2.4 Custom Field Form Sheet (New Field)

```
┌───────────────────────────────────────┐
│ Sheet: New Custom Field                │
│ Name*   [ ................ ]           │
│ Type*   [ Single Select ▾ ]           │
│ Options [ Available, Interviewing ]    │  ← required for Single Select
│ [ ] Sensitive                          │  ← excluded from shared profiles by default
│ [ Cancel ]                 [ Save ]    │
└───────────────────────────────────────┘
```

### 2.5 UM — `/resourcing/assignments`

```
┌─────────────────────────────────────────────────────────────────┐
│ h1: Assignments                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Employee | Request title | Candidate type | Decision | Date | St │  ← read-only (FR-AH-004)
│ ───────────────────────────────────────────────────────────      │
│ Nazar P. | Payments API  | Internal       | Approved | ... | ✔   │
└─────────────────────────────────────────────────────────────────┘
```

- Read-only; no edit actions. Never mixed with project history (BR-006).
- Empty state: "No assignments" / "Assignment history for your unit will appear here." (SRS-COPY5-007).

### 2.6 Profile Sharing Re-open (polish)

```
┌───────────────────────────────────────┐
│ Sheet: Generate Shared Profile         │
│ (on open, active link exists →)        │
│ Existing shared link                   │
│   https://.../shared/<token>           │
│   [ Copy Link ]              [ Done ]   │  ← no forced regeneration
└───────────────────────────────────────┘
```

---

## 3. Click Budget (Demo Happy Path)

Counts are intentional clicks only (not typing, not role switch if demo starts in role).

### Scenario 3 — UM edits a Bench value and confirms on profile

| Step      | Action                                                | Clicks |
| --------- | ----------------------------------------------------- | ------ |
| 1         | Open `/custom-lists` (UM nav)                         | 0      |
| 2         | Select Bench tab                                      | 1      |
| 3         | Click Bench Status cell for Nazar                     | 1      |
| 4         | Select "Interviewing"                                 | 1      |
| 5         | Commit (blur / Enter)                                 | 0      |
| 6         | Open employee profile (`/people/person-employee-001`) | 1      |
| 7         | Confirm custom field shows "Interviewing"             | 0      |
| **Total** |                                                       | **4**  |

Role switch to UM from another role: +1 if demo starts elsewhere.

---

## 4. Interaction Contracts

| Flow                | Trigger        | API                                | Success                                | Error                             | SRS ref     |
| ------------------- | -------------- | ---------------------------------- | -------------------------------------- | --------------------------------- | ----------- |
| Inline edit         | blur/Enter/Tab | `PATCH .../custom-field-values`    | Optimistic value; no toast             | Revert; error toast SRS-COPY5-005 | SRS-UX5-002 |
| Cancel edit         | Escape         | none                               | Revert to prior value                  | —                                 | SRS-UX5-003 |
| Create/edit list    | Save           | `POST/PATCH /api/custom-lists`     | Tab appears/updates; success toast     | Toast; sheet stays open           | SRS-UX5-010 |
| Share list          | Share          | `POST /api/custom-lists/:id/share` | Recipient tab; success toast           | Toast; sheet stays open           | SRS-UX5-020 |
| Assignments load    | Page open      | `GET /api/resourcing/assignments`  | Read-only table                        | ErrorState                        | SRS-UX5-030 |
| Shared-profile open | Sheet open     | `GET /api/shared-profiles/active`  | Existing link with Copy, else generate | Generate flow                     | SRS-UX5-040 |

---

## 5. Edge Cases

| Scenario                                                  | Behavior                                                        |
| --------------------------------------------------------- | --------------------------------------------------------------- |
| Recipient opens a cell for an employee outside their unit | No edit mode; `cursor-default` (BR-009, row `editable: false`). |
| Number field receives non-numeric input                   | Input prevents non-numeric; invalid value reverts on blur.      |
| List has no configured fields                             | Empty state SRS-COPY5-002.                                      |
| List filter matches no employees                          | Empty state SRS-COPY5-001.                                      |
| User opens a second cell while one is open                | First cell commits (blur), second enters edit mode.             |
| Shared profile link already active                        | Sheet shows existing link; no duplicate generation.             |
