# Decision Log — BRD Remediation

**Date:** 2026-06-27
**Author:** Product Owner / BA / Solution Architect — Remediation Pass
**Status:** Approved — Carlos Nunes, 2026-06-27
**Triggered by:** Engineering audit findings from Phase 1 validation (Ivan Zamikula, 2026-06-25)
**Source of truth consulted:** Test Assignment PDF, BRD v1.0, `.planning/` docs, Phase 1 validation report

All decisions in this log have been reviewed and approved by Carlos Nunes (Product Owner, 2026-06-27). BRD v1.1 is the active source of truth. Phase 2 implementation may proceed.

---

## G-1 — Feedbacks Profile Section

**Decision:** Include in MVP scope.

**Recommendation:** Add a `Feedback` entity. Display a Feedbacks tab on the managerial Employee Profile showing a list of feedback entries (type, content, author, date). The Unit Manager can add new feedback entries from this tab. The Feedbacks section is excluded from shared profiles by default. Employee personal view never sees feedbacks.

**Rationale:** PDF §4 explicitly lists "feedbacks" as a mandatory section of the managerial profile. BRD v1.0 mentions it once in §7.1 prose but has no entity, no FR, no AC, and no roadmap entry — making it unimplementable. It is a required profile section, not an optional enhancement. The implementation is straightforward (a seeded list with an add-entry form) and does not affect the resourcing flow.

**Impact:**

- New entity: `Feedback` (§8.16 of BRD)
- Updated: FR-EP-002 (new Feedbacks tab in tab list)
- New FR: FR-EP-013 (display Feedbacks tab), FR-EP-014 (manager adds feedback entry)
- Updated: FR-PS-003 (feedbacks already in sensitive-excluded list — confirmed)
- New AC: AC-EP-006, AC-EP-007
- Seed data: minimum 2 feedback entries per demo employee
- Phase: 3 (Employee Profile)

**Status:** Approved — Carlos Nunes, 2026-06-27

---

## G-2 — Scheduled Leaves Profile Section

**Decision:** Include in MVP scope.

**Recommendation:** Add a `ScheduledLeave` entity. Display scheduled leaves as a section within the Overview tab of the managerial Employee Profile. Show leave type, start/end date, and status. The Unit Manager can see scheduled leaves when reviewing candidates (FR-CP-007 leave-overlap warning depends on this data). Scheduled leaves are not shown in the Employee personal view. Not included in shared profiles by default.

**Rationale:** PDF §4 explicitly lists "scheduled leaves" as a mandatory section of the managerial profile. BRD v1.0 references "leave overlap" in FR-CP-007 and BR-014 as a candidate warning, but there is no entity and no display FR — so the warning has no data to check against. Including this entity closes both the profile gap and wires FR-CP-007 properly.

**Impact:**

- New entity: `ScheduledLeave` (§8.17 of BRD)
- Updated: FR-EP-003 (Overview tab now includes scheduled leaves section)
- Updated: FR-CP-007 (now references ScheduledLeave entity explicitly)
- Updated: BR-014 (wired to ScheduledLeave entity)
- New AC: AC-EP-008
- Seed data: minimum 1 scheduled leave per demo employee
- Phase: 3 for display; Phase 4 for leave-overlap warning

**Status:** Approved — Carlos Nunes, 2026-06-27

---

## G-3 — Custom List Filter-Field Builder

**Decision:** Include in MVP scope with minimal implementation.

**Recommendation:** Update FR-CL-002 to require that when building a custom list, the Unit Manager can designate each custom field as a filter, a column, or both. The simplest UI is a checkbox group per field: "Use as filter | Use as column | Both." The `CustomList.filterableFields` field already exists in the data model — this decision adds the FR and AC that make it implementable. No separate complex builder screen is needed; this is an extension of the existing list creation form.

**Rationale:** PDF §3 explicitly requires that managers can "choose which fields appear as columns and which are used as filters" and that "any custom field can be used as a filter, a column, or both." The `filterableFields` field in the data model acknowledges this requirement exists, but no FR or AC covers the builder UI for it. Without this, the custom list feature is incompletely specified.

**Impact:**

