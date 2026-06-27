# Roadmap

Phased delivery aligned with BRD scope and E2E resourcing demo. Each phase should be demoable and QA-validated before the next begins.

---

## Phase 1 — Foundation ✅ Complete

**Goal:** App shell, role switcher, routing, mock data foundation.

| Deliverable                                            | BRD alignment                                       | Status |
| ------------------------------------------------------ | --------------------------------------------------- | ------ |
| App layout with role-aware navigation                  | FR-RS-001–002                                       | Done   |
| Role switcher with 3 seeded personas                   | FR-RS-003–005                                       | Done   |
| Route structure for UM, DM, Employee landing pages     | AC-RS-001–003                                       | Done   |
| Domain types + mock data layer (MSW) + Faker factories | AS-001, AS-014–016, mock data §7.1                  | Done   |
| TanStack Query wiring                                  | AGENTS.md stack                                     | Done   |
| Seed data baseline (personas, units, 75 employees)     | BRD §7.1 mock data (partial — full 500+ by Phase 2) | Done   |

**Exit:** Phase 1 validation passed (Ivan Zamikula, 2026-06-25). All 20 functional/browser/a11y checks pass.

---

## Phase 2 — Manager Dashboard & Subordinates

**Goal:** UM operational overview, people list, and full seed data expansion including new entities.

| Deliverable                                                                                                                                   | BRD alignment                |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Manager dashboard with 4 widgets + action items list                                                                                          | FR-DB-001–007, AC-DB-001–004 |
| Subordinates table (sort, filter, row → profile stub)                                                                                         | FR-SL-001–006, AC-SL-001–005 |
| Expand Person type to full BRD §8.1 field set                                                                                                 | BRD §8.1, `data-models.md`   |
| Expand ResourcingRequest type to full BRD §8.10 field set                                                                                     | BRD §8.10, `data-models.md`  |
| Add new types: Feedback, ScheduledLeave, AssignmentHistory, ProjectHistory, Risk, ActionItem, Document, IDP, CandidateProposal, SharedProfile | BRD §8                       |
| Expand seed data to 500+ employees across 3 units                                                                                             | BRD §7.1 mock data           |
| Add seed data: feedbacks, scheduled leaves, risks, action items, project history                                                              | BRD §7.1                     |
| Add MSW handlers for new entities                                                                                                             | `feature-rules.md`           |

**Exit:** Demo Scenario 1 (dashboard) and partial Scenario 2 (list navigation). Build/lint pass.

---

## Phase 3 — Employee Profile

**Goal:** Managerial and personal profile views, including new Feedbacks tab and Scheduled Leaves section.

| Deliverable                                          | BRD alignment                      |
| ---------------------------------------------------- | ---------------------------------- |
| Managerial profile — all tabs, header, custom fields | FR-EP-001–012, AC-EP-001–005       |
| **Feedbacks tab** — display list + add entry form    | FR-EP-013–014, AC-EP-006–007 (G-1) |
| **Scheduled Leaves section** on Overview tab         | FR-EP-003 updated, AC-EP-008 (G-2) |
| Personal profile — edit contact, IDP, certificates   | FR-PV-001–007                      |
| Risks and action items on profile                    | FR-EP-005, risks §7.1              |
| Documents & IDP metadata (mock file names)           | BRD §7.1 documents                 |

**Exit:** Demo Scenarios 2 and 7. All profile tabs render with seeded data.

---

## Phase 4 — Resourcing Request E2E Flow

**Goal:** Complete staffing journey — the MVP centerpiece.

| Deliverable                                             | BRD alignment                    |
| ------------------------------------------------------- | -------------------------------- |
| DM: create/submit/cancel requests                       | FR-RR-001–007, AC-RR-001–004     |
| UM: incoming queue, propose candidates, warnings        | FR-CP-001–012, AC-CP-001–004     |
| **Leave overlap warning using ScheduledLeave entity**   | FR-CP-007, BR-014, A-3 confirmed |
| **Allocation warning using Person.availabilityPercent** | FR-CP-006, BR-013, A-3 confirmed |
| **High/Critical risk warning**                          | FR-CP-008, BR-012, A-3 confirmed |
| Profile sharing for internal candidates                 | FR-PS-001–007, AC-PS-001–004     |
| DM: approve/reject with required rejection reason       | FR-CD-001–009, AC-CD-001–004     |
| Assignment history on profile + UM resourcing section   | FR-AH-001–006, AC-AH-001–004     |
| 10 seeded resourcing requests                           | BRD §7.1 mock data               |

**Exit:** Demo Scenarios 4, 5, 6 — full E2E resourcing journey.

---

## Phase 5 — Custom Lists, Profile Sharing Polish, Documents, QA Hardening

**Goal:** Remaining BRD features and demo readiness.

| Deliverable                                                    | BRD alignment                |
| -------------------------------------------------------------- | ---------------------------- |
| Custom fields + lists with inline edit and sharing             | FR-CL-001–013, AC-CL-001–006 |
| **Filter/column/both field designation in list builder** (G-3) | FR-CL-002 updated, AC-CL-006 |
| Bench, Booked, Needs Conversation seeded lists                 | FR-CL-012                    |
| Profile sharing UX polish                                      | FR-PS-\*                     |
| Full seed data (20 risks, 30 action items)                     | BRD §7.1                     |
| Loading/empty/error states; desktop table layouts              | AGENTS.md, BRD §7.2          |
| QA regression pass against all AC-\* groups                    | BRD §13                      |

**Exit:** All 7 demo scenarios pass; acceptance criteria checklist complete.

---

## Dependency Graph

```text
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
                              ↑
                    (E2E blocked until profile + sharing exist)
```

Phase 4 depends on Phase 3 profile tabs (assignment history) and Phase 1 role switcher. Phase 5 custom lists can parallelize late Phase 4 work but should not delay E2E demo.
