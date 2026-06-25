# Software Requirements Specification

# Phase 1 - Foundation

## 1. Document Control

| Field                | Value                                                   |
| -------------------- | ------------------------------------------------------- |
| Product              | People Management & Resourcing MVP                      |
| Phase                | Phase 1 - Foundation                                    |
| Document type        | Software Requirements Specification                     |
| Status               | Draft for implementation                                |
| Implementation owner | Volodymyr                                               |
| QA owner             | Ivan                                                    |
| Product / BA owner   | Carlos                                                  |
| Source BRD           | `docs/requirements/# Business Requirements Document.md` |
| Phase plan           | `.planning/phases/phase-1-foundation/PLAN.md`           |
| Phase validation     | `.planning/phases/phase-1-foundation/VALIDATION.md`     |

## 2. Purpose

This SRS translates the BRD and Phase 1 plan into implementation-ready software requirements for the foundation increment. Phase 1 must establish the React SPA shell, role switcher, role-aware routing, app providers, minimal shared domain types, and mock data foundation that later phases can extend without rework.

Phase 1 is not expected to deliver full dashboard widgets, subordinates tables, employee profile tabs, resourcing workflows, custom lists, profile sharing, assignment history, or complete 500+ employee seed data.

## 3. Source Inputs

| Source                                           | Used for                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| BRD sections 3-7                                 | Product goal, scope, roles, frontend-only constraints              |
| BRD section 8                                    | Core business entities and field direction                         |
| BRD FR-RS-001 through FR-RS-005                  | Role switcher behavior and seeded personas                         |
| BRD BR-001 through BR-003                        | Role-based data access constraints to preserve in foundation       |
| BRD AS-001 through AS-005, AS-014 through AS-016 | Mock data, simulated auth, desktop target                          |
| BRD AC-RS-001 through AC-RS-004                  | Role switcher acceptance criteria                                  |
| `.planning/ROADMAP.md`                           | Phase sequencing and later-phase dependencies                      |
| Phase 1 `PLAN.md`                                | In-scope deliverables and target locations                         |
| Phase 1 `VALIDATION.md`                          | QA checks and definition of done                                   |
| `docs/architecture/*.md`                         | Folder structure, page/component rules, theme, routing conventions |
| `docs/architecture/shared-ui.md`                 | Shared primitive ownership and interactive control requirements    |

## 4. Phase Objective

Establish a desktop-first frontend foundation where:

- The application runs as a React + TypeScript + Vite SPA.
- The app has global providers for TanStack Query and mocked server-like data.
- The active role and active persona are managed through client-side state.
- Users can switch between Unit Manager, Sales / Delivery Manager, and Employee without login.
- Switching role immediately updates route, visible navigation, visible page content, and accessible data scope.
- Phase 2 through Phase 5 can add real feature screens on top of stable routes, types, shared UI primitives, and mock data boundaries.

## 5. Scope

### 5.1 In Scope

1. App provider composition for TanStack Query and app-level state.
2. Zustand store for active role and active persona.
3. Role switcher visible in the application header.
4. Shared UI primitive support for the role switcher when a generic control is needed.
5. Role-aware navigation in the application layout.
6. Route helpers in `src/app/routes.ts`.
7. Route registration in `src/app/router.tsx`.
8. Role landing routes:
   - Unit Manager: `/dashboard`
   - Sales / Delivery Manager: `/resourcing/requests`
   - Employee: `/my-profile`
9. Redirect behavior for `/`, unknown routes, and wrong-role direct routes.
10. Placeholder route pages for the three role landing routes.
11. Minimal shared domain types for Phase 1.
12. Mock data foundation with seeded personas, units, people, skills, and minimal resourcing request data.
13. Typed client/query access for personas and other Phase 1 mock data needed by the layout/pages.
14. Loading, empty, and error states wherever Phase 1 UI renders async data.
15. Desktop browser validation at 1280px or wider.
16. Handoff notes in `.planning/STATE.md` after implementation.

### 5.2 Out of Scope

The following must not be implemented as part of Phase 1 unless explicitly reprioritized:

- Manager dashboard widgets and manager action item list.
- Subordinates table.
- Employee profile tabs and editable profile forms.
- Resourcing request creation, candidate proposal, approval, rejection, and assignment history.
- Custom fields, custom lists, and list sharing UI.
- Profile sharing generation or public shared profile views.
- Real authentication or production authorization.
- Backend application, database, server persistence, ORM, or server-only framework.
- Real file upload or file storage.
- External integrations.
- Full 500+ employee seed data.
- Mobile, tablet, or narrow viewport validation.
- New npm dependencies beyond `package.json`.

