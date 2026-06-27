# Data Models

Complete MVP entity definitions for engineering implementation.
These models are derived from BRD v1.1. All entities must live in `src/types/` as shared domain types.

---

## Naming Conventions

- `id`: string, stable identifier, format `{entity}-{sequence}` (e.g. `person-001`, `feedback-001`)
- Dates: ISO 8601 string (`2026-07-15`)
- All entities are read-only after creation in MVP unless noted
- All cross-entity references use `id` fields (no embedded objects)

---

## Person

```ts
// src/types/person.ts

type EmploymentStatus = 'Active' | 'On Leave' | 'Notice Period' | 'Inactive'
type CurrentProjectStatus = 'Allocated' | 'Partially Allocated' | 'Bench' | 'Booked' | 'Unavailable'
type RiskLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
type EmploymentType = 'FTE' | 'Subcontractor'
type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

type Person = {
  id: string
  firstName: string
  lastName: string
  workEmail: string
  personalEmail?: string
  workPhone?: string
  personalPhone?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  addressLine?: string
  city?: string
  country?: string
  dateOfBirth?: string
  position: string
  grade: string
  unitId: string
  managerId?: string
  employmentType: EmploymentType
  employmentStatus: EmploymentStatus
  hireDate?: string
  workLocation?: string
  englishLevel: EnglishLevel
  currentProjectStatus: CurrentProjectStatus
  availabilityPercent: number // 0–100
  riskLevel: RiskLevel
  customFieldValues: Record<string, string | number | boolean> // map of customFieldId → value
}
```

**Relationships:**

- Belongs to one `Unit`
- Managed by one `Person` (the Unit Manager)
- Has zero or more: `Skill`, `Risk`, `ActionItem`, `Document`, `Feedback`, `ScheduledLeave`, `AssignmentHistoryItem`, `ProjectHistoryItem`
- Has zero or more `CustomFieldValue` entries encoded in `customFieldValues`

**Seed requirements:**

- 500+ generated employees across 3 units
- 3 named demo personas with full field coverage
- At least 2 employees with `riskLevel = 'High'` or `'Critical'` (for FR-CP-008 demo)
- At least 2 employees with `availabilityPercent + requestedWorkload > 100` combination (for FR-CP-006 demo)

---

## Feedback

**New entity — closes audit finding G-1**

```ts
// src/types/feedback.ts

type FeedbackType = 'HR Note' | 'Performance' | 'General'
type FeedbackVisibility = 'Manager Only' | 'Shareable'

type Feedback = {
  id: string
  personId: string // the employee this feedback is about
  authorId: string // Unit Manager (Person) who wrote it
  type: FeedbackType
  content: string
  createdAt: string
  visibility: FeedbackVisibility
}
```

**Relationships:**

- Belongs to one `Person` (subject employee)
- Author is one `Person` (Unit Manager)

**Ownership:** Unit Manager creates and owns feedback for their subordinates.

**Visibility rules:**

- Visible only in the Managerial Profile view (Feedbacks tab)
- Never shown in Employee personal view (`FR-EP-011`, `BR-016`)
- `visibility = 'Shareable'` items may appear in shared profiles only when the Feedbacks section is explicitly selected by the Unit Manager
- Default shared profile excludes feedbacks (`FR-PS-003`)

**Mock API endpoint:** `GET /api/people/:id/feedbacks`  
**MSW handler mutation:** `POST /api/people/:id/feedbacks`

**Seed requirements:**

- Minimum 2 `Feedback` records for each demo employee persona
- Mix of types: at least 1 `'HR Note'` and 1 `'Performance'` per demo person

---

## Scheduled Leave

**New entity — closes audit finding G-2**

```ts
// src/types/scheduled-leave.ts

type LeaveType = 'Annual' | 'Sick' | 'Parental' | 'Other'
type LeaveStatus = 'Confirmed' | 'Tentative'

type ScheduledLeave = {
  id: string
  personId: string
  leaveType: LeaveType
  startDate: string // ISO date
  endDate: string // ISO date
  status: LeaveStatus
  notes?: string
}
```

**Relationships:**

- Belongs to one `Person`

**Ownership:** Unit Manager creates/manages for subordinates.

**Visibility rules:**

- Visible in Managerial Profile Overview tab (read-only list) — `FR-EP-003`
- Not shown in Employee personal view
- Not included in shared profiles by default (`FR-PS-003`)
- Used by candidate proposal system for overlap detection (`FR-CP-007`, `BR-014`)

**Overlap detection logic:**  
A leave overlaps if: `leave.startDate <= request.endDate AND leave.endDate >= request.startDate`

**Mock API endpoint:** `GET /api/people/:id/scheduled-leaves`

**Seed requirements:**

- Minimum 1 `ScheduledLeave` per demo employee persona
- At least 1 leave with dates that overlap a seeded resourcing request period (to demonstrate FR-CP-007 warning in demo)

---

## Skill

**Status: Confirmed in scope — closes audit finding A-2**

```ts
// src/types/skill.ts (enhance existing)

type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

type Skill = {
  id: string
  personId: string
  name: string
  category: string
  level: SkillLevel
  yearsExperience: number
  lastUsedDate?: string
}
```

**Relationships:** Belongs to one `Person`.

**Seed requirements:**

- Minimum 3 skills per demo employee
- Skills must match some `requiredSkills` entries on seeded resourcing requests (to enable realistic demo scenario)

---

## Assignment History Item

