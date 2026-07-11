import { phase3Baselines, phase3Routes } from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { SubordinatesPage } from '../page-objects/SubordinatesPage'
import { expect, test } from '../support/test'

test.describe('Phase 3 - profile tabs shell', () => {
  test('P3-T01: all seven tabs are present', async ({ page }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)

    for (const tabLabel of phase3Baselines.expectedTabLabels) {
      await expect(profile.tab(tabLabel)).toBeVisible()
    }
    await expect(profile.tabList().getByRole('tab')).toHaveCount(
      phase3Baselines.expectedTabLabels.length,
    )
  })

  test('P3-T02: Overview tab is active on first mount', async ({ page }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)

    await expect(profile.tab('Overview')).toHaveAttribute('aria-selected', 'true')
    await expect(profile.section('Basic Information')).toBeVisible()
  })

  test('P3-T03: switching tabs renders content without a full page reload', async ({ page }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)

    await page.evaluate(() => {
      ;(window as unknown as { __phase3NoReloadMarker?: string }).__phase3NoReloadMarker = 'kept'
    })

    await profile.openTab('Job and Skills')
    await expect(profile.tab('Job and Skills')).toHaveAttribute('aria-selected', 'true')
    await expect(profile.section('Employment Details')).toBeVisible()

    const marker = await page.evaluate(
      () => (window as unknown as { __phase3NoReloadMarker?: string }).__phase3NoReloadMarker,
    )
    expect(marker).toBe('kept')
  })

  test('P3-T04: re-entering the profile resets the active tab to Overview', async ({ page }) => {
    await page.goto(phase3Routes.subordinates)
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()
    await subordinates.searchForPerson(phase3Baselines.employeeFullName)

    await page.getByRole('button', { name: phase3Baselines.employeeFullName }).first().click()
    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(phase3Baselines.employeeFullName)

    await profile.openTab('Feedbacks')
    await expect(profile.tab('Feedbacks')).toHaveAttribute('aria-selected', 'true')

    await profile.backButton().click()
    await expect(page).toHaveURL(new RegExp(`${phase3Routes.subordinates}(?:\\?.*)?$`))
    await subordinates.searchForPerson(phase3Baselines.employeeFullName)

    await page.getByRole('button', { name: phase3Baselines.employeeFullName }).first().click()
    await profile.expectLoaded(phase3Baselines.employeeFullName)
    await expect(profile.tab('Overview')).toHaveAttribute('aria-selected', 'true')
  })
})
