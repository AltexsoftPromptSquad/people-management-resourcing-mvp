import { phase3Baselines, phase3Routes } from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { expect, test } from '../support/test'

test.describe('Phase 3 - non-functional requirements', () => {
  test('P3-N01: profile pages only call the mocked frontend API, never a real backend', async ({
    page,
  }) => {
    const requestUrls: string[] = []
    page.on('request', (request) => {
      const url = new URL(request.url())
      if (url.pathname.startsWith('/api/')) {
        requestUrls.push(url.href)
      }
    })

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    for (const tabLabel of phase3Baselines.expectedTabLabels) {
      await profile.openTab(tabLabel)
    }

    expect(requestUrls.length).toBeGreaterThan(0)
    for (const url of requestUrls) {
      expect(new URL(url).origin).toBe(new URL(page.url()).origin)
    }
  })

  test('P3-N02: managerial and personal profiles render without horizontal overflow at 1280px', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.profile)
    const profileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(profileOverflow).toBe(false)

    await appShell.switchRole('Employee')
    const myProfileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(myProfileOverflow).toBe(false)
  })

  test('P3-N03: repeated loads of the same profile render identical seeded data', async ({
    page,
  }) => {
    const { employeePerson, feedbacksForEmployee } = phase3Baselines

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')
    // `toHaveCount` polls until the feedback query resolves, unlike a one-shot `.count()` call.
    await expect(profile.tabPanel().getByRole('listitem')).toHaveCount(feedbacksForEmployee.length)
    await expect(page.getByText(`Risk: ${employeePerson.riskLevel}`, { exact: true })).toBeVisible()

    await page.reload()
    await profile.expectLoaded(phase3Baselines.employeeFullName)
    await profile.openTab('Feedbacks')
    await expect(profile.tabPanel().getByRole('listitem')).toHaveCount(feedbacksForEmployee.length)
    await expect(page.getByText(`Risk: ${employeePerson.riskLevel}`, { exact: true })).toBeVisible()
  })
})
