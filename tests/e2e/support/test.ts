import { test as base } from '@playwright/test'
import { AppShellPage } from '../page-objects/AppShellPage'
import { ConsoleMonitor } from './console-monitor'

type E2EFixtures = {
  appShell: AppShellPage
  consoleMonitor: ConsoleMonitor
}

export const test = base.extend<E2EFixtures>({
  appShell: async ({ page }, runFixture) => {
    await runFixture(new AppShellPage(page))
  },
  consoleMonitor: async ({ page }, runFixture) => {
    const monitor = new ConsoleMonitor()
    monitor.attach(page)
    await runFixture(monitor)
  },
})

export { expect } from '@playwright/test'
