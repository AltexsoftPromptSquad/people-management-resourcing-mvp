# Project — People Management & Resourcing MVP

## Goal

Build a simple, fast, realistic **frontend-only** internal web app for an engineering organization (500+ employees) to manage people, fulfill staffing requests, and support employee self-service — with **one complete end-to-end resourcing flow** from request creation through candidate approval and assignment history on the employee profile.

All data is seeded or mocked. No real backend, authentication, or external integrations.

**Validation target:** Desktop browser usage only (suggested minimum viewport: 1280px). Mobile, tablet, and narrow-viewport responsive validation are out of scope.

## Current Repo State

| Area                            | Status                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| Tooling                         | Vite, React, TypeScript, Tailwind, ESLint, Prettier, Husky — in place               |
| BRD                             | v1.1 — Remediated 2026-06-27. See `docs/requirements/DECISION-LOG.md`               |
| App shell                       | Phase 1 complete — `AppLayout`, role-aware nav, role switcher, route guards         |
| Routing                         | Phase 1 complete — React Router, role-landing redirects, fallback                   |
| UI primitives                   | Phase 1 — Button, Badge, EmptyState, ErrorState, LoadingState                       |
| Feature modules                 | Phase 1 — `features/roles` only; remaining features not started                     |
| Role switcher / mock data layer | Phase 1 complete — MSW, personas, 75 employees seeded                               |
| Domain types                    | Phase 1 — Person (partial), Persona, Unit, Skill, Role, ResourcingRequest (partial) |

**Next:** Phase 2 — Manager Dashboard & Subordinates. See `.planning/phases/phase-2-dashboard/PLAN.md`.

## Key Roles (Product)

| Role                              | Goal                                                                                                                        |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Unit Manager (UM)**             | Manage subordinates, risks, action items, custom lists; fulfill resourcing requests; propose candidates and shared profiles |
| **Sales / Delivery Manager (DM)** | Create resourcing requests; review proposed candidates; approve or reject with feedback                                     |
| **Employee**                      | View and update own profile (limited fields), action items, IDP, certificates                                               |

Three fixed roles with a **role switcher** (no real login). No dual-role behavior in MVP.

## MVP Delivery Goal

Demonstrate **one complete E2E resourcing journey**:

1. DM creates and submits a request
2. UM receives it, proposes internal + external candidates with shared profile
3. DM approves one candidate and rejects another (rejection reason required)
4. Assignment history appears on the employee profile (separate from project history)

Plus supporting manager dashboard, subordinates list, employee profile views, custom lists, and profile sharing per BRD scope.

## AI-First Experiment Context

This MVP supports an **AI-first delivery experiment**:

- BRD is the stable business source of truth for dev, QA, and AI agents
- Frontend-only web application with a mock data layer (MSW optional per AGENTS.md) + Faker keeps agents unblocked without backend work
- GSD-lite planning (`.planning/`) tracks phases, state, and validation without heavy frameworks
- Requirements are traceable by ID (FR-_, BR-_, AC-\*) for test case and task generation
- Demo-ready seeded personas: 1 UM, 1 DM, 1 Employee; 500+ employees, 10 requests, 3 custom lists

**Source of truth:** `docs/requirements/# Business Requirements Document.md` (v1.1, Active — Remediated 2026-06-27)

**Decision log:** `docs/requirements/DECISION-LOG.md` — audit findings G-1, G-2, G-3, D-1, D-3, A-2, A-3 resolved.
