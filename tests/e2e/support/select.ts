import type { Locator } from '@playwright/test'

const getListbox = async (combobox: Locator) => {
  const listboxId = await combobox.getAttribute('aria-controls')
  const page = combobox.page()

  return listboxId ? page.locator(`#${listboxId}`) : page.getByRole('listbox').last()
}

export const selectCustomOption = async (combobox: Locator, optionLabel: string): Promise<void> => {
  const isExpanded = await combobox.getAttribute('aria-expanded')

  if (isExpanded !== 'true') {
    await combobox.click()
  }

  const listbox = await getListbox(combobox)
  await listbox.getByRole('option', { name: optionLabel, exact: true }).click()
}

export const selectCustomOptionByIndex = async (
  combobox: Locator,
  index: number,
): Promise<void> => {
  const isExpanded = await combobox.getAttribute('aria-expanded')

  if (isExpanded !== 'true') {
    await combobox.click()
  }

  const listbox = await getListbox(combobox)
  await listbox.getByRole('option').nth(index).click()
}