```ts
// src/types/assignment-history.ts

type AssignmentHistoryStatus = 'Proposed' | 'Approved' | 'Rejected' | 'Withdrawn'

type AssignmentHistoryItem = {
  id: string
  employeeId: string // the proposed internal candidate
  requestId: string
  proposalId: string
  status: AssignmentHistoryStatus
  proposedAt: string
  proposedById: string // Unit Manager
  decisionAt?: string
  decisionById?: string // Sales/DM who made the decision
  feedback?: string // rejection reason (if Rejected) or approval note (if Approved)
  convertedToProject: boolean // flag only — no automated project creation in MVP (BR-006)
}
```

**Relationships:**

- Belongs to one `Person` (the candidate)
- References one `ResourcingRequest` and one `CandidateProposal`

**Visibility:**

- Visible to Unit Manager: Resourcing > Assignments (`FR-AH-004`)
- Visible on Employee Profile: Resourcing History tab (`FR-AH-003`)
- Employee cannot see their own assignment history in personal view (`AS-011`)
- Read-only for all roles (`FR-AH-006`)
- Never mixed with Project History (`FR-AH-005`, `BR-006`)

---

## Project History Item

```ts
// src/types/project-history.ts

type ProjectHistoryStatus = 'Active' | 'Completed'

type ProjectHistoryItem = {
  id: string
  personId: string
  projectName: string
  clientName?: string
  role: string
  startDate: string
  endDate?: string
  allocationPercent: number
  status: ProjectHistoryStatus
}
```

**Relationships:** Belongs to one `Person`.

**Visibility:**

- Visible on Employee Profile: Project History tab (`FR-EP-007`)
- Visible in shared profiles when Project History section is selected
- Never mixed with Assignment History (`BR-006`)
- Seeded only in MVP — no creation flow from approvals (`D-3`, `BR-006`)

---

## Custom Field

```ts
// src/types/custom-field.ts

type CustomFieldType = 'Text' | 'Number' | 'Date' | 'Single Select' | 'Boolean'

type CustomField = {
  id: string
  name: string
  description?: string
  type: CustomFieldType
  options?: string[] // values for Single Select type only
  createdByManagerId: string
  isSensitive: boolean
  isActive: boolean
}
```

**Relationships:** Created by one Unit Manager. Values stored per Person via `Person.customFieldValues`.

---

## Custom List

**Updated — closes audit finding G-3**

```ts
// src/types/custom-list.ts

type CustomFieldUsage = 'filter' | 'column' | 'both'

type CustomListFieldConfig = {
  customFieldId: string
  usage: CustomFieldUsage // G-3: each custom field can be filter, column, or both
}

type CustomList = {
  id: string
  name: string
  description?: string
  ownerManagerId: string
  sharedWithManagerIds: string[]
  employeeFilter: Record<string, string | string[]> // system field filters (position, grade, status, etc.)
  fieldConfigs: CustomListFieldConfig[] // replaces separate visibleColumns + filterableFields
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
}
```

**Key change from BRD v1.0:** `filterableFields` and `visibleColumns` are merged into `fieldConfigs` where each custom field carries its own `usage` designation. This directly implements G-3.

**Relationships:**

- Owned by one Unit Manager
- Shared (view-only) with zero or more other Unit Managers (`BR-008`)
- Shared managers can only edit custom values for their own direct reports (`BR-009`)

---

## Resourcing Request

```ts
// src/types/resourcing-request.ts (enhance existing)

type ResourcingRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Candidates Proposed'
  | 'Approved'
  | 'Rejected'
  | 'Closed'
  | 'Cancelled'

type ResourcingRequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

type ResourcingRequest = {
  id: string
  requestCode: string
  title: string
  projectName: string
  clientName?: string
  createdById: string
  assignedUnitManagerId: string
  requiredRole: string
  requiredSkills: string[] // array of skill names
  gradeLevel: string
  englishLevel: EnglishLevel // from person.ts
  expectedCompensationLevel?: string
  workloadPercent: number // 0–100
  startDate: string
  endDate?: string
  durationText?: string
  priority: ResourcingRequestPriority
  status: ResourcingRequestStatus
  businessReason?: string
  createdAt: string
  updatedAt: string
}
```

**Note:** Current `src/types/resourcing-request.ts` is missing `clientName`, `requiredSkills`, `gradeLevel`, `englishLevel`, `expectedCompensationLevel`, `workloadPercent`, `startDate`, `endDate`, `durationText`, `businessReason`. These must be added for Phase 4.

---

## Seed Data Requirements Summary

| Entity            | Demo personas | Generated        | Notes                                              |
| ----------------- | ------------- | ---------------- | -------------------------------------------------- |
| Person            | 3             | 497+             | Full field coverage on demo personas               |
| Skill             | 3+ per person | 1+ per generated | At least 3 per demo person                         |
| Feedback          | 2+ per person | 0                | Seeded only for demo personas                      |
| ScheduledLeave    | 1+ per person | 0–1              | At least 1 overlap scenario with a request         |
| Risk              | 2+ per person | 1+               | 20 total across all employees                      |
| ActionItem        | 2+ per person | 1+               | 30 total, mix of overdue and upcoming              |
| Document          | 2+ per person | 0                | Seeded only for demo personas                      |
| AssignmentHistory | 2+ per person | 0                | Seeded only for demo personas                      |
| ProjectHistory    | 2+ per person | 1+               | Seeded for demo personas; some generated           |
| ResourcingRequest | —             | 10 total         | Mix of statuses; at least 2 in Candidates Proposed |
| CustomList        | 3             | 0                | Bench, Booked, Needs Conversation                  |
| CustomField       | 3+            | 0                | Pre-configured for seeded lists                    |
