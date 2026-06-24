# AGENTS.md

## Project Overview

People Management & Resourcing MVP is a frontend-only React SPA for managing people, skills, teams, projects, allocations, and resourcing views for an engineering organization.

There is no backend requirement. Use mock data, MSW handlers, Faker-generated fixtures, and local client state where needed. Keep implementation realistic enough to support future API integration, but avoid building server-side abstractions that are not needed for the MVP.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui for base UI components
- React Router for routing
- TanStack Query for async/mock server state
- TanStack Table for data grids
- Zustand for local app state
- React Hook Form + Zod for forms and validation
- MSW for mocked API boundaries
- Faker for mock data generation

## Folder Structure Rules

Follow the component and page structure rules from the start of every frontend change. For concrete examples, read:

- `docs/architecture/component-structure.md`
- `docs/architecture/page-structure.md`

```text
src/
  app/              # app bootstrap, providers, router
  shared/
    ui/             # reusable UI components
  features/         # domain features: people, projects, allocations, skills
  lib/              # utilities, query client, helpers
  mocks/            # MSW handlers, mock data factories
  pages/            # route-level pages and page-only components
  store/            # Zustand stores
  types/            # shared TypeScript types
```

Rules:

- Put reusable UI components in `src/shared/ui/{component-name}`.
- Put business components in `src/features/{domain}/components/{component-name}`.
- Put page-only components in `src/pages/{page-name}/components/{component-name}`.
- Each component folder should use `ComponentName.tsx`, `ComponentName.types.ts`, and `index.ts`.
- Add `ComponentName.constants.ts` or `ComponentName.utils.ts` only when the component actually needs them.
- Use named exports from components and indexes.
- Define React components as arrow functions where possible: `export const ComponentName: FC<ComponentNameProps> = (...) => ...`.
- Use explicit `Props` types and never use `any`.
- Use Tailwind CSS and `cn()` for class composition.
- Use shadcn/ui primitives where possible.
- Handle loading, empty, and error states for async data.
- Keep accessibility basics: semantic elements, labels, focus states, and keyboard-friendly controls.
- Put domain-specific hooks, schemas, tables, and helpers inside `features/<feature>/`.
- Put generated or static mock data in `mocks/`, not inside UI components.
- Keep route components thin; push behavior into feature modules.
- Avoid large barrel files unless they clearly improve imports.

## Routing and Page Rules

- Keep all route path helpers in `src/app/routes.ts`.
- Name path helpers as `get<PageName>PagePath`, for example `getHomePagePath`.
- Do not hard-code app paths in `Link`, `NavLink`, `Navigate`, redirects, or route registration.
- Register routes only in `src/app/router.tsx`.
- Create route pages under `src/pages/{page-name}`.
- Each page folder must use `PageName.tsx`, `PageName.types.ts`, and `index.ts`.
- Export pages with named exports and type them with `FC<PageNameProps>`.
- Add a new page by creating the page folder, adding a path helper, registering the route, and updating navigation only when the page is a primary destination.
- Remove a page by removing its route registration, path helper, navigation item, page folder, and imports.
- Keep pages thin: layout, route params/search params, page-level state, and composition only.

## Implementation Rules

- Use TypeScript for all app code.
- Build real SPA screens, not placeholder landing pages.
- Prefer shadcn/ui components before creating custom UI primitives.
- Use Tailwind utilities for styling; keep custom CSS minimal.
- Use React Router for navigation and route state.
- Use TanStack Query for data that behaves like remote data, even when backed by MSW.
- Use Zustand only for local UI/application state that is not server-like data.
- Use React Hook Form with Zod schemas for non-trivial forms.
- Use TanStack Table for sortable/filterable/resource-style tables.
- Keep mock APIs realistic: IDs, loading states, empty states, and error states should exist where useful.
- Do not add a backend, database, or server-only framework.
- Do not hard-code large datasets directly inside components.
- Keep components focused and readable; extract only when it reduces real complexity.

## Code Quality Rules

- ESLint is the source of truth for code correctness checks.
- Prettier is the source of truth for formatting.
- Do not format manually against Prettier preferences; run the formatter.
- Keep ESLint and Prettier responsibilities separate. Avoid adding ESLint rules that only duplicate formatting concerns.
- Husky must install repository Git hooks through the `prepare` script.
- The pre-commit hook must run `lint-staged`.
- `lint-staged` should only operate on staged files and should run ESLint fixes before Prettier on TypeScript/React files.
- Never bypass hooks with `--no-verify` unless explicitly agreed for an emergency.

## Project Codex Skills

Project-specific Codex skills live in `.codex/skills`.

- Use `.codex/skills/pmr-react-spa/SKILL.md` for substantial React SPA component, screen, form, table, routing, state, and mock-data work.
- Use `.codex/skills/pmr-desktop-ui-audit/SKILL.md` after creating or changing visible pages/screens. Audit only desktop view with Chrome DevTools MCP, usually at `1440x900`, and fix blocking layout, console, network, accessibility, and usability issues found during the audit.
- Keep `AGENTS.md` concise. Put detailed reusable agent guidance into project skills or their `references/` files.

## Review Guidelines

When reviewing changes, prioritize:

- Correctness of business flows and data state.
- Type safety and clear domain models.
- Accessible controls, labels, keyboard behavior, and focus states.
- Responsive layout for dashboard/table-heavy screens.
- Loading, empty, and error states.
- Consistent use of shadcn/ui and Tailwind patterns.
- Avoiding duplicated mock data or inconsistent fixtures.
- Avoiding unnecessary global state.
- Passing ESLint, Prettier, and build checks.
- Keeping Husky/lint-staged configuration intact when changing package scripts.

Call out missing validation, fragile table logic, unclear routing, and UI that would not scale to realistic people/project counts.

## Testing and Build Commands

Use the project package manager scripts when available.

Expected commands:

```bash
npm install
npm run dev
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run build
npm run preview
```

If tests are added:

```bash
npm run test
```

Before considering work complete, run at least:

```bash
npm run build
npm run lint
npm run format:check
```

If the relevant scripts do not exist yet, add them as part of the setup or clearly note what is missing.

## Definition of Done

A change is done when:

- The requested feature or fix is implemented end to end.
- TypeScript, lint, and build checks pass.
- Formatting checks pass.
- Pre-commit hooks run lint-staged successfully.
- UI handles loading, empty, and error states where applicable.
- Forms validate with Zod and show useful user feedback.
- Mock data and MSW handlers are updated when data behavior changes.
- The implementation follows the feature folder structure.
- Created or changed pages pass the desktop Chrome DevTools MCP UI audit when the change affects visible UI.
- No unrelated refactors or generated clutter are included.
- The result is usable in the browser with realistic MVP data.
