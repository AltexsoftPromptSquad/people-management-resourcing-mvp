# Phase 2 Status

**Phase:** Manager Dashboard & Subordinates  
**Owner:** Volodymyr  
**Updated:** 2026-06-26

## Implementation

- Route helpers and route registration added for subordinates and profile drilldown.
- Unit Manager navigation extended with `Subordinates`.
- Dashboard feature implemented with typed API/hooks:
  - summary cards
  - action items list (due-date sort + overdue emphasis)
  - quick links block
- Subordinates feature implemented with typed API/hooks:
  - filter controls (`search`, `position`, `grade`, `status`, `risk`)
  - sortable table headers
  - empty state behavior
  - row navigation to profile stub route
- Shared primitives introduced for reusable filter controls:
  - `src/shared/ui/input`
  - `src/shared/ui/select`
- Mock layer expanded:
  - new datasets for action items and risks
  - deterministic seed expanded to 540 people total
  - manager aggregation/query service and Phase 2 endpoints

## Validation

- `npm run build`: pass
- `npm run lint`: pass
- `npm run format:check`: pass
- Manual checklist execution by Ivan: pending

## Deferred Scope

- Full profile tabs/editing flows (Phase 3)
- Resourcing request/proposal/review workflows (Phase 4)
- Custom list creation/edit/share workflows (Phase 5)