- Updated: FR-CL-002 (add filter/column/both designation)
- Updated: CustomList entity definition (clarify `filterableFields` and `visibleColumns` semantics)
- New AC: AC-CL-006
- Phase: 5 (Custom Lists)

**Status:** Approved — Carlos Nunes, 2026-06-27

---

## D-1 — One Approval Per Request

**Decision:** Confirmed. One approval per request is correct for MVP.

**Recommendation:** Keep AS-009 as written. FR-CD-004 ("approve one candidate per request") is confirmed. Section §15 updated to reflect confirmed status.

**Rationale:** PDF §6.3 uses the phrase "for each proposed candidate, the DM can either approve the assignment, or reject it" — which describes per-candidate actions, not that multiple approvals are supported. The PDF does not state multiple approvals in a single request are required. One approval fulfilling a request is the simplest interpretation consistent with the assignment goal: demonstrate one complete E2E resourcing flow. Allowing multiple approvals adds status model complexity (what happens to remaining candidates after an approval?) without adding demo value.

**Impact:**

- AS-009 confirmed
- FR-CD-004 confirmed
- §15 updated from "Open Question" to "Confirmed Decision"
- No code or model changes required

**Status:** Approved — Carlos Nunes, 2026-06-27

---

## D-3 — Assignment → Project History Creation

**Decision:** Confirmed out-of-scope for MVP. The `convertedToProject` boolean flag is sufficient.

**Recommendation:** Keep BR-006 as written. The `AssignmentHistoryItem.convertedToProject` flag remains the MVP indicator that a successful assignment led to a project. No automated or manual project history creation flow from approvals is required in MVP. Project history entries are seeded only.

**Rationale:** PDF §4/§6 says a successful assignment "may lead to a project, in which case both items exist" — the word "may" makes it conditional, not mandatory. BR-006 explicitly excludes automated project history creation from MVP scope, and §7.2 Out of Scope confirms this. The `convertedToProject` flag allows the demo to acknowledge the concept. Creating a project history creation flow would require a separate form, additional state transitions, and cross-entity updates — complexity not justified for MVP demo purposes.

**Impact:**

- BR-006 confirmed
- `convertedToProject` field confirmed on AssignmentHistoryItem entity
- §15 updated from "Open Question" to "Confirmed Decision"
- §7.2 Out of Scope entry confirmed
- No code or model changes required beyond current state

**Status:** Approved — Carlos Nunes, 2026-06-27

---

## A-2 — Skills Entity in MVP Scope

**Decision:** Confirmed in scope.

**Recommendation:** The `Skill` entity, "Job and Skills" tab on the profile (FR-EP-004), and required skills on resourcing requests (FR-RR-002) are confirmed as intended MVP scope. Remove "needs confirm" status.

