# Phase 1 Foundation — Playwright E2E Validation Test

## Test Metadata

| Field               | Value                                                                                                                                                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test type           | Phase 1 validation — build checks + live browser E2E (Playwright MCP)                                                                                                                                                                              |
| Date executed       | 2026-06-25                                                                                                                                                                                                                                         |
| Executed by (model) | Claude Sonnet 4.6 (Cursor agent / Playwright MCP)                                                                                                                                                                                                  |
| Test environments   | (1) Production — `https://people-management-resourcing-mvp.vercel.app` · (2) Local dev — `http://localhost:5173` (`npm run dev`, Vite v8.0.16)                                                                                                     |
| Viewport            | 1280 × 800 (desktop, ≥ 1280 px — required by VALIDATION.md §env)                                                                                                                                                                                   |
| Checklist source    | `.planning/phases/phase-1-foundation/VALIDATION.md`                                                                                                                                                                                                |
| Method              | (1) Local: `npm install` → `npm run build` → `npm run lint` → `npm run format:check`; (2) Live browser automation via Playwright MCP against both Vercel and localhost: navigate, click, evaluate JS, take screenshots, inspect a11y tree / styles |
| Node modules        | Installed fresh — 324 packages, 0 vulnerabilities (`npm install` exit 0)                                                                                                                                                                           |
| Build executed?     | **Yes** — all three checks run and passed (see §6)                                                                                                                                                                                                 |
| Result summary      | **Phase 1 is ready for sign-off. All 20 functional/browser/a11y checks pass. All 3 build/lint/format checks pass. 0 failures across both environments.**                                                                                           |

---

## 1. Role Switcher (FR-RS-\*, AC-RS-\*)

| #   | Check                                | Expected                                           | Actual                                                                                                                                                       | Result  |
| --- | ------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| 1   | Role switcher visible in header      | UM, DM, Employee options present                   | `role="group"` `aria-label="Active role"` with three buttons: **Unit Manager**, **Sales / Delivery Manager**, **Employee**                                   | ✅ Pass |
| 2   | Default UM persona loads             | Dashboard placeholder route loads                  | URL `/dashboard`; heading **Manager Dashboard**; persona **Olena Kovalenko**; Unit Manager button `aria-pressed="true"`                                      | ✅ Pass |
| 3   | Switch to DM                         | Nav changes; resourcing requests placeholder loads | Click **Sales / Delivery Manager** → URL `/resourcing/requests`; nav shows **Resourcing Requests**; persona **Marcus Reed**; heading **Resourcing Requests** | ✅ Pass |
| 4   | Switch to Employee                   | Nav changes; my-profile placeholder loads          | Click **Employee** → URL `/my-profile`; nav shows **My Profile**; persona **Nazar Petrenko**; heading **My Profile**                                         | ✅ Pass |
| 5   | Role switch without full page reload | Content and nav update in-app                      | Each role switch triggers client-side navigation only — URL, heading, nav link, and persona name update without a full page reload                           | ✅ Pass |
| 6   | Each role shows different nav items  | No UM-only links visible as Employee               | UM: **Dashboard** only · DM: **Resourcing Requests** only · Employee: **My Profile** only — no cross-role nav links observed in any role                     | ✅ Pass |

---

## 2. Routing

| #   | Check                          | Expected                                                                 | Actual                                                                                                         | Result  |
| --- | ------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------- |
| 7   | `/` behavior                   | Redirects to role landing or shows home — consistent with implementation | `GET /` → immediate redirect to `/dashboard` (UM role landing); page title and content correct                 | ✅ Pass |
| 8   | Unknown route                  | Redirects to valid page (no blank screen)                                | `GET /this-route-does-not-exist` → redirects to `/dashboard`; no blank screen, no error boundary               | ✅ Pass |
| 9   | Direct URL to wrong-role route | Redirects to current role's landing or shows access message              | Navigating to `/my-profile` while active role is UM → redirects to `/dashboard`; UM content rendered correctly | ✅ Pass |
| 10  | Browser back/forward           | Works without broken state                                               | `page.goBack()` from DM view rendered DM content (heading, persona, nav) without broken state or empty screen  | ✅ Pass |

