# Requirements Summary

Extracted from BRD v1.0. Full detail and tables live in `docs/requirements/# Business Requirements Document.md`.

## Core Business Requirements

| Theme                 | Summary                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------- |
| People management     | UM dashboard, subordinates list, full managerial employee profile with tabs             |
| Employee self-service | Personal profile view; edit contact fields, IDP, certificates                           |
| Resourcing            | DM request creation → UM candidate proposal → DM approve/reject → assignment history    |
| Operational tracking  | Custom fields/lists with inline edit; profile sharing for candidate review              |
| Data                  | 500+ seeded employees, 10 requests, 3 demo lists, 20 risks, 30 action items, 3 personas |

## Requirement Groups

### FR-RS — Role Switcher (5)

- **FR-RS-001–005:** Role switcher for UM, DM, Employee without auth; switching changes nav, actions, and data immediately; each role defaults to a named seeded persona.

### FR-DB — Manager Dashboard (7)

- **FR-DB-001–004:** Widgets — subordinate headcount, active risks, open action items, active resourcing requests.
- **FR-DB-005–006:** Manager's own action items sorted by due date; overdue highlighted.
- **FR-DB-007:** Quick nav to Subordinates, Custom Lists, Resourcing, Risks.

### FR-SL — Subordinates List (6)

- **FR-SL-001–006:** Unit-scoped table (name, position, grade, status, risk); sort/filter; row opens managerial profile; empty state.

### FR-EP — Employee Profile — Managerial (12)

- **FR-EP-001–012:** Header, tabs (Overview, Job & Skills, Risks & Action Items, Resourcing History, Project History, Documents & IDP); custom fields; manager edits; assignment vs project history **never mixed**.

### FR-PV — Employee Profile — Personal (7)

- **FR-PV-001–007:** Own profile only; edit personal phone/email/address; view action items; update IDP; add certificate metadata; no manager-only data; save confirmation.

### FR-CL — Custom Lists (13)

- **FR-CL-001–013:** Custom field types; named filtered lists as tabs; inline edit on custom columns only; share view-only; seeded Bench, Booked, Needs Conversation.

### FR-PS — Profile Sharing (7)

- **FR-PS-001–007:** Generate shareable profile with per-section toggles; sensitive sections off by default; token link; no login required.

### FR-RR — Resourcing Request Creation (7)

- **FR-RR-001–007:** DM creates request with required fields; submit → Submitted; appears in UM queue; validation on required fields; cancel Draft/Submitted.

### FR-CP — Candidate Proposal (12)

- **FR-CP-001–012:** UM views request; selects internal candidates; external URL; fit summary; warnings (allocation >100%, leave overlap, High/Critical risk); shared profile; submit → Candidates Proposed; withdraw before decision.

### FR-CD — Candidate Review (9)

- **FR-CD-001–009:** DM reviews proposed candidates; approve one (optional note); reject with **required** reason; status updates.

### FR-AH — Assignment History (6)

- **FR-AH-001–006:** Record every proposal attempt with outcome; visible on profile Resourcing History tab and UM Resourcing section; read-only; **never** mixed with project history.

## Key Business Rules

| ID         | Rule                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| BR-001     | UM proposes candidates only from own unit                                   |
| BR-002     | DM cannot browse employee profiles — only shared profile or external URL    |
| BR-003     | Employee sees/edits own profile only                                        |
| BR-004     | Candidate rejection always requires written reason                          |
| BR-005     | Sensitive sections excluded from shared profiles by default                 |
| BR-006     | Assignment history and project history are always separate                  |
| BR-007     | Custom list inline edit — custom field columns only                         |
| BR-008     | Shared custom list — view only, no structure changes                        |
| BR-009     | Shared list recipients edit custom values only for their direct reports     |
| BR-010     | Creator can cancel Draft or Submitted requests                              |
| BR-011     | UM can withdraw Proposed candidate before DM decision                       |
| BR-012–014 | High risk, over-allocation, leave overlap → visible warnings (non-blocking) |
| BR-015     | External candidate URL must be valid and non-empty                          |

## Key Acceptance Criteria (by area)

| Group              | IDs           | Highlights                                                                                        |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------- |
| Role Switcher      | AC-RS-001–004 | Each role loads correct landing page; nav/content change without full reload                      |
| Dashboard          | AC-DB-001–004 | Four widgets with seeded values; sorted action items; overdue highlight; nav links work           |
| Subordinates       | AC-SL-001–005 | Unit-scoped list; five columns; sort/filter; row → profile                                        |
| Employee Profile   | AC-EP-001–005 | Header fields; all tabs; separate history tabs; manager notes hidden in personal view             |
| Custom Lists       | AC-CL-001–005 | Three seeded tabs; inline edit persists to profile; system columns read-only; shared list visible |
| Profile Sharing    | AC-PS-001–004 | Generate action; section checkboxes; link shows selected sections only                            |
| Resourcing Request | AC-RR-001–004 | Submit with required fields; status Submitted; appears in UM queue; validation errors             |
| Candidate Proposal | AC-CP-001–004 | Internal selection; allocation warning; external URL; status Candidates Proposed                  |
| Candidate Review   | AC-CD-001–004 | Shared profile/URL visible; approve/reject with validation on rejection reason                    |
| Assignment History | AC-AH-001–004 | Record after decision; correct data; separate from project history; read-only                     |

## Out of Scope (BRD §7.2)

Real auth, backend, database, file storage, external integrations, admin permission UI, automated project history from approvals, notification system.

## Assumptions (selected)

- **AS-001–002:** All data mocked; auth simulated via role switcher
- **AS-009:** One approved candidate fulfills a request
- **AS-011:** Employee does **not** see own assignment history in MVP
- **AS-012:** Rejection feedback not shown to employee
