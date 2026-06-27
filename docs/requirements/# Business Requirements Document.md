# Business Requirements Document

# People Management & Resourcing MVP

---

## 1. Document Control

| Field             | Value                                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| Document Name     | Business Requirements Document — People Management & Resourcing MVP      |
| Version           | 1.1                                                                      |
| Status            | Active — Remediated 2026-06-27                                           |
| Author            | Business Analyst                                                         |
| Date              | 2026-05-18                                                               |
| Remediation Date  | 2026-06-27                                                               |
| Intended Audience | QA Engineers, Developers, AI Agents, Product Managers, Demo Stakeholders |

**Source Materials:**

- Test Assignment: People Management & Resourcing MVP
- AI-First Delivery Experiment Guidelines
- PMR_MVP_Domain_Research_Notes_Iteration_2.md (Iteration 2)
- People_Management_Resourcing_MVP_Deep_Research.md

**Remediation source:** `docs/requirements/DECISION-LOG.md` (2026-06-27) — closes audit findings G-1, G-2, G-3, D-1, D-3, A-2, A-3.

---

## 2. Purpose

This BRD defines the business requirements for the People Management & Resourcing MVP. It exists to provide a single, stable source of business truth for the following downstream activities:

- Generation of Software Requirements Specifications (SRS)
- Creation of QA test cases and acceptance criteria
- Breakdown into developer implementation tasks
- AI agent task execution
- Demo preparation and scope confirmation

This document does not describe technical architecture. It describes what the product must do, who uses it, what the rules are, and how success is measured.

---

## 3. Product Goal

Build a simple, fast, and realistic internal People Management & Resourcing web application for an engineering organization of 500 or more employees. The system allows Unit Managers to manage people and fulfill staffing requests, Sales and Delivery Managers to create and review resourcing requests, and Employees to view and update their own profiles.

The MVP must demonstrate one complete, end-to-end resourcing flow: from request creation to candidate approval, with assignment history recorded on the employee profile. All data is seeded or mocked. No real backend, authentication, or external integrations are required.

---

## 4. Business Context

**Target Organization:** An engineering company with 500 or more employees distributed across units and projects.

**Problem Being Solved:**

- Unit Managers have no centralized tool to track their people, risks, and resourcing requests.
- Sales and Delivery Managers have no structured way to submit staffing needs and review proposed candidates.
- Employees have no self-service view of their own profile or assigned tasks.
- Assignment decisions and their outcomes are not recorded in a consistent, accessible history.

**Why Each Role Needs the System:**

- Unit Managers need to see all subordinates, their risks, action items, and incoming staffing requests in one place.
- Sales and Delivery Managers need to submit clear requests and review proposed candidates with enough profile information to make a decision.
- Employees need to view and maintain their own contact details, IDP status, and documents without going through a manager for every change.

**Why Mock Data and Frontend-Only Delivery Are Acceptable:**
This is an MVP for an experiment in AI-first delivery. The goal is to demonstrate a realistic, working product flow. Real backend services, databases, and authentication are explicitly excluded from scope. Seeded and mocked data is sufficient to validate the product concept, support all demo scenarios, and enable QA testing.

---

## 5. Product Principles

The following principles govern all design, implementation, and testing decisions for this MVP.

| Principle                     | Description                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Minimal user journey          | Each user completes their core task in as few steps as possible.                                   |
| One primary action per screen | Every screen has one obvious next action. No competing priorities.                                 |
| Fewest practical clicks       | The main resourcing flow completes in the fewest steps that remain clear and safe.                 |
| Clear business language       | Labels, buttons, and messages use plain business words. No technical jargon.                       |
| Simple fixed roles            | Three roles with fixed permissions. No admin configuration UI.                                     |
| No unnecessary configuration  | The product works immediately without setup steps per user.                                        |
| Seed and mock data only       | All data is pre-loaded. No real data entry is required to reach demo state.                        |
| Frontend-only web MVP         | Delivered as a browser-based web application with no server-side application layer.                |
| No real infrastructure        | No back-end, database, production authentication, file storage, or external integrations.          |
| Desktop browser target        | Optimized and validated for desktop browser usage only (suggested minimum viewport: 1280px width). |
| Easy to test                  | Every requirement has a testable acceptance criterion.                                             |
| Easy to implement             | No feature complexity beyond what the assignment explicitly requires.                              |
| Easy to demo                  | One complete E2E resourcing flow works from any seeded starting state.                             |

---

## 6. User Roles

### 6.1 Unit Manager (UM)

**Goal:** Manage a group of engineers and fulfill incoming resourcing requests.

**Main Responsibilities:**

- Review own dashboard for people status, risks, and open items.
- Browse and filter subordinates.
- View and edit allowed employee profile sections.
- Create and manage risks and action items for subordinates.
- Manage custom fields and custom lists.
- Receive, review, and fulfill resourcing requests from Sales or Delivery Managers.
- Propose internal candidates or external candidate URLs for open requests.
- Generate safe shared profile views for proposed internal candidates.

**Can Do:**

- View own dashboard with subordinates, risks, action items, and active requests.
- Open any subordinate's full profile.
- Edit allowed fields on subordinate profiles (contact details, notes, English level, skills, IDP, documents).
- Create, update, and close risks and action items.
- Create and manage custom fields.
- Create, edit, and share custom lists.
- View incoming resourcing requests assigned to them.
- Propose one or more internal candidates from their unit.
- Add an external candidate URL to any request.
- Generate a shared profile for an internal candidate with selected sections.
- View assignment history for their proposed candidates.
- Switch to personal Employee view.

**Cannot Do:**

- Create or approve resourcing requests (no dual role in MVP).
- View employees outside their unit unless a shared profile is provided.
- Approve their own candidate proposals.
- Edit another manager's private lists or notes unless explicitly shared.

---

### 6.2 Sales / Delivery Manager (DM)

**Goal:** Request engineers for projects and decide on proposed candidates.

**Main Responsibilities:**

- Create resourcing requests with role, skills, grade, timeline, and workload details.
- Review proposed candidates for own requests.
- Open shared profiles of internal candidates.
- Approve or reject each candidate with required feedback on rejection.

**Can Do:**

