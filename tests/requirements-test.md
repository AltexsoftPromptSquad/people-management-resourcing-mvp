# Requirements Conformance Test — People Management & Resourcing MVP

## Test Metadata

| Field | Value |
|---|---|
| Test type | Requirements traceability / conformance audit |
| Date executed | 2026-06-24 |
| Executed by (model) | Claude Opus 4.8 (Cursor agent) |
| Source of truth (authoritative) | `people-management-resourcing-mvp/docs/Test Assignment- People Management & Resourcing MVP.pdf` (4 pages) |
| Artifacts under test | Generated requirements & planning markdown (see list below) |
| Method | Manual section-by-section mapping of every PDF requirement to generated FR / BR / AC / entity / roadmap items; classify each as Covered, Gap, Deviation, or Addition |
| Result summary | **Core scope substantially covered.** 2 genuine content gaps (Feedbacks, Scheduled Leaves), 1 builder gap (filter-field selection), several documented scope narrowings, and several reasonable additions. |

### Files compared

**Authoritative requirement (PDF):**
- `docs/Test Assignment- People Management & Resourcing MVP.pdf`

**Generated requirements / plans tested against it:**
- `docs/requirements/# Business Requirements Document.md` (BRD v1.0)
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/phases/phase-1-foundation/PLAN.md`
- `.planning/phases/phase-1-foundation/VALIDATION.md`

**Reviewed for "additional functionality" only (engineering convention docs, not requirements):**
- `docs/architecture/page-structure.md`, `component-structure.md`, `shared-ui.md`, `visual-theme.md`, `project-structure.md`

---

## 1. Coverage Matrix (PDF → Generated artifacts)

| PDF § | Requirement | Generated coverage | Status |
|---|---|---|---|
| 1 | Manager Dashboard — summary widgets (headcount, active risks, open action items, active requests) | FR-DB-001–004, AC-DB-001 | ✅ Covered |
| 1 | Own action items sorted by due date, overdue highlighting | FR-DB-005–006, AC-DB-002–003 | ✅ Covered |
| 1 | Quick nav (subordinates, custom lists, resourcing, risks) | FR-DB-007, AC-DB-004 | ✅ Covered |
| 2 | Subordinates table (name, position, grade, project/status, risk level) | FR-SL-002, AC-SL-002 | ✅ Covered |
| 2 | Basic sorting & filtering | FR-SL-003–004, AC-SL-003–004 | ✅ Covered |
| 2 | Row click → Employee Profile | FR-SL-005, AC-SL-005 | ✅ Covered |
| 3 | Define custom fields (text, number, date, single-select, boolean) | FR-CL-001 | ✅ Covered |
| 3 | Builder UI — pick employees by filter, choose columns | FR-CL-002, AC-CL-002 | ⚠️ Partial — see Gap G-3 |
| 3 | Choose which fields are used as **filters**; any field usable as filter/column/both | Entity `CustomList.filterableFields` only | ⚠️ Gap G-3 |
| 3 | Inline-editable columns update underlying field | FR-CL-004–005, AC-CL-003 | ✅ Covered |
| 3 | Each saved list as a tab; multiple tabs | FR-CL-003, AC-CL-001 | ✅ Covered |
| 3 | Lists owned by creator, shareable to other managers | FR-CL-010, AC-CL-005 | ✅ Covered (with narrowing D-2) |
| 3 | Example lists: booked / bench / needs a conversation | FR-CL-012 (seeded) | ✅ Covered |
| 4 | Basic info: name, position, grade, birthday, contacts (personal, emergency), address | FR-EP-003, Person entity (`dateOfBirth`, emergency contact, address) | ✅ Covered |
| 4 | Employee type (FTE / Subcontractor) | Person `employmentType` | ✅ Covered |
| 4 | English level | FR-EP-003/004, Person `englishLevel` | ✅ Covered |
| 4 | IDP document reference | FR-EP-009, IDP entity | ✅ Covered |
| 4 | Risks (current level + history) | FR-EP-005, Risk entity | ✅ Covered |
| 4 | HR / management notes | FR-EP-011 | ✅ Covered |
| 4 | **Feedbacks** | — none | ❌ **Gap G-1** |
| 4 | **Scheduled leaves** | Referenced only by warning FR-CP-007; no entity, no profile FR | ❌ **Gap G-2** |
| 4 | Documents (contract, CV, joining interview feedback) | FR-EP-009, Document entity | ✅ Covered |
| 4 | Assignment history (separate from project history) | FR-EP-006, FR-AH-*, BR-006 | ✅ Covered |
| 4 | Project history (separate from assignment history) | FR-EP-007, FR-AH-005 | ✅ Covered |
| 4 | A successful assignment may lead to a project (both items exist) | `convertedToProject` flag; **no creation flow**; BR-006 excludes auto-creation | ⚠️ Deviation D-3 |
| 4 | Action items (manager assigns tasks to person) | FR-EP-005, Action Item entity | ✅ Covered |
| 4 | Custom fields | FR-EP-010, AC-EP-005 | ✅ Covered |
| 5 | Granular per-section selection of shared info | FR-PS-002, AC-PS-002 | ✅ Covered |
| 5 | Accessible via generated link | FR-PS-004, AC-PS-003 | ✅ Covered |
| 5 | Sensitive sections excluded by default, explicit enable | FR-PS-003, BR-005, AC-PS-004 | ✅ Covered |
| 6.1 | DM creates request: vacancy details/requirements, compensation, duration/term, workload % | FR-RR-001–002 (superset of fields) | ✅ Covered |
| 6.2 | UM sees incoming requests; select internal specialists OR add external candidate URL; attach; submit for approval | FR-CP-001–011 | ✅ Covered |
| 6.3 | DM sees own requests; per-candidate link (shared profile / external URL); approve **or** reject with feedback reason | FR-CD-001–009 | ⚠️ Covered with narrowing D-1 |
| 6.4 | Each attempt recorded & shown in UM Resourcing→Assignments + employee profile (separate from project history) | FR-AH-001–006, AC-AH-* | ✅ Covered |
| 7 | Employee: see/update own contact info | FR-PV-002 | ✅ Covered |
| 7 | Employee: see action items from manager / **PP** | FR-PV-003 (PP role not modeled) | ⚠️ Minor — see Note N-1 |
| 7 | Employee: see/update IDP statuses | FR-PV-004 | ✅ Covered |
| 7 | Employee: upload certificates & similar documents | FR-PV-005 | ✅ Covered |

---

## 2. Missing / Under-Specified Requirements (Gaps)

> These are PDF requirements that are not fully represented in the generated requirements or plans.

### G-1 — "Feedbacks" profile section is missing (Severity: High)
- **PDF §4** lists **feedbacks** as a mandatory section of the managerial Employee Profile, distinct from documents (which separately include "joining interview feedback").
- **Generated:** The word "feedbacks" appears once in BRD §7.1's prose list of sections, but there is:
  - **No data entity** (§8 has no Feedback entity),
  - **No functional requirement** (FR-EP-002 tabs are Overview, Job & Skills, Risks & Action Items, Resourcing History, Project History, Documents & IDP — no Feedback),
  - **No acceptance criterion**, and
  - **No roadmap deliverable** (Phase 3 builds "all tabs" per FR-EP-002, which excludes feedback).
- **Impact:** A required profile section is effectively dropped from implementable scope. Note: rejection "feedback" (FR-CD-006) is a different concept and does not satisfy this.
- **Recommendation:** Add a Feedback entity, an FR (display/list feedback on profile), an AC, and a roadmap line — or explicitly move "feedbacks" to Out of Scope with rationale.

### G-2 — "Scheduled leaves" has no entity and no profile-display requirement (Severity: High)
- **PDF §4** lists **scheduled leaves** as a mandatory managerial profile section.
- **Generated:** Scheduled leave is referenced **only** as a candidate warning condition (FR-CP-007 / BR-014 — "leave overlapping the request period"). There is **no Leave entity** in §8 and **no FR/AC** to display scheduled leaves on the profile.
- **Impact:** The profile section is unimplementable as specified; the warning rule even depends on data that has no defined source entity.
- **Recommendation:** Add a Leave/ScheduledLeave entity, an FR/AC to display leaves on the profile, and seed data; then wire FR-CP-007 to it.

### G-3 — Custom list builder: configuring which fields are *filters* (Severity: Medium)
- **PDF §3** explicitly requires that the builder let the manager "choose which fields appear as columns **and which are used as filters**," and that "**any custom field can be used as a filter, a column, or both**."
- **Generated:** FR-CL-002 covers choosing the employee filter and column fields only. The "select filterable fields" capability exists in the data model (`CustomList.filterableFields`) but has **no functional requirement or acceptance criterion** describing the builder UI for it. The "filter OR column OR both" interchangeability is not stated as a requirement.
- **Recommendation:** Extend FR-CL-002 (or add FR-CL) to require selecting filterable fields in the builder and to state field/column/filter interchangeability; add a matching AC.

---

## 3. Deviations / Scope Narrowings

> Generated artifacts intentionally restrict or reinterpret the PDF. Each is documented as an assumption/open-question default — acceptable for an MVP, but flagged as a divergence from the literal PDF.

### D-1 — One approval per request vs. per-candidate approve/reject (Severity: Medium)
- **PDF §6.3:** "For each proposed candidate, the DM can either approve the assignment, or reject it" — phrasing supports independent per-candidate decisions (potentially multiple approvals).
- **Generated:** FR-CD-004 / AS-009 / §15 restrict to **one approval per request** in MVP.
- **Status:** Documented narrowing. Acceptable, but confirm with stakeholder since the PDF does not state a single-approval rule.

### D-2 — Shared custom lists are view-only (Severity: Low)
- **PDF §3:** lists "can be shared to other managers" with no stated read/write restriction.
- **Generated:** BR-008 makes shared lists view-only (structure); BR-009 limits shared recipients to editing custom values only for their own reports.
- **Status:** Reasonable added constraint; flag as interpretation.

### D-3 — "Successful assignment leads to a project" not implemented (Severity: Medium)
- **PDF §4/§6:** A successful assignment "may lead to a project, in which case both items exist" — implying the resulting project appears in Project History.
- **Generated:** BR-006 and §7.2 explicitly **exclude** automated project-history creation from approvals; an `AssignmentHistoryItem.convertedToProject` flag exists but there is **no flow** (manual or automatic) to create the resulting project-history entry.
- **Status:** Documented out-of-scope decision. Project history is seed-only. Acceptable for MVP, but the PDF's "both items exist" linkage is not demonstrable end-to-end.

---

## 4. Additional Functionality (Beyond the PDF)

> Present in generated requirements but **not** in the PDF. Most are reasonable MVP enablers; listed for scope transparency and to confirm they are intended.

| # | Addition | Where | Assessment |
|---|---|---|---|
| A-1 | **Role switcher** (no-auth persona switching) FR-RS-001–005 | BRD §10.1 | Justified — replaces auth, which PDF excludes. |
| A-2 | **Skills** entity, skills on profile, "Job & Skills" tab, required-skills on request | Person/Skill entities, FR-EP-004, FR-RR-002 | Beyond PDF — PDF profile list does **not** mention skills. Reasonable for resourcing but confirm intent. |
| A-3 | **Candidate fit warnings** (allocation >100%, leave overlap, High/Critical risk) FR-CP-006–008 | BRD §10.9 | Value-add not requested by PDF. |
| A-4 | **Withdraw** a proposed candidate FR-CP-012 / BR-011 | BRD | Not in PDF. |
| A-5 | **Cancel** a Draft/Submitted request FR-RR-006 / BR-010 | BRD | Not in PDF. |
| A-6 | Expanded request fields: title, project name, client, grade, English level, priority, business reason, fit summary | FR-RR-002, FR-CP-005 | Elaboration of PDF's "vacancy details and requirements." |
| A-7 | Full **request status model** (Draft/Submitted/In Review/Candidates Proposed/Approved/Rejected/Closed/Cancelled) | BRD §7.1 | Elaboration; reasonable. |
| A-8 | **Document visibility settings** + document type taxonomy | Document entity, FR-EP-009 | Elaboration supporting profile sharing. |
| A-9 | **Allocation / availability** model (`Allocation`, `availabilityPercent`, `currentProjectStatus`) | §8.5, Person | Supports warnings/bench lists; beyond PDF. |
| A-10 | Specific **mock-data volumes** (500 employees, 10 requests, 20 risks, 30 action items) | BRD §7.1 | Implementation detail; aligns with PDF "500+". |

---

## 5. Minor Notes

- **N-1 — "PP" (People Partner) actor unmodeled:** PDF §7 says action items may be assigned "by their manager / PP." Generated docs model only the Unit Manager as assigner; no People Partner role. Low impact (three fixed roles by design), but the PDF reference is unaddressed.
- **N-2 — Profile-sharing audience:** PDF §5 frames sharing for "users without direct hierarchical access (e.g., a Sales manager)" generally; generated docs scope it primarily to candidate review. Functionally compatible.
- **N-3 — Inline-edit narrowing:** PDF §3 says "columns must be inline-editable"; generated FR-CL-006 / BR-007 restrict inline edit to **custom-field** columns (system fields read-only). Reasonable interpretation, noted.
- **N-4 — BRD source file hygiene:** `docs/requirements/# Business Requirements Document.md` contains trailing non-markdown Python script content after line ~990 (`*End of Document*`). Already noted in `STATE.md` as a known parsing caveat; recommend trimming so the file is clean.

