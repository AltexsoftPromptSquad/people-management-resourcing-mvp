import { phase2Baselines, phase2Routes } from '../fixtures/phase2-data'
import { SubordinatesPage } from '../page-objects/SubordinatesPage'
import { expect, test } from '../support/test'

test.describe('Phase 2 - accessibility checks', () => {
  test('P2-A01/P2-A02: dashboard headings, landmarks, and keyboard focus are accessible', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase2Routes.dashboard)

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('region', { name: 'Dashboard summary' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Quick navigation' })).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Manager action items' })).toBeVisible()

    const navLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', {
      name: 'Subordinates',
    })
    await navLink.focus()
    await expect(navLink).toBeFocused()
    const focusShadow = await appShell.computedStyle(navLink, 'box-shadow')
    expect(focusShadow).not.toBe('none')
  })

  test('P2-A03/P2-A04: sortable headers and filters are keyboard and label accessible', async ({
    page,
  }) => {
    await page.goto(phase2Routes.subordinates)
    await expect(page.getByRole('heading', { level: 1, name: 'Subordinates' })).toBeVisible({
      timeout: 15_000,
    })
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()

    await expect(subordinates.searchInput()).toBeVisible()
    await expect(subordinates.positionSelect()).toBeVisible()
    await expect(subordinates.gradeSelect()).toBeVisible()
    await expect(subordinates.statusSelect()).toBeVisible()
    await expect(subordinates.riskSelect()).toBeVisible()

    const sortButton = subordinates.headerSortButton('Risk')
    await sortButton.focus()
    await expect(sortButton).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/sortField=riskLevel/)
  })

  test('P2-A05: readable empty/loading/error state text and semantics are exposed', async ({
    page,
  }) => {
    await page.goto(phase2Routes.subordinates)
    const subordinates = new SubordinatesPage(page)
    await subordinates.searchInput().fill('zzzzzz-phase-2-a11y-empty')

    await expect
      .poll(() => new URL(page.url()).searchParams.get('search') ?? '')
      .toBe('zzzzzz-phase-2-a11y-empty')

    await expect(page.getByText('No subordinates match the current filters')).toBeVisible()
    await expect(page.getByText('Try clearing one or more filters')).toBeVisible()

    await page.addInitScript(() => {
      const originalFetch = window.fetch.bind(window)
      window.fetch = async (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

        if (url.includes('/api/subordinates')) {
          await new Promise((resolve) => setTimeout(resolve, 900))
        }

        return originalFetch(input, init)
      }
    })

    const dashboardNavigation = page.reload()
    const loadingState = page.locator('section[aria-busy="true"]')
    await expect(loadingState).toContainText('Loading subordinates')
    await dashboardNavigation

    await page.addInitScript(() => {
      const originalFetch = window.fetch.bind(window)
      window.fetch = async (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

        if (url.includes('/api/subordinates')) {
          return new Response(
            JSON.stringify({
              message: 'Injected subordinates failure for accessibility coverage.',
            }),
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
    const errorState = page.getByRole('alert')
    await expect(errorState).toBeVisible()
    await expect(errorState).toContainText('Something went wrong')
    await expect(errorState).toContainText(
      'Mock data could not be loaded. Try refreshing the page.',
    )
  })

  test('P2-A06: overdue state uses text label (not color-only)', async ({ page }) => {
    await page.goto(phase2Routes.dashboard)

    const expectedOverdueCount = phase2Baselines.dashboardActionItems.filter(
      (item) => item.isOverdue,
    ).length

    if (expectedOverdueCount > 0) {
      await expect(page.getByText('Overdue', { exact: true }).first()).toBeVisible()
    } else {
      await expect(page.getByText('Overdue', { exact: true })).toHaveCount(0)
    }
  })

  test('P2-A07: console remains clean across dashboard/subordinates/profile flow', async ({
    page,
    consoleMonitor,
  }) => {
    await page.goto(phase2Routes.dashboard)
    await page.goto(phase2Routes.subordinates)
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()
    await subordinates.searchForPerson(phase2Baselines.profileTarget.fullName)

    await page.getByRole('button', { name: phase2Baselines.profileTarget.fullName }).first().click()
    await page.getByRole('button', { name: 'Back', exact: true }).click()

    expect(consoleMonitor.errors).toEqual([])
    expect(consoleMonitor.warnings).toEqual([])
    expect(consoleMonitor.pageErrors).toEqual([])
  })

  test('P2-N02: dashboard and subordinates fit desktop viewport without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto(phase2Routes.dashboard)
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      )
      .toBeTruthy()

    await page.goto(phase2Routes.subordinates)
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      )
      .toBeTruthy()
  })
})
