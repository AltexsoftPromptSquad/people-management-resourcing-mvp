# Project Structure

This document describes the intended long-term project structure for the People Management & Resourcing MVP. It is based on the BRD, `.planning/` roadmap, and existing architecture rules.

The app is a frontend-only React SPA. Do not add a backend app, database server, ORM layer, or server-only framework. Server-like behavior should be represented through typed client APIs, TanStack Query, MSW handlers, Faker factories, and local client state.

## Top-Level Structure

```text
.
  docs/
    architecture/
    requirements/
  .planning/
    phases/
  public/
  src/
    app/
    features/
    lib/
    mocks/
    pages/
    shared/
    store/
    styles/
    types/
```

## Root Folders

| Folder               | Purpose                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `docs/requirements/` | Business source of truth. The BRD defines product behavior, roles, rules, and acceptance criteria. |
| `docs/architecture/` | Engineering and design conventions for agents and developers.                                      |
| `.planning/`         | GSD-lite delivery planning: roadmap, current state, phase plans, and validation checklists.        |
| `public/`            | Static browser assets such as favicon and other files served directly by Vite.                     |
| `src/`               | Application source code.                                                                           |

## Source Folder Overview

```text
src/
  app/        # bootstrap, providers, router, layouts, route guards
  config.ts   # typed app configuration and Vite env access
  features/   # domain modules: people, profiles, resourcing, dashboard, custom lists
  lib/        # cross-cutting technical utilities
  mocks/      # MSW handlers, mock API data, Faker factories
  pages/      # route-level composition
  shared/     # reusable UI and app-agnostic shared code
  store/      # global Zustand stores
  styles/     # app-level CSS and theme entry points
  types/      # shared domain types used across features
```

## `src/config.ts`

Use `src/config.ts` as the single app configuration boundary for Vite environment variables.

Rules:

- Read `import.meta.env` only in `src/config.ts`.
- Export named, typed constants such as `isViteDev`, `isViteEnableMocks`, and `shouldEnableMocking`.
- Other modules must import configuration values from `@/config` or `./config`, not read `import.meta.env` directly.
- Convert string environment flags to booleans in `src/config.ts`; do not compare `VITE_*` strings throughout the app.
- Add new Vite env typings in `src/vite-env.d.ts` when adding a new `VITE_*` variable.

## `src/app`

Use `src/app` for application wiring, not domain behavior.

```text
src/app/
  layouts/
    app-layout/
  navigation.ts
  providers/
    AppProviders.tsx
    query-provider/
    role-provider/
  router-provider.tsx
  router.tsx
  routes.ts
```

Responsibilities:

- Register routes in `router.tsx`.
- Define route path helpers in `routes.ts`.
- Keep app-shell navigation items and role-to-route mappings in `navigation.ts`.
- Compose global providers: React Router, TanStack Query, and app-level context providers.
- Own application layouts and role-aware navigation shell.
- Own route guards and redirects, such as current-role landing redirects.

Application layouts must follow `visual-theme.md` for persistent chrome, header accents, active navigation, focus rings, and role-aware navigation treatments. Layouts should compose shared UI primitives where possible; if a generic button, segmented control, hover state, cursor, disabled state, or focus behavior is wrong, fix the shared primitive instead of patching only the app layout.

Do not put feature business logic, schemas, large mock datasets, page-specific UI, or shared primitive variant definitions in `src/app`.

## `src/pages`

Use `src/pages` for route-level screens. Pages should be thin composition layers.

```text
src/pages/
  dashboard-page/
    DashboardPage.tsx
    DashboardPage.types.ts
    index.ts
    components/
  resourcing-requests-page/
  employee-profile-page/
  my-profile-page/
  custom-lists-page/
  shared-profile-page/
```

Responsibilities:

- Read route params and search params.
- Trigger page-level queries.
- Compose feature components and shared UI.
- Handle page-level loading, empty, and error states.