- Create new resourcing requests.
- View all requests they created.
- Open a request and see proposed candidates.
- Follow shared profile links to view selected sections of internal candidate profiles.
- Open external candidate URLs provided by the Unit Manager.
- Approve a candidate proposal.
- Reject a candidate proposal with mandatory written feedback.
- View the final status and history of their requests.

**Cannot Do:**

- Browse all employee profiles directly.
- Edit any employee record.
- View sensitive profile sections unless the Unit Manager explicitly shared them.
- Fulfill resourcing requests (no dual role in MVP).

---

### 6.3 Employee

**Goal:** View and maintain their own profile and assigned tasks.

**Main Responsibilities:**

- Review own profile information.
- Update allowed contact fields.
- View and act on action items assigned by their manager.
- View and update IDP status.
- Add certificate document records.

**Can Do:**

- View own profile in read mode.
- Edit own allowed contact information (personal phone, personal email, address).
- View action items assigned to them.
- Mark own action items as complete where allowed.
- View and update own IDP status.
- Add certificate metadata records.
- View own documents marked as employee-visible.

**Cannot Do:**

- View other employees' profiles.
- Edit own job data, grade, manager assignment, risk records, manager notes, or assignment history.
- Approve or reject resourcing decisions.
- Access the Manager Dashboard or resourcing workflows.

---

## 7. MVP Scope

### 7.1 In Scope

**Delivery model**

- Frontend-only web application — browser-based, not a native desktop application.
- All data is mocked, seeded, or held in local client-side state.
- All demo scenarios must work without back-end services.

**Manager Dashboard**

- Personal landing page for the Unit Manager.
- Summary widgets: subordinate headcount, active risks, open action items, active resourcing requests.
- List of manager's own action items sorted by due date with overdue highlighting.
- Quick navigation to subordinates list, custom lists, resourcing, and risks.

**Subordinates List**

- Tabular list of all employees subordinate to the current Unit Manager.
- Columns: name, position, grade, project or status, risk level.
- Basic sorting and filtering.
- Row click opens the Employee Profile.

**Employee Profile — Managerial View**

- Full detail page for each subordinate.
- Sections: basic info, contact info, employment type, English level, IDP reference, risks, notes, feedbacks, scheduled leaves, documents, assignment history, project history, action items, and custom fields.
- Assignment history and project history are always separate sections.

**Employee Profile — Personal View**

- Simplified view for the employee themselves.
- Editable: personal contact fields.
- Viewable: action items, IDP status, own documents.
- Employee can add certificate metadata.

**Custom Lists — Simplified**

- Unit Manager can create custom fields (text, number, date, single select, boolean).
- Unit Manager can build and save named lists with selected employee filters and column selections.
- Saved lists are displayed as tabs on the Custom Lists page.
- Custom field columns are inline-editable directly in the list.
- Editing a cell updates the field value on the employee profile.
- Lists can be shared with other managers (view-only for shared managers in MVP).
- Three seeded demo lists are pre-loaded: Bench, Booked, and Needs Conversation.

**Profile Sharing — Simplified**

- Unit Manager can generate a shareable view of a subordinate's profile.
- Manager selects which sections to include (per-section control).
- Sensitive sections (contact info, risks, notes, documents) are excluded by default.
- Shared view is accessible via a generated link token.
- Shared view shows only the selected sections.

**Resourcing Request Workflow**

- Sales / Delivery Manager creates a request with: title, project name, required role, required skills, grade level, English level, expected compensation level, workload percentage, start date, duration, assigned Unit Manager, priority, and business reason.
- Request statuses: Draft, Submitted, In Review, Candidates Proposed, Approved, Rejected, Closed, Cancelled.
- Submitted requests appear in the Unit Manager's incoming request queue.

**Candidate Proposal Workflow**

- Unit Manager views incoming requests assigned to them.
- Unit Manager selects one or more internal candidates from their unit.
- Unit Manager can add one external candidate URL per request.
- Unit Manager attaches a fit summary and submits candidates for review.
- Internal candidates receive a generated shared profile link (safe sections by default).
- Candidate statuses: Proposed, Approved, Rejected, Withdrawn.

**Candidate Approval and Rejection**

- Sales / Delivery Manager opens request detail and reviews each proposed candidate.
- For each candidate, DM can either approve or reject.
- Rejection requires a written reason.
- Approval optionally allows a note.

**Assignment History**

- Each candidate proposal attempt is recorded with outcome and feedback.
- Assignment history is visible in the Unit Manager's Resourcing section.
- Assignment history is visible on the employee profile (separate section from project history).
- Approved assignments record: request title, proposed date, decision date, reviewer, and outcome.
- Rejected assignments record: all of the above plus rejection reason.

**Documents and IDP Metadata**

- Document records contain: name, type, uploaded by, upload date, visibility setting, and mock file name.
- Document types: Contract, CV, Certificate, IDP Document, Joining Interview Feedback, Performance Document, Other.
- Visibility settings: Manager Only, Employee Visible, Shareable, Sensitive.
- Unit Manager can view and add document records for subordinates.
- Employee can view own employee-visible documents and add certificate records.
- IDP reference field on profile links to an IDP document.

**Risks and Action Items**

- Risks: level, category, description, owner, due date, status, history.
- Risk levels: None, Low, Medium, High, Critical.
- Action items: title, description, assignee, owner, due date, priority, status.
- Unit Manager creates and manages both for subordinates.
- Employees can view their own action items.

**Mock Data**

- Minimum 500 seeded employees across 3 units.
- 10 seeded resourcing requests.
- 3 seeded custom lists with custom fields pre-configured.
- 20 seeded risks.
- 30 seeded action items.
- 1 named Unit Manager persona (demo user).
- 1 named Sales / Delivery Manager persona (demo user).
- 1 named Employee persona (demo user).
- Role switcher to change between the three personas without login.

---

### 7.2 Out of Scope

- Back-end implementation.
- Database or server-side persistence.
- Real authentication and session management (production authentication or authorization service).
- Real backend API or server.
- Real database.
- Real file upload and storage (production file storage).
- External system integrations (Jira, Confluence, ATS, HRIS).
- Mobile and tablet responsive implementation.
- Narrow viewport support and breakpoint-by-breakpoint responsive validation.
- Payroll and compensation history.
- Full HRIS feature parity.
- eSignature workflows.
- Admin permission configuration UI.
- Complex resource optimization algorithms.
- Advanced notification system (email, push).
- Complex audit and legal compliance features.
- Custom role creation.
- Approval of employee-uploaded documents.
- Automated project history creation from approved assignments.

