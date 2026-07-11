import { DashboardPage } from '../page-objects/DashboardPage'
import { phase2Baselines, phase2Roles, phase2Routes } from '../fixtures/phase2-data'
import { expect, test } from '../support/test'

test.describe('Phase 2 - dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(phase2Routes.dashboard)
  })

  test('P2-D01/P2-D02/P2-D09: widgets and dashboard structure match deterministic baseline', async ({
    page,
    appShell,
  }) => {
    const dashboard = new DashboardPage(page)
    await dashboard.expectLoaded()
    await appShell.expectRoleView(phase2Roles.unitManager)

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('region', { name: 'Dashboard summary' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Manager action items' })).toBeVisible()

    await expect(dashboard.summaryValue('Subordinates')).toHaveText(
      String(phase2Baselines.dashboardSummary.subordinateCount),
    )
    await expect(dashboard.summaryValue('Active Risks')).toHaveText(
      String(phase2Baselines.dashboardSummary.activeRisksCount),
    )
    await expect(dashboard.summaryValue('Open Action Items')).toHaveText(
      String(phase2Baselines.dashboardSummary.openActionItemsCount),
    )
    await expect(dashboard.summaryValue('Active Requests')).toHaveText(
      String(phase2Baselines.dashboardSummary.activeResourcingRequestsCount),
    )
  })

  test('P2-D03/P2-D04: top nav links are present and navigate to expected routes', async ({
    page,
    appShell,
  }) => {
    const dashboard = new DashboardPage(page)
    await dashboard.expectLoaded()

    await appShell.navLink('Subordinates').click()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.subordinates}$`))

    await page.goto(phase2Routes.dashboard)
    await appShell.navLink('Custom Lists').click()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.customLists}$`))

    await page.goto(phase2Routes.dashboard)
    await appShell.navLink('Incoming Requests').click()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.resourcingIncoming}$`))

    await page.goto(phase2Routes.dashboard)
    await appShell.navLink('Risks').click()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.risks}$`))
  })

  test('P2-D05/P2-D06: action items are ordered by due date and overdue labeling matches baseline', async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page)
    await dashboard.expectLoaded()

    const renderedRows = await dashboard.actionItemsListItems().allTextContents()
    expect(renderedRows.length).toBeGreaterThan(0)
    expect(renderedRows.length).toBeLessThanOrEqual(10)

    const dueDatesFromUi = renderedRows.map((row) => {
      const match = row.match(/Due\s+(\d{1,2}\s\w{3}\s\d{4})/)
      expect(match).toBeTruthy()
      return new Date(match?.[1] ?? '').getTime()
    })
    const sortedDueDates = [...dueDatesFromUi].sort((left, right) => left - right)
    expect(dueDatesFromUi).toEqual(sortedDueDates)

    const expectedOverdueCount = phase2Baselines.dashboardActionItems.filter(
      (item) => item.isOverdue,
    ).length
    const actualOverdueCount = renderedRows.filter((text) => text.includes('Overdue')).length
    expect(actualOverdueCount).toBe(expectedOverdueCount)

    if (expectedOverdueCount === 0) {
      await expect(page.getByText('Overdue', { exact: true })).toHaveCount(0)
    }
  })

  test('P2-D07: dashboard loading state is rendered while queries are pending', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalFetch = window.fetch.bind(window)
      window.fetch = async (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

        if (url.includes('/api/dashboard/summary')) {
          await new Promise((resolve) => setTimeout(resolve, 900))
        }

        return originalFetch(input, init)
      }
    })

    const reload = page.reload()
    await expect(page.locator('section[aria-busy="true"]')).toContainText(
      'Loading manager dashboard',
    )
    await reload

    const dashboard = new DashboardPage(page)
    await dashboard.expectLoaded()
  })

  test('P2-D08: dashboard error state is rendered when data loading fails', async ({ page }) => {
    await page.addInitScript(() => {
      const originalFetch = window.fetch.bind(window)
      window.fetch = async (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

        if (url.includes('/api/dashboard/summary')) {
          return new Response(
            JSON.stringify({ message: 'Injected dashboard summary failure for e2e coverage.' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }

        return originalFetch(input, init)
      }
    })

    await page.reload()
    const alertState = page.getByRole('alert')
    await expect(alertState).toBeVisible()
    await expect(alertState).toContainText('Something went wrong')
    await expect(alertState).toContainText(
      'Mock data could not be loaded. Try refreshing the page.',
    )
  })

  test('P2-D10: dashboard empty state is rendered when summary payload is unavailable', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalFetch = window.fetch.bind(window)
      window.fetch = async (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

        if (url.includes('/api/dashboard/summary')) {
          return new Response('null', {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        return originalFetch(input, init)
      }
    })

    await page.reload()
    await expect(page.getByText('Dashboard data unavailable')).toBeVisible()
    await expect(
      page.getByText('Summary and action item data could not be loaded for this manager.'),
    ).toBeVisible()
  })
})
