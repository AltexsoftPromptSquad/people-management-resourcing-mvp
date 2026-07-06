---
name: pmr-playwright-tests
description: Create and extend Playwright e2e tests for the People Management & Resourcing MVP. Use when asked to write Playwright tests, add e2e coverage, create page objects, extend fixtures, or validate app behavior against mock data. Each section/chapter from the input context (BRD, SRS, VALIDATION.md) must map to a dedicated spec.ts; fixtures pull from src/mocks as the expected-result baseline.
---

# PMR Playwright Tests

## Before You Begin

1. Read the relevant BRD/SRS/VALIDATION section for the feature being tested.
2. Identify which `src/mocks/data/*.ts` files hold the seeded entities.
3. Read neighboring spec files in `tests/e2e/phase{n}/` to match naming and style.

## File Organization

```
tests/e2e/
├── support/
│   ├── test.ts              # Custom test — always import test + expect from here
│   └── console-monitor.ts
├── fixtures/
│   ├── phaseN-data.ts       # Phase-scoped routes, roles, baselines derived from src/mocks
│   └── *-util.ts            # Shared helpers (any function used in 2+ tests/files)
├── page-objects/
│   └── FeaturePage.ts       # One class per feature area
└── phaseN/
    └── section-name.spec.ts # One spec per section/chapter of the context document
```

**Rules:**

- One `test.describe` and `*.spec.ts` per section/chapter. Test IDs in test names: `PN-ABC01:`.
- All reusable logic (format helpers, `ensure`, `overrideFetch`) → `fixtures/*-util.ts`.
- Never inline shared utilities in spec files.
- Read relevant `/src/pages` and `/src/shared` files to design better page objects and tests
- Don't ever use hard waits
- Compare the actual MSW API response in runtime against the fitures \*data.ts
-

## Fixture Data File

Create or extend `tests/e2e/fixtures/phaseN-data.ts`:

```ts
// 1. Route helpers from src/app/routes
import { getFeaturePagePath } from '../../../src/app/routes'
// 2. Raw mock arrays from src/mocks/data/* — these are the expected-result baseline
import { resourcingRequests } from '../../../src/mocks/data/resourcing-requests'
import { personas } from '../../../src/mocks/data/personas'
// 3. ensure() — fails at import time so missing seed data is caught immediately
const ensure = <T>(v: T | undefined, msg: string): T => {
  if (v === undefined) throw new Error(msg)
  return v
}
// 4. Export typed constants
export const phaseNRoutes = { ... } as const
export const phaseNBaselines = { ... } as const
```

Tests compare what the real app renders against values sourced from `phaseNBaselines`.

## Spec File Structure

```ts
// tests/e2e/phaseN/feature.spec.ts
import { phaseNBaselines, phaseNRoutes } from '../fixtures/phaseN-data'
import { FeaturePage } from '../page-objects/FeaturePage'
import { expect, test } from '../support/test' // ← always support/test, not @playwright/test

test.describe('Phase N - Section Title', () => {
  test('PN-ABC01: human-readable description', async ({ page, appShell }) => {
    await page.goto(phaseNRoutes.targetPage)
    const ui = new FeaturePage(page)
    await expect(ui.heading()).toBeVisible()
    await expect(page.getByText(phaseNBaselines.someField)).toBeVisible()
  })
})
```

Map each AC/FR/check in the context document to at least one test. Use the requirement ID as the test name prefix.

## Page Object Pattern

```ts
// tests/e2e/page-objects/FeaturePage.ts
import { expect, type Locator, type Page } from '@playwright/test'

export class FeaturePage {
  constructor(private readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Page Title' })
  }

  // Scoped section — avoids matching outer wrapper sections
  section(title: string): Locator {
    return this.page
      .getByRole('heading', { level: 2, name: title, exact: true })
      .locator('xpath=ancestor::section[1]')
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible()
  }
}
```

Only `@playwright/test` imports in page objects. Spec files import from `../support/test`.

## Simulating Empty / Error / Loading States

Use `overrideFetch` (defined in `fixtures/phase3-data.ts` or extract to `fixtures/fetch-util.ts`).
Call `page.addInitScript` **before** `page.goto` — MSW sits below `window.fetch`, so `page.route()` cannot intercept these requests:

```ts
import { overrideFetch, type FetchOverrideRule } from '../fixtures/phase3-data'

await page.addInitScript(overrideFetch, [
  { urlIncludes: '/feedbacks', respondWith: { status: 200, body: [] } },
  { urlIncludes: '/risks', respondWith: { status: 500, body: {} } },
] satisfies FetchOverrideRule[])
await page.goto(phaseNRoutes.profile)
```

Use `delayMs` (instead of `respondWith`) for loading-skeleton tests.
The `urlIncludes` match is path-boundary-aware: `/risks` does not match `/risks/history`.

## Reusable Utilities in `fixtures/*-util.ts`

Extract any function used in two or more tests or spec files:

```ts
// tests/e2e/fixtures/format-util.ts
export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

export const formatPhone = (phone: string) => phone.replace(/\s*x\d+$/i, '').trim()
```

## Data-Dependent Tests

Skip gracefully when baseline data may be absent:

```ts
test.skip(baseline.risksForEmployee.length === 0, 'Requires seeded risks')
```

## Role Switching

```ts
await appShell.switchRole('Unit Manager')
await appShell.switchRole('Sales / Delivery Manager')
await appShell.switchRole('Employee')
```

`appShell` is injected by the custom `test` fixture in `support/test.ts`.

## Console Error Detection

```ts
test('PN-NF01: no console errors on page load', async ({ page, consoleMonitor }) => {
  await page.goto(phaseNRoutes.targetPage)
  expect(consoleMonitor.errors).toHaveLength(0)
  expect(consoleMonitor.pageErrors).toHaveLength(0)
})
```

## Coverage Rule

Every verifiable item in the input context (AC, FR, BRD check, VALIDATION.md row) must map to at least one test. Prefer one `describe` block per section and one test per check; group tightly-coupled checks into a single test only when they share identical setup.

## Running Tests

Run all created (and/or affected) tests in the end. Iterate until all affected tests pass (except those which fail due to correct assertions)

```bash
npx playwright install chromium   # first time or after playwright version bump
npm run test:e2e
```