---

### 7.3 Future Scope

The following items are reasonable next steps after the MVP is delivered but are not required now:

- Real authentication with role-based access control.
- Backend API and persistent database.
- Jira and Confluence integration for ticket and wiki sync.
- ATS integration for external candidate profiles.
- Automated email notifications for request status changes.
- Approval workflow for employee document uploads.
- Automatic project history creation from an approved resourcing assignment.
- Shared profile link expiry and revocation.
- Full custom permission editor for administrators.
- Advanced resource matching with scoring algorithms.
- Time-off and leave calendar integration.
- Compensation history and grade change tracking.

---

## 8. Key Business Entities

### 8.1 Person (Employee)

**Purpose:** The central data record for each employee. All other entities reference this record.

**Key Fields:**

- id, firstName, lastName, workEmail, personalEmail, workPhone, personalPhone
- emergencyContactName, emergencyContactPhone
- addressLine, city, country, dateOfBirth
- position, grade, unitId, managerId
- employmentType (FTE, Subcontractor)
- employmentStatus (Active, On Leave, Notice Period, Inactive)
- hireDate, workLocation
- englishLevel (A1 through C2)
- currentProjectStatus (Allocated, Partially Allocated, Bench, Booked, Unavailable)
- availabilityPercent
- riskLevel (None, Low, Medium, High, Critical)
- customFieldValues (map of custom field id to value)

**Key Relationships:**

- Belongs to one Unit.
- Managed by one Unit Manager.
- Has zero or more Skills, Risks, Action Items, Documents, Feedback Items, Scheduled Leave Items, Assignment History Items, Project History Items.
- Has zero or more Custom Field Values.

---

### 8.2 Unit

**Purpose:** Organizational group of employees managed by one Unit Manager.

**Key Fields:**

- id, name, managerId

**Key Relationships:**

- Has one Unit Manager (Person with manager role).
- Contains one or more Persons.

---

### 8.3 Skill

**Purpose:** Records a specific technical or professional capability of an employee.

**Key Fields:**

- id, personId, name, category, level (Beginner, Intermediate, Advanced, Expert), yearsExperience, lastUsedDate

**Key Relationships:**

- Belongs to one Person.

---

### 8.4 Project

**Purpose:** Records a project that an employee worked or is working on.

**Key Fields:**

- id, name, clientName, role, startDate, endDate, allocationPercent, status

**Key Relationships:**

- Referenced by one or more Persons via Project History Items.

---

### 8.5 Allocation

**Purpose:** Records the percentage of an employee's time assigned to a project at a given period.

**Key Fields:**

- id, personId, projectId, allocationPercent, startDate, endDate, role

**Key Relationships:**

- Belongs to one Person and one Project.
- Used to derive availability percentage.

---

### 8.6 Risk

**Purpose:** Records a retention or performance risk identified for an employee.

**Key Fields:**

- id, personId, level, category, description, ownerId, dueDate, status, createdAt, updatedAt

**Key Relationships:**

- Belongs to one Person.
- Owner is a Unit Manager (Person).

---

### 8.7 Action Item

**Purpose:** A task assigned by a manager to or about an employee.

**Key Fields:**

- id, personId, title, description, assigneeId, ownerId, dueDate, priority, status

**Key Relationships:**

- Belongs to one Person.
- Assignee and owner are Persons.

---

### 8.8 Custom Field

**Purpose:** A manager-defined data field that extends the employee profile for tracking purposes.

**Key Fields:**

- id, name, description, type (Text, Number, Date, Single Select, Boolean), options (for Single Select), createdByManagerId, isSensitive, isActive

**Key Relationships:**

- Created by one Unit Manager.
- Values stored per Person via Custom Field Values.

---

### 8.9 Custom List

**Purpose:** A manager-defined filtered view of employees with selected columns for operational tracking.

**Key Fields:**

- id, name, description, ownerManagerId, sharedWithManagerIds, employeeFilter, visibleColumns, filterableFields, defaultSort

**Key Relationships:**

- Owned by one Unit Manager.
- Shared with zero or more other Unit Managers (view-only).
- References Custom Fields as columns and filters.

---

### 8.10 Resourcing Request

**Purpose:** A formal request from a Sales or Delivery Manager for an engineer with specific qualifications.

**Key Fields:**

- id, title, requestCode, createdById, assignedUnitManagerId, projectName, clientName, requiredRole, requiredSkills, gradeLevel, englishLevel, expectedCompensationLevel, workloadPercent, startDate, endDate, durationText, priority (Low, Medium, High, Urgent), status, businessReason, createdAt, updatedAt

**Key Relationships:**

- Created by one Sales / Delivery Manager.
- Assigned to one Unit Manager.
- Contains zero or more Candidate Proposals.

---

### 8.11 Candidate Proposal

**Purpose:** Records the Unit Manager's proposal of a specific candidate (internal or external) for a resourcing request.

**Key Fields:**

- id, requestId, candidateType (Internal, External), employeeId (if internal), externalProfileUrl (if external), proposedById, proposedAt, status (Proposed, Approved, Rejected, Withdrawn), fitSummary, availabilityPercent, warnings, sharedProfileId (if internal), reviewedById, reviewedAt, rejectionReason, feedback

**Key Relationships:**

- Belongs to one Resourcing Request.
- References one Person (if internal) or one external URL.
- References one Shared Profile (if internal).

---

### 8.12 Assignment History Item

**Purpose:** A permanent record of each candidate proposal attempt and its outcome.

**Key Fields:**

- id, employeeId, requestId, proposalId, status, proposedAt, decisionAt, decisionById, feedback, convertedToProject (boolean, default false)

**Key Relationships:**

- Belongs to one Person (the proposed candidate).
- References one Resourcing Request and one Candidate Proposal.
- Visible on Person profile (separate from Project History).

---

### 8.13 Shared Profile

**Purpose:** A controlled, link-accessible view of selected sections of an employee profile for use by Sales / Delivery Managers during candidate review.

**Key Fields:**

- id, personId, createdById, allowedSections (list), token, isActive

**Key Relationships:**

- Created by a Unit Manager for one Person.
- Linked to one Candidate Proposal.

---

