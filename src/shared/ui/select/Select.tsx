import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SelectProps } from './Select.types'

type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

const parseSelectOptions = (children: SelectProps['children']): SelectOption[] => {
  const options: SelectOption[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== 'option') {
      return
    }

    const optionProps = child.props as {
      value?: string | number
      disabled?: boolean
      children?: ReactNode
    }

    options.push({
      value: String(optionProps.value ?? ''),
      label: String(optionProps.children ?? optionProps.value ?? ''),
      disabled: optionProps.disabled,
    })
  })

  return options
}

const createChangeEvent = (
  name: string | undefined,
  value: string,
): ChangeEvent<HTMLSelectElement> => {
  return {
    target: { value, name: name ?? '' },
    currentTarget: { value, name: name ?? '' },
  } as ChangeEvent<HTMLSelectElement>
}

const createBlurEvent = (
  name: string | undefined,
  value: string,
): FocusEvent<HTMLSelectElement> => {
  return {
    target: { value, name: name ?? '' },
    currentTarget: { value, name: name ?? '' },
  } as FocusEvent<HTMLSelectElement>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      children,
      value,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      disabled,
      name,
      id,
      autoFocus,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const listboxId = useId()
    const containerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const listboxRef = useRef<HTMLUListElement>(null)
    const hiddenSelectRef = useRef<HTMLSelectElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [listboxStyle, setListboxStyle] = useState<CSSProperties>({})
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(() =>
      String(isControlled ? (value ?? '') : (defaultValue ?? '')),
    )

    const options = useMemo(() => parseSelectOptions(children), [children])
    const selectedValue = isControlled ? String(value) : internalValue
    const selectedOption = options.find((option) => option.value === selectedValue)
    const selectedLabel = selectedOption?.label ?? selectedValue

    const setHiddenSelectRef = useCallback(
      (node: HTMLSelectElement | null) => {
        hiddenSelectRef.current = node

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
      (nextValue: string) => {
        if (hiddenSelectRef.current) {
          hiddenSelectRef.current.value = nextValue
        }

        if (!isControlled) {
          setInternalValue(nextValue)
        }

        onChange?.(createChangeEvent(name, nextValue))
      },
      [isControlled, name, onChange],
    )

    useLayoutEffect(() => {
      if (isControlled || !hiddenSelectRef.current) {
        return
      }

      const domValue = hiddenSelectRef.current.value
      setInternalValue((current) => (current !== domValue ? domValue : current))
    })

    const closeMenu = useCallback(
      (shouldBlur = false) => {
        setIsOpen(false)
        setHighlightedIndex(-1)

        if (shouldBlur) {
          onBlur?.(createBlurEvent(name, selectedValue))
        }
      },
      [name, onBlur, selectedValue],
    )

    const updateListboxPosition = useCallback(() => {
      const trigger = triggerRef.current
      if (!trigger) {
        return
      }

      const rect = trigger.getBoundingClientRect()
      const menuMaxHeight = 240
      const viewportPadding = 8
      const menuGap = 4
      const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
      const spaceAbove = rect.top - viewportPadding
      const shouldOpenAbove = spaceBelow < 160 && spaceAbove > spaceBelow
      const availableHeight = Math.max(
        96,
        Math.min(menuMaxHeight, shouldOpenAbove ? spaceAbove : spaceBelow),
      )
      const actualListboxHeight = listboxRef.current
        ? Math.min(listboxRef.current.offsetHeight, availableHeight)
        : availableHeight

      setListboxStyle({
        position: 'fixed',
        top: shouldOpenAbove
          ? Math.max(viewportPadding, rect.top - actualListboxHeight - menuGap)
          : rect.bottom + menuGap,
        left: rect.left,
        width: rect.width,
        maxHeight: availableHeight,
      })
    }, [])

    const openMenu = useCallback(() => {
      if (disabled) {
        return
      }

      updateListboxPosition()
      const selectedIndex = options.findIndex((option) => option.value === selectedValue)
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
      setIsOpen(true)
    }, [disabled, options, selectedValue, updateListboxPosition])

    const selectOptionAtIndex = useCallback(
      (index: number) => {
        const option = options[index]
        if (!option || option.disabled) {
          return
        }

        commitValue(option.value)
        setIsOpen(false)
        setHighlightedIndex(-1)
        onBlur?.(createBlurEvent(name, option.value))
        triggerRef.current?.focus()
      },
      [commitValue, name, onBlur, options],
    )

    useEffect(() => {
      if (!autoFocus || disabled) {
        return
      }

      triggerRef.current?.focus()
    }, [autoFocus, disabled])

    useEffect(() => {
      if (!isOpen) {
        return
      }

      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node
        if (!containerRef.current?.contains(target) && !listboxRef.current?.contains(target)) {
          closeMenu(true)
        }
      }

      document.addEventListener('mousedown', handlePointerDown)
      return () => {
        document.removeEventListener('mousedown', handlePointerDown)
      }
    }, [closeMenu, isOpen])

    useLayoutEffect(() => {
      if (!isOpen) {
        return
      }

      updateListboxPosition()

      window.addEventListener('resize', updateListboxPosition)
      window.addEventListener('scroll', updateListboxPosition, true)

      return () => {
        window.removeEventListener('resize', updateListboxPosition)
        window.removeEventListener('scroll', updateListboxPosition, true)
      }
    }, [isOpen, updateListboxPosition])

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event as unknown as KeyboardEvent<HTMLSelectElement>)

      if (event.defaultPrevented) {
        return
      }

      if (event.key === 'Escape') {
        if (isOpen) {
          event.preventDefault()
          closeMenu()
        }
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (!isOpen) {
          openMenu()
          return
        }

        setHighlightedIndex((current) => {
          const nextIndex = current < options.length - 1 ? current + 1 : current
          return options[nextIndex]?.disabled ? nextIndex + 1 : nextIndex
        })
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (!isOpen) {
          openMenu()
          return
        }

        setHighlightedIndex((current) => {
          const nextIndex = current > 0 ? current - 1 : 0
          return options[nextIndex]?.disabled ? Math.max(nextIndex - 1, 0) : nextIndex
        })
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (!isOpen) {
          openMenu()
          return
        }

        if (highlightedIndex >= 0) {
          selectOptionAtIndex(highlightedIndex)
        }
        return
      }

      if (event.key === 'Tab' && isOpen) {
        closeMenu(true)
      }
    }

    return (
      <div ref={containerRef} className={cn('relative w-full', className)}>
        <select
          {...props}
          ref={setHiddenSelectRef}
          name={name}
          disabled={disabled}
          tabIndex={-1}
          hidden
          {...(isControlled ? { value: selectedValue } : { defaultValue: selectedValue })}
          onChange={(event) => {
            if (!isControlled) {
              setInternalValue(event.target.value)
            }

            onChange?.(event)
          }}
          onBlur={onBlur}
        >
          {children}
        </select>

        <button
          ref={triggerRef}
          type="button"
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white py-1 pl-3 pr-10 text-left text-sm text-slate-950 shadow-xs outline-none transition-colors focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50',
            isOpen && 'border-slate-400 ring-2 ring-slate-300',
          )}
          onClick={() => {
            if (isOpen) {
              closeMenu()
              return
            }

            openMenu()
          }}
          onKeyDown={handleTriggerKeyDown}
          onBlur={(event) => {
            if (containerRef.current?.contains(event.relatedTarget as Node)) {
              return
            }

            if (isOpen) {
              closeMenu(true)
            }
          }}
        >
          <span className={cn('truncate', !selectedOption && 'text-slate-500')}>
            {selectedLabel || 'Select'}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-transform duration-150 ease-out',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        {isOpen && typeof document !== 'undefined'
          ? createPortal(
              <ul
                ref={listboxRef}
                id={listboxId}
                role="listbox"
                style={listboxStyle}
                className="z-50 max-h-60 origin-top animate-select-open overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
              >
                {options.map((option, index) => {
                  const isSelected = option.value === selectedValue
                  const isHighlighted = index === highlightedIndex

                  return (
                    <li
                      key={`${option.value}-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      className={cn(
                        'cursor-pointer px-3 py-2 text-sm transition-colors',
                        option.disabled && 'cursor-not-allowed opacity-50',
                        isSelected && 'bg-slate-100 font-medium text-slate-950',
                        !isSelected && 'text-slate-700',
                        isHighlighted && !option.disabled && 'bg-slate-50',
                        !isHighlighted && !isSelected && 'hover:bg-slate-50',
                      )}
                      onMouseEnter={() => {
                        if (!option.disabled) {
                          setHighlightedIndex(index)
                        }
                      }}
                      onMouseDown={(event) => {
                        event.preventDefault()
                      }}
                      onClick={() => {
                        selectOptionAtIndex(index)
                      }}
                    >
                      {option.label}
                    </li>
                  )
                })}
              </ul>,
              document.body,
            )
          : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
