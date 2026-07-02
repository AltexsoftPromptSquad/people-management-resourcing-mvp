# AGENTS.md

## Project

People Management & Resourcing MVP is a frontend-only React SPA for managing people, skills, teams, projects, allocations, and resourcing views.

Use mock data, MSW handlers, Faker-generated fixtures, TanStack Query, and local client state where needed. Do not add backend apps, server frameworks, real databases, ORMs, migrations, or production integrations for this MVP.

## Product Source Of Truth

Product behavior lives in `docs/requirements/# Business Requirements Document.md`.

Before product behavior changes or reviews, read the relevant BRD roles, functional requirements `FR-*`, business rules `BR-*`, assumptions `AS-*`, and acceptance criteria `AC-*`.

Use `.planning/` for phase scope, sequencing, ownership, and validation context.

## Architecture

Use `docs/architecture/` as the first stop for implementation decisions:

- `project-structure.md` for ownership, import direction, API/mock boundaries, hooks, providers, stores, and types.
- `component-structure.md` for component placement, file layout, exports, props, and async state rules.
- `shared-ui.md` before adding or styling generic controls such as selects, tabs, checkboxes, inputs, dialogs, and buttons.
- `page-structure.md` for route pages, page responsibilities, route registration, and path helpers.
- `state-and-rendering.md` for page state ownership, URL search params, query keys, filters, tables, and render stability.
- `visual-theme.md` for brand direction, palette, semantic colors, status tones, and accessibility color rules.
- `data-models.md` for complete entity definitions, field lists, relationships, visibility rules, and seed data requirements.
- `ux-requirements.md` for required page sections, mandatory UI states (loading/empty/error), navigation expectations, and consistency rules.
- `ux-behavior.md` for exact interaction sequences, component state machines, copy strings (empty states, toasts, confirm dialogs, validation errors), timing values, keyboard behavior, and accessibility checklist. Read before implementing any interactive feature.
- `feature-rules.md` for feature boundaries, what may be shared, what must not be duplicated, business logic placement, and state management rules.

When docs overlap, prefer the more specific document.

## Critical Rules

- Build real SPA screens, not placeholder landing pages.
- Keep pages thin; put domain behavior in `src/features/<feature>/`.
- Put reusable app-agnostic UI primitives in `src/shared/ui/`.
- Put generated or static mock data in `src/mocks/`, not UI components.
- Do not hard-code large datasets directly inside components.
- Keep route paths and route registration centralized in `src/app/routes.ts` and `src/app/router.tsx`.
- Follow `docs/architecture/state-and-rendering.md` for URL params, filters, tables, query keys, and render behavior.
- Read `import.meta.env` only in `src/config.ts`; import typed config values elsewhere.
- Use TanStack Query for server-like data, even when backed by MSW.
- Use Zustand only for local UI/application state that is not server-like data.

## Project Skills

Use `.codex/skills/pmr-react-spa/SKILL.md` for substantial React SPA work: components, screens, forms, tables, routing, state, filters, mock data, MSW handlers, and frontend flows.

Use `.codex/skills/pmr-desktop-ui-audit/SKILL.md` only when the user explicitly requests a desktop UI audit or grants permission. Do not run UI audits automatically.

## Review Guidelines

For PR reviews, prioritize P0/P1 issues:

- Broken business flows, role/permission mistakes, or BRD violations.
- Unsafe data state, lost user input, or inconsistent mock/API behavior.
- Type-safety issues that can cause runtime failures or unclear domain contracts.
- Accessibility issues that make controls unusable or hard to navigate by keyboard.
- Missing loading, empty, or error states for async UI.
- Duplicate generic control styling instead of shared UI primitives.
- Backend/server/db additions outside frontend-only MVP scope.
- Sensitive data (feedbacks, risks, manager notes, scheduled leaves) visible in Employee personal view or shared profile when not explicitly selected.
- Assignment history and project history mixed in the same view.
- Candidate warnings missing or incorrectly blocking submission.
- Failing build, lint, or format checks.

Do not nitpick formatting, naming, or style unless it causes a real bug, scalability issue, or maintainability risk.

## Code Quality

ESLint, Prettier, Husky, and lint-staged are the repository quality gates.

Do not bypass hooks with `--no-verify` unless explicitly agreed for an emergency.

When changing package scripts or quality tooling, keep Husky `prepare`, pre-commit, and lint-staged behavior intact.

## Commands

Do not run `npm install` unless dependencies are missing or `package.json` or the lockfile changed.

Use `npm run dev` only when browser verification is needed.

Before finishing meaningful code changes, run:

```bash
npm run build
npm run lint
npm run format:check
```

If Playwright coverage is added or relevant, run:

```bash
npx playwright install chromium
npm run test:e2e
```

Keep `npm run build` limited to TypeScript compile and Vite production build. Do not wire Playwright into the build script.

For markdown-only instruction changes, do not run the full frontend verification suite unless explicitly requested.

## Definition Of Done

A change is done when:

- The requested behavior is implemented end to end.
- Relevant BRD and architecture rules were followed.
- Loading, empty, error, and validation states exist where applicable.
- Mock data and MSW handlers are updated when data behavior changes.
- Build, lint, and format checks pass when relevant.
- No unrelated refactors or generated clutter are included.