### 8.14 Document

**Purpose:** A metadata record representing a file associated with an employee (no real file stored in MVP).

**Key Fields:**

- id, personId, name, type (Contract, CV, Certificate, IDP Document, Joining Interview Feedback, Performance Document, Other), uploadedById, uploadedAt, visibility (Manager Only, Employee Visible, Shareable, Sensitive), mockFileName

**Key Relationships:**

- Belongs to one Person.
- Uploaded by one Person (manager or employee depending on type).

---

### 8.15 IDP (Individual Development Plan)

**Purpose:** A reference link or document record tracking the employee's current development plan status.

**Key Fields:**

- id, personId, documentReference, status (Not Started, In Progress, Completed), lastUpdatedAt

**Key Relationships:**

- Belongs to one Person.
- Referenced in the Documents tab via IDP Document type.

---

### 8.16 Feedback

**Purpose:** A written HR or performance observation entered by a manager about an employee. Distinct from resourcing rejection feedback (which lives on Candidate Proposal / Assignment History).

**Key Fields:**

- id, personId, authorId, type (HR Note, Performance, General), content, createdAt, visibility (Manager Only, Shareable)

**Key Relationships:**

- Belongs to one Person (the subject employee).
- Author is a Unit Manager (Person).

**Ownership and Visibility:**

- Created and owned by the Unit Manager for their direct subordinates.
- Visible only in the Managerial Profile view under the Feedbacks tab.
- Never shown in the Employee personal view.
- `visibility = Shareable` feedback may be included in a shared profile only if the manager explicitly selects the Feedbacks section when generating the shared view.
- Sensitive sections policy: Feedbacks are excluded from shared profiles by default (FR-PS-003).

---

### 8.17 Scheduled Leave

**Purpose:** Records a planned absence for an employee. Used to display current leave status on the managerial profile and to detect candidate availability conflicts during resourcing.

**Key Fields:**

- id, personId, leaveType (Annual, Sick, Parental, Other), startDate, endDate, status (Confirmed, Tentative), notes

**Key Relationships:**

- Belongs to one Person.
- Referenced by FR-CP-007 and BR-014 for leave-overlap detection during candidate proposal.

**Ownership and Visibility:**

- Created by the Unit Manager for their subordinates.
- Visible in the Managerial Profile Overview tab as a read-only list.
- Not shown in the Employee personal view.
- Not included in shared profiles by default (consistent with contact info exclusion policy).
- Available to the candidate proposal system for overlap detection against request start date and duration.

---

## 9. Core User Journeys

### 9.1 Unit Manager Journey

1. Unit Manager opens the app in Unit Manager role.
2. Dashboard loads with widgets: subordinate count, active risks, open action items, and active resourcing requests.
3. Manager reviews overdue action items directly on the dashboard.
4. Manager clicks on a subordinate name to open their profile.
5. Manager reviews profile sections: overview (including scheduled leaves), skills, risks, action items, feedbacks, documents, assignment history, and project history.
6. Manager returns to the dashboard and navigates to Resourcing > Incoming Requests.
7. Manager opens an assigned request and reviews requirements.
8. Manager views suggested internal candidates from their unit.
9. Manager selects one internal candidate and reviews availability, skills, and risk status.
10. Manager adds a fit summary.
11. Manager generates a shared profile for the candidate with default safe sections.
12. Manager optionally adds an external candidate URL.
13. Manager submits the candidates.
14. Request status changes to Candidates Proposed.

---

### 9.2 Sales / Delivery Manager Journey

1. Sales / DM opens the app in Sales / DM role.
2. Navigates to Resourcing > My Requests.
3. Clicks New Request.
4. Fills in request fields: title, project, role, required skills, grade, English level, compensation level, workload, start date, and duration.
5. Selects the assigned Unit Manager.
6. Submits the request.
7. Request status becomes Submitted.
8. Manager navigates back to My Requests and opens the request.
9. Once candidates are proposed, status shows Candidates Proposed.
10. Manager opens each candidate and reviews the shared profile or external URL.
11. Manager approves one candidate.
12. Manager rejects the other candidate and provides a written rejection reason.
13. Request status updates based on outcome.
14. Assignment history is recorded for both candidates.

---

### 9.3 Employee Journey

1. Employee opens the app in Employee role.
2. My Profile page loads with personal information in view mode.
3. Employee edits their personal phone number or personal email.
4. Employee saves. A confirmation message appears.
5. Employee navigates to My Action Items and reviews assigned tasks.
6. Employee updates IDP status.
7. Employee navigates to My Documents and IDP.
8. Employee adds a certificate metadata record (name and mock file name).
9. Employee saves. The certificate appears in the document list.

---

### 9.4 Shared Profile Journey

1. Sales / DM opens a request in Candidates Proposed status.
2. DM clicks on a proposed internal candidate.
3. The system provides a link to the shared profile.
4. DM opens the shared profile.
5. Shared profile displays only the sections the Unit Manager selected (e.g., name, position, grade, skills, English level, availability, project history).
6. Sensitive sections (contact info, risks, manager notes, documents) are not visible.
7. DM reviews the information and returns to the request to make an approval or rejection decision.

---

### 9.5 Main End-to-End Resourcing Journey

1. **Sales / DM creates a request.** Fills all required fields and assigns to a Unit Manager. Status becomes Submitted.
2. **Unit Manager receives the request.** Request appears in the Incoming Requests queue. Status is Submitted or In Review.
3. **Unit Manager selects an internal candidate.** Chooses from their unit's employees, reviews fit signals (availability, skills, risk, leave warnings).
4. **Unit Manager adds an external candidate URL.** Enters a URL to an external candidate profile.
5. **Unit Manager generates a shared profile.** Selects safe sections; sensitive sections remain excluded by default.
6. **Unit Manager submits the candidates.** Status becomes Candidates Proposed.
7. **Sales / DM reviews candidates.** Opens the request, views each candidate's shared profile or external URL.
8. **Sales / DM approves one candidate.** Clicks Approve. An optional note is allowed.
9. **Sales / DM rejects the other candidate.** Clicks Reject. A written reason is required.
10. **Assignment history is updated.** Both approved and rejected proposals are recorded with all relevant data.
11. **Employee profile shows assignment history.** The approved internal candidate's profile shows the assignment history item. This item is in the Assignment History section, separate from the Project History section.