**Rationale:** Skills are already defined in BRD §8.3, referenced in FR-EP-004 (Job and Skills tab), FR-CP-002 (UM browses candidates' skills), and FR-RR-002 (required skills field on request form). The entity type exists in `src/types/skill.ts` and 3 seed records exist. The resourcing use case — matching candidates with required skills — depends on this entity being present. Removing it would require removing 4 FRs. The original assignment's resourcing workflow implicitly requires skills to support the "review candidate profile" steps.

**Impact:**

- `Skill` entity confirmed (§8.3)
- FR-EP-004 confirmed
- FR-CP-002 confirmed
- FR-RR-002 confirmed (requiredSkills field)
- Status changes from "Needs confirm" to "Confirmed" in STATE.md
- Seed data requirement: skills for all demo employees (minimum 3 per person)

**Status:** Approved — Carlos Nunes, 2026-06-27

---

## A-3 — Candidate Fit Warnings in MVP Scope

**Decision:** Confirmed in scope. All three warnings are required.

**Recommendation:** FR-CP-006 (over-allocation), FR-CP-007 (leave overlap), and FR-CP-008 (High/Critical risk) are confirmed as intended MVP scope. BR-012, BR-013, and BR-014 are confirmed. FR-CP-007 and BR-014 now have proper data backing via the ScheduledLeave entity (see G-2 decision).

**Rationale:** These warnings are essential to the resourcing demo scenario (Demo Scenario 5: "Select candidate → Review warnings"). Without warnings, the candidate proposal step has no meaningful decision support signals, reducing demo quality. All three warnings are non-blocking (FR-CP-009), so they do not add workflow complexity. FR-CP-007 depends on the ScheduledLeave entity (G-2) — now that G-2 is resolved, the leave warning has proper data backing.

**Impact:**

- FR-CP-006–009 confirmed
- BR-012–014 confirmed
- FR-CP-007 and BR-014 now reference ScheduledLeave entity explicitly
- Status changes from "Needs confirm" to "Confirmed" in STATE.md
- Seed data requirement: at least 1 leave-overlap scenario, 1 over-allocation scenario, and 1 high-risk candidate in seeded data

**Status:** Approved — Carlos Nunes, 2026-06-27

---

## Summary Table

| ID  | Decision                              | BRD Action                                 | Phase Impact | Status                              |
| --- | ------------------------------------- | ------------------------------------------ | ------------ | ----------------------------------- |
| G-1 | Feedbacks — Include in MVP            | New entity §8.16, FR-EP-013–014, new ACs   | Phase 3      | Approved — Carlos Nunes, 2026-06-27 |
| G-2 | Scheduled Leaves — Include in MVP     | New entity §8.17, update FR-EP-003, new AC | Phase 3–4    | Approved — Carlos Nunes, 2026-06-27 |
| G-3 | Filter-field builder — Include in MVP | Update FR-CL-002, new AC                   | Phase 5      | Approved — Carlos Nunes, 2026-06-27 |
| D-1 | One approval per request — Confirmed  | §15 confirmed, AS-009 stays                | No change    | Approved — Carlos Nunes, 2026-06-27 |
| D-3 | No auto project history — Confirmed   | BR-006 stays, §15 confirmed                | No change    | Approved — Carlos Nunes, 2026-06-27 |
| A-2 | Skills — Confirmed in scope           | §8.3 confirmed, remove uncertain status    | No change    | Approved — Carlos Nunes, 2026-06-27 |
| A-3 | Candidate warnings — Confirmed        | BR-012–014 confirmed, FR-CP-007 wired      | Phase 4      | Approved — Carlos Nunes, 2026-06-27 |
| H-1 | Employee action item completion       | New FR-PV-008, resolve BRD §4 vs FR-PV-003 | Post-Phase 5 | Approved — Carlos Nunes, 2026-07-09 |

---

# Post-Phase-5 Hardening Decisions

**Date:** 2026-07-09
**Author:** BA / Product remediation — post-Phase-5 hardening pass
**Status:** Approved — Carlos Nunes, 2026-07-09

---

## H-1 — Employee Marks Own Action Items Complete

**Decision:** Resolve the conflict in favor of BRD §4. Employees may mark their own assigned action items as complete.

**Conflict:** BRD §4 (Employee "Can Do") states "Mark own action items as complete where allowed." FR-PV-003 only grants view access, and the Phase 3 SRS and validation treated action items as read-only on the personal profile. The prose and the functional requirements disagree.

**Recommendation:** Keep FR-PV-003 (view) and add FR-PV-008 (complete). Scope the completion narrowly: only the assignee may complete their own item, only the status may change (to Done), and no other fields or other people's items may be edited. This closes the only BRD prose vs FR conflict and makes Demo Scenario 7 (Employee Self-Service) feel finished, consistent with the "mark as complete where allowed" prose.

**Rationale:** BRD §4 is the higher-level statement of intent and matches the self-service goal. The Phase 3 read-only treatment was an implementation simplification, not a product decision. The change is small, frontend-only, and reuses the existing personal-profile save + toast pattern.

**Impact:**

- New FR: FR-PV-008 (employee marks own assigned action items complete)
- FR-PV-003 unchanged (view remains valid)
- Superseded: Phase 3 read-only treatment of personal action items (validation row P3-PV06 to be updated by the implementing PR)
- Rules: assignee-only, status-to-Done-only, no edit of other fields or other people's items
- Implementation (separate dev PR, owned by Volodymyr): `PATCH /api/action-items/:id` MSW handler, `patchActionItem` API, mutation hook, "Mark complete" control on `/my-profile`, updated + new e2e tests
- Phase: post-Phase-5 hardening

**Status:** Approved — Carlos Nunes, 2026-07-09
