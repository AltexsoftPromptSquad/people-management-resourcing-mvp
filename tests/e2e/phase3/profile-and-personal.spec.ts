import { expect, test } from '../support/test'
import { phase3Baselines, phase3Routes } from '../fixtures/phase3-data'

test.describe('Phase 3 - profile and personal flows', () => {
  test('P3-R01/P3-T01/P3-T02/P3-F10: managerial profile renders with seven tabs', async ({
    page,
  }) => {
    await page.goto(phase3Routes.profile)

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: `${phase3Baselines.employeePerson.firstName} ${phase3Baselines.employeePerson.lastName}`,
      }),
    ).toBeVisible()

    for (const tabLabel of phase3Baselines.expectedTabLabels) {
      await expect(page.getByRole('tab', { name: tabLabel })).toBeVisible()
    }

    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(page.getByRole('heading', { level: 2, name: 'Scheduled Leaves' })).toBeVisible()
  })

  test('P3-F03/P3-F04/P3-F05/P3-F06/P3-F07: add feedback validates and saves', async ({ page }) => {
    await page.goto(phase3Routes.profile)
    await page.getByRole('tab', { name: 'Feedbacks' }).click()
    await page.getByRole('button', { name: 'Add Feedback' }).click()

    await expect(page.getByRole('heading', { level: 2, name: 'Add Feedback' })).toBeVisible()
    await page.getByRole('button', { name: 'Save Feedback' }).click()
    await expect(page.getByText('Type is required.')).toBeVisible()
    await expect(page.getByText('Feedback must be at least 10 characters.')).toBeVisible()

    await page.getByLabel('Type *').selectOption('General')
    await page.getByLabel('Content *').fill('Phase 3 feedback entry for e2e validation.')
    await page.getByRole('button', { name: 'Save Feedback' }).click()

    await expect(page.getByText('Feedback saved.')).toBeVisible()
    await expect(page.getByText('Phase 3 feedback entry for e2e validation.')).toBeVisible()
  })

  test('P3-PV01/P3-PV04/P3-PV07/P3-PV08/P3-V03: personal profile self-service flow', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.profile)
    await appShell.switchRole('Employee')
    await expect(page).toHaveURL(new RegExp(`${phase3Routes.myProfile}$`))

    await expect(page.getByRole('heading', { level: 1, name: 'My Profile' })).toBeVisible()
    await expect(page.getByText('Feedbacks')).toHaveCount(0)
    await expect(page.getByText('Manager Only')).toHaveCount(0)
    await expect(page.getByText('No action items')).toHaveCount(0)
    await expect(page.getByRole('listitem').filter({ hasText: 'Due' })).toHaveCount(
      phase3Baselines.actionItemsAssignedToEmployee,
    )

    await page.getByRole('button', { name: 'Edit' }).click()
    await page.getByLabel('Personal phone').fill('+380670000777')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Contact information saved.')).toBeVisible()

    await page.getByRole('combobox').first().selectOption('Completed')
    await expect(page.getByText('IDP status updated.')).toBeVisible()

    await page.getByRole('button', { name: 'Add Certificate' }).click()
    await page.getByLabel('Certificate name *').fill('Playwright QA Certificate')
    await page.getByLabel('File name *').fill('playwright-qa-certificate.pdf')
    await page.getByRole('button', { name: 'Save Certificate' }).click()
    await expect(page.getByText('Certificate added.')).toBeVisible()
    await expect(page.getByText('Playwright QA Certificate')).toBeVisible()
  })
})