---

## 10. Functional Requirements

### 10.1 Role Switcher

| ID        | Requirement                                                                                                                                                           |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-RS-001 | The application must provide a role switcher that allows the user to select between Unit Manager, Sales / Delivery Manager, and Employee without real authentication. |
| FR-RS-002 | Switching roles must immediately change the visible navigation, available actions, and accessible data.                                                               |
| FR-RS-003 | The Unit Manager role must default to a named seeded persona.                                                                                                         |
| FR-RS-004 | The Sales / DM role must default to a named seeded persona.                                                                                                           |
| FR-RS-005 | The Employee role must default to a named seeded persona.                                                                                                             |

---

### 10.2 Manager Dashboard

| ID        | Requirement                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| FR-DB-001 | The dashboard must display a subordinate headcount widget showing the total number of direct and indirect reports.               |
| FR-DB-002 | The dashboard must display an active risks widget showing the count of open risks for all subordinates.                          |
| FR-DB-003 | The dashboard must display an open action items widget showing the count of open action items for all subordinates.              |
| FR-DB-004 | The dashboard must display an active resourcing requests widget showing the count of requests currently assigned to the manager. |
| FR-DB-005 | The dashboard must display a list of the manager's own open action items sorted by due date in ascending order.                  |
| FR-DB-006 | Action items with a due date in the past must be visually highlighted as overdue.                                                |
| FR-DB-007 | The dashboard must provide quick navigation links to: Subordinates, Custom Lists, Resourcing, and Risks.                         |

---

### 10.3 Subordinates List

| ID        | Requirement                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| FR-SL-001 | The subordinates list must display only employees who report to the currently selected Unit Manager.                 |
| FR-SL-002 | The table must include the following columns: full name, position, grade, current project or status, and risk level. |
| FR-SL-003 | The user must be able to sort the table by any column.                                                               |
| FR-SL-004 | The user must be able to filter the list by position, grade, status, and risk level.                                 |
| FR-SL-005 | Clicking any row must open the full Employee Profile in managerial view.                                             |
| FR-SL-006 | The list must show an empty state message when no subordinates match the active filter.                              |

---

### 10.4 Employee Profile — Managerial View

| ID        | Requirement                                                                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-EP-001 | The profile must display a header with: photo placeholder or initials, full name, position, grade, unit, manager, current status, availability percentage, and risk badge.                                |
| FR-EP-002 | The profile must provide the following tabs: Overview, Job and Skills, Risks and Action Items, Feedbacks, Resourcing History, Project History, and Documents and IDP.                                     |
| FR-EP-003 | The Overview tab must show: basic info, contact info, employment type, English level, current status, summary counts for risks and open action items, and a list of upcoming and recent scheduled leaves. |
| FR-EP-004 | The Job and Skills tab must show: position, grade, unit, manager, hire date, employment status, work location, English level, and a skills list.                                                          |
| FR-EP-005 | The Risks and Action Items tab must show: current risk level, risk history, risk notes, and all open and closed action items.                                                                             |
| FR-EP-006 | The Resourcing History tab must show: all assignment attempts with request name, proposed date, proposed by, reviewed by, decision, and feedback.                                                         |
| FR-EP-007 | The Project History tab must show: all projects the person worked on with project name, role, start date, end date, and allocation percentage.                                                            |
| FR-EP-008 | Assignment history and project history must never be displayed in the same tab or mixed in the same list.                                                                                                 |
| FR-EP-009 | The Documents and IDP tab must show: a list of document records with name, type, visibility, and upload date, plus the IDP status.                                                                        |
| FR-EP-010 | A custom fields section must display all custom field values for the employee.                                                                                                                            |
| FR-EP-011 | HR and management notes must only be visible in the managerial view and must not appear in the Employee personal view.                                                                                    |
| FR-EP-012 | The Unit Manager must be able to edit: English level, IDP reference, skills, management notes, and custom field values for their direct subordinates.                                                     |
| FR-EP-013 | The Feedbacks tab must display a chronological list of feedback entries for the employee, each showing: type, content, author name, and date.                                                             |
| FR-EP-014 | The Unit Manager must be able to add a new feedback entry for a subordinate from the Feedbacks tab. The entry must include type (required) and content (required).                                        |

---

### 10.5 Employee Profile — Personal View

| ID        | Requirement                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------ |
| FR-PV-001 | The employee personal view must show only the employee's own profile.                            |
| FR-PV-002 | The employee must be able to edit: personal phone, personal email, and address.                  |
| FR-PV-003 | The employee must be able to view their own action items.                                        |
| FR-PV-004 | The employee must be able to update their IDP status.                                            |
| FR-PV-005 | The employee must be able to add a certificate document record with a name and a mock file name. |
| FR-PV-006 | The employee must not see manager-only notes, risk records, or assignment history.               |
| FR-PV-007 | Changes saved by the employee must be confirmed with a visible success message.                  |

---

### 10.6 Custom Lists

| ID        | Requirement                                                                                                                                                                                                                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CL-001 | The Unit Manager must be able to define custom fields with the following types: Text, Number, Date, Single Select, and Boolean.                                                                                                                                                   |
| FR-CL-002 | The Unit Manager must be able to create a named custom list by selecting an employee filter, choosing which fields appear as columns, and designating each custom field as a filter, a column, or both. Any custom field may serve as a filter, a column, or both simultaneously. |
| FR-CL-003 | Each saved custom list must appear as a separate tab on the Custom Lists page.                                                                                                                                                                                                    |
| FR-CL-004 | Custom field columns in a custom list must be inline-editable. Clicking a cell enters edit mode.                                                                                                                                                                                  |
| FR-CL-005 | Saving a cell edit in a custom list must update the corresponding custom field value on the employee profile.                                                                                                                                                                     |
| FR-CL-006 | System field columns (name, position, grade, status) must be read-only in custom list tables.                                                                                                                                                                                     |
| FR-CL-007 | Boolean fields must display as a checkbox or toggle in edit mode.                                                                                                                                                                                                                 |
| FR-CL-008 | Single select fields must display a dropdown in edit mode showing only configured options.                                                                                                                                                                                        |
| FR-CL-009 | Date fields must use one consistent date format throughout the application.                                                                                                                                                                                                       |
| FR-CL-010 | The Unit Manager must be able to share a custom list with selected other managers.                                                                                                                                                                                                |
| FR-CL-011 | A manager receiving a shared list must be able to view the list but cannot change its structure.                                                                                                                                                                                  |
| FR-CL-012 | The three seeded demo lists (Bench, Booked, Needs Conversation) must be pre-loaded and immediately usable.                                                                                                                                                                        |
| FR-CL-013 | An empty custom list must display a useful empty state message.                                                                                                                                                                                                                   |

