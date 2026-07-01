---
name: pmr-react-spa
description: Build or update React SPA features for the People Management & Resourcing MVP. Use when working on project-specific React components, screens, routing, forms, validation, tables, filters, mock data, MSW handlers, local state, or frontend flows using TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query/Table, Zustand, React Hook Form, Zod, MSW, and Faker.
---

# PMR React SPA

Use this skill for substantial frontend work in the People Management & Resourcing MVP.

## Default Workflow

1. Read `AGENTS.md` first for repository-wide rules.
2. Read `docs/architecture/component-structure.md` before creating or moving components.
3. Read `docs/architecture/shared-ui.md` before adding or styling form controls, dropdowns, tabs, checkboxes, dialogs, or other generic interactive UI.
4. Read `docs/architecture/page-structure.md` before creating or changing pages or routes.
5. Read `docs/architecture/state-and-rendering.md` before implementing page state, URL search params, filters, tables, query keys, or render-sensitive flows.
6. Identify the feature area: people, projects, allocations, skills, teams, or shared UI.
7. Search `src/shared/ui/` for existing primitives. Reuse them; if a generic primitive is missing, add it to shared UI once before composing it in features.
8. Place domain code under `src/features/<feature>/`.
9. Keep route components thin and move behavior into feature modules.
10. Add or update mock data/MSW handlers when the UI depends on server-like data.
11. Run `npm run lint`, `npm run format:check`, and `npm run build` before finishing.

## Core Rules

- Use TypeScript for app code.
- Define React components as arrow functions where possible and type props through `FC<Props>`.
- Prefer shared UI from `src/shared/ui/` before adding new primitives; see `shared-ui.md`.
- Prefer shadcn/ui as the base for new shared primitives, themed once in `src/shared/ui/`.
- Do not style generic controls inline in features or pages when they belong in shared UI.
- Use React Router for navigation.
- Use TanStack Query for async or mock-server state.
- Use Zustand only for local UI/application state.
- Use React Hook Form + Zod for non-trivial forms.
- Use TanStack Table for sortable, filterable, data-heavy tables.
- Include loading, empty, and error states when data is fetched or derived.
- Keep URL params, draft inputs, query keys, table state, and render-sensitive derived data aligned with `docs/architecture/state-and-rendering.md`.
- Do not add a backend, database, or server-only framework.
- Do not hard-code large datasets inside components.

## References

Read only the relevant reference when needed:

- Shared UI workflow and inventory: `docs/architecture/shared-ui.md`
- State, URL params, query keys, tables, and render stability: `docs/architecture/state-and-rendering.md`
- Forms and validation: `references/forms.md`
- Tables and filtering: `references/tables.md`
- Mock data and MSW: `references/mock-data.md`