## 6. Users And Personas

### 6.1 Supported Roles

| Role               | BRD label                | Phase 1 default landing route |
| ------------------ | ------------------------ | ----------------------------- |
| `unit-manager`     | Unit Manager             | `/dashboard`                  |
| `delivery-manager` | Sales / Delivery Manager | `/resourcing/requests`        |
| `employee`         | Employee                 | `/my-profile`                 |

### 6.2 Seeded Personas

Phase 1 must include exactly one named default persona for each supported role. Carlos has not yet confirmed final names, so implementation may use clearly marked placeholder names until product confirmation.

| Role                     | Required persona record      | Name requirement              |
| ------------------------ | ---------------------------- | ----------------------------- |
| Unit Manager             | One default UM persona       | Named, non-empty display name |
| Sales / Delivery Manager | One default DM persona       | Named, non-empty display name |
| Employee                 | One default Employee persona | Named, non-empty display name |

Persona IDs must be stable string IDs, not random values generated at runtime.

### 6.3 Persona Switching Rules

- Selecting a role must also select that role's default persona.
- Phase 1 supports one persona per role; the store and data model should allow additional personas later.
- The selected persona must survive ordinary in-app navigation during the same browser session.
- Persistence across browser reload is optional for Phase 1. If implemented, it must be local client-side only.

## 7. Functional Requirements

### 7.1 App Providers

| ID         | Requirement                                                                                                   | Source            |
| ---------- | ------------------------------------------------------------------------------------------------------------- | ----------------- |
| SRS-F1-001 | The app shall wrap the router with an app provider composition that includes `QueryClientProvider`.           | Phase plan task 6 |
| SRS-F1-002 | Query client setup shall live in `src/lib/query/` or `src/app/providers/` according to architecture docs.     | Architecture      |
| SRS-F1-003 | Provider setup shall not introduce backend services, production authentication, or server-side persistence.   | AS-001, AS-014    |
| SRS-F1-004 | Query defaults shall be suitable for mocked data and must avoid noisy retry loops for expected mock failures. | QA validation     |
| SRS-F1-005 | App providers shall be composed in a reusable `AppProviders` module or equivalent app-level provider wrapper. | Architecture      |

### 7.2 Role Store

| ID         | Requirement                                                                                               | Source                   |
| ---------- | --------------------------------------------------------------------------------------------------------- | ------------------------ |
| SRS-F1-010 | The app shall provide a Zustand store for `activeRole`, `activePersonaId`, and role switch actions.       | Phase plan task 2        |
| SRS-F1-011 | The store shall initialize to Unit Manager and the default UM persona.                                    | FR-RS-003, AC-RS-001     |
| SRS-F1-012 | The store shall expose an action that switches to Unit Manager, Sales / Delivery Manager, or Employee.    | FR-RS-001                |
| SRS-F1-013 | Switching role shall update the active persona to the default persona for that role.                      | FR-RS-003 through 005    |
| SRS-F1-014 | The store shall not hold server-like data such as people lists, requests, documents, or action items.     | Architecture             |
| SRS-F1-015 | The role store shall live in `src/store/role-store.ts` unless a more specific documented location exists. | Phase plan, Architecture |

### 7.3 Role Switcher

| ID         | Requirement                                                                                                   | Source                  |
| ---------- | ------------------------------------------------------------------------------------------------------------- | ----------------------- |
| SRS-F1-020 | The app header shall include a role switcher visible on all app-shell routes.                                 | FR-RS-001               |
| SRS-F1-021 | The switcher shall expose exactly three choices in Phase 1: Unit Manager, Sales / Delivery Manager, Employee. | FR-RS-001               |
| SRS-F1-022 | Selecting a role shall update visible navigation, available actions, route, and data scope without reload.    | FR-RS-002, AC-RS-004    |
| SRS-F1-023 | Selecting Unit Manager shall navigate to `/dashboard`.                                                        | AC-RS-001               |
| SRS-F1-024 | Selecting Sales / Delivery Manager shall navigate to `/resourcing/requests`.                                  | AC-RS-002               |
| SRS-F1-025 | Selecting Employee shall navigate to `/my-profile`.                                                           | AC-RS-003               |
| SRS-F1-026 | The switcher shall have an accessible label or visible text label.                                            | Validation #19          |
| SRS-F1-027 | The switcher shall be keyboard operable and show a visible focus state.                                       | Validation #18, #19     |
| SRS-F1-028 | The domain-aware role switcher component shall live under `src/features/roles/components/role-switcher/`.     | Architecture, shared UI |
| SRS-F1-029 | If implemented as a dropdown/select, the generic select primitive shall live in `src/shared/ui/select/`.      | `shared-ui.md`          |

