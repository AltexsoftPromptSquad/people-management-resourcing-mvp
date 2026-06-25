# Roadmap

Phased delivery aligned with BRD scope and E2E resourcing demo. Each phase should be demoable and QA-validated before the next begins.

---

## Phase 1 — Foundation

**Goal:** App shell, role switcher, routing, mock data foundation.

| Deliverable                                                     | BRD alignment                                       |
| --------------------------------------------------------------- | --------------------------------------------------- |
| App layout with role-aware navigation                           | FR-RS-001–002                                       |
| Role switcher with 3 seeded personas                            | FR-RS-003–005                                       |
| Route structure for UM, DM, Employee landing pages              | AC-RS-001–003                                       |
| Domain types + mock data layer (MSW optional) + Faker factories | AS-001, AS-014–016, mock data §7.1                  |
| TanStack Query wiring                                           | AGENTS.md stack                                     |
| Seed data baseline (personas, units, sample employees)          | BRD §7.1 mock data (partial — full 500+ by Phase 2) |

**Exit:** Switch roles → see correct nav and placeholder landing routes; mock data layer responds; build/lint pass. Validated at 1280px+ desktop browser viewport.

---

## Phase 2 — Manager Dashboard & Subordinates

**Goal:** UM operational overview and people list.

| Deliverable                                           | BRD alignment                |
| ----------------------------------------------------- | ---------------------------- |
| Manager dashboard with 4 widgets + action items list  | FR-DB-001–007, AC-DB-001–004 |
| Subordinates table (sort, filter, row → profile stub) | FR-SL-001–006, AC-SL-001–005 |
| Expand seed data toward 500+ employees across 3 units | BRD §7.1 mock data           |

**Exit:** Demo Scenario 1 (dashboard) and partial Scenario 2 (list navigation).

---

## Phase 3 — Employee Profile

**Goal:** Managerial and personal profile views.

| Deliverable                                          | BRD alignment                |
| ---------------------------------------------------- | ---------------------------- |
| Managerial profile — all tabs, header, custom fields | FR-EP-001–012, AC-EP-001–005 |
| Personal profile — edit contact, IDP, certificates   | FR-PV-001–007                |
| Risks and action items on profile                    | FR-EP-005, risks §7.1        |
| Documents & IDP metadata (mock file names)           | BRD §7.1 documents           |

**Exit:** Demo Scenarios 2 and 7.

---

## Phase 4 — Resourcing Request E2E Flow

**Goal:** Complete staffing journey — the MVP centerpiece.

| Deliverable                                           | BRD alignment                |
| ----------------------------------------------------- | ---------------------------- |
| DM: create/submit/cancel requests                     | FR-RR-001–007, AC-RR-001–004 |
| UM: incoming queue, propose candidates, warnings      | FR-CP-001–012, AC-CP-001–004 |
| Profile sharing for internal candidates               | FR-PS-001–007, AC-PS-001–004 |
| DM: approve/reject with required rejection reason     | FR-CD-001–009, AC-CD-001–004 |
| Assignment history on profile + UM resourcing section | FR-AH-001–006, AC-AH-001–004 |
| 10 seeded resourcing requests                         | BRD §7.1 mock data           |

**Exit:** Demo Scenarios 4, 5, 6 — full E2E resourcing journey.

---

## Phase 5 — Custom Lists, Profile Sharing Polish, Documents, QA Hardening

**Goal:** Remaining BRD features and demo readiness.

| Deliverable                                        | BRD alignment                |
| -------------------------------------------------- | ---------------------------- |
| Custom fields + lists with inline edit and sharing | FR-CL-001–013, AC-CL-001–005 |
| Bench, Booked, Needs Conversation seeded lists     | FR-CL-012                    |
| Profile sharing UX polish                          | FR-PS-\*                     |
| Full seed data (20 risks, 30 action items)         | BRD §7.1                     |
| Loading/empty/error states; desktop table layouts  | AGENTS.md, BRD §7.2          |
| QA regression pass against all AC-\* groups        | BRD §13                      |

**Exit:** All 7 demo scenarios pass; acceptance criteria checklist complete.

---

## Dependency Graph

```text
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
                              ↑
                    (E2E blocked until profile + sharing exist)
```

Phase 4 depends on Phase 3 profile tabs (assignment history) and Phase 1 role switcher. Phase 5 custom lists can parallelize late Phase 4 work but should not delay E2E demo.
