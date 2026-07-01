# UX Behavior

**Behavioral specification for every interaction, state, sequence, and user-facing string in the MVP.**

This document is the implementation contract for how the UI behaves. `ux-requirements.md` defines what screens contain. This document defines how everything works. Read both before building any screen.

---

## 1. Global Interaction System

### 1.1 Loading Taxonomy

Four tiers. Choose the right tier for each context. Never show a blank area — every async region must resolve to one of these.

| Tier             | When to use                                     | Component / Pattern                                                                              |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Page**         | Full screen not yet ready on initial load       | `<LoadingState label="…" className="mx-auto mt-16 max-w-7xl" />` centered in `<main>`            |
| **Section**      | One panel or tab content loading independently  | `<LoadingState label="…" className="mt-6" />` inside the section container                       |
| **Table / List** | Table rows pending; structure already visible   | Skeleton rows: 5 rows of `animate-pulse` `<div className="h-4 rounded bg-slate-200">` per column |
| **Inline**       | Button action in flight (submit, save, approve) | Spinner icon inside button + button `disabled` + `aria-busy="true"`                              |

**Rules:**

- Page-tier and Section-tier loading must use `<LoadingState>` from `src/shared/ui/loading-state`.
- Table skeletons must match the column count of the real table so layout does not shift on data arrival.
- Inline loading disables the button immediately on click. The button text does not change. A spinner appears left of the label.
- Loading state never blocks a header, breadcrumb, or tab strip — those render immediately from synchronous state.

---

### 1.2 Toast Notification System

