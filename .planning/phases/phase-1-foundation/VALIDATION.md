# Phase 1 — Validation

QA checklist for foundation phase. Reference BRD acceptance criteria where applicable.

## Build / Lint / Format

| Check | Command | Pass criteria |
|-------|---------|---------------|
| TypeScript build | `npm run build` | Exit 0, no type errors |
| ESLint | `npm run lint` | Exit 0, no errors |
| Prettier | `npm run format:check` | Exit 0, no formatting drift |

## Role Switcher (FR-RS-*, AC-RS-*)

| # | Check | Expected result | BRD ref |
|---|-------|-----------------|---------|
| 1 | Role switcher visible in header | UM, DM, Employee options present | FR-RS-001 |
| 2 | Default UM persona loads | Dashboard placeholder route loads | FR-RS-003, AC-RS-001 |
| 3 | Switch to DM | Nav changes; resourcing requests placeholder loads | FR-RS-002, AC-RS-002 |
| 4 | Switch to Employee | Nav changes; my-profile placeholder loads | AC-RS-003 |
| 5 | Role switch without full page reload | Content and nav update in-app | AC-RS-004 |
| 6 | Each role shows different nav items | No UM-only links visible as Employee | FR-RS-002 |

## Routing

| # | Check | Expected result |
|---|-------|-----------------|
| 7 | `/` behavior documented | Redirects to role landing or shows home — consistent with implementation |
| 8 | Unknown route | Redirects to valid page (no blank screen) |
| 9 | Direct URL to wrong-role route | Redirects to current role's landing or shows access message |
| 10 | Browser back/forward | Works without broken state |

## Mock Data / MSW

| # | Check | Expected result |
|---|-------|-----------------|
| 11 | MSW active in dev | Network tab shows intercepted `/api/*` (or equivalent) requests |
| 12 | Personas endpoint returns 3 records | UM, DM, Employee personas with distinct IDs |
| 13 | Brief loading state | Placeholder pages show loading before data (if query-driven) |
| 14 | No hard-coded large datasets in components | Data comes from mocks/factories |

## Browser Behavior (manual)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 15 | Fresh load as UM | Open app → default UM | Dashboard placeholder, UM nav |
| 16 | Switch UM → DM → Employee → UM | Use role switcher | Each switch updates nav and main content |
| 17 | Responsive header | Narrow viewport | Header and switcher remain usable |
| 18 | Keyboard focus | Tab to role switcher | Focus ring visible; operable |

## Accessibility (smoke)

| # | Check | Expected result |
|---|-------|-----------------|
| 19 | Role switcher has accessible label | `aria-label` or visible text |
| 20 | Nav links have focus states | Visible focus ring (existing AppLayout pattern) |

## Definition of Done

Phase 1 is **done** when:

- [ ] All build/lint/format checks pass
- [ ] Role switcher checks (#1–6) pass
- [ ] Routing checks (#7–10) pass
- [ ] Mock data checks (#11–14) pass
- [ ] Browser scenarios (#15–18) pass
- [ ] Accessibility smoke (#19–20) pass
- [ ] No application regressions to existing home/layout styling
- [ ] Handoff notes documented in STATE.md (persona names, routes)
- [ ] Carlos confirms persona names or accepts placeholders
- [ ] Ivan and Volodymyr sign off → Phase 2 may begin

## Out of Scope for Phase 1 QA

Do **not** block Phase 1 on: dashboard widgets, subordinates table, profiles, resourcing forms, custom lists, full 500+ seed, assignment history.
