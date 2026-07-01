# Phase 2 Validation

## Scope

Validate manager dashboard and subordinates flow implementation against:

- `SRS.md`
- `IMPLEMENTATION_PLAN.md`
- BRD v1.1 (Phase 2-related FR/AC)

## Checklist

- [x] Unit Manager can open `/dashboard`.
- [x] Unit Manager sees quick navigation to subordinates/custom lists/resourcing/risks.
- [x] Unit Manager can open `/subordinates` from left navigation.
- [x] Subordinates list supports filter/sort and profile drilldown.
- [x] Search behavior is debounced and does not trigger full-page blocking loading on each keystroke.
- [x] Profile drilldown route `/people/:id` is UM-guarded and supports back navigation.
- [x] Non-UM personas are blocked from UM-only routes by route guards.
- [x] Mock datasets satisfy Phase 2 scale targets (500+ people; 10 requests; expanded risk/action items).
- [x] Person-scoped mock endpoints return feedbacks/leaves/risks/action-items/history data.
- [x] `npm run build` passes.
- [x] `npm run lint` passes (with one non-blocking `react-hooks/incompatible-library` warning from TanStack Table usage).
- [x] `npm run format:check` passes.

## Evidence

Validation evidence from the latest execution run (2026-07-01):

| Check area                             | Command                                                                                              | Result  | Evidence summary                                                                                       |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| Build + full automated validation gate | `npm run build`                                                                                      | ✅ Pass | `tsc -b` and Vite build succeeded; Playwright stage reported **68 passed / 0 failed**                  |
| Lint gate                              | `npm run lint`                                                                                       | ✅ Pass | 0 errors; 1 known non-blocking warning (`react-hooks/incompatible-library` in `SubordinatesTable.tsx`) |
| Format gate                            | `npm run format:check`                                                                               | ✅ Pass | `All matched files use Prettier code style!`                                                           |
| Phase 2 async-state accessibility      | `npx playwright test tests/e2e/phase2/accessibility.spec.ts -g "P2-A05"`                             | ✅ Pass | Empty/loading/error semantic container assertions passed                                               |
| Phase 2 sort + filter robustness       | `npx playwright test tests/e2e/phase2/subordinates.spec.ts -g "P2-S03/P2-S04\|P2-S05/P2-S06/P2-S07"` | ✅ Pass | Sort URL-state and filter narrowing checks passed after deterministic wait improvements                |

Supporting test reports:

- `tests/test_reports/phase2/phase-2-playwright-validation.md`
- `tests/test_reports/phase2/phase-2-test-plan.md`
