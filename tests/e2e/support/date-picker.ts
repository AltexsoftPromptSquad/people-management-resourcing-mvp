import type { Page } from '@playwright/test'

export const setDatePickerValue = async (page: Page, fieldName: string, value: string) => {
  await page.locator(`input[name="${fieldName}"]`).evaluate((element, nextValue) => {
    const input = element as HTMLInputElement
    const valueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set
    valueSetter?.call(input, String(nextValue))
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
}
