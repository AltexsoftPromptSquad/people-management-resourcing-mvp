import { endpointRecordCounts, phase1Roles, phase1Routes } from '../fixtures/mock-baselines'
import { expect, test } from '../support/test'

test.describe('Phase 1', () => {
  test.describe('browser-backed checks', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(phase1Routes.dashboard)
    })

    test('check #11: MSW service worker is active and console is clean', async ({
      page,
      appShell,
      consoleMonitor,
    }) => {
      await appShell.expectRoleView(phase1Roles.unitManager)

      await expect
        .poll(async () => {
          return page.evaluate(async () => {
            const registration = await navigator.serviceWorker.getRegistration()
            return registration?.active?.scriptURL ?? ''
          })
        })
        .toContain('/mockServiceWorker.js')

      expect(consoleMonitor.errors).toEqual([])
      expect(consoleMonitor.warnings).toEqual([])
      expect(consoleMonitor.pageErrors).toEqual([])
    })

    test('check #12: /api/personas returns exactly three stable persona records', async ({
      page,
    }) => {
      await page.reload()
      await expect
        .poll(async () => {
          return page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? '')
        })
        .toContain('/mockServiceWorker.js')

      const personasResponse = await page.evaluate(async () => {
        const response = await fetch('/api/personas')
        const bodyText = await response.text()
        const body = JSON.parse(bodyText) as Array<{ id: string }>

        return {
          ok: response.ok,
          status: response.status,
          ids: body.map((item) => item.id).sort(),
        }
      })

      expect(personasResponse.ok).toBeTruthy()
      expect(personasResponse.status).toBe(200)
      expect(personasResponse.ids).toEqual([
        phase1Roles.deliveryManager.personaId,
        phase1Roles.employee.personaId,
        phase1Roles.unitManager.personaId,
      ])
    })

    test('check #14: seeded endpoints return expected record counts from mocks', async ({
      page,
    }) => {
      await page.reload()
      await expect
        .poll(async () => {
          return page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? '')
        })
        .toContain('/mockServiceWorker.js')

      const endpointCounts = await page.evaluate(async () => {
        const [personas, people, units, skills, resourcingRequests] = await Promise.all([
          fetch('/api/personas').then(async (response) => {
            return (await response.json()) as unknown[]
          }),
          fetch('/api/people').then(async (response) => {
            return (await response.json()) as unknown[]
          }),
          fetch('/api/units').then(async (response) => {
            return (await response.json()) as unknown[]
          }),
          fetch('/api/skills').then(async (response) => {
            return (await response.json()) as unknown[]
          }),
          fetch('/api/resourcing/requests').then(async (response) => {
            return (await response.json()) as unknown[]
          }),
        ])

        return {
          personas: personas.length,
          people: people.length,
          units: units.length,
          skills: skills.length,
          resourcingRequests: resourcingRequests.length,
        }
      })

      expect(endpointCounts).toEqual(endpointRecordCounts)
      await expect(page.locator('pre')).toHaveCount(0)
    })

    test('check #13: dashboard query flow renders manager workspace and no debug payload', async ({
      appShell,
      page,
    }) => {
      await appShell.expectRoleView(phase1Roles.unitManager)
      await expect(page.locator('pre')).toHaveCount(0)
    })
  })
})
