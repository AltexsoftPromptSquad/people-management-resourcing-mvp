import type { Page } from '@playwright/test'
import { getDashboardPagePath } from '../../../src/app/routes'
import { phase4Routes } from '../fixtures/phase4-data'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { ResourcingRequestsPage } from '../page-objects/ResourcingRequestsPage'
import { SharedProfilePublicPage } from '../page-objects/SharedProfilePublicPage'
import { expect, test } from '../support/test'

const navigateWithinSpa = async (page: Page, route: string) => {
  await page.evaluate((nextRoute) => {
    window.history.pushState({}, '', nextRoute)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, route)
}

test.describe('Phase 4 - routing and role guards', () => {
  test('P4-R01: DM opens /resourcing/requests and My Requests page renders', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
    const ui = new ResourcingRequestsPage(page)
    await ui.expectLoaded()
    await expect(page.getByRole('button', { name: 'New Request' })).toBeVisible()
  })

  test('P4-R02: UM opens /resourcing/incoming and Incoming Requests page renders', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
  })

  test('P4-R03: UM direct-nav to /resourcing/requests redirects to /dashboard', async ({
    page,
    appShell,
  }) => {
    await page.goto(getDashboardPagePath())
    // default role is Unit Manager
    await navigateWithinSpa(page, phase4Routes.dmRequests)
    await expect(page).toHaveURL(new RegExp(`${getDashboardPagePath()}$`))
    await expect(appShell.roleButton('Unit Manager')).toBeVisible()
  })

  test('P4-R04: DM direct-nav to /resourcing/incoming redirects to /resourcing/requests', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
    await navigateWithinSpa(page, phase4Routes.umIncoming)
    await expect(page).toHaveURL(new RegExp(`${phase4Routes.dmRequests}$`))
  })

  test('P4-R05: public /shared/:token renders shared profile without app nav shell', async ({
    page,
  }) => {
    await page.goto(phase4Routes.sharedProfile)
    const ui = new SharedProfilePublicPage(page)
    await ui.expectLoaded()
    await ui.expectNoAppNav()
    await expect(page.getByRole('group', { name: 'Active role' })).toHaveCount(0)
  })

  test('P4-R06: invalid shared token shows ErrorState with profile-unavailable message', async ({
    page,
  }) => {
    await page.goto(phase4Routes.invalidSharedProfile)
    const ui = new SharedProfilePublicPage(page)
    await expect(ui.errorState()).toBeVisible()
    await expect(ui.errorState()).toContainText('Profile not available')
    await expect(ui.errorState()).toContainText(
      'This shared profile link is no longer active or does not exist.',
    )
  })
})
