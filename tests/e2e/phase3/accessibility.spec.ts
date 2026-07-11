import {
  overrideFetch,
  phase3Baselines,
  phase3Routes,
  type FetchOverrideRule,
} from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { SubordinatesPage } from '../page-objects/SubordinatesPage'
import { selectCustomOption } from '../support/select'
import { expect, test } from '../support/test'

test.describe('Phase 3 - accessibility', () => {
  test('P3-A01: managerial and personal profiles each have a single h1 and labelled tab sections', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.profile)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    const profile = new EmployeeProfilePage(page)
    await expect(profile.tabPanel()).toHaveAttribute('aria-labelledby', /.+/)

    await appShell.switchRole('Employee')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  })

  test('P3-A02: tab strip is keyboard operable with visible focus', async ({ page, appShell }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)

    await profile.tab('Overview').focus()
    await expect(profile.tab('Overview')).toBeFocused()
    const focusShadow = await appShell.computedStyle(profile.tab('Overview'), 'box-shadow')
    expect(focusShadow).not.toBe('none')

    await page.keyboard.press('ArrowRight')
    await expect(profile.tab('Job and Skills')).toHaveAttribute('aria-selected', 'true')

    await page.keyboard.press('ArrowLeft')
    await expect(profile.tab('Overview')).toHaveAttribute('aria-selected', 'true')

    await profile.tab('Job and Skills').focus()
    await page.keyboard.press('Enter')
    await expect(profile.tab('Job and Skills')).toHaveAttribute('aria-selected', 'true')

    await profile.tab('Overview').focus()
    await page.keyboard.press('Space')
    await expect(profile.tab('Overview')).toHaveAttribute('aria-selected', 'true')
  })

  test('P3-A03: sheet form fields are labelled, errors are visible, and save shows aria-busy', async ({
    page,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/feedbacks', method: 'POST', delayMs: 500 },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')
    await profile.addFeedbackButton().click()
    const feedbackDialog = page.getByRole('dialog', { name: 'Add Feedback' })
    const typeSelect = feedbackDialog.getByRole('combobox', { name: 'Type *' })

    await expect(typeSelect).toBeVisible()
    await expect(page.getByLabel('Content *')).toBeVisible()

    await page.getByRole('button', { name: 'Save Feedback' }).click()
    const typeError = page.getByText('Type is required.')
    await expect(typeError).toBeVisible()
    await expect(typeError).toHaveAttribute('role', 'alert')
    await expect(typeError).toHaveAttribute('aria-live', 'assertive')

    await selectCustomOption(typeSelect, 'General')
    await page.getByLabel('Content *').fill('Accessibility coverage feedback entry text.')
    const saveButton = page.getByRole('button', { name: 'Save Feedback' })
    await saveButton.click()
    await expect(saveButton).toHaveAttribute('aria-busy', 'true')
    await expect(page.getByText('Feedback saved.')).toBeVisible()
  })

  test('P3-A04: error, loading, and empty states use semantic containers rather than color alone', async ({
    page,
  }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: '/risks',
        method: 'GET',
        respondWith: { status: 500, body: { message: 'Injected failure for a11y coverage.' } },
      },
      { urlIncludes: '/documents', method: 'GET', delayMs: 500 },
      { urlIncludes: '/scheduled-leaves', method: 'GET', respondWith: { status: 200, body: [] } },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)

    // Empty: titled section with heading + description text, not color-only. `EmptyState` renders
    // its own nested `<section>`/`<h2>`, so target the empty-state heading text specifically.
    // Scheduled Leaves lives on the Overview tab, so check it before switching tabs away.
    await expect(
      profile
        .section('Scheduled Leaves')
        .getByRole('heading', { level: 2, name: 'No scheduled leaves', exact: true }),
    ).toBeVisible()

    // Error: role="alert" semantic container, not a bare colored div.
    await profile.openTab('Risks and Action Items')
    await expect(profile.section('Risk History').getByRole('alert')).toBeVisible()

    // Loading: aria-live + aria-busy container with a readable label.
    await profile.openTab('Documents and IDP')
    const documentsLoading = profile.tabPanel().locator('[aria-busy="true"]')
    await expect(documentsLoading).toHaveAttribute('aria-live', 'polite')
    await expect(documentsLoading).toContainText('Loading documents')
  })

  test('P3-A05: no console errors or warnings across the profile and my-profile flows', async ({
    page,
    appShell,
    consoleMonitor,
  }) => {
    await page.goto(phase3Routes.subordinates)
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()
    await subordinates.searchForPerson(phase3Baselines.employeeFullName)
    await page.getByRole('button', { name: phase3Baselines.employeeFullName }).first().click()

    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(phase3Baselines.employeeFullName)
    for (const tabLabel of phase3Baselines.expectedTabLabels) {
      await profile.openTab(tabLabel)
    }

    await profile.openTab('Feedbacks')
    await profile.addFeedbackButton().click()
    await page.keyboard.press('Escape')

    await profile.backButton().click()
    await appShell.switchRole('Employee')

    expect(consoleMonitor.errors).toEqual([])
    expect(consoleMonitor.warnings).toEqual([])
    expect(consoleMonitor.pageErrors).toEqual([])
  })
})