### 7.4 Role-Aware Navigation

| ID         | Requirement                                                                                          | Source                |
| ---------- | ---------------------------------------------------------------------------------------------------- | --------------------- |
| SRS-F1-030 | The app layout shall render navigation items based on `activeRole`.                                  | FR-RS-002             |
| SRS-F1-031 | Unit Manager navigation shall include Dashboard as the Phase 1 primary route.                        | AC-RS-001             |
| SRS-F1-032 | Sales / Delivery Manager navigation shall include My Requests or Resourcing Requests.                | AC-RS-002             |
| SRS-F1-033 | Employee navigation shall include My Profile as the Phase 1 primary route.                           | AC-RS-003             |
| SRS-F1-034 | Employee navigation shall not show Unit Manager-only or Sales / DM-only links.                       | BR-003, Validation #6 |
| SRS-F1-035 | Sales / DM navigation shall not expose direct employee browsing links.                               | BR-002                |
| SRS-F1-036 | Navigation shall not include active links to deferred routes unless they have valid placeholders.    | Phase scope           |
| SRS-F1-037 | Navigation links shall use route helper functions, not hard-coded app paths.                         | Routing rules         |
| SRS-F1-038 | Navigation shall keep the existing header pattern unless implementation needs a small layout update. | Phase plan task 9     |

### 7.5 Routing

| ID         | Requirement                                                                                          | Source         |
| ---------- | ---------------------------------------------------------------------------------------------------- | -------------- |
| SRS-F1-040 | All route path helper functions shall be defined in `src/app/routes.ts`.                             | Routing rules  |
| SRS-F1-041 | Routes shall be registered only in `src/app/router.tsx`.                                             | Routing rules  |
| SRS-F1-042 | `getDashboardPagePath()` shall return `/dashboard`.                                                  | Phase plan     |
| SRS-F1-043 | `getResourcingRequestsPagePath()` shall return `/resourcing/requests`.                               | Phase plan     |
| SRS-F1-044 | `getMyProfilePagePath()` shall return `/my-profile`.                                                 | Phase plan     |
| SRS-F1-045 | The root route `/` shall redirect to the current role landing route.                                 | Validation #7  |
| SRS-F1-046 | Unknown routes shall redirect to the current role landing route or another documented valid route.   | Validation #8  |
| SRS-F1-047 | Direct navigation to a route unavailable to the current role shall redirect or show access feedback. | Validation #9  |
| SRS-F1-048 | Browser back and forward navigation shall not leave the application in a blank or broken state.      | Validation #10 |
| SRS-F1-049 | Route guards shall be implemented in `src/app` and must not contain domain feature logic.            | Architecture   |

### 7.6 Placeholder Pages

| ID         | Requirement                                                                                              | Source             |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------ |
| SRS-F1-050 | Phase 1 shall create a Dashboard placeholder page under `src/pages/dashboard-page/`.                     | Phase plan task 10 |
| SRS-F1-051 | Phase 1 shall create a Resourcing Requests placeholder page under `src/pages/resourcing-requests-page/`. | Phase plan task 10 |
| SRS-F1-052 | Phase 1 shall create a My Profile placeholder page under `src/pages/my-profile-page/`.                   | Phase plan task 10 |
| SRS-F1-053 | Each page folder shall include `PageName.tsx`, `PageName.types.ts`, and `index.ts`.                      | Page structure     |
| SRS-F1-054 | Each page shall be a thin route-level composition component.                                             | Page structure     |
| SRS-F1-055 | Placeholder pages shall show role-appropriate title, current persona context, and empty state.           | Phase plan         |
| SRS-F1-056 | Placeholder pages shall not implement deferred Phase 2 through Phase 5 business flows.                   | Phase scope        |
| SRS-F1-057 | Placeholder pages that use TanStack Query shall handle loading, error, and empty states.                 | Component rules    |
| SRS-F1-058 | Placeholder pages shall use shared empty/loading/error primitives if those primitives exist.             | `shared-ui.md`     |