---

### 10.7 Profile Sharing

| ID        | Requirement                                                                                                                                                                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PS-001 | The Unit Manager must be able to generate a shared profile view for any of their direct subordinates.                                                                                                                                                |
| FR-PS-002 | The shared profile generation screen must allow the manager to select which sections to include, with per-section control.                                                                                                                           |
| FR-PS-003 | Sensitive sections must be excluded by default when a shared profile is generated. Sensitive sections include: contact info, emergency contact, risks, manager notes, HR notes, feedbacks, scheduled leaves, documents, and sensitive custom fields. |
| FR-PS-004 | The generated shared profile must be accessible via a unique link token.                                                                                                                                                                             |
| FR-PS-005 | The shared profile view must display only the sections the manager explicitly selected.                                                                                                                                                              |
| FR-PS-006 | A shared profile must include by default: name, position, grade, skills, English level, availability, and project history.                                                                                                                           |
| FR-PS-007 | Opening a shared profile link must not require login.                                                                                                                                                                                                |

---

### 10.8 Resourcing Request Creation

| ID        | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-RR-001 | The Sales / Delivery Manager must be able to create a new resourcing request.                                                                                                                                                                                                                                                                                                                                                                                 |
| FR-RR-002 | The request form must include: title (required), project name (required), client name (optional), required role (required), required skills (required, multi-value), grade level (required), English level (required), expected compensation level (required), workload percentage (required), start date (required), duration or end date (required), assigned Unit Manager (required), priority (required, default Medium), and business reason (optional). |
| FR-RR-003 | Submitting the form must change the request status to Submitted.                                                                                                                                                                                                                                                                                                                                                                                              |
| FR-RR-004 | A submitted request must immediately appear in the assigned Unit Manager's Incoming Requests queue.                                                                                                                                                                                                                                                                                                                                                           |
| FR-RR-005 | The Sales / DM must be able to see all requests they created in My Requests.                                                                                                                                                                                                                                                                                                                                                                                  |
| FR-RR-006 | The Sales / DM must be able to cancel a Draft or Submitted request.                                                                                                                                                                                                                                                                                                                                                                                           |
| FR-RR-007 | The form must block submission if any required field is empty.                                                                                                                                                                                                                                                                                                                                                                                                |

---

### 10.9 Candidate Proposal

| ID        | Requirement                                                                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CP-001 | The Unit Manager must be able to open an assigned request and view its requirements.                                                                           |
| FR-CP-002 | The Unit Manager must be able to browse employees from their unit and see availability, skills, grade, English level, risk level, and current status for each. |
| FR-CP-003 | The Unit Manager must be able to select one or more internal employees as candidates for the request.                                                          |
| FR-CP-004 | The Unit Manager must be able to add one external candidate entry by providing a valid URL.                                                                    |
| FR-CP-005 | The Unit Manager must be able to add a free-text fit summary for each proposed internal candidate.                                                             |
| FR-CP-006 | The system must display a warning when a candidate's current allocation plus the requested workload would exceed 100 percent.                                  |
| FR-CP-007 | The system must display a warning when a candidate has a ScheduledLeave record whose date range overlaps the request start date or duration period.            |
| FR-CP-008 | The system must display a warning when a candidate has a risk level of High or Critical.                                                                       |
| FR-CP-009 | Warnings must be visible to the Unit Manager but must not prevent proposal submission.                                                                         |
| FR-CP-010 | The Unit Manager must be able to generate a shared profile for each internal candidate before submitting.                                                      |
| FR-CP-011 | Submitting the candidates must change the request status to Candidates Proposed.                                                                               |
| FR-CP-012 | The Unit Manager must be able to withdraw a proposed candidate before the DM has made a decision.                                                              |

---

### 10.10 Candidate Review and Decision

| ID        | Requirement                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| FR-CD-001 | The Sales / DM must be able to open a request in Candidates Proposed status and see all proposed candidates.       |
| FR-CD-002 | Each proposed internal candidate must show a link to the shared profile.                                           |
| FR-CD-003 | Each proposed external candidate must show the URL provided by the Unit Manager.                                   |
| FR-CD-004 | The Sales / DM must be able to approve one candidate per request in MVP.                                           |
| FR-CD-005 | Approving a candidate must change the candidate status to Approved and update the request status to Approved.      |
| FR-CD-006 | The Sales / DM must be able to reject a candidate by providing a written rejection reason.                         |
| FR-CD-007 | The rejection reason field must be required when rejecting. The system must block rejection if the field is empty. |
| FR-CD-008 | Rejecting all remaining candidates with no approved candidate must change the request status to Rejected.          |
| FR-CD-009 | An optional note may be provided on approval.                                                                      |

---

### 10.11 Assignment History

| ID        | Requirement                                                                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-AH-001 | Every candidate proposal attempt must create an assignment history record at the time the decision is made.                                                                         |
| FR-AH-002 | Each assignment history record must include: request title, candidate type, proposed date, proposed by, decision date, decision by, final status, and feedback or rejection reason. |
| FR-AH-003 | Assignment history must be visible on the Employee Profile under a dedicated Resourcing History tab.                                                                                |
| FR-AH-004 | Assignment history must also be visible in the Unit Manager's Resourcing section under Assignments.                                                                                 |
| FR-AH-005 | Assignment history must never be displayed in the same view as project history.                                                                                                     |
| FR-AH-006 | Assignment history must be read-only for all roles.                                                                                                                                 |

---

## 11. Business Rules