Pages should not contain:

- Large tables directly.
- Form schemas.
- Domain transformations.
- Large mock data.
- API handler logic.
- State orchestration that belongs in a page/feature hook; see `state-and-rendering.md`.

## `src/features`

Use `src/features` for domain-specific behavior. A feature owns business UI, local domain hooks, schemas, tables, and domain API wrappers.

Expected feature domains:

```text
src/features/
  dashboard/
  people/
  employee-profile/
  resourcing/
  custom-lists/
  profile-sharing/
  documents/
  risks/
  action-items/
  roles/
```

Recommended feature shape:

```text
src/features/{feature}/
  api/
  components/
  hooks/
  schemas/
  tables/
  utils/
  constants.ts
  types.ts
```

Use only the folders a feature actually needs.

### Feature `api/`

Use feature `api/` folders for typed client functions that behave like remote API calls.

```text
src/features/resourcing/api/
  get-resourcing-requests.ts
  create-resourcing-request.ts
  update-candidate-decision.ts
```

These functions should call the mock API boundary through shared request helpers in `src/lib/api/`. They should not contain MSW handlers or Faker factories.

### Feature `hooks/`

Use feature hooks for domain-specific data and behavior.

```text
src/features/people/hooks/
  use-subordinates-query.ts
  use-person-profile-query.ts
```

Examples:

- `useSubordinatesQuery`
- `useResourcingRequestsQuery`
- `useCandidateDecisionMutation`
- `useEmployeeProfileForm`

Feature hooks can use TanStack Query, React Hook Form, Zod schemas, and feature API functions.

### Feature `components/`

Use feature components for UI that understands domain data.

Examples:

- `SubordinatesTable`
- `EmployeeProfileTabs`
- `ResourcingRequestForm`
- `CandidateProposalPanel`
- `AssignmentHistoryTable`
- `RiskBadge`

If a component no longer knows about PMR domain concepts, move it to `src/shared/ui`.

### Feature `schemas/`

Use feature schemas for Zod validation.

Examples:

- Resourcing request form schema.
- Candidate rejection schema.
- Employee personal profile schema.
- Custom field schema.

Keep schemas near the feature they validate.

### Feature `tables/`

Use feature `tables/` for TanStack Table column definitions and table helpers.

Examples:

- Subordinates columns.
- Custom list columns.
- Candidate proposal columns.
- Assignment history columns.

Do not define large table column arrays inside page components.

## `src/shared`

Use `src/shared` for reusable code that is not specific to people, profiles, resourcing, roles, or planning.

```text
src/shared/
  ui/
  hooks/
  context/
  constants/
```

### `src/shared/ui`

Reusable UI primitives and composed app-agnostic components. This is the design-system layer: generic controls are styled once here and reused across features and pages.

Read `docs/architecture/shared-ui.md` before adding or styling any interactive control (select, tabs, checkbox, dialog, input, etc.).

Examples:

- `button`
- `badge`
- `select`
- `input`
- `checkbox`
- `tabs`
- `dialog`
- `dropdown-menu`
- `status-pill`
- `data-table`
- `empty-state`
- `error-state`
- `loading-state`
- `page-header`
- `section-header`
- `confirm-dialog`

Rules:

- Before building a control, check the shared UI inventory in `shared-ui.md`. Reuse existing primitives.
- If a generic primitive is missing, add it to `src/shared/ui/{component-name}/` first. Prefer shadcn/ui themed for PMR, then compose it from features.
- Do not style native `<select>`, `<input>`, tab strips, or similar controls inline in `features/`, `pages/`, or `app/` when a shared primitive is needed or likely to be reused.
- Shared UI should accept generic props and not import feature types.

### `src/shared/hooks`

Use shared hooks only for generic browser or UI behavior.

For state ownership, URL search params, query keys, filters, tables, and render stability, see `state-and-rendering.md`.

Examples:

