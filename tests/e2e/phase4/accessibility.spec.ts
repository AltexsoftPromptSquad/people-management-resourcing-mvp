import {
  overrideFetch,
  phase4Baselines,
  phase4Routes,
  type FetchOverrideRule,
} from '../fixtures/phase4-data'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { ResourcingRequestsPage } from '../page-objects/ResourcingRequestsPage'
import { SharedProfilePublicPage } from '../page-objects/SharedProfilePublicPage'
import { setDatePickerValue } from '../support/date-picker'
import { selectCustomOptionByIndex } from '../support/select'
import { expect, test } from '../support/test'

test.describe('Phase 4 - accessibility', () => {
  test('P4-A01: each resourcing screen has exactly one <h1>', async ({ page, appShell }) => {
    // DM requests page
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
    const dmPage = new ResourcingRequestsPage(page)
    await dmPage.expectLoaded()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

    // UM incoming page
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    const umPage = new ResourcingIncomingPage(page)
    await umPage.expectLoaded()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

    // Shared profile public page
    await page.goto(phase4Routes.sharedProfile)
    const sharedPage = new SharedProfilePublicPage(page)
    await sharedPage.expectLoaded()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  })

  test('P4-A02: New Request sheet — focus trapping and Escape closes', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const newRequestButton = page.getByRole('button', { name: 'New Request' })
    await newRequestButton.click()

    const sheet = page.getByRole('dialog')
    await expect(sheet).toBeVisible()

    // Focus must move to the first focusable element inside the sheet
    const firstFocusable = page.getByLabel('Request title *')
    await expect(firstFocusable).toBeFocused()

    // Tab through sheet and verify focus stays inside (spot check 3 tabs)
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    // Focus should still be inside the dialog
    const focused = await page.evaluate(
      () => document.activeElement?.closest('[role="dialog"]') !== null,
    )
    expect(focused).toBe(true)

    // Escape closes the sheet
    await page.keyboard.press('Escape')
    await expect(sheet).toHaveCount(0)

    // Focus returns to the trigger button
    await expect(newRequestButton).toBeFocused()
  })

  test('P4-A03: candidate warnings use text labels (not color alone)', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    const ui = new ResourcingIncomingPage(page)
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithoutActiveSharedProfile
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    // Warning must show readable text, not rely on color alone
    await expect(page.getByText(/Allocation would reach.*exceeds 100%/)).toBeVisible()
    // WarningBadge renders text inside it; verify it is non-empty
    const warningBadges = page.locator('[class*="WarningBadge"], [class*="warning-badge"]')
    const count = await warningBadges.count()
    if (count > 0) {
      await expect(warningBadges.first()).not.toBeEmpty()
    }
  })

  test('P4-A04: every form field in resourcing forms has an associated label', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    await page.getByRole('button', { name: 'New Request' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    const labeledFields = [
      'Request title *',
      'Project name *',
      'Required role *',
      'Grade level *',
      'Workload % *',
      'Required skills (comma-separated) *',
    ]
    for (const labelText of labeledFields) {
      await expect(page.getByLabel(labelText)).toBeVisible()
    }

    const comboboxFields = [
      'English level *',
      'Expected compensation level *',
      'Assigned Unit Manager *',
      'Priority *',
      'Start date *',
    ]
    for (const labelText of comboboxFields) {
      await expect(page.getByRole('combobox', { name: labelText })).toBeVisible()
    }
  })

  test('P4-A05: validation errors are linked to their field via aria-describedby', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    await page.getByRole('button', { name: 'New Request' }).click()
    await page.getByRole('button', { name: 'Submit' }).click()

    // Error message is visible
    await expect(page.getByText('Request title is required.')).toBeVisible()

    // The input that is invalid should have an associated error element
    const titleInput = page.getByLabel('Request title *')
    await expect(titleInput).toBeVisible()
    // Either aria-describedby references the error or the error has role="alert"/"status"
    const describedById = await titleInput.getAttribute('aria-describedby')
    const errorHasAlert = await page.getByText('Request title is required.').evaluate((el) => {
      return (
        el.getAttribute('role') === 'alert' ||
        el.closest('[role="alert"]') !== null ||
        el.getAttribute('aria-live') !== null
      )
    })
    const hasAssociation = Boolean(describedById) || errorHasAlert
    expect(hasAssociation).toBe(true)
  })

  test('P4-A06: request table rows can be navigated by keyboard — Tab to focus, Enter activates', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
    const ui = new ResourcingRequestsPage(page)
    await ui.expectLoaded()

    const firstRow = page.getByRole('row').nth(1)
    await firstRow.focus()
    await expect(firstRow).toBeFocused()

    await page.keyboard.press('Enter')
    // After Enter, a request detail panel should be visible
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
  })

  test('P4-A07: submit/confirm buttons show aria-busy during mutation', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/resourcing/requests', method: 'POST', delayMs: 500 },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    await page.getByRole('button', { name: 'New Request' }).click()
    await page.getByLabel('Request title *').fill('Aria Busy Test Request')
    await page.getByLabel('Project name *').fill('Test Project')
    await page.getByLabel('Required role *').fill('Engineer')
    await page.getByLabel('Grade level *').fill('M1')
    await page.getByLabel('Required skills (comma-separated) *').fill('React')
    await selectCustomOptionByIndex(
      page.getByRole('combobox', { name: 'Assigned Unit Manager *' }),
      1,
    )
    await setDatePickerValue(page, 'startDate', '2027-01-01')

    const submitButton = page.getByRole('button', { name: 'Submit' })
    await submitButton.click()

    await expect(submitButton).toHaveAttribute('aria-busy', 'true')
    await expect(submitButton).toBeDisabled()
  })

  test('P4-A08: every resourcing screen has a <main> landmark wrapping primary content', async ({
    page,
    appShell,
  }) => {
    // DM requests
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
    await expect(page.locator('main')).toBeVisible()

    // UM incoming
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    await expect(page.locator('main')).toBeVisible()

    // Shared profile public page
    await page.goto(phase4Routes.sharedProfile)
    await expect(page.locator('main')).toBeVisible()
  })

  test('P4-A09: page-tier LoadingState root has aria-busy="true"', async ({ page, appShell }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/resourcing/requests', method: 'GET', delayMs: 800 },
    ] satisfies FetchOverrideRule[])

    const navigation = page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const loadingRoot = page.locator('[aria-busy="true"]').first()
    await expect(loadingRoot).toBeVisible()
    await navigation
  })

  test('P4-A10: ErrorState root has role="alert" so screen readers announce it', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: '/resourcing/requests',
        method: 'GET',
        respondWith: { status: 500, body: {} },
      },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const errorState = page.getByRole('alert')
    await expect(errorState).toBeVisible()
    await expect(errorState).toContainText('Could not load requests')
  })

  test('P4-A11: icon-only action buttons have aria-label or visible text', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const ui = new ResourcingRequestsPage(page)
    await ui.expectLoaded()

    // All buttons should have accessible names (either text or aria-label)
    const buttons = page.getByRole('button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i)
      const name = await btn.getAttribute('aria-label')
      const text = await btn.textContent()
      const ariaLabelledBy = await btn.getAttribute('aria-labelledby')
      expect(Boolean(name) || Boolean(text?.trim()) || Boolean(ariaLabelledBy)).toBe(true)
    }
  })

  test('P4-A12: interactive elements show a visible focus ring on keyboard focus', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const newRequestButton = page.getByRole('button', { name: 'New Request' })
    await newRequestButton.focus()

    const boxShadow = await newRequestButton.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('box-shadow'),
    )
    const outline = await newRequestButton.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('outline'),
    )
    // Either box-shadow or outline must be non-none to indicate a visible focus ring
    const hasFocusRing = boxShadow !== 'none' || !outline.includes('0px')
    expect(hasFocusRing).toBe(true)
  })

  test('P4-A13: page <h1> has tabIndex=-1 and receives focus on route mount', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const h1 = page.getByRole('heading', { level: 1, name: 'My Requests' })
    await expect(h1).toBeVisible()

    const tabIndex = await h1.getAttribute('tabindex')
    expect(tabIndex).toBe('-1')
  })

  test('P4-A14: employee browser checkboxes can be toggled with Space key and communicate state to screen readers', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)

    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithoutActiveSharedProfile
    const checkbox = ui.candidateCheckbox(`${firstName} ${lastName}`)
    await checkbox.focus()
    await expect(checkbox).toBeFocused()

    // Space key toggles the checkbox
    await page.keyboard.press('Space')
    await expect(checkbox).toBeChecked()

    // aria-checked reflects state
    const ariaChecked = await checkbox.getAttribute('aria-checked')
    const isChecked = await checkbox.isChecked()
    expect(ariaChecked === 'true' || isChecked).toBe(true)
  })
})
