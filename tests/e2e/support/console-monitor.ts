import type { Page } from '@playwright/test'

export class ConsoleMonitor {
  readonly errors: string[] = []
  readonly warnings: string[] = []
  readonly pageErrors: string[] = []

  attach(page: Page): void {
    page.on('console', (message) => {
      if (message.type() === 'error') {
        this.errors.push(message.text())
      }

      if (message.type() === 'warning') {
        this.warnings.push(message.text())
      }
    })

    page.on('pageerror', (error) => {
      this.pageErrors.push(error.message)
    })
  }
}