- `use-debounced-value`
- `use-throttled-callback`
- `use-disclosure`
- `use-local-storage`
- `use-search-param-state`

Do not put domain hooks here. A hook that knows about people, roles, requests, candidates, risks, or profiles belongs in the relevant feature.

Pages and page/feature hooks that sync filters, sorting, pagination, or tabs with the URL should use shared hooks instead of calling `useSearchParams` directly in every component. Keep these hooks app-agnostic and driven by typed default search params.

Rules:

- Do not add a root-level `src/hooks` folder. Generic hooks belong in `src/shared/hooks`; domain hooks belong in `src/features/{feature}/hooks`.
- Use `use-debounced-value` for text input that affects URL params or TanStack Query keys, such as search boxes.
- Use throttle only for continuous event streams where the latest value may be sampled, such as resize, scroll, or pointer movement. Do not use throttle as the default search-query behavior.
- A reusable search-param hook should accept only typed default search params, keep one internal params state synchronized with the URL, and expose the normalized params object plus an update function for writing normalized params back to the router.
- Query hooks should receive URL-synchronized, normalized params, not raw keystrokes or mutable `URLSearchParams` instances.
- Avoid putting `URLSearchParams` objects directly in TanStack Query keys. Convert them to stable plain objects or primitives first.

### `src/shared/context`

Use shared context sparingly for generic UI concerns.

Allowed examples:

- Toast provider context.
- Dialog manager context.
- Theme context if the app later supports theme switching.

Do not put role, persona, request, or employee state here. Those belong in `src/store` or feature-level state.

## `src/store`

Use `src/store` for global Zustand stores that are application-level, not server-like.

Expected stores:

```text
src/store/
  role-store.ts
  ui-store.ts
```

Good global store candidates:

- Active role.
- Active persona id.
- Persistent UI preferences.
- Global navigation/sidebar state.

Do not store server-like data such as people lists, requests, documents, risks, or action items in Zustand. Use TanStack Query for that data, even when MSW backs it.

## Contexts And Providers

Prefer this hierarchy:

| Scope                  | Location                          | Use for                                                       |
| ---------------------- | --------------------------------- | ------------------------------------------------------------- |
| Global app providers   | `src/app/providers/`              | Query client, router-level providers, app shell providers     |
| Global app state       | `src/store/`                      | Role/persona and UI state through Zustand                     |
| Feature-local context  | `src/features/{feature}/context/` | Temporary wizard state or deeply nested feature-only UI state |
| Shared generic context | `src/shared/context/`             | Toasts, dialogs, theme-like generic concerns                  |

Avoid React context for data that behaves like remote data. Use TanStack Query and feature API functions instead.

## `src/lib`

Use `src/lib` for cross-cutting technical helpers that are not UI components and not domain features.

```text
src/lib/
  api/
    api-client.ts
    api-error.ts
  query/
    query-client.ts
    query-keys.ts
  dates/
  formatting/
  ids/
  utils.ts
```

### `src/lib/api`

This is a frontend API client boundary, not a backend API implementation.

Use it for:

- Shared `fetch` wrapper.
- API error normalization.
- Request/response helpers.
- Base URL constants for mock endpoints.

Do not put MSW handlers here. Handlers belong in `src/mocks`.

### `src/lib/query`

Use it for TanStack Query setup and shared query key helpers.

Feature-specific query keys may live in the feature if they are not reused elsewhere.

## `src/mocks`

Use `src/mocks` for all mock server behavior and seeded data.

```text
src/mocks/
  browser.ts
  handlers.ts
  data/
    people.ts
    units.ts
    skills.ts
    requests.ts
    risks.ts
    action-items.ts
  factories/
    person-factory.ts
    unit-factory.ts
    request-factory.ts
  db/
    mock-db.ts
```