---

## 3. Mock Data Layer

| #   | Check                                      | Expected                                                     | Actual                                                                                                                                                                                                                                                         | Result  |
| --- | ------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 11  | Mock data layer active in dev              | Seeded/mock requests resolve (MSW or equivalent if used)     | Console: `Worker script URL: /mockServiceWorker.js` registered; `serviceWorker` in navigator confirmed; 0 console errors, 0 warnings (both environments)                                                                                                       | ✅ Pass |
| 12  | Personas endpoint returns 3 records        | UM, DM, Employee personas with distinct IDs                  | `fetch('/api/personas')` intercepted by MSW → returns exactly 3 records: `persona-um-001` (Olena Kovalenko / unit-manager), `persona-dm-001` (Marcus Reed / delivery-manager), `persona-employee-001` (Nazar Petrenko / employee)                              | ✅ Pass |
| 13  | Brief loading state                        | Placeholder pages show loading before data (if query-driven) | Source-confirmed: `DashboardPage` uses `useActivePersona()` (TanStack Query); `isPending === true` renders `<LoadingState aria-busy="true" label="Loading manager workspace">`. The state is imperceptible at dev-server speed but the code path is confirmed. | ✅ Pass |
| 14  | No hard-coded large datasets in components | Data comes from mocks/factories                              | All persona/people data served via MSW handlers. 75 people (`/api/people`), 3 units (`/api/units`), 3 skills (`/api/skills`), 2 requests (`/api/resourcing/requests`) all resolved from mock factories — no inline arrays in rendered DOM.                     | ✅ Pass |

---

## 4. Browser Behaviour (manual via Playwright)

| #   | Scenario                       | Steps                              | Expected                                                | Actual                                                                                                                                                                   | Result  |
| --- | ------------------------------ | ---------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| 15  | Fresh load as UM               | Navigate to `/dashboard`           | Dashboard placeholder, UM nav                           | URL `/dashboard`; heading **Manager Dashboard**; persona **Olena Kovalenko**; nav link **Dashboard**                                                                     | ✅ Pass |
| 16  | Switch UM → DM → Employee → UM | Click each role button in sequence | Each switch updates nav and main content                | Full cycle tested: UM (`/dashboard`, Olena) → DM (`/resourcing/requests`, Marcus) → Employee (`/my-profile`, Nazar) → UM (`/dashboard`, Olena) — all transitions correct | ✅ Pass |
| 17  | Desktop header usability       | Viewport set to 1280 × 800         | Header and role switcher usable without layout breakage | `setViewportSize(1280, 800)`: all 3 role buttons visible and interactive; no overflow, clipping, or wrapping observed                                                    | ✅ Pass |
| 18  | Keyboard focus — role switcher | Tab to role switcher               | Focus ring visible; operable                            | Tab navigation reaches role switcher buttons; focused button has computed `box-shadow: oklab(0.372 -0.00968 -0.0429 / 0.3) 0px 0px 0px 3px` — visible 3 px focus ring    | ✅ Pass |

---

## 5. Accessibility Smoke

| #   | Check                              | Expected                                        | Actual                                                                                                                                                                                                  | Result  |
| --- | ---------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 19  | Role switcher has accessible label | `aria-label` or visible text                    | `role="group"` element has `aria-label="Active role"`; each button has visible text label (e.g. "Unit Manager") and `aria-pressed` state tracking active selection                                      | ✅ Pass |
| 20  | Nav links have focus states        | Visible focus ring (existing AppLayout pattern) | Focused `<a>` in primary nav has computed `box-shadow: oklch(0.372 0.044 257.287) 0px 0px 0px 4px` — 4 px blue-tinted ring on top of a 2 px white offset ring; distinct and meets visual focus guidance | ✅ Pass |

