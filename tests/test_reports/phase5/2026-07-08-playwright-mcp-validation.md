# Phase 5 — Playwright MCP Browser Validation Report

**Date:** 2026-07-08  
**Environment:** Chromium 1280×800, `npm run dev`, MSW seed `faker.seed(20260625)`  
**Method:** Playwright MCP (`browser_run_code_unsafe`) + `npm run test:e2e` regression

## Summary

| Outcome | Count |
| ------- | ----- |
| PASS    | 53    |
| FAIL    | 5     |
| PARTIAL | 2     |
| BLOCKED | 4     |

## Regression

- Phases 1–4 E2E: **224 passed** (4.5m) — PASS (#56)

## Critical failures

### Profile sync (#24, #25, #55)

- Inline list edit commits in table (PATCH `/api/people/:id/custom-field-values` → 200 with updated `customFieldValues`).
- Subsequent GET `/api/people/:id` returns **stale** `customFieldValues` (`Available` instead of committed value).
- Employee profile at `/people/person-employee-001` does not reflect list edit.

### Filter bar (#6, #12, #13 partial)

- `CustomListFilterBar` not implemented. Fields with `usage: filter | both` do not render inline filter controls on list tabs.
- Column portion of "Both" works; filter-bar portion does not.

## Blocked

| Row     | Reason                                                                                                                                                           |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #15     | No Number-type custom field in seed data                                                                                                                         |
| #27–#29 | No UI to switch active persona to `persona-um-002` (recipient). API confirms share persistence (`GET /api/custom-lists?managerId=person-um-002` includes Bench). |

## Partial

| Row | Pass                                  | Fail                                                                                       |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| #7  | SRS-COPY5-002 (`List not configured`) | SRS-COPY5-001 (`No employees match`) — no zero-row filter scenario observed in seeded data |
| #13 | Column renders for `Both` usage       | Filter bar missing                                                                         |

## Source-confirmed (#57–#64)

Code inspection PASS for all architecture rows (see VALIDATION.md).
