export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const parseIsoDate = (value: string): Date | null => {
  if (!ISO_DATE_PATTERN.test(value)) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return date
}

export const toIsoDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const formatDisplayDate = (value: string): string => {
  const date = parseIsoDate(value)
  if (!date) {
    return value
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const isSameDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate()

export const getMonthLabel = (year: number, month: number): string =>
  new Date(year, month, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

export type CalendarDay = {
  date: Date
  isoValue: string
  inMonth: boolean
}

export const getCalendarDays = (year: number, month: number): CalendarDay[] => {
  const firstDayOfMonth = new Date(year, month, 1)
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - startOffset)
  const days: CalendarDay[] = []

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)

    days.push({
      date,
      isoValue: toIsoDate(date),
      inMonth: date.getMonth() === month,
    })
  }

  return days
}