---

## 6. Build / Lint / Format

All three checks executed locally after `npm install` (324 packages, 0 vulnerabilities).

| Check            | Command                | Exit code | Output                                                                                                                                                                                                       | Result  |
| ---------------- | ---------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| TypeScript build | `npm run build`        | 0         | `tsc -b` clean; Vite v8.0.16 bundled 2 234 modules — `dist/index.html` 0.48 kB, `dist/assets/index-*.css` 19 kB, `dist/assets/index-*.js` 359 kB, `dist/assets/browser-*.js` 831 kB (MSW SW). Built in 22 s. | ✅ Pass |
| ESLint           | `npm run lint`         | 0         | No errors, no warnings. (Took ~96 s first run — cold cache.)                                                                                                                                                 | ✅ Pass |
| Prettier         | `npm run format:check` | 0         | `All matched files use Prettier code style!` — 8 markdown files had formatting drift and were corrected with `npm run format` before the final check.                                                        | ✅ Pass |

> **Prettier note:** On the first run, 8 `.md` files (planning docs, BRD, test reports) had formatting drift. `npm run format` corrected them; the final `npm run format:check` exits 0. Source `.ts`/`.tsx` files were already clean.
>
> **Build note:** The 500 kB chunk-size advisory in the Vite output refers to the MSW service-worker bundle (`browser-*.js`, 831 kB). This is expected for a dev-only mock tool and is not a build error. Consider lazy-loading or build-env guarding in a later phase if bundle size becomes a concern.

---

## 7. Localhost Dev Server Verification

Dev server started with `npm run dev` (Vite v8.0.16, ready in 461 ms, `http://localhost:5173`). Playwright suite re-run against localhost.

