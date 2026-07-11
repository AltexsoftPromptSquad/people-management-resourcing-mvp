import {
  overrideFetch,
  phase3Baselines,
  phase3Routes,
  type FetchOverrideRule,
} from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { selectCustomOption } from '../support/select'
import { expect, test } from '../support/test'

test.describe('Phase 3 - Add Feedback flow', () => {
  test('P3-F03/P3-F04: sheet opens titled "Add Feedback" with type select and content textarea', async ({
    page,
  }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')
    await profile.addFeedbackButton().click()

    await expect(page.getByRole('heading', { level: 2, name: 'Add Feedback' })).toBeVisible()
    const typeSelect = page.getByLabel('Type *')
    await expect(typeSelect).toBeFocused()
    await expect(typeSelect.locator('option')).toHaveText([
      'Select type',
      'HR Note',
      'Performance',
      'General',
    ])

    const contentField = page.getByLabel('Content *')
    await expect(contentField).toHaveAttribute('placeholder', 'Write your feedback…')
  })

  test('P3-F05/P3-F06: validates required type and minimum content length', async ({ page }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')
    await profile.addFeedbackButton().click()

    await page.getByRole('button', { name: 'Save Feedback' }).click()
    await expect(page.getByText('Type is required.')).toBeVisible()
    await expect(page.getByText('Feedback must be at least 10 characters.')).toBeVisible()

    await page.getByLabel('Content *').fill('Too short')
    await page.getByRole('button', { name: 'Save Feedback' }).click()
    await expect(page.getByText('Feedback must be at least 10 characters.')).toBeVisible()
  })

  test('P3-F07: saving prepends the entry without a page reload and shows a success toast', async ({
    page,
  }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')

    await page.evaluate(() => {
      ;(window as unknown as { __phase3NoReloadMarker?: string }).__phase3NoReloadMarker = 'kept'
    })

    await profile.addFeedbackButton().click()
    await selectCustomOption(page.getByLabel('Type *'), 'General')
    await page.getByLabel('Content *').fill('Phase 3 feedback entry for e2e coverage validation.')
    await page.getByRole('button', { name: 'Save Feedback' }).click()

    await expect(page.getByText('Feedback saved.')).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Add Feedback' })).toHaveCount(0)

    const items = profile.tabPanel().getByRole('listitem')
    await expect(items.first()).toContainText('Phase 3 feedback entry for e2e coverage validation.')
    await expect(items).toHaveCount(phase3Baselines.feedbacksForEmployee.length + 1)

    const marker = await page.evaluate(
      () => (window as unknown as { __phase3NoReloadMarker?: string }).__phase3NoReloadMarker,
    )
    expect(marker).toBe('kept')
  })

  test('P3-F08: save failure keeps the sheet open and shows an error toast', async ({ page }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: '/feedbacks',
        method: 'POST',
        respondWith: { status: 500, body: { message: 'Injected feedback save failure.' } },
      },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')
    await profile.addFeedbackButton().click()

    await selectCustomOption(page.getByLabel('Type *'), 'HR Note')
    await page.getByLabel('Content *').fill('This save attempt is expected to fail in this test.')
    await page.getByRole('button', { name: 'Save Feedback' }).click()

    await expect(page.getByText('Failed to save feedback. Try again.')).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Add Feedback' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save Feedback' })).toBeEnabled()
  })

  test('P3-F09: Cancel and Escape discard the draft without a confirm dialog', async ({ page }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')

    let dialogShown = false
    page.on('dialog', () => {
      dialogShown = true
    })

    await profile.addFeedbackButton().click()
    await page.getByLabel('Content *').fill('Draft content that should be discarded on cancel.')
    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByRole('dialog', { name: 'Add Feedback' })).toHaveCount(0)
    await expect(profile.addFeedbackButton()).toBeFocused()
    expect(dialogShown).toBe(false)

    await profile.addFeedbackButton().click()
    await page.getByLabel('Content *').fill('Another draft discarded via Escape this time.')
    await page.keyboard.press('Escape')

    await expect(page.getByRole('dialog', { name: 'Add Feedback' })).toHaveCount(0)
    await expect(profile.addFeedbackButton()).toBeFocused()
    expect(dialogShown).toBe(false)

    await expect(page.getByText('Draft content that should be discarded on cancel.')).toHaveCount(0)
    await expect(page.getByText('Another draft discarded via Escape this time.')).toHaveCount(0)
  })
})
