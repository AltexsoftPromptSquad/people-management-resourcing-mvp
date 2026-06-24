# Phase 1 — Validation

**Owner:** Ivan (QA / validation / test cases)

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
| 7 | `/` behavior | Redirects to the current role landing route |
| 8 | Unknown route | Redirects to valid page (no blank screen) |
| 9 | Employee opens `/dashboard` directly | Redirects to `/my-profile` |
| 10 | Browser back/forward | Works without broken state |
| 11 | DM opens `/dashboard` directly | Redirects to `/resourcing/requests` |
| 12 | UM opens `/my-profile` directly | Redirects to `/dashboard` |

## Mock Data / MSW

| # | Check | Expected result |
|---|-------|-----------------|
| 13 | MSW active in dev | Network tab shows intercepted `/api/*` (or equivalent) requests |
| 14 | Personas endpoint returns 3 records | UM, DM, Employee personas with distinct IDs |
| 15 | Persona names | Carlos-confirmed names or accepted placeholders are documented |
| 16 | Phase 1 seed count | ~50–100 sample employees; deferred full 500+ seed is documented for Phase 2 |
| 17 | Brief loading state | Placeholder pages show loading before data (if query-driven) |
| 18 | No hard-coded large datasets in components | Data comes from mocks/factories |

## Browser Behavior (manual)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 19 | Fresh load as UM | Open app → default UM | Dashboard placeholder, UM nav |
| 20 | Switch UM → DM → Employee → UM | Use role switcher | Each switch updates nav and main content |
| 21 | Keyboard focus | Tab to role switcher | Focus ring visible; operable |

## Desktop UI Audit (Chrome DevTools MCP)

Use `.codex/skills/pmr-desktop-ui-audit/SKILL.md` for this section. Keep this audit desktop-only.

| # | Check | Expected result |
|---|-------|-----------------|
| 22 | `/dashboard` at `1440x900` | No layout overlap, clipping, console errors, or unexpected failed requests |
| 23 | `/resourcing/requests` at `1440x900` | No layout overlap, clipping, console errors, or unexpected failed requests |
| 24 | `/my-profile` at `1440x900` | No layout overlap, clipping, console errors, or unexpected failed requests |

## Responsive Smoke (manual)

This is separate from the desktop-only Chrome DevTools MCP audit.

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 25 | Responsive header | Narrow viewport | Header and switcher remain usable |

## Accessibility (smoke)

| # | Check | Expected result |
|---|-------|-----------------|
| 26 | Role switcher has accessible label | `aria-label` or visible text |
| 27 | Nav links have focus states | Visible focus ring (existing AppLayout pattern) |

## Definition of Done

Phase 1 is **done** when:

- [ ] All build/lint/format checks pass
- [ ] Role switcher checks (#1–6) pass
- [ ] Routing checks (#7–12) pass
- [ ] Mock data checks (#13–18) pass
- [ ] Browser scenarios (#19–21) pass
- [ ] Desktop UI audit checks (#22–24) pass
- [ ] Responsive smoke (#25) passes
- [ ] Accessibility smoke (#26–27) pass
- [ ] No application regressions to existing home/layout styling
- [ ] Handoff notes documented in STATE.md (persona names, routes, redirect rules, seed-count deferral)
- [ ] Carlos confirms persona names or accepts placeholders
- [ ] Volodymyr completes implementation handoff to Ivan
- [ ] Ivan signs off validation → Phase 2 may begin

## Out of Scope for Phase 1 QA

Do **not** block Phase 1 on: dashboard widgets, subordinates table, profiles, resourcing forms, custom lists, full 500+ seed, assignment history.
