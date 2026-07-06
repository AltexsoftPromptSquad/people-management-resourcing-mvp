# Phase 4 — UX Flow Specification

**Purpose:** Minimal, stable E2E resourcing UX. One layout pattern per role. Reuse Phase 3 interaction primitives (Sheet, Toast, ConfirmDialog, StatusPill).

**Sources:** `SRS.md` §8–10, `docs/architecture/ux-behavior.md` §3.5–3.10, `ux-requirements.md` §233–314.

---

## 1. Global UX Rules (Phase 4)

| Rule                | Decision                                                                                     | Why                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Page layout         | Master-detail on both resourcing pages. Table left, panel right. No extra routes for detail. | Fewer navigations; matches Phase 2 subordinates drilldown mental model. |
| Forms               | Always `Sheet` (slide-over). Never full-page wizard.                                         | Same as Phase 3 Add Feedback / Add Certificate.                         |
| Destructive confirm | `ConfirmDialog` only for: Cancel request, Withdraw candidate, Submit candidates.             | ux-requirements consistency rule.                                       |
| Approve / Reject    | `Sheet` only. No ConfirmDialog before Reject (sheet is the confirmation step).               | ux-behavior §3.8                                                        |
| Success feedback    | Toast for every mutation. No inline success banners.                                         | Phase 3 pattern.                                                        |
| Errors              | Inline under field (validation) or `ErrorState` (load failure). Toast for mutation failure.  | Phase 3 pattern.                                                        |
| Warnings            | Inline under candidate name. Never in dialog. Never block submit.                            | FR-CP-009                                                               |
| Selection state     | Row click selects request and opens right panel. Selected row has `bg-slate-50`.             | Same as subordinates table selected state.                              |
| Panel persistence   | Right panel stays open when table refreshes. Resets when user selects another row.           | Stable context during mutations.                                        |
| Role switch         | Demo flows assume role switcher in header (1 click per role change).                         | Phase 1 pattern.                                                        |

---

## 2. Screen Layouts

### 2.1 DM — `/resourcing/requests`

```
┌─────────────────────────────────────────────────────────────────┐
│ h1: My Requests                          [New Request] button   │
├──────────────────────────┬──────────────────────────────────────┤
│ Requests table (55%)     │ Detail panel (45%)                     │
│ REQ | Title | Status ... │                                        │
│ ─────────────────────    │ When no row selected:                 │
│ row (clickable)          │   EmptyState "Select a request"        │
│ row (selected)           │                                        │
│                          │ When row selected:                      │
│                          │   Read-only request fields              │
│                          │   Cancel button (Draft/Submitted only)  │
│                          │   Candidate list (if Candidates Proposed)│
│                          │   [Approve] [Reject] per Proposed row   │
└──────────────────────────┴──────────────────────────────────────┘
```

- **New Request** opens Sheet from the right (not a new page).
- **Submit** in the Sheet creates the request and sets status to Submitted in one user action (internal POST + PATCH). User clicks Submit once.

### 2.2 UM — `/resourcing/incoming`

```
┌─────────────────────────────────────────────────────────────────┐
│ h1: Incoming Requests                                           │
├──────────────────────────┬──────────────────────────────────────┤
│ Queue table (40%)        │ Proposal panel (60%)                 │
│ REQ | Title | Status     │                                      │
│ row (clickable)          │ When no row selected:                 │
│ row (selected)           │   EmptyState "Select a request"      │
│                          │                                      │
│                          │ When Submitted/In Review row selected:│
│                          │   Requirements summary (read-only)    │
│                          │   Employee table (checkbox per row)   │
│                          │   Selected candidates (stacked cards) │
│                          │     name, warnings, fit summary       │
│                          │     [Generate Shared Profile] link btn│
│                          │   External URL field + [Add] (optional)│
│                          │   [Submit Candidates] primary btn     │
│                          │                                      │
│                          │ When Candidates Proposed: read-only    │
│                          │   candidate list + [Withdraw] per row │
└──────────────────────────┴──────────────────────────────────────┘
```

- Employee table shows unit subordinates only. Checkbox adds/removes from selected candidates list.
- Warnings appear on the candidate card immediately when selected (not on submit).

### 2.3 Public — `/shared/:token`

