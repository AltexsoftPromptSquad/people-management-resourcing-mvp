import { phase4Baselines, phase4Routes } from '../fixtures/phase4-data'
import { expect, test } from '../support/test'

test.describe('Phase 4 - Resourcing E2E', () => {
  test('P4-E2E01: DM sees requests table and request-003 candidates proposed', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
    await expect(page.getByRole('heading', { name: 'My Requests' })).toBeVisible()
    await expect(
      page.getByText(phase4Baselines.candidatesProposedRequest.requestCode),
    ).toBeVisible()

    await page.getByText(phase4Baselines.candidatesProposedRequest.title).click()
    await expect(page.getByText('Proposed candidates')).toBeVisible()
  })

  test('P4-E2E02: UM sees incoming queue for assigned requests', async ({ page, appShell }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)

    await expect(page.getByRole('heading', { name: 'Incoming Requests' })).toBeVisible()
    await expect(page.getByText(phase4Baselines.submittedRequest.requestCode)).toBeVisible()
  })

  test('P4-E2E03: Public shared profile loads without app shell', async ({ page }) => {
    await page.goto(phase4Routes.sharedProfile)

    await expect(page.getByRole('heading', { name: 'Shared Profile' })).toBeVisible()
    await expect(page.getByText('Generate Shared Profile')).toHaveCount(0)
  })
})
