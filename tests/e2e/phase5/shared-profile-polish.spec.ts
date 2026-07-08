import { phase5Routes } from '../fixtures/phase5-data'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { expect, test } from '../support/test'

test.describe('Phase 5 - shared profile polish', () => {
  test('P5-PS01: Generate Shared Profile sheet reuses existing active link', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase5Routes.incoming)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase5Routes.incoming)

    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest('REQ-001')

    await ui.candidateCheckbox('Nazar Petrenko').check()
    await ui.generateSharedProfileButton().click()

    const sheet = page.getByRole('dialog')
    await expect(sheet.getByText('Existing shared link')).toBeVisible()
    await expect(sheet.getByRole('button', { name: 'Generate Link' })).toHaveCount(0)

    await sheet.getByRole('button', { name: 'Copy Link' }).click()
    await expect(page.getByText('Link copied to clipboard.')).toBeVisible()
  })
})