---

## 6. Verdict

| Category | Count | Items |
|---|---|---|
| ✅ Covered | 30 of 35 mapped PDF requirements | — |
| ❌ Genuine gaps | 3 | G-1 Feedbacks, G-2 Scheduled Leaves, G-3 filter-field builder |
| ⚠️ Documented deviations | 3 | D-1 single approval, D-2 view-only shares, D-3 no auto project |
| ➕ Additions beyond PDF | 10 | A-1 … A-10 (mostly justified MVP enablers) |

**Overall:** The generated BRD and plans are a faithful and well-structured expansion of the PDF for the core flows (dashboard, subordinates, profile, custom lists, profile sharing, and the end-to-end resourcing workflow). **Two mandatory profile sections from PDF §4 — "feedbacks" and "scheduled leaves" — are effectively missing** (no entity, no FR/AC, not in the roadmap) and are the highest-priority items to remediate before the BRD can be considered complete against the assignment. The custom-list filter-builder gap (G-3) is the third item to close. The remaining differences are intentional, documented MVP narrowings or reasonable additions.

### Recommended actions (priority order)
1. Add Feedback entity + FR/AC + roadmap line (or explicitly de-scope with rationale). [G-1]
2. Add Scheduled-Leave entity + profile-display FR/AC + seed data; wire FR-CP-007 to it. [G-2]
3. Extend FR-CL-002 to cover selecting filterable fields and field/column interchangeability. [G-3]
4. Confirm scope narrowings D-1 and D-3 with the stakeholder.
5. Confirm additions A-2 (skills) and A-3 (warnings) are intended scope.
6. Trim trailing non-markdown content from the BRD file. [N-4]
