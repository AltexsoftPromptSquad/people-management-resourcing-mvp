import { phase1Roles, phase1Routes, stablePersonaIds } from '../fixtures/mock-baselines'
import { expect, test } from '../support/test'

test.describe('Phase 1', () => {
  test.describe('browser-backed checks', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(phase1Routes.dashboard)
    })

    test('check #21: each landing page renders exactly one h1', async ({ page, appShell }) => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

      await appShell.switchRole(phase1Roles.deliveryManager.label)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

      await appShell.switchRole(phase1Roles.employee.label)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    })

    test('check #22: each landing page renders expected phase-appropriate content', async ({
      page,
      appShell,
    }) => {
      const hasLegacyDashboardPlaceholder = await page
        .getByText('Dashboard foundation is ready')
        .isVisible()

      if (hasLegacyDashboardPlaceholder) {
        await expect(page.getByText('Dashboard foundation is ready')).toBeVisible()
      } else {
        await expect(page.getByRole('region', { name: 'Dashboard summary' })).toBeVisible()
      }

      await appShell.switchRole(phase1Roles.deliveryManager.label)
      const hasLegacyResourcingPlaceholder = await page
        .getByText('Resourcing foundation is ready')
        .isVisible()

      if (hasLegacyResourcingPlaceholder) {
        await expect(page.getByText('Resourcing foundation is ready')).toBeVisible()
      } else {
        await expect(page.getByRole('heading', { level: 1, name: 'My Requests' })).toBeVisible()
      }

      await appShell.switchRole(phase1Roles.employee.label)
      const hasLegacyEmployeePlaceholder = await page
        .getByText('Employee profile foundation is ready')
        .isVisible()

      if (hasLegacyEmployeePlaceholder) {
        await expect(page.getByText('Employee profile foundation is ready')).toBeVisible()
      } else {
        await expect(
          page.getByRole('heading', { level: 1, name: phase1Roles.employee.heading }),
        ).toBeVisible()
        await expect(
          page.getByRole('heading', { level: 2, name: 'Contact Information' }),
        ).toBeVisible()
      }
    })

    test('check #23: active navigation and role state are represented beyond color', async ({
      appShell,
    }) => {
      await expect(appShell.roleButton(phase1Roles.unitManager.label)).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      await expect(appShell.navLink(phase1Roles.unitManager.navLabel)).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    test('check #24: role state is session-only and page reload resets to Unit Manager', async ({
      page,
      appShell,
    }) => {
      await appShell.switchRole(phase1Roles.employee.label)
      await appShell.expectRoleView(phase1Roles.employee)

      await page.reload()
      await appShell.expectRoleView(phase1Roles.unitManager)
    })

    test('check #25: no blocking console errors across full role cycle', async ({
      appShell,
      consoleMonitor,
    }) => {
      await appShell.switchRole(phase1Roles.deliveryManager.label)
      await appShell.switchRole(phase1Roles.employee.label)
      await appShell.switchRole(phase1Roles.unitManager.label)

      expect(consoleMonitor.errors).toEqual([])
      expect(consoleMonitor.warnings).toEqual([])
      expect(consoleMonitor.pageErrors).toEqual([])
    })

    test('check #26: persona IDs remain stable across repeated API calls', async ({ page }) => {
      await page.reload()
      await expect
        .poll(async () => {
          return page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? '')
        })
        .toContain('/mockServiceWorker.js')

      const getPersonaIds = async () => {
        return page.evaluate(async () => {
          const response = await fetch('/api/personas')
          const body = (await response.json()) as Array<{ id: string }>
          return body.map((item) => item.id).sort()
        })
      }

      const first = await getPersonaIds()
      const second = await getPersonaIds()
      expect(first).toEqual(second)
      expect(first).toEqual(stablePersonaIds)
    })

    test('check #27: delivery manager nav exposes no employee-browsing links', async ({
      appShell,
    }) => {
      await appShell.switchRole(phase1Roles.deliveryManager.label)

      await expect(appShell.navLink(phase1Roles.deliveryManager.navLabel)).toBeVisible()
      await expect(appShell.navLink('My Profile')).toHaveCount(0)
      await expect(appShell.navLink('Dashboard')).toHaveCount(0)
    })
  })

  test('check #28: fallback and role guards redirect to the active role landing page', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase1Routes.unknown)
    await appShell.expectRoleView(phase1Roles.unitManager)

    await page.goto(phase1Routes.resourcingRequests)
    await appShell.expectRoleView(phase1Roles.unitManager)

    await page.goto(phase1Routes.myProfile)
    await appShell.expectRoleView(phase1Roles.unitManager)
  })
})
