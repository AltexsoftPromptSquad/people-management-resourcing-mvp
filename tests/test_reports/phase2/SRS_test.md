# Documentation Gap Analysis

## Comparison: Test Assignment PDF vs BRD v1.1 vs Phase 2 SRS

| Field        | Value                                                               |
| ------------ | ------------------------------------------------------------------- |
| Date         | 2026-07-01                                                          |
| Reviewer     | QA (documentation review)                                           |
| Sources      | `docs/Test Assignment- People Management & Resourcing MVP.pdf`      |
|              | `docs/requirements/# Business Requirements Document.md` (v1.1)      |
|              | `.planning/phases/phase-2-dashboard/SRS.md`                         |
| Support docs | `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`                 |
| Purpose      | Identify gaps/inconsistencies in the requirements documentation set |

---

## 1. How the documents relate

- **Test Assignment PDF** — the original client brief (7 feature areas).
- **BRD v1.1** — the "business truth" expansion of the PDF. Covers the PDF comprehensively and in most cases _adds_ detail (skills, feedbacks, scheduled leaves, candidate warnings, decision log).
- **Phase 2 SRS** — a deliberately narrow slice (Manager Dashboard + Subordinates List + data/type foundation). It explicitly defers Employee Profile, Resourcing, Custom Lists, and Profile Sharing to Phases 3–5, which are documented in `ROADMAP.md`.

**Conclusion:** Most PDF features absent from the Phase 2 SRS are **intentional, documented deferrals**, not gaps. The genuine gaps and inconsistencies are listed below.

---

## 2. Coverage summary (PDF → BRD)

| PDF Section                                    | BRD Coverage                  | Status  |
| ---------------------------------------------- | ----------------------------- | ------- |
| §1 Manager Dashboard                           | FR-DB-001..007                | Covered |
| §2 Subordinates List                           | FR-SL-001..006                | Covered |
| §3 Custom Lists                                | FR-CL-001..013                | Covered |
| §4 Employee Profile (managerial)               | FR-EP-001..014                | Covered |
| §5 Profile Sharing                             | FR-PS-001..007                | Covered |
| §6 Resourcing (request/propose/review/history) | FR-RR / FR-CP / FR-CD / FR-AH | Covered |
| §7 Employee Profile (personal)                 | FR-PV-001..007                | Covered |

The BRD is a faithful **superset** of the PDF; no PDF feature area is dropped, and deferred items are accounted for across ROADMAP Phases 3–5.

---

## 3. Genuine gaps

### GAP-1 (P1) — Dashboard "Risks" (and "Custom Lists") quick-nav targets have no defined destination

- **Source:** PDF §1; `FR-DB-007`; `SRS-F2-043`; SRS §9 route table; SRS acceptance §14.2.4.
- **Issue:**
  - There is **no `/risks` page or route defined anywhere** in the BRD functional requirements. Risks appear only as a dashboard widget and as profile tabs/sections — never as a standalone navigable page. "Risks" is a nav target with no destination spec.
  - The Phase 2 SRS route table (§9) defines only `/dashboard`, `/subordinates`, `/people/:id`, `/resourcing/requests`, `/my-profile`. **`/custom-lists` and `/risks` are not defined for Phase 2**, yet `SRS-F2-043` mandates the links and acceptance check 14.2.4 states "Quick links navigate to expected routes."
- **Impact:** Contradiction — Phase 2 requires working links to pages that are not specified until later phases (or, for Risks, never as a standalone page). Ambiguous for validation.
- **Recommendation:** Specify Phase 2 behavior for the Custom Lists and Risks quick-nav links (disabled, placeholder route, or deep-link into an existing page), and clarify in the BRD whether a standalone Risks page exists or the link points to a filtered subordinates/profile view.

### GAP-2 (P1) — "Direct and indirect reports" not supported by the data model

- **Source:** `FR-DB-001` vs BRD §8.1 `Person`; `SRS-F2-050`.
- **Issue:** `FR-DB-001` specifies the headcount widget shows "direct **and indirect** reports." The `Person` entity has only a single `managerId`, and the Phase 2 SRS treats subordinates as a **flat unit scope**. There is no multi-level hierarchy in the model, so "indirect reports" has no backing. The PDF itself says only "headcount of subordinates" (flat).
- **Impact:** `FR-DB-001` over-specifies relative to both the PDF and the data model.
- **Recommendation:** Either add hierarchy support to the data model or amend `FR-DB-001` to drop "indirect."

### GAP-3 (P2) — "PP" (People Partner) actor referenced but never defined

- **Source:** PDF §7; BRD §6 roles; BRD §8.7 Action Item.
- **Issue:** PDF §7 (personal view) says employees see action items assigned "by their manager **/ PP**." The BRD defines exactly three roles (UM, DM, Employee) and Action Item ownership is just `ownerId`. The "PP / People Partner" actor is neither modeled, folded into "manager," nor explicitly excluded.
- **Impact:** Undocumented actor; likely an intentional simplification but not stated.
- **Recommendation:** Add a one-line BRD note that "PP" is out of scope / represented by the manager owner in MVP.

### GAP-4 (P2) — Assignment→Project linkage traceability is incomplete

- **Source:** PDF §5/§6; BRD §8.12 `AssignmentHistoryItem`; decision D-3.
- **Issue:** PDF §6 states a successful assignment "may lead to a project, in which case **both items exist**" and are related. The BRD handles no-auto-creation (D-3) via a boolean `convertedToProject`, but there is **no field linking an assignment-history item to the resulting project/project-history item**. The "both items exist and are related" relationship cannot be captured.
- **Impact:** Data-model gap; traceability described in PDF is not representable.
- **Recommendation:** If traceability is desired, add an optional `resultingProjectId` reference; otherwise document that only the boolean flag is tracked.

---

## 4. Minor / ambiguity-level findings

### MIN-1 — "Active Requests" widget status set undefined

- `FR-DB-004` / `SRS-F2-040` count "active" resourcing requests, but neither doc specifies which of the 8 statuses (Draft…Cancelled) count as "active." Not listed in SRS §16 Open Decisions.
- **Recommendation:** Enumerate the statuses that qualify as "active."

### MIN-2 — Employee "upload certificates and similar documents" narrowed

- PDF §7 says "upload certificates and similar documents." BRD `FR-PV-005` narrows this to certificate records only. Consistent with Confirmed Decisions, but a slight narrowing worth noting.

---

## 5. Verdict

- **BRD v1.1:** Complete and faithful superset of the PDF. No feature-area gaps.
- **Phase 2 SRS:** Internally consistent for its scope, with one real defect (**GAP-1**: quick-nav links to undefined destinations) that should be resolved before Phase 2 validation.
- **Priority fixes before Phase 2 sign-off:** GAP-1 and GAP-2.
- **Lower priority (BRD clarifications):** GAP-3, GAP-4, MIN-1.