| ID     | Rule                                                                                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-001 | A Unit Manager can only propose candidates from their own unit.                                                                                                                             |
| BR-002 | A Sales / DM cannot browse employee profiles directly. They may only view a shared profile provided by a Unit Manager or an external URL.                                                   |
| BR-003 | An Employee can only view and edit their own profile.                                                                                                                                       |
| BR-004 | Rejection of a candidate always requires a written reason.                                                                                                                                  |
| BR-005 | Sensitive profile sections are excluded from shared profiles by default and must be explicitly enabled.                                                                                     |
| BR-006 | Assignment history and project history are always separate. A successful assignment does not automatically create a project history entry in the MVP.                                       |
| BR-007 | Custom list inline editing applies only to custom field columns. System fields are always read-only in lists.                                                                               |
| BR-008 | A manager who receives a shared custom list can view the list but cannot change its structure or settings.                                                                                  |
| BR-009 | Shared managers of a custom list can only edit custom field values for employees they manage directly.                                                                                      |
| BR-010 | A request in Draft or Submitted status can be cancelled by the creator.                                                                                                                     |
| BR-011 | A candidate in Proposed status can be withdrawn by the proposing Unit Manager before a decision is made.                                                                                    |
| BR-012 | A candidate with a High or Critical risk level may be proposed but must trigger a visible warning.                                                                                          |
| BR-013 | A candidate whose allocation plus the requested workload would exceed 100 percent must trigger a visible warning.                                                                           |
| BR-014 | A candidate with a ScheduledLeave record whose date range overlaps the request period must trigger a visible warning. The ScheduledLeave entity is the authoritative source for this check. |
| BR-015 | External candidates require a valid URL. The URL must be validated as a non-empty, properly formatted URL.                                                                                  |
| BR-016 | Feedback entries on the managerial profile are visible only to the Unit Manager. They are excluded from shared profiles by default and are never shown in the Employee personal view.       |

---

## 12. Assumptions

| ID     | Assumption                                                                                                                         |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| AS-001 | All data in the MVP is seeded or mocked. No real user data is entered.                                                             |
| AS-002 | Authentication is simulated through a role switcher. No real login is implemented.                                                 |
| AS-003 | The Unit Manager persona sees only their direct and indirect reports.                                                              |
| AS-004 | A Sales / DM cannot access employee profiles outside of the shared profile mechanism.                                              |
| AS-005 | An Employee can only access their own profile.                                                                                     |
| AS-006 | Shared profile links do not expire in the MVP. An isActive flag is sufficient.                                                     |
| AS-007 | Availability percentage can be seeded directly or calculated from mock allocation records. Either approach is acceptable.          |
| AS-008 | Document upload is simulated by storing a mock file name. No actual file is stored.                                                |
| AS-009 | One approved candidate is sufficient to fulfill a request in the MVP. Multiple approvals are not supported.                        |
| AS-010 | The Unit Manager cannot act as a Sales / DM and approve their own candidate proposals.                                             |
| AS-011 | The employee cannot see their own assignment history in the MVP.                                                                   |
| AS-012 | Rejection feedback is visible to the Unit Manager and Sales / DM only. It is not shown to the employee.                            |
| AS-013 | Risk records and manager notes are not included in shared profiles unless explicitly selected.                                     |
| AS-014 | The MVP runs as a frontend-only web application in a desktop browser.                                                              |
| AS-015 | Mock data is acceptable for all demo flows; local client-side state may supplement seeded data.                                    |
| AS-016 | Desktop Chrome or another modern desktop browser is the target validation environment; suggested minimum viewport width is 1280px. |

---

## 13. Acceptance Criteria

### Role Switcher

| ID        | Criterion                                                                                   |
| --------- | ------------------------------------------------------------------------------------------- |
| AC-RS-001 | When the user selects Unit Manager, the dashboard page loads with manager-specific content. |
| AC-RS-002 | When the user selects Sales / Delivery Manager, the resourcing page with My Requests loads. |
| AC-RS-003 | When the user selects Employee, the My Profile page loads.                                  |
| AC-RS-004 | Switching roles changes all visible navigation and content without a page reload.           |

### Dashboard

| ID        | Criterion                                                                                    |
| --------- | -------------------------------------------------------------------------------------------- |
| AC-DB-001 | The dashboard shows four correctly labeled widgets with non-zero seeded values.              |
| AC-DB-002 | The action items list is sorted by due date ascending.                                       |
| AC-DB-003 | At least one overdue action item is visually highlighted differently from non-overdue items. |
| AC-DB-004 | Each navigation link on the dashboard opens the correct page.                                |

### Subordinates List

| ID        | Criterion                                                                             |
| --------- | ------------------------------------------------------------------------------------- |
| AC-SL-001 | The list shows only employees belonging to the selected Unit Manager's unit.          |
| AC-SL-002 | All five required columns are visible: name, position, grade, status, and risk level. |
| AC-SL-003 | Sorting by name changes the row order correctly.                                      |
| AC-SL-004 | Filtering by risk level returns only matching employees.                              |
| AC-SL-005 | Clicking a row opens the employee profile for that person.                            |

### Employee Profile

| ID        | Criterion                                                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-EP-001 | The profile header shows name, position, grade, unit, availability, and risk badge.                                                             |
| AC-EP-002 | All required tabs are present and display relevant content.                                                                                     |
| AC-EP-003 | The Resourcing History tab and Project History tab are separate and show different data.                                                        |
| AC-EP-004 | Manager-only notes are not visible in the Employee personal view.                                                                               |
| AC-EP-005 | Editing a custom field value in the profile saves and displays the updated value after save.                                                    |
| AC-EP-006 | The Feedbacks tab shows at least two seeded feedback entries, each displaying type, content, author name, and date.                             |
| AC-EP-007 | The Feedbacks tab has an "Add Feedback" action that, when used, adds the new entry to the list immediately without a page reload.               |
| AC-EP-008 | The Overview tab shows a Scheduled Leaves section with at least one seeded leave entry displaying leave type, start date, end date, and status. |

### Custom Lists

| ID        | Criterion                                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AC-CL-001 | Three seeded custom list tabs are present on the Custom Lists page.                                                                                                                        |
| AC-CL-002 | Clicking a cell in a custom field column enters inline edit mode.                                                                                                                          |
| AC-CL-003 | Saving an inline edit updates the custom field value visible on the employee profile.                                                                                                      |
| AC-CL-004 | System field columns cannot be edited in the list.                                                                                                                                         |
| AC-CL-005 | A shared list appears in the receiving manager's Custom Lists tabs.                                                                                                                        |
| AC-CL-006 | When creating or editing a custom list, the manager can designate each custom field as a filter, a column, or both, and the list respects this designation when rendering filter controls. |