### 7.7 Domain Types

| ID         | Requirement                                                                                         | Source            |
| ---------- | --------------------------------------------------------------------------------------------------- | ----------------- |
| SRS-F1-060 | Shared domain types shall be placed in `src/types/`.                                                | Architecture      |
| SRS-F1-061 | Phase 1 shall define `Role`, `Persona`, `Person`, `Unit`, `Skill`, and minimal `ResourcingRequest`. | Phase plan task 1 |
| SRS-F1-062 | Types shall use explicit TypeScript unions for fixed domain values where possible.                  | Type safety       |
| SRS-F1-063 | Types shall avoid `any`.                                                                            | Code quality      |
| SRS-F1-064 | Type files shall not import UI components, pages, or feature modules.                               | Import direction  |
| SRS-F1-065 | Phase 1 entity types shall include only fields needed for foundation and near-future compatibility. | Phase plan        |

### 7.8 Mock Data Foundation

| ID         | Requirement                                                                                                                              | Source         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| SRS-F1-070 | Mock data shall live under `src/mocks/`.                                                                                                 | Architecture   |
| SRS-F1-071 | Mock data shall include three personas, three units with manager assignments, 50-100 employees, skills, and minimal resourcing requests. | Phase plan     |
| SRS-F1-072 | Full 500+ employee seed data is deferred to Phase 2 and shall not block Phase 1.                                                         | Phase plan     |
| SRS-F1-073 | Faker factories shall be used for generated employee-like records where practical.                                                       | Tech stack     |
| SRS-F1-074 | Stable named personas and key demo records shall not be regenerated with changing IDs on every import.                                   | Demo stability |
| SRS-F1-075 | Mock data shall be accessible through typed client/query functions, not hard-coded inside UI.                                            | Architecture   |
| SRS-F1-076 | Phase 1 shall not create root-level `api/` or `db/` folders.                                                                             | Architecture   |
| SRS-F1-077 | If an in-memory mock database helper is used, it shall live under `src/mocks/db/`.                                                       | Architecture   |
| SRS-F1-078 | The mock data layer shall support development usage without a real backend.                                                              | AS-001         |

### 7.9 Mock API / Client Boundary

| ID         | Requirement                                                                                       | Source                |
| ---------- | ------------------------------------------------------------------------------------------------- | --------------------- |
| SRS-F1-080 | Phase 1 shall expose a way to fetch personas as async/mock server-like data.                      | Validation #12        |
| SRS-F1-081 | The personas response shall include exactly three default persona records.                        | FR-RS-003 through 005 |
| SRS-F1-082 | If MSW is used, handlers shall live in `src/mocks/handlers.ts` or split files under `src/mocks/`. | Architecture          |
| SRS-F1-083 | If MSW is used, `src/mocks/browser.ts` shall initialize the worker in development only.           | Phase plan task 5     |
| SRS-F1-084 | Feature or role query hooks shall call typed client functions, not MSW handlers directly.         | Architecture          |
| SRS-F1-085 | API client helpers, if needed, shall live under `src/lib/api/`.                                   | Architecture          |
| SRS-F1-086 | Mock request failures may be added later, but Phase 1 default seeded endpoints shall succeed.     | QA validation         |

Recommended Phase 1 mock endpoints if MSW is used:

| Method | Path                       | Response                      |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/api/personas`            | `Persona[]`                   |
| GET    | `/api/units`               | `Unit[]`                      |
| GET    | `/api/people`              | `Person[]`                    |
| GET    | `/api/resourcing/requests` | Minimal `ResourcingRequest[]` |

Only `/api/personas` is required for Phase 1 validation. The other endpoints are recommended to establish the future mock boundary.

### 7.10 Role Data Scope

| ID         | Requirement                                                                       | Source             |
| ---------- | --------------------------------------------------------------------------------- | ------------------ |
| SRS-F1-090 | Unit Manager mock data shall be associated with a unit and subordinate records.   | AS-003             |
| SRS-F1-091 | Employee persona shall be associated with one person record.                      | AS-005             |
| SRS-F1-092 | Sales / DM shall not be associated with direct employee browsing capabilities.    | BR-002             |
| SRS-F1-093 | Phase 1 placeholder content shall avoid displaying data that violates role scope. | BR-001 through 003 |

### 7.11 Handoff Documentation

| ID         | Requirement                                                                                        | Source         |
| ---------- | -------------------------------------------------------------------------------------------------- | -------------- |
| SRS-F1-100 | After implementation, `.planning/STATE.md` shall document persona names and role mappings.         | Validation DoD |
| SRS-F1-101 | After implementation, handoff notes shall list Phase 1 routes and expected behavior per role.      | PLAN handoff   |
| SRS-F1-102 | Deferred items such as partial seed count and unconfirmed persona names shall be explicitly noted. | PLAN handoff   |

## 8. Minimal Data Contracts

The following contracts describe Phase 1 minimum fields. Later phases may extend these types without breaking existing consumers.

### 8.1 Role

```ts
export type Role = 'unit-manager' | 'delivery-manager' | 'employee'
```

### 8.2 Persona

```ts
export type Persona = {
  id: string
  role: Role
  personId: string
  displayName: string
  title: string
  unitId?: string
  isDefault: boolean
}
```

### 8.3 Unit

```ts
export type Unit = {
  id: string
  name: string
  managerId: string
}
```

### 8.4 Person

```ts
export type Person = {
  id: string
  firstName: string
  lastName: string
  workEmail: string
  position: string
  grade: string
  unitId: string
  managerId?: string
  employmentStatus: 'Active' | 'On Leave' | 'Notice Period' | 'Inactive'
  currentProjectStatus: 'Allocated' | 'Partially Allocated' | 'Bench' | 'Booked' | 'Unavailable'
  availabilityPercent: number
  riskLevel: 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
}
```

### 8.5 Skill

```ts
export type Skill = {
  id: string
  personId: string
  name: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  yearsExperience: number
}
```

### 8.6 Minimal Resourcing Request

```ts
export type ResourcingRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Candidates Proposed'
  | 'Approved'
  | 'Rejected'
  | 'Closed'
  | 'Cancelled'

