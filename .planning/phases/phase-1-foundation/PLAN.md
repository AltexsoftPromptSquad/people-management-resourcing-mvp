# Phase 1 — Foundation

## Objective

Establish the application shell, role switcher, routing skeleton, and mock data foundation so all subsequent feature phases can build on a consistent structure.

## Scope

### In scope

1. **App providers** — TanStack Query client, MSW browser worker (dev), Zustand store for active role + persona
2. **Role switcher** — UM, DM, Employee; immediate nav/data change (FR-RS-001–002)
3. **Role-aware routing** — Landing routes per role:
   - UM → `/dashboard` (placeholder)
   - DM → `/resourcing/requests` (placeholder)
   - Employee → `/my-profile` (placeholder)
4. **App layout update** — Role-specific navigation items; retain existing header pattern
5. **Domain types** — Core entities: Person, Unit, Skill, ResourcingRequest (minimal fields for Phase 1)
6. **Mock data foundation** — MSW handlers + Faker factories:
   - 3 named personas (UM, DM, Employee) — names TBD by Carlos
   - 3 units with manager assignments
   - ~50–100 sample employees (full 500+ deferred to Phase 2)
7. **Path aliases** — Ensure `@/` imports consistent across `app`, `pages`, `features`, `mocks`
8. **Placeholder pages** — One per role landing route with role-appropriate title and empty state

### Out of scope

- Manager dashboard widgets (Phase 2)
- Subordinates table (Phase 2)
- Employee profile tabs (Phase 3)
- Resourcing workflows (Phase 4)
- Custom lists, profile sharing UI (Phase 5)
- Real authentication
- Full 500+ employee seed (Phase 2)
- New npm dependencies beyond what `package.json` already declares

## Tasks

| # | Task | Owner | Depends on |
|---|------|-------|------------|
| 1 | Define `src/types/` for Person, Unit, Role, Persona | Dev | — |
| 2 | Create Zustand store: `activeRole`, `activePersonaId`, switch actions | Dev | 1 |
| 3 | Build role switcher component in app header | Dev | 2 |
| 4 | Add MSW `browser.ts`, `handlers.ts`, persona/unit/person factories | Dev | 1 |
| 5 | Wire MSW in `main.tsx` (dev only) | Dev | 4 |
| 6 | Add QueryClientProvider in app providers | Dev | — |
| 7 | Extend router: `/dashboard`, `/resourcing/requests`, `/my-profile` | Dev | 2 |
| 8 | Role guard / redirect: wrong role route → correct landing | Dev | 2, 7 |
| 9 | Update `AppLayout` nav items per active role | Dev | 2, 3 |
| 10 | Placeholder page components per landing route | Dev | 7 |
| 11 | Hook personas endpoint via TanStack Query | Dev | 4, 6 |
| 12 | Document persona names once Carlos confirms | Product | — |

## Expected Outputs

| Output | Location (target) |
|--------|-------------------|
| Domain types | `src/types/` |
| Role store | `src/store/role-store.ts` (or `src/features/auth/`) |
| Role switcher UI | `src/app/` or `src/shared/ui/` |
| MSW setup | `src/mocks/` |
| App providers | `src/app/providers.tsx` |
| Extended router | `src/app/router.tsx`, `src/app/routes.ts` |
| Placeholder pages | `src/pages/` |

## Handoff to QA

When Phase 1 tasks are complete, notify Volodymyr with:

1. Branch name and commit SHA
2. Dev server URL (`http://localhost:5173`)
3. Confirmed persona names and which persona maps to each role
4. List of routes and expected behavior per role
5. Note any deferred items (e.g., partial seed count)

QA runs checks in `VALIDATION.md` before Phase 2 starts.
