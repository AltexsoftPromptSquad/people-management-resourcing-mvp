# Phase 4 — Validation Checklist

## Static Gates

```bash
npm run build
npm run lint
npm run format:check
```

All must exit 0.

## Phase 3 Regression

```bash
npm run test:e2e -- tests/e2e/phase3
```

Expected: 78/78 pass (no regressions from Phase 4 work).

## Phase 4 E2E

```bash
npx playwright install chromium
npm run test:e2e -- tests/e2e/phase4
```

## Manual Demo Scenarios

### Scenario 4 — DM creates request

1. Switch to Delivery Manager (`person-dm-001`).
2. Open `/resourcing/requests`.
3. Click **New Request**, fill required fields, click **Submit**.
4. Request appears in table with status **Submitted**.
5. Switch to Unit Manager; open `/resourcing/incoming`.
6. New request appears in queue.

### Scenario 5 — UM proposes candidates

1. As UM, select `request-001` (or newly submitted request).
2. Check one or more employees; confirm warnings show inline.
3. Add fit summary; optionally generate shared profile.
4. Click **Submit Candidates**; confirm dialog; status becomes **Candidates Proposed**.

### Scenario 6 — DM approves / rejects

1. As DM, select `request-003` (or proposed request).
2. Approve one candidate with optional note.
3. Reject another with required reason.
4. As UM, open employee profile **Resourcing History** tab.
5. New assignment history records visible.

### Shared profile

1. Generate link from proposal panel or profile header.
2. Open `/shared/:token` in new tab (no login).
3. Only selected sections render.

## SRS Traceability

Map each check to `phase-4-test-plan.md` P4-_ cases and SRS-F4-_ IDs.

## Out of Scope (confirm absent)

- Custom list builder (Phase 5)
- UM Assignments section FR-AH-004 (Phase 5)
- Backend / database / auth

## Sign-off

- [ ] Ivan — Phase 3 formal QA sign-off + Phase 4 automated validation complete
- [x] Carlos — SRS scope approved — Carlos Nunes, 2026-07-06
- [x] Carlos — Product sign-off (Demo Scenarios 4, 5, 6) — Carlos Nunes, 2026-07-06