**Component:** `src/shared/ui/toast` (build using [Sonner](https://sonner.emilkowal.ski/) or a Radix Toast wrapper, themed per `visual-theme.md`).

| Property              | Value                     |
| --------------------- | ------------------------- |
| Position              | Top-right                 |
| Auto-dismiss duration | 4 000 ms                  |
| Manual dismiss        | `×` button on every toast |
| Max visible at once   | 3 (queue oldest out)      |
| Stacking              | Newest on top             |
| Minimum width         | 280 px                    |

**Four types:**

| Type      | Tailwind surface                   | Tailwind text      | When to fire                                                |
| --------- | ---------------------------------- | ------------------ | ----------------------------------------------------------- |
| `success` | `bg-emerald-50 border-emerald-200` | `text-emerald-700` | Any mutation that persists user intent                      |
| `error`   | `bg-red-50 border-red-200`         | `text-red-700`     | Any mutation or critical query failure                      |
| `warning` | `bg-amber-50 border-amber-200`     | `text-amber-800`   | Non-blocking business rule violation (rare at global level) |
| `info`    | `bg-sky-50 border-sky-200`         | `text-sky-700`     | Neutral informational events (e.g. link copied)             |

**Rule:** Toasts fire for mutations only. Query (GET) failures render `<ErrorState>` inline — they do not use toasts. The user needs to see the error in context, not in the corner of the screen.

---

### 1.3 Confirm Dialog System

**Component:** `src/shared/ui/confirm-dialog` (wraps Radix Dialog).

Use for every destructive or hard-to-reverse action. Never allow a destructive action to execute immediately on single click.

**Structure template:**

```
[Title]         — present tense verb + object. "Cancel request?" / "Reject candidate?" / "Withdraw candidate?"
[Description]   — one sentence stating the consequence. No jargon.
[Cancel button] — secondary, left-aligned: "Keep [object]"
[Confirm button]— primary danger variant, right-aligned: verb from title
```

**Keyboard behavior:**

- `Escape` → closes dialog (same as Cancel)
- `Enter` on focused Confirm button → executes action
- Focus is trapped inside dialog while open
- On close, focus returns to the trigger element

**Rule:** Confirm dialogs do not have checkboxes, second confirmation fields, or countdown timers. One sentence, two buttons.

---

### 1.4 Form Validation System

**Library:** React Hook Form + Zod (both already in `package.json`).

| Rule                                     | Behavior                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Trigger — required fields**            | On form submit attempt. Not on mount, not on blur.                                                                                               |
| **Trigger — format fields** (URL, email) | On field blur.                                                                                                                                   |
| **Display**                              | Inline below the field. `text-sm text-red-700`. Field border changes to `border-red-500 ring-1 ring-red-500`.                                    |
| **Required asterisk**                    | `<label>` text ends with ` *` (space asterisk) for required fields. Color: `text-red-500`.                                                       |
| **Submit guard**                         | While any field has a validation error, the submit button remains enabled but clicking re-triggers validation and focuses the first error field. |
| **Focus management on submit**           | After submit with errors: `focus()` the first field with an error.                                                                               |
| **Focus management on success**          | After a successful form save in a sheet/dialog: close the sheet/dialog, return focus to the trigger element.                                     |
| **Clearing errors**                      | An error clears as soon as the user modifies the field value (on `onChange`).                                                                    |
| **Disabled fields**                      | Use `disabled` attribute + `text-slate-400 cursor-not-allowed` Tailwind classes. Never fake-disable with `pointer-events-none`.                  |

---

### 1.5 Role Gate System

Two levels of enforcement:

| Level           | Rule                                                                                                                             | Implementation                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Route gate**  | A URL belonging to a different role redirects immediately to the active role's landing page (no flash of the wrong page).        | `<RoleRoute>` guard — already implemented in Phase 1. |
| **Action gate** | A button, link, or section that a role cannot access is **not rendered at all**. It does not appear disabled or hidden with CSS. | Conditional rendering based on `useRoleStore`.        |

**Rule:** Never render a disabled button to tell a user they cannot do something. Either the action is available for their role (render it) or it is not (do not render it). The exception is a temporarily-disabled state (e.g. submit during loading — that uses inline loading pattern above).

---

## 2. Navigation and Routing Behavior

### 2.1 Role Switching

**Trigger:** User clicks a role button in the `RoleSwitcher` component.

**Sequence:**

1. `setActiveRole(newRole)` fires synchronously in Zustand store.
2. `RoleRoute` re-evaluates the current path for the new role.
3. If the current path is accessible to the new role → stay on the current path.
4. If the current path is NOT accessible to the new role → `<Navigate replace to={getRoleLandingPagePath(newRole)} />` fires.
5. Navigation bar updates immediately (synchronous, from store).
6. Role button pressed state updates immediately (`aria-pressed`).
7. Any in-progress form state on the current page is **silently discarded** (no guard dialog in MVP).
8. TanStack Query cache is NOT cleared on role switch. Cached data remains valid.

**Edge cases:**

| Scenario                                                            | Behavior                                                              |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| User is on `/people/person-001` (UM route) and switches to Employee | Redirect to `/my-profile`                                             |
| User is on `/resourcing/requests` (DM route) and switches to UM     | Redirect to `/dashboard`                                              |
| User switches role while a confirm dialog is open                   | Dialog closes (role switch renders new page tree), no action executes |
| User switches to the same role they are already on                  | No-op. Button remains pressed. No navigation.                         |

---

### 2.2 Route Transitions

- React Router client-side navigation. No full page reload.
- No route transition animations (MVP is an operational tool — instant transitions are correct).
- Page `<h1>` focus management: on route change, focus the `<h1>` of the new page (`tabIndex={-1}`, `focus()` after mount) for screen reader announcement.
- The active nav link (`aria-current="page"`) updates synchronously with route change.

---

### 2.3 Browser History

| Scenario                                                  | Behavior                                                                                                                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser back from `/people/person-001` to `/subordinates` | Returns to subordinates list. Table scroll position is not restored (MVP).                                                                                |
| Browser back from `/subordinates` to `/dashboard`         | Returns to dashboard.                                                                                                                                     |
| Browser forward                                           | Navigates forward through history normally.                                                                                                               |
| User reloads any page                                     | Role resets to Unit Manager (Zustand is session-only, no persistence). Page at the reloaded URL renders if accessible; otherwise redirects to UM landing. |
| User pastes a URL for a wrong-role route                  | `RoleRoute` redirects to active role landing (UM by default on fresh load).                                                                               |

---

### 2.4 Unsaved Data on Navigation

| Context                                                   | Behavior                                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------------------- |
| Contact edit form (personal profile) with unsaved changes | Navigating away **silently discards** the changes. No guard dialog in MVP. |
| Add Feedback sheet open                                   | Navigating away **closes the sheet**, discards the draft. No guard dialog. |
| New Request form with unsaved changes                     | Navigating away **silently discards**. No guard dialog.                    |

**Rationale:** Guard dialogs add complexity and are disproportionate for an MVP where all data is seeded. Implementing one would require implementing all. Deferred to a future iteration.

---

## 3. Interaction Sequences

Sequences use this format:

> **Precondition** → **Trigger** → **Numbered steps** → **Success / Error / Edge cases** → **BRD trace**

---

### 3.1 Role Switching

Already covered in §2.1.

---

### 3.2 Navigate to Employee Profile (from Subordinates List)

**Precondition:** User is on `/subordinates` as Unit Manager. Table has loaded rows.

**Trigger:** User clicks any table row (or the linked name cell).

**Sequence:**

1. Pointer cursor on hover (`cursor-pointer` on `<tr>`).
2. Row hover state: `bg-slate-50` background.
3. On click: React Router navigates to `/people/:personId`.
4. Profile page mounts with `<LoadingState label="Loading profile…">` (Page tier).
5. Parallel queries fire: person detail, feedbacks, scheduled leaves, risks, action items, skills, project history, assignment history, documents.
6. Once all critical queries resolve: Profile header renders with name, position, grade, unit, availability, risk badge.
7. Tab strip renders. First tab (Overview) is active by default.
8. Overview tab content renders with all section data.

**Error path:** If person query fails → `<ErrorState title="Could not load profile" description="Refresh the page or return to the list." />` replaces the page content. A "Back to Subordinates" link renders below.

**Edge cases:**

| Scenario                                                              | Behavior                                                                                                                          |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Person ID in URL does not exist in seed data                          | `<ErrorState>` with "Profile not found."                                                                                          |
| User navigates to profile of a person outside their unit (direct URL) | Profile loads — `RoleRoute` only checks role, not unit. Unit scoping is a data concern, not a route concern. The profile renders. |

**BRD trace:** FR-SL-005, AC-SL-005

---

### 3.3 Add Feedback Entry (Managerial Profile)

**Precondition:** User is Unit Manager on `/people/:id`, Feedbacks tab is active. Tab has loaded (empty or populated).

**Trigger:** User clicks "Add Feedback" button (renders above the feedback list).

**Sequence:**

1. A `<Sheet>` (slide-in panel from the right) opens. Focuses the first form field automatically.
2. Sheet title: "Add Feedback"
3. Sheet contains:
   - **Type** field: `<Select>` with options "HR Note", "Performance", "General". Required.
   - **Content** field: `<Textarea>` with placeholder "Write your feedback…". Required. Min 10 characters.
   - **Save** button (primary): "Save Feedback"
   - **Cancel** button (secondary): "Cancel"
4. User completes fields.
5. User clicks "Save Feedback".
6. Save button enters inline loading state (spinner, `disabled`).
7. `POST /api/people/:id/feedbacks` fires.
8. On success:
   - Sheet closes.
   - New feedback entry appears **at the top** of the list (prepended, not at bottom).
   - Toast fires: `success` — "Feedback saved."
   - Focus returns to "Add Feedback" button.
9. On API error:
   - Sheet stays open.
   - Save button returns to enabled state.
   - Toast fires: `error` — "Failed to save feedback. Try again."

**Edge cases:**

| Scenario                                | Behavior                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------- |
| User clicks Cancel with typed content   | Sheet closes. Content is discarded silently. No confirm dialog.            |
| User presses Escape with the sheet open | Sheet closes. Content discarded.                                           |
| User submits with Type not selected     | Validation error below Type field: "Type is required."                     |
| User submits with Content < 10 chars    | Validation error below Content: "Feedback must be at least 10 characters." |

**BRD trace:** FR-EP-013, FR-EP-014, AC-EP-006, AC-EP-007, BR-016

---

### 3.4 Custom List Inline Edit

**Precondition:** User is Unit Manager on `/custom-lists`, a list tab is active, the table has loaded rows. A custom field column is visible.

**Trigger:** User clicks a cell in a custom-field column.

**Sequence:**

1. The clicked cell transitions from display mode to edit mode.
2. Edit mode renders the field type's input control:
   - **Text**: `<Input>` pre-filled with current value, auto-focused, full-cell width.
   - **Number**: `<Input type="number">` pre-filled.
   - **Date**: `<Input type="date">` pre-filled.
   - **Boolean**: `<Checkbox>` toggled to current value, auto-focused.
   - **Single Select**: `<Select>` open to current value, auto-focused.
3. Other cells in the same row remain in display mode.
4. Only one cell may be in edit mode at any time.

**Saving (keyboard):**

- `Enter` (or `Tab` to next cell) → commits the value.

**Saving (mouse):**

- Clicking outside the cell → commits the value.

**Cancelling:**

- `Escape` → discards the change. Cell returns to its previous display value.

**Commit sequence:**

1. Control loses focus (blur) or Enter/Tab is pressed.
2. `PATCH /api/people/:personId/custom-field-values` fires with `{ fieldId, value }`.
3. On success:
   - Cell immediately shows new value in display mode (optimistic update — update local state before API returns, rollback on error).
   - No toast for individual cell saves (too noisy in a list of edits).
4. On API error:
   - Cell reverts to the previous value.
   - Toast fires: `error` — "Could not save "[field name]". Change was not applied."

**System field cells (name, position, grade, status, risk):**

- `cursor-default` on hover.
- No edit mode. Clicking does nothing.
- No visual affordance for editing.

**Edge cases:**

| Scenario                                                           | Behavior                                                                                                                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User opens a cell, types a value, then clicks a **different** cell | First cell commits (blur triggers), second cell enters edit mode.                                                                                                 |
| User opens a cell in a **shared** list (not the owner)             | The cell does not enter edit mode for employees outside the viewer's unit. For viewer's own reports: edit mode opens. For others: `cursor-default`, no edit mode. |
| Number field receives non-numeric input                            | Client-side: HTML input type=number prevents non-numeric. On blur with invalid value: revert to previous.                                                         |

**BRD trace:** FR-CL-004, FR-CL-005, FR-CL-006, FR-CL-007, FR-CL-008, AC-CL-002, AC-CL-003, AC-CL-004, BR-007, BR-009

---

### 3.5 Generate Shared Profile

**Precondition:** User is Unit Manager on `/people/:id` (managerial view). Profile has loaded.

**Trigger:** User clicks "Generate Shared Profile" button (visible in profile header action area or from the Candidate Proposal panel).

**Sequence:**

1. A `<Sheet>` opens titled "Generate Shared Profile".
2. Sheet shows the employee's name and a section checklist.
3. Checklist sections (per FR-PS-002, FR-PS-006):

| Section               | Default state                                            |
| --------------------- | -------------------------------------------------------- |
| Name, position, grade | Checked, **disabled** (always included — cannot exclude) |
| Skills                | Checked                                                  |
| English level         | Checked                                                  |
| Availability          | Checked                                                  |
| Project history       | Checked                                                  |
| Overview / Basic info | Unchecked                                                |
| Contact info          | Unchecked (sensitive — FR-PS-003)                        |
| Risks                 | Unchecked (sensitive)                                    |
| Manager notes         | Unchecked (sensitive)                                    |
| Feedbacks             | Unchecked (sensitive — BR-016)                           |
| Scheduled leaves      | Unchecked (sensitive)                                    |
| Documents             | Unchecked (sensitive)                                    |

4. User adjusts section selection.
5. User clicks "Generate Link".
6. Button enters inline loading state.
7. `POST /api/shared-profiles` fires with `{ personId, allowedSections }`.
8. On success:
   - Sheet transitions to a "Link Generated" state.
   - A read-only input shows the generated URL.
   - A "Copy Link" button appears. Clicking it: copies URL to clipboard, shows `info` toast "Link copied to clipboard."
   - A "Done" button closes the sheet.
9. On error:
   - Toast fires: `error` — "Could not generate link. Try again."
   - Sheet stays open. Button returns to enabled state.

**Edge cases:**

| Scenario                                            | Behavior                                                                                                                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User unchecks "Name, position, grade"               | Checkbox is `disabled` — cannot uncheck. Disabled state is visually clear.                                                                                 |
| User generates a second profile for the same person | A new token is created. Previous links remain valid (AS-006: no expiry).                                                                                   |
| User closes the sheet before copying the link       | Link is generated and stored. User can re-open Generate Shared Profile to access it. The sheet should show the existing active link if one already exists. |

**BRD trace:** FR-PS-001–007, AC-PS-001–004, AS-006

---

### 3.6 Submit Candidate Proposal

**Precondition:** User is Unit Manager on `/resourcing/incoming`, has opened a request in Submitted or In Review status, and has selected at least one internal candidate.

**Trigger:** User clicks "Submit Candidates".

**Sequence:**

1. System validates: at least one internal candidate OR one external URL is present.
2. If validation fails: inline error below the candidates section: "Add at least one candidate before submitting."
3. If validation passes: ConfirmDialog opens.
   - Title: "Submit candidates?"
   - Description: "The Sales / Delivery Manager will be notified that candidates have been proposed for this request."
   - Cancel: "Keep editing"
   - Confirm: "Submit"
4. User confirms.
5. Confirm button enters inline loading state.
6. `PATCH /api/resourcing/requests/:id/status` + `POST /api/candidate-proposals` (batch) fire.
7. On success:
   - Panel/page refreshes to show updated request status: "Candidates Proposed".
   - Toast fires: `success` — "Candidates submitted. Request status updated to Candidates Proposed."
8. On error:
   - Toast fires: `error` — "Submission failed. Your candidates were not saved. Try again."
   - Confirm dialog closes. Panel stays open and editable.

**Warning display (FR-CP-006–008, non-blocking):**

Warnings appear **inline** in each candidate row, below the candidate's name, before submission. They do not block the submit button and do not appear in the ConfirmDialog.

| Warning            | Tone              | Icon | Copy                                                  |
| ------------------ | ----------------- | ---- | ----------------------------------------------------- |
| Allocation >100%   | `warning` (amber) | ⚠    | "Allocation would reach [N]% — above 100%."           |
| Leave overlap      | `warning` (amber) | ⚠    | "Has scheduled leave overlapping the request period." |
| High/Critical risk | `danger` (red)    | ⚠    | "Risk level is [High / Critical]."                    |

All three can appear simultaneously for one candidate. Render as a stacked list of warning badges below the candidate name.

**BRD trace:** FR-CP-001–012, FR-CP-006–009, AC-CP-001–004, BR-012–014

---

### 3.7 Approve Candidate

**Precondition:** User is Sales/Delivery Manager. Request is in Candidates Proposed status. A candidate in Proposed status is visible.

**Trigger:** User clicks "Approve" on a candidate row.

**Sequence:**

1. A `<Sheet>` or inline panel opens: "Approve [candidate name]?"
2. Optional note field: `<Textarea>` with placeholder "Add an optional note (visible to Unit Manager)…". Not required.
3. User clicks "Approve".
4. Button enters inline loading state.
5. `PATCH /api/candidate-proposals/:id` fires with `{ status: 'Approved', feedback: note }`.
6. On success:
   - Sheet/panel closes.
   - Candidate row updates: status pill shows "Approved" (success tone).
   - Request status updates: "Approved".
   - Other candidates in Proposed status remain visible but Approve button disappears (one approval per request — AS-009).
   - Toast fires: `success` — "[Candidate name] approved. Assignment history updated."
7. On error:
   - Toast fires: `error` — "Could not record approval. Try again."
   - Sheet stays open.

**BRD trace:** FR-CD-004, FR-CD-005, FR-CD-009, AC-CD-002, AS-009

---

### 3.8 Reject Candidate

**Precondition:** User is Sales/Delivery Manager. Request has at least one Proposed candidate. This candidate has not been approved.

**Trigger:** User clicks "Reject" on a candidate row.

**Sequence:**

1. A `<Sheet>` or inline panel opens: "Reject [candidate name]"
2. **Rejection reason** field: `<Textarea>` labeled "Rejection reason \*". Required. Placeholder: "Explain why this candidate is not suitable…".
3. User fills the reason.
4. User clicks "Reject Candidate" button (danger variant).
5. If reason is empty: inline validation error below field: "A rejection reason is required." Submit blocked.
6. If reason is present: button enters inline loading state.
7. `PATCH /api/candidate-proposals/:id` fires with `{ status: 'Rejected', rejectionReason: reason }`.
8. On success:
   - Sheet closes.
   - Candidate row updates: status pill shows "Rejected" (danger tone).
   - If all candidates are now Rejected (none Approved): request status updates to "Rejected".
   - Toast fires: `success` — "[Candidate name] rejected."
9. On error:
   - Toast fires: `error` — "Could not record rejection. Try again."
   - Sheet stays open.

**Edge cases:**

| Scenario                                                           | Behavior                                                                                                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| User opens the sheet, types a reason, then presses Escape          | Sheet closes. Reason is discarded. No action taken. Candidate status unchanged.                                 |
| This is the last Proposed candidate and an approval already exists | Reject still works. The request remains Approved. The rejected candidate's assignment history records Rejected. |

**BRD trace:** FR-CD-006, FR-CD-007, FR-CD-008, AC-CD-003, AC-CD-004, BR-004

---

### 3.9 Cancel Resourcing Request

**Precondition:** User is Sales/Delivery Manager. Request is in Draft or Submitted status (BR-010).

**Trigger:** User clicks "Cancel Request" in the request detail view or the action column of the requests table.

**Sequence:**

1. ConfirmDialog opens:
   - Title: "Cancel request?"
   - Description: "This request will be cancelled and removed from the Unit Manager's queue. This cannot be undone."
   - Cancel: "Keep request"
   - Confirm: "Cancel request" (danger)
2. User confirms.
3. Confirm button enters inline loading state.
4. `PATCH /api/resourcing/requests/:id/status` fires with `{ status: 'Cancelled' }`.
5. On success:
   - Request status updates to "Cancelled" (neutral tone).
   - Cancel Request action no longer renders (BR-010: only Draft/Submitted can be cancelled).
   - Toast fires: `success` — "Request cancelled."
6. On error:
   - ConfirmDialog closes.
   - Toast fires: `error` — "Could not cancel the request. Try again."

**BRD trace:** FR-RR-006, BR-010, AC-RR-004

---

### 3.10 Withdraw Candidate

**Precondition:** User is Unit Manager. A candidate is in Proposed status. The DM has not yet made a decision (BR-011).

**Trigger:** User clicks "Withdraw" on the candidate in the request detail panel.

**Sequence:**

1. ConfirmDialog opens:
   - Title: "Withdraw candidate?"
   - Description: "The proposed candidate will be removed from this request. The Sales / Delivery Manager will no longer see them."
   - Cancel: "Keep candidate"
   - Confirm: "Withdraw" (danger)
2. User confirms.
3. `PATCH /api/candidate-proposals/:id` fires with `{ status: 'Withdrawn' }`.
4. On success:
   - Candidate row status updates to "Withdrawn" (neutral tone).
   - Withdraw button no longer renders for this candidate.
   - Toast fires: `success` — "Candidate withdrawn."
5. On error:
   - Toast fires: `error` — "Could not withdraw candidate. Try again."

**BRD trace:** FR-CP-012, BR-011

---

### 3.11 Edit Personal Contact Info

**Precondition:** User is Employee on `/my-profile`. Contact section is in view mode.

**Trigger:** User clicks the "Edit" button in the Contact section.

**Sequence:**

1. Contact section transitions from view mode to edit mode in place (no navigation, no sheet).
2. Fields become editable `<Input>` controls:
   - Personal phone (optional)
   - Personal email (optional; format validation on blur: valid email or empty)
   - Address line, city, country (optional)
3. "Save" (primary) and "Cancel" (secondary) buttons appear below the fields.
4. User edits and clicks "Save".
5. Save button enters inline loading state.
6. `PATCH /api/people/:id/contact` fires.
7. On success:
   - Section returns to view mode with updated values.
   - Toast fires: `success` — "Contact information saved."
8. On error:
   - Section stays in edit mode.
   - Toast fires: `error` — "Could not save changes. Try again."

**Cancel path:**

- User clicks "Cancel": section returns to view mode with original values. No confirm dialog (MVP).

**BRD trace:** FR-PV-002, FR-PV-007, AC-EP-004

---

### 3.12 Add Certificate Document

**Precondition:** User is Employee on `/my-profile`, Documents section is visible.

**Trigger:** User clicks "Add Certificate".

**Sequence:**

1. An inline form expands below the existing document list (or a small `<Sheet>` — consistent with platform choice, use same pattern as Add Feedback).
2. Fields:
   - **Certificate name** `<Input>` — required. Placeholder: "e.g. AWS Solutions Architect"
   - **File name** `<Input>` — required. Placeholder: "e.g. certificate.pdf (mock — no upload)"
3. User fills fields and clicks "Save Certificate".
4. `POST /api/people/:id/documents` fires with `{ name, type: 'Certificate', mockFileName, uploadedById, visibility: 'Employee Visible' }`.
5. On success:
   - New document row appears at the top of the list.
   - Toast fires: `success` — "Certificate added."
   - Form clears / sheet closes.
6. On error:
   - Toast fires: `error` — "Could not add certificate. Try again."
   - Form stays open.

**BRD trace:** FR-PV-005, AS-008

---

## 4. Component State Reference

### 4.1 Buttons

Every button must render all of these states. Use `src/shared/ui/button` for all.

| State                | Visual                             | Tailwind approach                                                               |
| -------------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| Default (primary)    | `slate-800` background, white text | Already in `Button.constants.ts`                                                |
| Hover                | `slate-900` background             | `hover:bg-slate-900`                                                            |
| Focus                | Visible ring                       | `focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2` |
| Active/pressed       | `slate-950` background             | `active:bg-slate-950`                                                           |
| **Loading**          | Spinner + `disabled`               | Spinner icon left of label, `opacity-75 cursor-not-allowed`, `aria-busy="true"` |
| **Disabled**         | Muted background                   | `disabled:opacity-50 disabled:cursor-not-allowed`                               |
| Danger (destructive) | `red-600` background               | `bg-red-600 hover:bg-red-700 text-white`                                        |
| Secondary            | `white` background, border         | `bg-white border border-slate-300 text-slate-700 hover:bg-slate-50`             |

**Rule:** The loading state always disables the button. There must never be a clickable button with a spinner — it must become `disabled` immediately.

---

### 4.2 Form Fields

All form controls use `src/shared/ui/input`, `src/shared/ui/select`, `src/shared/ui/textarea`.

| State          | Border                                   | Background | Text        |
| -------------- | ---------------------------------------- | ---------- | ----------- |
| Default        | `border-slate-300`                       | `white`    | `slate-950` |
| Focus          | `border-slate-500 ring-1 ring-slate-500` | `white`    | `slate-950` |
| Filled / valid | `border-slate-300`                       | `white`    | `slate-950` |
| **Error**      | `border-red-500 ring-1 ring-red-500`     | `white`    | `slate-950` |
| Disabled       | `border-slate-200`                       | `slate-50` | `slate-400` |

Validation error text: `text-sm text-red-700 mt-1` — renders immediately below the field.

---

### 4.3 Table Rows

| State                 | Background                                                       |
| --------------------- | ---------------------------------------------------------------- |
| Default               | `white`                                                          |
| Hover (clickable row) | `bg-slate-50` + `cursor-pointer`                                 |
| Selected (future use) | `bg-slate-100`                                                   |
| Overdue (action item) | `bg-amber-50` — left border accent `border-l-2 border-amber-400` |
| Loading (skeleton)    | `animate-pulse bg-slate-200` cells                               |

**Clickable rows** (`<tr>`) must have `role="row"` and be navigable via keyboard (Tab to row, Enter activates, per accessibility rules).

---

### 4.4 Tabs (Profile and Custom Lists)

| State              | Visual                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Default (inactive) | `text-slate-600`, no underline, `bg-transparent`                                                   |
| Hover              | `text-slate-950`                                                                                   |
| Active             | `text-slate-950 font-medium`, bottom border `border-b-2 border-slate-800` or `bg-white` per design |
| Disabled           | `text-slate-400 cursor-not-allowed`                                                                |
| Focus              | Visible focus ring                                                                                 |

**Behavior:**

- Active tab persists within a single profile page visit. Navigating away and back resets to the first tab.
- Switching tabs does not cause a page reload. Tab content renders from already-fetched query data where possible.
- If a tab's query has not yet fired (lazy loading), it fires on tab activation, showing Section-tier loading.

---

### 4.5 Domain Value → Status Tone Reference

Use this table in every component that renders domain status. Never invent new tones ad hoc.

| Domain            | Value                                     | Tone           | Badge/Pill |
| ----------------- | ----------------------------------------- | -------------- | ---------- |
| Request           | Draft                                     | neutral        | `slate`    |
| Request           | Submitted, In Review, Candidates Proposed | info           | `sky`      |
| Request           | Approved                                  | success        | `emerald`  |
| Request           | Rejected                                  | danger         | `red`      |
| Request           | Closed, Cancelled                         | neutral        | `slate`    |
| Candidate         | Proposed                                  | info           | `sky`      |
| Candidate         | Approved                                  | success        | `emerald`  |
| Candidate         | Rejected                                  | danger         | `red`      |
| Candidate         | Withdrawn                                 | neutral        | `slate`    |
| Risk              | None, Low                                 | neutral        | `slate`    |
| Risk              | Medium                                    | warning        | `amber`    |
| Risk              | High, Critical                            | danger         | `red`      |
| Project status    | Active, Allocated                         | success        | `emerald`  |
| Project status    | Partially Allocated, Booked               | warning        | `amber`    |
| Project status    | Bench                                     | info           | `sky`      |
| Project status    | Unavailable, Inactive                     | neutral        | `slate`    |
| Employment status | Active                                    | success        | `emerald`  |
| Employment status | On Leave                                  | warning        | `amber`    |
| Employment status | Notice Period                             | danger         | `red`      |
| Employment status | Inactive                                  | neutral        | `slate`    |
| Action item       | Open                                      | info           | `sky`      |
| Action item       | Due soon (≤ 3 days)                       | warning        | `amber`    |
| Action item       | Overdue                                   | danger         | `red`      |
| Action item       | Completed                                 | neutral        | `slate`    |
| Leave status      | Confirmed                                 | success        | `emerald`  |
| Leave status      | Tentative                                 | warning        | `amber`    |
| IDP status        | Completed                                 | success        | `emerald`  |
| IDP status        | In Progress                               | info           | `sky`      |
| IDP status        | Not Started                               | neutral        | `slate`    |
| Feedback type     | HR Note                                   | neutral violet | `violet`   |
| Feedback type     | Performance                               | info           | `sky`      |
| Feedback type     | General                                   | neutral        | `slate`    |

---

## 5. Copy Library

All user-facing strings. Copy these verbatim. Do not paraphrase.

---

### 5.1 Empty States

Use `<EmptyState title="…" description="…" />` from `src/shared/ui/empty-state`.

| Context                                            | Title                   | Description                                                                |
| -------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| Dashboard — action items                           | "All caught up"         | "No open action items."                                                    |
| Subordinates list — no employees                   | "No subordinates found" | "No employees are assigned to your unit."                                  |
| Subordinates list — filtered, no results           | "No results"            | "No employees match the current filters. Clear the filters to see all."    |
| Employee Profile — Feedbacks tab, empty            | "No feedback recorded"  | "Feedback entries for this employee will appear here."                     |
| Employee Profile — Resourcing History tab, empty   | "No resourcing history" | "Assignment history records will appear here after a resourcing decision." |
| Employee Profile — Project History tab, empty      | "No project history"    | "Project history records will appear here."                                |
| Employee Profile — Risks tab, empty                | "No risks recorded"     | "Risk entries for this employee will appear here."                         |
| Employee Profile — Action Items tab, empty         | "No action items"       | "Action items assigned to this employee will appear here."                 |
| Employee Profile — Documents tab, empty            | "No documents"          | "Document records for this employee will appear here."                     |
| Employee Profile — Scheduled Leaves section, empty | "No scheduled leaves"   | "Scheduled leave records will appear here."                                |
| Personal Profile — Action Items, empty             | "No action items"       | "Action items assigned to you by your manager will appear here."           |
| Personal Profile — Documents, empty                | "No documents"          | "Documents shared with you will appear here."                              |
| Custom List — no employees match                   | "No employees match"    | "No employees in this unit match the list's filters."                      |
| Custom List — list has no fields configured        | "List not configured"   | "Add columns to this list to start tracking employees."                    |
| Resourcing Requests (DM) — no requests             | "No requests yet"       | "Create your first resourcing request to get started."                     |
| Resourcing Incoming (UM) — no requests             | "No incoming requests"  | "Resourcing requests assigned to you will appear here."                    |
| Shared Profile — token invalid                     | "Profile not available" | "This shared profile link is no longer active or does not exist."          |

---

### 5.2 Error States

Use `<ErrorState title="…" description="…" />` from `src/shared/ui/error-state`.

| Context                          | Title                         | Description                                                             |
| -------------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| Dashboard load failure           | "Dashboard unavailable"       | "We could not load your dashboard data. Refresh the page to try again." |
| Subordinates list load failure   | "Could not load subordinates" | "Refresh the page or contact support if this continues."                |
| Employee profile load failure    | "Could not load profile"      | "Refresh the page or return to the list."                               |
| Any tab content failure          | "Could not load [tab name]"   | "Refresh the page to try again."                                        |
| Custom list load failure         | "Could not load list"         | "Refresh the page to try again."                                        |
| Resourcing requests load failure | "Could not load requests"     | "Refresh the page to try again."                                        |

---

### 5.3 Toast Messages

| Action                        | Type    | Message                                                                |
| ----------------------------- | ------- | ---------------------------------------------------------------------- |
| Feedback saved                | success | "Feedback saved."                                                      |
| Feedback save failed          | error   | "Failed to save feedback. Try again."                                  |
| Contact info saved            | success | "Contact information saved."                                           |
| Contact info save failed      | error   | "Could not save changes. Try again."                                   |
| IDP status updated            | success | "IDP status updated."                                                  |
| Certificate added             | success | "Certificate added."                                                   |
| Certificate add failed        | error   | "Could not add certificate. Try again."                                |
| Custom field cell saved       | —       | _(no toast — see §3.4)_                                                |
| Custom field cell save failed | error   | "Could not save "[field name]". Change was not applied."               |
| Shared profile link generated | —       | _(shown in sheet, not toast)_                                          |
| Shared profile link copied    | info    | "Link copied to clipboard."                                            |
| Candidates submitted          | success | "Candidates submitted. Request status updated to Candidates Proposed." |
| Submission failed             | error   | "Submission failed. Your candidates were not saved. Try again."        |
| Candidate approved            | success | "[Name] approved. Assignment history updated."                         |
| Approval failed               | error   | "Could not record approval. Try again."                                |
| Candidate rejected            | success | "[Name] rejected."                                                     |
| Rejection failed              | error   | "Could not record rejection. Try again."                               |
| Request cancelled             | success | "Request cancelled."                                                   |
| Request cancel failed         | error   | "Could not cancel the request. Try again."                             |
| Candidate withdrawn           | success | "Candidate withdrawn."                                                 |
| Withdraw failed               | error   | "Could not withdraw candidate. Try again."                             |

---

### 5.4 Confirm Dialog Copy

| Action                                          | Title                                                                                      | Description                                                                                                       | Cancel label     | Confirm label    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------- |
| Cancel request                                  | "Cancel request?"                                                                          | "This request will be cancelled and removed from the Unit Manager's queue. This cannot be undone."                | "Keep request"   | "Cancel request" |
| Withdraw candidate                              | "Withdraw candidate?"                                                                      | "The proposed candidate will be removed from this request. The Sales / Delivery Manager will no longer see them." | "Keep candidate" | "Withdraw"       |
| Reject candidate _(confirm before sheet opens)_ | _(no dialog — rejection requires reason field; the sheet itself is the confirmation step)_ | —                                                                                                                 | —                | —                |

---

### 5.5 Validation Error Messages

| Field                  | Rule              | Error message                                           |
| ---------------------- | ----------------- | ------------------------------------------------------- |
| Any required field     | Empty on submit   | "[Field label] is required."                            |
| Feedback content       | < 10 chars        | "Feedback must be at least 10 characters."              |
| Feedback type          | Not selected      | "Type is required."                                     |
| Rejection reason       | Empty on submit   | "A rejection reason is required."                       |
| External candidate URL | Not a valid URL   | "Enter a valid URL (e.g. https://example.com/profile)." |
| Personal email         | Not a valid email | "Enter a valid email address."                          |
| Request workload %     | Not 1–100         | "Workload must be between 1 and 100."                   |
| Request start date     | In the past       | "Start date cannot be in the past."                     |
| Request title          | Empty             | "Request title is required."                            |
| Request required role  | Empty             | "Required role is required."                            |
| Request grade level    | Not selected      | "Grade level is required."                              |
| Request English level  | Not selected      | "English level is required."                            |
| Request assigned UM    | Not selected      | "Assigned Unit Manager is required."                    |
| Certificate name       | Empty             | "Certificate name is required."                         |
| Certificate file name  | Empty             | "File name is required."                                |

---

### 5.6 Candidate Warning Messages

Render inline in each candidate row during proposal (§3.6). Non-blocking. `warning` or `danger` tone badge.

| Warning                 | Tone            | Message                                                               |
| ----------------------- | --------------- | --------------------------------------------------------------------- |
| Allocation >100%        | warning (amber) | "Allocation would reach [calculated %]% — exceeds 100%."              |
| Scheduled leave overlap | warning (amber) | "Has scheduled leave overlapping the request period ([leave dates])." |
| High risk               | danger (red)    | "Risk level is High."                                                 |
| Critical risk           | danger (red)    | "Risk level is Critical."                                             |

All warnings end with no period after the date parenthetical (for clean rendering). All others end with a period.

---

### 5.7 Form Placeholder Text

| Field                   | Placeholder                                          |
| ----------------------- | ---------------------------------------------------- |
| Feedback content        | "Write your feedback…"                               |
| Rejection reason        | "Explain why this candidate is not suitable…"        |
| Approval note           | "Add an optional note (visible to Unit Manager)…"    |
| Fit summary             | "Summarise why this candidate is a good fit…"        |
| External candidate URL  | "https://linkedin.com/in/candidate-profile"          |
| Certificate name        | "e.g. AWS Solutions Architect"                       |
| Certificate file name   | "e.g. certificate.pdf (mock — no actual upload)"     |
| Custom list name        | "e.g. Bench — Q3 2026"                               |
| Manager notes           | "Internal notes about this employee…"                |
| Request title           | "e.g. Senior Frontend Engineer for Client Portal"    |
| Request business reason | "Brief description of the business need (optional)…" |

---

## 6. Keyboard Behavior

### 6.1 Tab Order (per screen)

Logical tab order (left-to-right, top-to-bottom within the visual layout):

1. Header — app logo (non-interactive, skip)
2. Role switcher buttons (tabIndex follows DOM order: UM → DM → Employee)
3. Primary navigation links
4. Page `<h1>` (tabIndex=−1, receives programmatic focus on route change — not in tab sequence)
5. Page-level action button(s) (e.g. "New Request", "Add Feedback")
6. Filter controls (left-to-right)
7. Table headers (sortable — `role="columnheader" tabIndex={0}`)
8. Table rows (focusable via Tab, activatable with Enter)
9. Pagination (if present)

### 6.2 Modal and Sheet Behavior

| Event               | Behavior                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Dialog/Sheet opens  | Focus moves to first focusable element inside                                                                    |
| `Escape`            | Closes dialog/sheet; discards unsaved changes                                                                    |
| `Tab`               | Cycles focus through interactive elements inside — **focus is trapped** inside the dialog/sheet while it is open |
| `Shift + Tab`       | Cycles backward                                                                                                  |
| Dialog/Sheet closes | Focus returns to the element that triggered opening                                                              |

### 6.3 Table Row Navigation

| Event                            | Behavior                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `Tab`                            | Moves focus to next focusable element (next row or next interactive element outside table) |
| `Enter` on a focused row         | Triggers row click action (navigate to profile)                                            |
| `Space` on a checkbox inside row | Toggles checkbox                                                                           |

### 6.4 Form Submission

| Event                                    | Behavior                                                                            |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| `Enter` inside a single-line `<Input>`   | Submits the form (default browser behavior — do not prevent unless explicit reason) |
| `Enter` inside a `<Textarea>`            | Inserts newline — does **not** submit                                               |
| `Enter` on the submit `<Button>`         | Submits                                                                             |
| `Escape` while a form is open in a sheet | Closes sheet; discards form state                                                   |

---

## 7. Timing Reference

All timing values are constants. Define in `src/shared/constants/timing.ts` and import where needed.

```ts
export const TIMING = {
  TOAST_DURATION_MS: 4_000, // auto-dismiss
  DEBOUNCE_FILTER_MS: 300, // subordinates list filter input
  TAB_TRANSITION_MS: 0, // no animation — operational tool
  SKELETON_PULSE: 'animate-pulse', // Tailwind class
  INLINE_EDIT_COMMIT_EVENT: 'blur', // table inline edit commits on blur
} as const
```

**Debounce rule:** Apply `DEBOUNCE_FILTER_MS` only to free-text search inputs. Select/dropdown filters apply immediately on change (no debounce).

---

## 8. Accessibility Checklist per Screen

Before marking any screen as done, verify all of these:

| Check                         | Requirement                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------- |
| Single `<h1>`                 | Exactly one per page                                                             |
| `<main>` landmark             | Wraps all primary content                                                        |
| `aria-current="page"`         | On the active nav link                                                           |
| `aria-pressed`                | On the active role button in switcher                                            |
| `aria-busy="true"`            | On `<LoadingState>` root element                                                 |
| `role="alert"`                | On `<ErrorState>` root element                                                   |
| `aria-label` or visible label | On all icon-only buttons                                                         |
| Focus ring                    | Visible on all interactive elements (no `outline-none` without ring replacement) |
| Color not sole indicator      | Every status shown with text label + color                                       |
| Error message association     | `aria-describedby` links field to its error message                              |
| Modal focus trap              | Focus stays inside while dialog is open                                          |
| Focus return                  | After modal closes, focus returns to trigger                                     |
| Keyboard-navigable table      | Rows reachable and activatable by keyboard                                       |