export type ResourcingRequest = {
  id: string
  requestCode: string
  title: string
  projectName: string
  createdById: string
  assignedUnitManagerId: string
  requiredRole: string
  status: ResourcingRequestStatus
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  createdAt: string
  updatedAt: string
}
```

## 9. Page And Route Requirements

| Route                  | Helper                            | Allowed role(s)          | Page folder                           | Page purpose                    |
| ---------------------- | --------------------------------- | ------------------------ | ------------------------------------- | ------------------------------- |
| `/`                    | `getHomePagePath()`               | All                      | No dedicated page required            | Redirect to active role landing |
| `/dashboard`           | `getDashboardPagePath()`          | Unit Manager             | `src/pages/dashboard-page/`           | UM foundation placeholder       |
| `/resourcing/requests` | `getResourcingRequestsPagePath()` | Sales / Delivery Manager | `src/pages/resourcing-requests-page/` | DM foundation placeholder       |
| `/my-profile`          | `getMyProfilePagePath()`          | Employee                 | `src/pages/my-profile-page/`          | Employee foundation placeholder |
| `*`                    | `getFallbackRoutePath()`          | All                      | No dedicated page required            | Redirect to active role landing |

The implementation may use a reusable route guard component in `src/app/` to enforce allowed roles.

## 10. Shared UI Requirements

1. Before building the role switcher, identify the generic primitive used by the UI pattern.
2. If the role switcher uses a dropdown/select pattern and no shared select exists, add `src/shared/ui/select/` first.
3. If the role switcher uses a button group or segmented control, reuse `Button` variants or add a generic shared primitive if it is app-agnostic.
4. The role switcher itself remains domain-aware and belongs in `src/features/roles/components/role-switcher/`.
5. Do not duplicate generic control chrome such as borders, focus rings, chevrons, active states, and disabled states inside `app/`, `pages/`, or features when a shared primitive should own it.
6. Update `docs/architecture/shared-ui.md` inventory if a new shared primitive is added during implementation.

## 11. UI Requirements

1. UI must follow `docs/architecture/visual-theme.md`.
2. Screens must feel like internal operational software, not a marketing landing page.
3. Use slate backgrounds, white structured surfaces, blue primary accents, and role accents sparingly.
4. Header must remain usable at 1280px viewport width and above.
5. Interactive controls must use semantic elements and visible focus states.
6. Do not rely on color alone to communicate active role or selected navigation state.
7. Do not add decorative hero sections or oversized marketing content.
8. Placeholder content must clearly identify the role context and deferred phase without becoming a product tutorial.

## 12. Non-Functional Requirements

| ID          | Requirement                                                                                | Source         |
| ----------- | ------------------------------------------------------------------------------------------ | -------------- |
| SRS-NF1-001 | The app shall remain frontend-only.                                                        | BRD principles |
| SRS-NF1-002 | The app shall run in a modern desktop browser at 1280px width or above.                    | AS-016         |
| SRS-NF1-003 | Phase 1 shall pass `npm run build`.                                                        | Validation     |
| SRS-NF1-004 | Phase 1 shall pass `npm run lint`.                                                         | Validation     |
| SRS-NF1-005 | Phase 1 shall pass `npm run format:check`.                                                 | Validation     |
| SRS-NF1-006 | Implementation shall use TypeScript strictness and avoid `any`.                            | Code quality   |
| SRS-NF1-007 | Implementation shall not add dependencies beyond those already declared in `package.json`. | Phase scope    |
| SRS-NF1-008 | The app shall not perform real network calls for MVP data in development.                  | AS-001         |
| SRS-NF1-009 | Browser console shall have no blocking runtime errors during role switching.               | UI audit / QA  |
| SRS-NF1-010 | The foundation shall preserve import direction from architecture docs.                     | Architecture   |

## 13. Accessibility Requirements

| ID           | Requirement                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| SRS-A11Y-001 | The role switcher shall have an accessible name.                                 |
| SRS-A11Y-002 | The role switcher shall be reachable and operable by keyboard.                   |
| SRS-A11Y-003 | Navigation shall have an accessible label.                                       |
| SRS-A11Y-004 | Active navigation state shall be visible and understandable beyond color alone.  |
| SRS-A11Y-005 | Placeholder pages shall use a single clear `h1`.                                 |
| SRS-A11Y-006 | Loading, empty, and error states shall use readable text and semantic structure. |

## 14. Implementation Constraints

1. Use named exports for new components, pages, hooks, and helpers.
2. Define React components as arrow functions where possible and type props with `FC<Props>`.
3. Each new page folder must include `PageName.tsx`, `PageName.types.ts`, and `index.ts`.
4. Reusable UI belongs in `src/shared/ui/`.
5. Business/domain role UI belongs in `src/features/roles/`.
6. App layout, route guards, route registration, and route helpers belong in `src/app/`.
7. Global app state belongs in `src/store/`.
8. Server-like data belongs in TanStack Query backed by typed client/mock API functions, not Zustand.
9. Mock data and mock handlers belong in `src/mocks/`.
10. Do not create backend-oriented root folders.
11. Do not hard-code large datasets in components.
12. Use `@/` path alias consistently where project style supports it.

## 15. Traceability Matrix

| Phase 1 SRS area                       | BRD / planning references               |
| -------------------------------------- | --------------------------------------- |
| Role switcher choices and behavior     | FR-RS-001, FR-RS-002, AC-RS-004         |
| Default role personas                  | FR-RS-003, FR-RS-004, FR-RS-005         |
| UM landing route                       | AC-RS-001, Phase 1 plan                 |
| DM landing route                       | AC-RS-002, Phase 1 plan                 |
| Employee landing route                 | AC-RS-003, Phase 1 plan                 |
| Simulated auth                         | AS-002                                  |
| Mock data only                         | AS-001, AS-015                          |
| Desktop validation                     | AS-014, AS-016, BRD QA validation scope |
| UM data scoping                        | AS-003, BR-001                          |
| DM cannot browse people directly       | AS-004, BR-002                          |
| Employee own profile only              | AS-005, BR-003                          |
| No backend / no real auth              | BRD sections 5, 7.2                     |
| Partial seed data                      | Phase 1 plan, roadmap                   |
| Build/lint/format pass                 | Phase 1 validation                      |
| Folder structure                       | Architecture docs, AGENTS.md            |
| Shared interactive primitive ownership | `docs/architecture/shared-ui.md`        |

## 16. Acceptance Criteria

Phase 1 implementation is acceptable when all criteria below are true.

### 16.1 Build And Tooling

- `npm run build` exits with code 0.
- `npm run lint` exits with code 0.
- `npm run format:check` exits with code 0.
- No new dependencies are added beyond the existing declared stack.

### 16.2 Role Switcher

- Header shows Unit Manager, Sales / Delivery Manager, and Employee options.
- Default load selects Unit Manager and opens `/dashboard`.
- Switching to Sales / Delivery Manager opens `/resourcing/requests`.
- Switching to Employee opens `/my-profile`.
- Switching roles updates page content and navigation without full page reload.
- Keyboard focus and selection behavior work for the switcher.

### 16.3 Routing

- `/` redirects to the current active role landing route.
- Unknown routes redirect to a valid route.
- Direct navigation to a wrong-role route is handled with redirect or access message.
- Browser back/forward does not produce a blank screen.
- Routes are created through helpers in `src/app/routes.ts`.

### 16.4 Mock Data

- Personas mock data returns exactly three records.
- Persona records have stable IDs, role, person ID, and display name.
- Units mock data includes three units with manager assignments.
- People mock data includes approximately 50-100 records and is not hard-coded inside components.
- Mock data is available through typed client/query access.

### 16.5 UI And Accessibility

- Each role landing page has a clear role-appropriate title.
- Navigation items differ by active role.
- Employee role does not show manager-only or DM-only nav.
- Sales / DM role does not show direct employee browsing nav.
- Header and role switcher are usable at 1280px+ desktop width.
- Console has no blocking runtime errors during fresh load and role switching.

### 16.6 Documentation Handoff

- `.planning/STATE.md` is updated with implemented route behavior.
- Persona names and role mappings are documented.
- Deferred items, especially partial seed data and unconfirmed names, are noted.

## 17. QA Validation Mapping

| Validation item              | Covered by SRS                  |
| ---------------------------- | ------------------------------- |
| Build / lint / format        | SRS-NF1-003 through SRS-NF1-005 |
| Role switcher visible        | SRS-F1-020 through SRS-F1-021   |
| Default UM persona loads     | SRS-F1-011, SRS-F1-023          |
| Switch to DM                 | SRS-F1-024                      |
| Switch to Employee           | SRS-F1-025                      |
| Role switch without reload   | SRS-F1-022                      |
| Different nav items          | SRS-F1-030 through SRS-F1-036   |
| `/` behavior                 | SRS-F1-045                      |
| Unknown route                | SRS-F1-046                      |
| Wrong-role route             | SRS-F1-047                      |
| Browser back/forward         | SRS-F1-048                      |
| Mock data layer active       | SRS-F1-070 through SRS-F1-078   |
| Personas endpoint            | SRS-F1-080 through SRS-F1-081   |
| Loading state                | SRS-F1-057                      |
| No large hard-coded datasets | SRS-F1-075                      |
| Header usability             | Sections 10 and 11              |
| Keyboard focus               | SRS-F1-027, SRS-A11Y-002        |
| Accessible label             | SRS-F1-026, SRS-A11Y-001        |

## 18. Open Decisions

| Decision                          | Owner     | Default for implementation                                                  |
| --------------------------------- | --------- | --------------------------------------------------------------------------- |
| Final demo persona names          | Carlos    | Use clearly marked placeholder names until confirmed                        |
| Persist active role across reload | Volodymyr | Optional; session-only is acceptable                                        |
| Use MSW for Phase 1 mock boundary | Volodymyr | Recommended because `msw` is declared and validation references endpoints   |
| Number of generated employees     | Volodymyr | 50-100 records                                                              |
| Unknown route UX                  | Volodymyr | Redirect to current role landing route                                      |
| Wrong-role route UX               | Volodymyr | Redirect to current role landing route                                      |
| Role switcher primitive           | Volodymyr | Prefer shared `Select` if using dropdown; otherwise reuse existing `Button` |

## 19. Definition Of Done

Phase 1 is done when:

- All in-scope requirements in this SRS are implemented or explicitly deferred with rationale.
- `npm run build`, `npm run lint`, and `npm run format:check` pass.
- Role switching works for all three roles without full page reload.
- Route guards and redirects behave as specified.
- Mock persona data is queryable and stable.
- Placeholder pages exist and follow page structure rules.
- Shared UI rules are followed for any new interactive primitive.
- No deferred Phase 2 through Phase 5 business flows are accidentally implemented.
- `.planning/STATE.md` contains handoff notes for Ivan.
- Ivan can execute `.planning/phases/phase-1-foundation/VALIDATION.md` without needing additional product interpretation.