| Check                                      | Localhost result                                                                          | Matches Vercel |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------- |
| Route behaviour (`/`, unknown, wrong-role) | Identical — all redirects correct                                                         | ✅ Yes         |
| Role switcher cycle (UM→DM→Emp→UM)         | All transitions correct; URLs, headings, personas match                                   | ✅ Yes         |
| MSW active                                 | `Worker script URL: http://localhost:5173/mockServiceWorker.js`; 0 errors, 0 warnings     | ✅ Yes         |
| `/api/personas`                            | 3 records — `persona-um-001`, `persona-dm-001`, `persona-employee-001`                    | ✅ Yes         |
| `/api/people`                              | 75 people across 3 units (seed count per STATE.md Phase 1 handoff)                        | ✅ Yes         |
| `/api/units`                               | 3 units                                                                                   | ✅ Yes         |
| `/api/skills`                              | 3 skills                                                                                  | ✅ Yes         |
| `/api/resourcing/requests`                 | 2 requests                                                                                | ✅ Yes         |
| Loading state (check #13)                  | `DashboardPage` source confirmed: `isPending` → `<LoadingState aria-busy="true">` renders | ✅ Confirmed   |

---

## 8. Confirmed Persona & Mock Data Inventory

Verified via `GET /api/personas` (MSW-intercepted, both environments):

| Persona ID             | Role               | Display Name    | Title             | Unit            |
| ---------------------- | ------------------ | --------------- | ----------------- | --------------- |
| `persona-um-001`       | `unit-manager`     | Olena Kovalenko | Unit Manager      | `unit-platform` |
| `persona-dm-001`       | `delivery-manager` | Marcus Reed     | Delivery Manager  | —               |
| `persona-employee-001` | `employee`         | Nazar Petrenko  | Software Engineer | `unit-platform` |

Additional seeded mock endpoints verified on localhost:

| Endpoint                       | Record count | Notes                                    |
| ------------------------------ | ------------ | ---------------------------------------- |
| `GET /api/personas`            | 3            | All 3 roles, distinct IDs                |
| `GET /api/people`              | 75           | Faker-generated across 3 units           |
| `GET /api/units`               | 3            | `unit-platform`, `unit-product`, 1 other |
| `GET /api/skills`              | 3            | Seeded skills                            |
| `GET /api/resourcing/requests` | 2            | Seeded requests                          |

> STATE.md Phase 1 handoff note: full 500+ person seed is deferred to Phase 2; 75 is the Phase 1 target.

---

## 9. Extended Coverage (SRS / PLAN / IMPLEMENTATION_PLAN beyond VALIDATION.md)

`VALIDATION.md` items #1–20 are the formal QA gate and all pass (§1–§5). The following additional checks trace to requirements in `SRS.md`, `PLAN.md`, and `IMPLEMENTATION_PLAN.md` that are not represented one-to-one in the 20-item checklist. They are recorded here for full Phase 1 traceability.

**Verification method legend:** _Playwright-observed_ = confirmed during the live browser run in §1–§7 · _Source-confirmed_ = verified by static reading of `src/` (no new browser run) · _Recommended_ = not executed in this run; suggested before formal close.

| #   | Check                                            | Requirement ref                             | Expected                                                                   | Verification method                                 | Result              |
| --- | ------------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------- | ------------------- |
| 21  | Each placeholder page has exactly one `h1`       | SRS-A11Y-005                                | One clear role-appropriate `h1` per landing page                           | Source-confirmed                                    | ✅ Pass             |
| 22  | Placeholder pages render shared empty-state      | SRS-F1-055, SRS-F1-058                      | Dashboard / Resourcing / My Profile render `<EmptyState>` primitive        | Source-confirmed                                    | ✅ Pass             |
| 23  | Active nav/role state conveyed beyond color      | SRS-A11Y-004, UI req #6                     | `aria-current="page"` on active nav link; `aria-pressed` on role button    | Source-confirmed + Playwright-observed              | ✅ Pass             |
| 24  | Role state session-only; reload resets to UM     | SRS §6.3, IMPLEMENTATION_PLAN (persistence) | Zustand store has no reload persistence; reload returns to UM/`/dashboard` | Source-confirmed; browser reload **Recommended**    | ⚠️ Source-confirmed |
| 25  | No blocking console errors during role switching | SRS-NF1-009                                 | Console clean across full UM→DM→Emp→UM cycle                               | Playwright-observed (§3 #11: 0 errors / 0 warnings) | ✅ Pass             |
| 26  | Persona IDs are stable (not regenerated)         | SRS-F1-074, SRS-F1-081                      | `persona-um/dm/employee-001` stable across imports/requests                | Source-confirmed + Playwright-observed              | ✅ Pass             |
| 27  | DM nav exposes no direct employee-browsing links | SRS-F1-035, BR-002                          | DM navigation shows only Resourcing Requests                               | Playwright-observed (§1 #6)                         | ✅ Pass             |
| 28  | Routes via helpers; registered only in router    | SRS-F1-037, SRS-F1-040, SRS-F1-041          | Path helpers in `src/app/routes.ts`; registration only in `router.tsx`     | Source-confirmed                                    | ✅ Pass             |

**Source evidence for the static-confirmed rows:**

- #21 / #22 — `DashboardPage.tsx`, `ResourcingRequestsPage.tsx`, `MyProfilePage.tsx` each render a single `<h1>` plus `<EmptyState>` (and `LoadingState`/`ErrorState` for the query path).
- #23 — `AppLayout.tsx` uses React Router `NavLink` (sets `aria-current="page"` on the active link by default) and the active role button carries `aria-pressed` (`RoleSwitcher.tsx`), so active state is not color-only.
- #24 — `src/store/role-store.ts` initializes `activeRole: 'unit-manager'` with no persistence middleware, matching the IMPLEMENTATION_PLAN "Reload resets to Unit Manager" decision. A live reload-state check was not part of this run.
- #26 — `src/mocks/data/personas.ts` defines fixed string IDs; `people.ts` calls `faker.seed(20260625)` for deterministic generated records.
- #28 — `src/app/routes.ts` exposes `getDashboardPagePath`, `getResourcingRequestsPagePath`, `getMyProfilePagePath`, `getRoleLandingPagePath`; routes are registered only in `src/app/router.tsx`.

> **Note on out-of-scope SRS areas:** SRS-F1-029/SRS-F1-010 §10 (shared `Select` primitive) intentionally does **not** apply — the IMPLEMENTATION_PLAN selected a segmented `Button` group, so no `src/shared/ui/select/` is expected. Handoff documentation items (SRS-F1-100–102 / STATE.md, STATUS.md) remain pending owners (Ivan/Carlos) and are tracked in the Definition of Done below, not as code checks.

---

## 10. Verdict

| Category                             | Checks | Pass   | Inconclusive | Fail  |
| ------------------------------------ | ------ | ------ | ------------ | ----- |
| Role Switcher (FR-RS-\*, AC-RS-\*)   | 6      | 6      | 0            | 0     |
| Routing                              | 4      | 4      | 0            | 0     |
| Mock Data Layer                      | 4      | 4      | 0            | 0     |
| Browser Behaviour                    | 4      | 4      | 0            | 0     |
| Accessibility Smoke                  | 2      | 2      | 0            | 0     |
| **Total (functional/browser/a11y)**  | **20** | **20** | **0**        | **0** |
| Build (`npm run build`)              | 1      | 1      | 0            | 0     |
| Lint (`npm run lint`)                | 1      | 1      | 0            | 0     |
| Format (`npm run format:check`)      | 1      | 1      | 0            | 0     |
| **Total (build/lint/format)**        | **3**  | **3**  | **0**        | **0** |
| **Grand total (VALIDATION.md gate)** | **23** | **23** | **0**        | **0** |

### Extended coverage (§9 — SRS/PLAN traceability, recorded separately from the formal gate)

| Category                          | Checks | Pass | Source-confirmed only | Fail |
| --------------------------------- | ------ | ---- | --------------------- | ---- |
| Extended SRS/PLAN checks (#21–28) | 8      | 7    | 1 (#24 reload)        | 0    |

> #24 (reload resets to UM) is confirmed by source (no persistence in the Zustand store); a live browser reload check is recommended before formal close but is not a blocker.

**Overall: PASS — Phase 1 foundation is complete and ready for sign-off.** All 20 functional/browser/a11y checks plus 3 build/lint/format checks pass on both the live Vercel deployment and localhost. The 8 extended SRS/PLAN traceability checks (§9) are also satisfied (7 verified, 1 source-confirmed). No failures, no blockers.

### Definition of Done checklist status

- [x] All build/lint/format checks pass — **`npm run build` exit 0, `npm run lint` exit 0, `npm run format:check` exit 0**
- [x] Role switcher checks #1–6 — **passed**
- [x] Routing checks #7–10 — **passed**
- [x] Mock data checks #11–14 — **passed** (check #13 loading state confirmed via source code)
- [x] Browser scenarios #15–18 — **passed**
- [x] Accessibility smoke #19–20 — **passed**
- [x] No application regressions to home/layout — **no regressions observed**
- [ ] Handoff notes documented in STATE.md (persona names, routes) — **pending Ivan**
- [ ] `STATUS.md` updated — **pending Ivan**
- [ ] Carlos confirms persona names or accepts placeholders — **pending Carlos**
- [ ] Ivan signs off validation → Phase 2 may begin — **pending sign-off**

### Remaining actions before formal Phase 1 close

1. Ivan: update `STATE.md` handoff section and `STATUS.md` with validation completion.
2. Carlos: confirm or amend placeholder persona names (Olena Kovalenko, Marcus Reed, Nazar Petrenko).
3. Once sign-offs are obtained, advance to Phase 2.