### Profile Sharing

| ID        | Criterion                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------ |
| AC-PS-001 | The Unit Manager can open a Generate Shared Profile action from the employee profile.            |
| AC-PS-002 | The generation screen shows per-section checkboxes. Sensitive sections are unchecked by default. |
| AC-PS-003 | The generated link opens a view showing only the selected sections.                              |
| AC-PS-004 | Sensitive sections are not visible in the shared profile unless explicitly enabled.              |

### Resourcing Request

| ID        | Criterion                                                                                |
| --------- | ---------------------------------------------------------------------------------------- |
| AC-RR-001 | The Sales / DM can complete and submit a request form with all required fields.          |
| AC-RR-002 | Submitting the form changes the request status to Submitted.                             |
| AC-RR-003 | The submitted request appears immediately in the Unit Manager's Incoming Requests queue. |
| AC-RR-004 | Attempting to submit with a missing required field shows a validation error message.     |

### Candidate Proposal

| ID        | Criterion                                                                         |
| --------- | --------------------------------------------------------------------------------- |
| AC-CP-001 | The Unit Manager can select at least one internal candidate from their unit.      |
| AC-CP-002 | A warning appears when the candidate's total allocation would exceed 100 percent. |
| AC-CP-003 | The Unit Manager can add an external candidate URL to the same request.           |
| AC-CP-004 | Submitting candidates changes the request status to Candidates Proposed.          |

### Candidate Review

| ID        | Criterion                                                                                                  |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| AC-CD-001 | The Sales / DM sees each proposed candidate with a shared profile link or external URL.                    |
| AC-CD-002 | Approving a candidate changes the candidate status to Approved and updates the request status.             |
| AC-CD-003 | Attempting to reject a candidate without entering a reason shows a validation error and blocks submission. |
| AC-CD-004 | Rejecting a candidate with a reason changes the candidate status to Rejected and records the reason.       |

### Assignment History

| ID        | Criterion                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------ |
| AC-AH-001 | After a decision, an assignment history record appears on the employee's Resourcing History tab. |
| AC-AH-002 | The assignment history record shows the correct request title, status, and feedback.             |
| AC-AH-003 | The assignment history section and project history section are separate.                         |
| AC-AH-004 | Assignment history records are read-only. No edit action is available.                           |

### QA Validation Scope

QA must not block MVP acceptance on back-end persistence, real integrations, production authentication, production file storage, or mobile/tablet/narrow-viewport responsive behavior. Validate the MVP for **desktop browser usage only** at or above 1280px viewport width unless a specific check states otherwise.

---

## 14. Demo Scenarios

### Scenario 1: Unit Manager Dashboard

**Goal:** Show operational overview.
**Steps:** Switch to Unit Manager → View dashboard widgets → Identify overdue action items → Navigate to Subordinates.

### Scenario 2: Find a Person and View Profile

**Goal:** Show people management.
**Steps:** Open Subordinates → Filter or sort → Click employee row → Review all profile tabs.

### Scenario 3: Custom List Inline Edit

**Goal:** Show manager-owned tracking.
**Steps:** Open Custom Lists → Select Bench tab → Edit Bench Status inline → Open employee profile → Confirm the value changed.

### Scenario 4: Create a Resourcing Request

**Goal:** Show DM request creation.
**Steps:** Switch to DM → Open Resourcing → New Request → Fill fields → Submit → Confirm status is Submitted.

### Scenario 5: Propose a Candidate

**Goal:** Show Unit Manager fulfillment.
**Steps:** Switch to Unit Manager → Incoming Requests → Open request → Select candidate → Review warnings → Generate shared profile → Add external URL → Submit.

### Scenario 6: Approve and Reject Candidates

**Goal:** Show decision and history.
**Steps:** Switch to DM → Open request → Open shared profile → Approve one candidate → Reject other with feedback → Switch to Unit Manager → Open employee profile → Verify assignment history.

### Scenario 7: Employee Self-Service

**Goal:** Show employee profile access.
**Steps:** Switch to Employee → My Profile → Edit phone → Update IDP status → Add certificate → Confirm save.

---

## 15. Confirmed Decisions

The following decisions were finalised during BRD remediation (2026-06-27). See `docs/requirements/DECISION-LOG.md` for full rationale. No further stakeholder input is required for implementation.

| Decision                                                               | Confirmed Value                                                                | Decision Log Ref |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------- |
| Can one request approve multiple candidates?                           | No. One approval fulfills the request in MVP.                                  | D-1              |
| Can the Unit Manager edit request details?                             | No. The Unit Manager can only add proposals.                                   | —                |
| Can the Sales / DM reopen a rejected request?                          | No. Create a new request.                                                      | —                |
| Should shared profiles expire?                                         | No expiry in MVP. `isActive` flag only.                                        | —                |
| Should rejection feedback be visible to the employee?                  | No. Manager and DM only.                                                       | —                |
| Should the employee see their own assignment history?                  | No in MVP.                                                                     | —                |
| Should risks be shareable in a shared profile?                         | Yes, but excluded by default.                                                  | —                |
| Should custom fields be global or manager-owned?                       | Manager-owned for MVP.                                                         | —                |
| Should employee-uploaded certificates require manager approval?        | No. Mark as Employee Uploaded automatically.                                   | —                |
| Should approval update the employee's allocation record?               | No. Record assignment history only.                                            | D-3              |
| Does a successful assignment create a project history entry?           | No. `convertedToProject` flag only. Seeded data only.                          | D-3              |
| Are Skills in MVP scope?                                               | Yes. Skill entity, Job & Skills tab, required skills on requests are in scope. | A-2              |
| Are candidate fit warnings (allocation, leave overlap, risk) in scope? | Yes. FR-CP-006–008 and BR-012–014 are confirmed scope.                         | A-3              |
| Are Feedbacks in MVP scope?                                            | Yes. Feedback entity, Feedbacks tab on profile, manager can add entries.       | G-1              |
| Are Scheduled Leaves in MVP scope?                                     | Yes. ScheduledLeave entity, Overview tab section, leave-overlap warning.       | G-2              |
| Does the custom list builder support filter/column/both fields?        | Yes. FR-CL-002 updated to require this capability.                             | G-3              |

---

_End of Document_
