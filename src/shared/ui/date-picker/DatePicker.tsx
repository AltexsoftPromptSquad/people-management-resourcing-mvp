import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DatePickerProps } from './DatePicker.types'
import {
  formatDisplayDate,
  getCalendarDays,
  getMonthLabel,
  isSameDay,
  parseIsoDate,
  toIsoDate,
} from './DatePicker.utils'

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const createChangeEvent = (
  name: string | undefined,
  value: string,
): ChangeEvent<HTMLInputElement> => {
  return {
    target: { value, name: name ?? '' },
    currentTarget: { value, name: name ?? '' },
  } as ChangeEvent<HTMLInputElement>
}

const createBlurEvent = (name: string | undefined, value: string): FocusEvent<HTMLInputElement> => {
  return {
    target: { value, name: name ?? '' },
    currentTarget: { value, name: name ?? '' },
  } as FocusEvent<HTMLInputElement>
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      disabled,
      name,
      id,
      autoFocus,
      placeholder = 'Select date',
      ...props
    },
    ref,
  ) => {
    const calendarId = useId()
    const containerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const hiddenInputRef = useRef<HTMLInputElement>(null)
    const today = useMemo(() => new Date(), [])
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(() =>
      String(isControlled ? (value ?? '') : (defaultValue ?? '')),
    )
    const [isOpen, setIsOpen] = useState(false)

    const selectedValue = isControlled ? String(value) : internalValue
    const selectedDate = useMemo(() => parseIsoDate(selectedValue), [selectedValue])
    const [viewMonth, setViewMonth] = useState(() => ({
      year: (selectedDate ?? today).getFullYear(),
      month: (selectedDate ?? today).getMonth(),
    }))

    const setHiddenInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        hiddenInputRef.current = node

        if (typeof ref === 'function') {
          ref(node)
          return
        }

        if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    const commitValue = useCallback(
      (nextValue: string, shouldBlur = false) => {
        if (hiddenInputRef.current) {
          hiddenInputRef.current.value = nextValue
        }

        if (!isControlled) {
          setInternalValue(nextValue)
        }

        onChange?.(createChangeEvent(name, nextValue))

        if (shouldBlur) {
          onBlur?.(createBlurEvent(name, nextValue))
        }
      },
      [isControlled, name, onBlur, onChange],
    )

    const closeCalendar = useCallback(
      (shouldBlur = false) => {
        setIsOpen(false)

        if (shouldBlur) {
          onBlur?.(createBlurEvent(name, selectedValue))
        }
      },
      [name, onBlur, selectedValue],
    )

    const openCalendar = useCallback(() => {
      if (disabled) {
        return
      }

      const anchorDate = selectedDate ?? today
      setViewMonth({
        year: anchorDate.getFullYear(),
        month: anchorDate.getMonth(),
      })
      setIsOpen(true)
    }, [disabled, selectedDate, today])

    useLayoutEffect(() => {
      if (isControlled || !hiddenInputRef.current) {
        return
      }

      const domValue = hiddenInputRef.current.value
      setInternalValue((current) => (current !== domValue ? domValue : current))
    })

    useEffect(() => {
      if (!selectedDate) {
        return
      }

      setViewMonth({
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth(),
      })
    }, [selectedValue])

    useEffect(() => {
      if (!autoFocus || disabled) {
        return
      }

      const anchorDate = selectedDate ?? today
      setViewMonth({
        year: anchorDate.getFullYear(),
        month: anchorDate.getMonth(),
      })
      setIsOpen(true)
      triggerRef.current?.focus()
    }, [autoFocus, disabled])

    useEffect(() => {
      if (!isOpen) {
        return
      }

      const handlePointerDown = (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) {
          closeCalendar(true)
        }
      }

      document.addEventListener('mousedown', handlePointerDown)
      return () => {
        document.removeEventListener('mousedown', handlePointerDown)
      }
    }, [closeCalendar, isOpen])

    const calendarDays = useMemo(
      () => getCalendarDays(viewMonth.year, viewMonth.month),
      [viewMonth.month, viewMonth.year],
    )

    const displayLabel = selectedValue ? formatDisplayDate(selectedValue) : placeholder

    const handleSelectDate = (isoValue: string) => {
      setIsOpen(false)
      commitValue(isoValue)
      triggerRef.current?.focus()
    }

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event as unknown as KeyboardEvent<HTMLInputElement>)

      if (event.defaultPrevented) {
        return
      }

      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        closeCalendar()
      }
    }

    return (
      <div ref={containerRef} className={cn('relative w-full', className)}>
        <input
          {...props}
          ref={setHiddenInputRef}
          type="hidden"
          name={name}
          value={selectedValue}
          onChange={(event) => {
            if (!isControlled) {
              setInternalValue(event.target.value)
            }

            onChange?.(event)
          }}
          onBlur={onBlur}
        />

        <button
          ref={triggerRef}
          type="button"
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls={calendarId}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white py-1 pl-3 pr-10 text-left text-sm shadow-xs outline-none transition-colors focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50',
            selectedValue ? 'text-slate-950' : 'text-slate-500',
            isOpen && 'border-slate-400 ring-2 ring-slate-300',
          )}
          onClick={() => {
            if (isOpen) {
              closeCalendar()
              return
            }

            openCalendar()
          }}
          onKeyDown={handleTriggerKeyDown}
          onBlur={(event) => {
            if (containerRef.current?.contains(event.relatedTarget as Node)) {
              return
            }

            if (isOpen) {
              closeCalendar(true)
            }
          }}
        >
          <span className="truncate">{displayLabel}</span>
          <CalendarDays
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
          />
        </button>

        {isOpen ? (
          <div
            id={calendarId}
            role="dialog"
            aria-label="Choose date"
            className="absolute z-50 mt-1 w-[min(100%,18rem)] origin-top animate-select-open rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                aria-label="Previous month"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
                onClick={() => {
                  setViewMonth((current) => {
                    const nextMonth = current.month - 1
                    if (nextMonth < 0) {
                      return { year: current.year - 1, month: 11 }
                    }

                    return { year: current.year, month: nextMonth }
                  })
                }}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>

              <p className="text-sm font-semibold text-slate-900">
                {getMonthLabel(viewMonth.year, viewMonth.month)}
              </p>

              <button
                type="button"
                aria-label="Next month"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
                onClick={() => {
                  setViewMonth((current) => {
                    const nextMonth = current.month + 1
                    if (nextMonth > 11) {
                      return { year: current.year + 1, month: 0 }
                    }

                    return { year: current.year, month: nextMonth }
                  })
                }}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label} className="py-1">
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7">
              {calendarDays.map((day) => {
                const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false
                const isToday = isSameDay(day.date, today)

                return (
                  <div key={day.isoValue} className="flex items-center justify-center p-0.5">
                    <button
                      type="button"
                      className={cn(
                        'flex size-8 cursor-pointer items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-300',
                        day.inMonth ? 'text-slate-700' : 'text-slate-400',
                        isSelected && 'bg-slate-800 font-medium text-white hover:bg-slate-900',
                        !isSelected && 'hover:bg-slate-100',
                        isToday && !isSelected && 'border border-slate-300',
                      )}
                      onMouseDown={(event) => {
                        event.preventDefault()
                      }}
                      onClick={() => {
                        handleSelectDate(day.isoValue)
                      }}
                    >
                      {day.date.getDate()}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                type="button"
                className="cursor-pointer text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
                onClick={() => {
                  setIsOpen(false)
                  commitValue('')
                  triggerRef.current?.focus()
                }}
              >
                Clear
              </button>
              <button
                type="button"
                className="cursor-pointer text-sm font-medium text-slate-800 transition-colors hover:text-slate-950"
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
                onClick={() => {
                  handleSelectDate(toIsoDate(today))
                }}
              >
                Today
              </button>
            </div>
          </div>
        ) : null}
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'
