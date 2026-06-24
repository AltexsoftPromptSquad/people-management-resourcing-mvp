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
   - `/` redirects to the current role landing route.
   - Wrong-role direct URLs redirect to the current role landing route:
     - Employee opens `/dashboard` → `/my-profile`
     - DM opens `/dashboard` → `/resourcing/requests`
     - UM opens `/my-profile` → `/dashboard`
4. **App layout update** — Role-specific navigation items; retain existing header pattern
5. **Domain types** — Core entities: Person, Unit, Skill, ResourcingRequest, Role, Persona (minimal fields for Phase 1). Add minimal Project and Allocation types if needed to keep availability assumptions compatible with later phases.
6. **Mock data foundation** — MSW handlers + Faker factories:
   - 3 named personas (UM, DM, Employee). Use stable placeholders if Carlos has not confirmed names yet:
     - UM: Olena Kovalenko
     - DM: Dmytro Shevchenko
     - Employee: Anna Melnyk
   - 3 units with manager assignments
   - ~50–100 sample employees. This is an intentional Phase 1 seed-size deviation from the BRD MVP target; full 500+ seed remains required before MVP acceptance and is deferred to Phase 2.
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
| 1 | Define `src/types/` for Person, Unit, Role, Persona | Volodymyr | — |
| 2 | Create Zustand store: `activeRole`, `activePersonaId`, switch actions | Volodymyr | 1 |
| 3 | Build role switcher component in app header | Volodymyr | 2 |
| 4 | Add MSW `browser.ts`, `handlers.ts`, persona/unit/person factories | Volodymyr | 1 |
| 5 | Wire MSW in `main.tsx` (dev only) | Volodymyr | 4 |
| 6 | Add QueryClientProvider in app providers | Volodymyr | — |
| 7 | Extend router: `/dashboard`, `/resourcing/requests`, `/my-profile` | Volodymyr | 2 |
| 8 | Role guard / redirect: `/` and wrong-role routes → current role landing | Volodymyr | 2, 7 |
| 9 | Update `AppLayout` nav items per active role | Volodymyr | 2, 3 |
| 10 | Placeholder page components per landing route | Volodymyr | 7 |
| 11 | Hook personas endpoint via TanStack Query | Volodymyr | 4, 6 |
| 12 | Confirm persona names or explicitly accept placeholders | Carlos | — |

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

## Handoff to QA (Ivan)

When Phase 1 implementation tasks are complete, Volodymyr notifies Ivan with:

1. Branch name and commit SHA
2. Dev server URL (`http://localhost:5173`)
3. Confirmed persona names and which persona maps to each role, or note that placeholders are accepted
4. List of routes and expected behavior per role, including `/` and wrong-role redirects
5. Note deferred items, especially partial Phase 1 seed count versus the BRD 500+ MVP target

Ivan runs checks in `VALIDATION.md` before Phase 2 starts.