```
┌─────────────────────────────────────────────────────────────────┐
│ (no app nav, no role switcher)                                  │
│ centered max-w-3xl card                                         │
│   name, position, grade (always)                                │
│   selected sections only                                        │
└─────────────────────────────────────────────────────────────────┘
```

- Invalid token: full-page `ErrorState` SRS-COPY4-003.

### 2.4 Profile header add-on (Phase 3 deferred)

- UM on `/people/:id`: one secondary button **Generate Shared Profile** in header action area.
- Same Sheet as proposal panel. No duplicate UX.

---

## 3. Click Budgets (Demo Happy Path)

Counts are intentional clicks only (not typing, not role switch if demo starts in role).

### Scenario 4 — DM creates and submits request

| Step      | Action                                   | Clicks |
| --------- | ---------------------------------------- | ------ |
| 1         | Open `/resourcing/requests` (DM landing) | 0      |
| 2         | New Request                              | 1      |
| 3         | Submit (valid form; one button submits)  | 1      |
| **Total** |                                          | **2**  |

Role switch from UM: +1 if demo starts as UM.

### Scenario 5 — UM proposes one internal + one external

| Step      | Action                                           | Clicks |
| --------- | ------------------------------------------------ | ------ |
| 1         | Open `/resourcing/incoming`                      | 0      |
| 2         | Select `request-001` row                         | 1      |
| 3         | Checkbox internal employee                       | 1      |
| 4         | Generate Shared Profile                          | 1      |
| 5         | Generate Link (defaults OK; no checkbox changes) | 1      |
| 6         | Done (close sheet)                               | 1      |
| 7         | Enter external URL + Add                         | 2      |
| 8         | Submit Candidates                                | 1      |
| 9         | Confirm Submit                                   | 1      |
| **Total** |                                                  | **9**  |

Minimal internal-only (no external): **7 clicks**.

Warnings demo: select a flagged employee instead of step 3. No extra clicks (warnings are automatic).

### Scenario 6 — DM approves one, rejects one, UM checks history

| Step      | Action                                   | Clicks |
| --------- | ---------------------------------------- | ------ |
| 1         | DM: select `request-003` row             | 1      |
| 2         | Open shared profile link (new tab)       | 1      |
| 3         | Approve candidate A                      | 1      |
| 4         | Approve in sheet                         | 1      |
| 5         | Reject candidate B                       | 1      |
| 6         | Reject Candidate in sheet (reason typed) | 1      |
| 7         | Switch to UM role                        | 1      |
| 8         | Subordinates → employee row              | 1      |
| 9         | Resourcing History tab                   | 1      |
| **Total** |                                          | **9**  |

---

## 4. Interaction Sequences (Implementation Contract)

### 4.1 New Request (DM)

1. Click **New Request** → Sheet opens, title "New Request", first field focused.
2. Required fields per FR-RR-002. Assigned UM defaults to `person-um-001` in demo seed dropdown.
3. Click **Submit** → inline loading on button.
4. Internal: `POST` (Draft) then `PATCH` (Submitted) in one mutation.
5. Success: Sheet closes, table refreshes, new row selected in panel, toast none required (row appearance is feedback) OR optional success toast "Request submitted."
6. Validation fail: inline errors under fields, sheet stays open.

**Do not** use a two-step Draft then Submit flow in the UI.

### 4.2 Select Candidate (UM)

1. Checkbox on employee row toggles candidate card in "Selected candidates" section.
2. On add: fetch warnings async (scheduled leaves + risk from existing endpoints; allocation from person field).
3. Show warnings as stacked `WarningBadge` under name.
4. Fit summary textarea appears on card (optional for submit, but demo should fill one line).

### 4.3 Generate Shared Profile

1. Click **Generate Shared Profile** on candidate card (or profile header).
2. Sheet opens. Defaults per ux-behavior §3.5 table (sensitive unchecked).
3. Click **Generate Link** → POST → show URL + Copy Link + Done.
4. Copy Link → info toast SRS-COPY4-011.
5. Store `sharedProfileId` on candidate card for proposal submit payload.

**Happy path:** user does not touch checkboxes.

### 4.4 Submit Candidates (UM)

1. Click **Submit Candidates**.
2. If no candidates: inline error SRS-COPY4-048 (no dialog).
3. ConfirmDialog SRS-COPY4-032 → Confirm.
4. POST batch proposals + PATCH request status.
5. Success: panel switches to read-only Candidates Proposed view, toast SRS-COPY4-013.

