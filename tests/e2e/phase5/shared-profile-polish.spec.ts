import { phase5Routes } from '../fixtures/phase5-data'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { expect, test } from '../support/test'

test.describe('Phase 5 - shared profile polish', () => {
  test('P5-PS01: Generate Shared Profile sheet shows reusable or newly generated link', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase5Routes.incoming)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase5Routes.incoming)

    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest('REQ-001')

    await page.getByRole('checkbox').first().check()
    await ui.generateSharedProfileButton().click()

    const sheet = page.getByRole('dialog')
    const existingLink = sheet.getByText('Existing shared link')
    if (await existingLink.isVisible().catch(() => false)) {
      await expect(existingLink).toBeVisible()
      await expect(sheet.getByRole('button', { name: 'Generate Link' })).toHaveCount(0)
    } else {
      await sheet.getByRole('button', { name: /Generate/ }).click()
      await expect(sheet.getByText('Shared profile link')).toBeVisible()
    }

    await sheet.getByRole('button', { name: 'Copy Link' }).click()
    await expect(page.getByText('Link copied to clipboard.')).toBeVisible()
  })
})
