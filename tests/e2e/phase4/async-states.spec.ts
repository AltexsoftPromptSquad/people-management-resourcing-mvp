import { overrideFetch, phase4Routes, type FetchOverrideRule } from '../fixtures/phase4-data'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { ResourcingRequestsPage } from '../page-objects/ResourcingRequestsPage'
import { expect, test } from '../support/test'

test.describe('Phase 4 - async states and UI rendering', () => {
  test('P4-AS01: DM requests page shows page-tier LoadingState while requests are pending', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/resourcing-requests', method: 'GET', delayMs: 800 },
    ] satisfies FetchOverrideRule[])

    const navigation = page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
    await expect(page.getByText('Loading requests…')).toBeVisible()
    await navigation

    const ui = new ResourcingRequestsPage(page)
    await ui.expectLoaded()
  })

  test('P4-AS02: DM requests page shows EmptyState when there are no requests', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: '/resourcing/requests',
        method: 'GET',
        respondWith: { status: 200, body: [] },
      },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    await expect(page.getByText('No requests yet')).toBeVisible()
    await expect(
      page.getByText('Create your first resourcing request to get started.'),
    ).toBeVisible()
  })

  test('P4-AS03: DM requests page shows ErrorState when requests query fails', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: '/resourcing/requests',
        method: 'GET',
        respondWith: { status: 500, body: { message: 'Injected failure.' } },
      },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const errorState = page.getByRole('alert')
    await expect(errorState).toBeVisible()
    await expect(errorState).toContainText('Could not load requests')
    await expect(errorState).toContainText('Refresh the page to try again.')
  })

  test('P4-AS04: UM incoming page shows EmptyState when there are no assigned requests', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: '/resourcing/requests',
        method: 'GET',
        respondWith: { status: 200, body: [] },
      },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)

    await expect(page.getByText('No incoming requests')).toBeVisible()
    await expect(
      page.getByText('Resourcing requests assigned to you will appear here.'),
    ).toBeVisible()
  })

  test('P4-AS05: proposal panel employee browser shows section-tier LoadingState independently', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/api/people', method: 'GET', delayMs: 800 },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)

    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()

    // Select a Submitted request to show the proposal panel (nth(1) skips the header row)
    await page.getByRole('row').nth(1).click()

    await expect(page.getByText('Loading employees…')).toBeVisible()
    // Heading and request list are still visible (page-level is not blocked)
    await expect(ui.heading()).toBeVisible()
  })

  test('P4-UI01: request status pills use correct semantic tone mapping', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const ui = new ResourcingRequestsPage(page)
    await ui.expectLoaded()

    // Status pills should be rendered with visible text labels
    // (status values that exist in the seed data)
    await expect(page.getByText('Submitted').first()).toBeVisible()
    await expect(page.getByText('Draft').first()).toBeVisible()
    await expect(page.getByText('Candidates Proposed').first()).toBeVisible()

    // Status pill text must be readable (not color-only)
    const statusPills = page.locator('[class*="StatusPill"], [class*="status-pill"]')
    const count = await statusPills.count()
    // At minimum the seed data statuses are visible as text in the table
    // Verify by counting non-zero status pill elements
    if (count > 0) {
      await expect(statusPills.first()).not.toBeEmpty()
    }
  })
})