### 4.5 Approve Candidate (DM)

1. Click **Approve** on Proposed row → Sheet "Approve [name]?"
2. Optional note textarea.
3. Click **Approve** → PATCH → close sheet, update row status, hide Approve on all remaining Proposed rows, toast SRS-COPY4-015.

### 4.6 Reject Candidate (DM)

1. Click **Reject** → Sheet "Reject [name]" with required reason.
2. Empty reason on submit → inline SRS-COPY4-040.
3. Click **Reject Candidate** (danger) → PATCH → close sheet, toast SRS-COPY4-017.

### 4.7 Cancel Request (DM)

1. Click **Cancel Request** in detail panel → ConfirmDialog SRS-COPY4-030.
2. Confirm → PATCH Cancelled → toast SRS-COPY4-019.

### 4.8 Withdraw Candidate (UM)

1. Visible only when request is Candidates Proposed and candidate is Proposed.
2. Click **Withdraw** → ConfirmDialog SRS-COPY4-031 → toast SRS-COPY4-021.

---

## 5. Async States Per Screen

| Screen         | Page load                          | Panel load                      | Mutation                           |
| -------------- | ---------------------------------- | ------------------------------- | ---------------------------------- |
| DM requests    | `LoadingState` "Loading requests…" | Skeleton in panel on row select | Button `aria-busy` in sheet/dialog |
| UM incoming    | `LoadingState` "Loading queue…"    | Skeleton for employee table     | Same                               |
| Shared profile | `LoadingState` "Loading profile…"  | —                               | —                                  |
| Empty table    | SRS-COPY4-001 or SRS-COPY4-002     | "Select a request" in panel     | —                                  |

---

## 6. What We Do Not Build (Stability)

| Skip                               | Reason                          |
| ---------------------------------- | ------------------------------- |
| Multi-step request wizard          | Sheet + single Submit is enough |
| Separate `/requests/:id` route     | Master-detail keeps one URL     |
| Modal dialogs for forms            | Sheet only (Phase 3 precedent)  |
| Warning modal before submit        | FR-CP-009 non-blocking          |
| Edit request after submit          | Out of BRD scope                |
| Drag-and-drop candidate ordering   | No BRD requirement              |
| Real file upload in shared profile | MVP mock only                   |
| Animations beyond sheet slide      | Keep simple                     |

---

## 7. Phase 3 Pattern Alignment

| Phase 3 pattern                          | Phase 4 reuse                                          |
| ---------------------------------------- | ------------------------------------------------------ |
| Sheet for Add Feedback                   | Sheet for New Request, Approve, Reject, Shared Profile |
| ConfirmDialog absent for feedback cancel | Same: Escape closes sheet, discards draft              |
| Toast on mutation success                | All resourcing mutations                               |
| Thin page + fat feature components       | `features/resourcing/components/*` own panel UI        |
| Tab reset on re-entry                    | N/A; panel resets on new row select                    |
| `status-pill` for domain status          | Request + candidate status                             |

---

## 8. SRS / Test Traceability

| UX-FLOW section     | SRS                             | Test refs                |
| ------------------- | ------------------------------- | ------------------------ |
| §4.1 New Request    | SRS-F4-110–113, SRS-UX4-060–061 | P4-RR01–RR04             |
| §4.2–4.4 Proposal   | SRS-F4-210–218, SRS-UX4-010–012 | P4-CP01–CP07, P4-W01–W04 |
| §4.3 Shared profile | SRS-F4-310–314, SRS-UX4-001–003 | P4-PS01–PS05             |
| §4.5–4.6 Review     | SRS-F4-410–415, SRS-UX4-020–032 | P4-CD01–CD05             |
| §3 click budgets    | BRD §14 Scenarios 4–6           | P4-D04–D06               |

---

## 9. Definition of Done (UX)

Phase 4 UX is done when:

- [ ] Both resourcing pages use master-detail layout per §2.
- [ ] Demo happy paths meet click budgets in §3 (±1 for role switch).
- [ ] All flows follow §4 sequences without extra steps.
- [ ] Copy matches SRS §10 / ux-behavior verbatim.
- [ ] No form uses a pattern not listed in §1 Global UX Rules.