MSW startup must be explicit and environment-aware. Enable it automatically in local development, and enable it for hosted demo builds only when `VITE_ENABLE_MOCKS=true` is configured. Do not rely on unconditional production MSW startup. Read the resolved mock flag from `src/config.ts`; do not read `import.meta.env` directly from `src/mocks`.

### Mock `db/`

Because the MVP has no real backend or database, any `db` folder must live under `src/mocks/db`.

Use it only for in-memory seeded collections and helper functions that support MSW handlers.

Do not create a root `db/` folder, Prisma schema, SQL migrations, server database adapters, or persistence layer.

## `src/types`

Use `src/types` for shared domain models that cross feature boundaries.

Expected types:

```text
src/types/
  role.ts
  persona.ts
  person.ts
  unit.ts
  skill.ts
  project.ts
  allocation.ts
  risk.ts
  action-item.ts
  custom-field.ts
  custom-list.ts
  resourcing-request.ts
  candidate-proposal.ts
  assignment-history.ts
  shared-profile.ts
  document.ts
  idp.ts
```

Rules:

- Put types here when multiple features need them.
- Keep feature-only helper types inside `src/features/{feature}/types.ts`.
- Do not duplicate entity shapes in mocks, components, and API functions.

## `src/styles`

Use `src/styles` for app-level CSS entry points and theme-level styling.

```text
src/styles/
  globals.css
  theme.css
```

Keep most styling in Tailwind classes. Use CSS files only for:

- Tailwind imports.
- CSS variables if the app introduces explicit theme tokens.
- Global element defaults.
- Small app-wide overrides that cannot reasonably live in component classes.

Do not put component-specific CSS files here unless the styling is truly global.

## Suggested Domain Ownership

| Domain                 | Main owner folder                                 | Notes                                                            |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| Role switcher/personas | `src/features/roles`, `src/store/role-store.ts`   | Role UI and persona query hooks in feature; active role in store |
| Dashboard              | `src/features/dashboard`                          | Widgets and manager action summary                               |
| People/subordinates    | `src/features/people`                             | People lists, filters, subordinate scoping                       |
| Employee profiles      | `src/features/employee-profile`                   | Managerial and personal profile modules                          |
| Resourcing             | `src/features/resourcing`                         | Requests, candidates, decisions, assignment history              |
| Custom lists           | `src/features/custom-lists`                       | Custom fields, saved list tabs, inline edit                      |
| Profile sharing        | `src/features/profile-sharing`                    | Shared profile generation and public shared view                 |
| Documents and IDP      | `src/features/documents`                          | Document metadata and IDP state                                  |
| Risks/action items     | `src/features/risks`, `src/features/action-items` | Can stay separate once screens grow                              |

## Import Direction

Keep dependency direction predictable:

```text
pages -> features -> shared/lib/types
app -> pages/features/shared/lib/store
mocks -> types
features -> lib/api, lib/query, shared/ui, types
shared -> lib
```

Avoid:

- `shared` importing from `features`.
- `types` importing from UI or features.
- `mocks` importing from pages or components.
- Cross-feature imports unless the imported module is intentionally shared. Move shared domain models to `src/types`.

## Naming Rules

- Component folders: kebab-case folder, PascalCase component files.
- Hooks: `use-name.ts`.
- Feature API files: verb-object names such as `get-people.ts`, `create-resourcing-request.ts`.
- Zod schemas: `thing.schema.ts`.
- Table columns: `thing.columns.tsx` or a `tables/` folder when more than one table exists.
- Route pages: `{PageName}.tsx`, `{PageName}.types.ts`, `index.ts`.

## What Not To Add

Do not add these unless the project scope changes:

- Root `api/` backend folder.
- Root `db/` database folder.
- Express, Nest, Next.js server routes, Prisma, migrations, or SQL schema.
- Production authentication/session folders.
- Real file upload storage.
- External integration clients for Jira, Confluence, HRIS, ATS, or email.

Represent all of those concerns as mocked frontend boundaries only when needed for the MVP demo.
