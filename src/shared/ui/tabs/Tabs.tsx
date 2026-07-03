import type { FC, ReactNode } from 'react'
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react'
import { Tabs as ReactTabs } from 'react-tabs'
import { cn } from '@/lib/utils'
import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from './Tabs.types'

type TabsContextValue = {
  activeValue: string
  setActiveValue: (value: string) => void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

const useTabsContext = () => {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error('Tabs components must be used within Tabs.')
  }

  return context
}

export const Tabs: FC<TabsProps> = ({
  children,
  className,
  value,
  defaultValue = '',
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const baseId = useId()

  const values = useMemo(() => extractTabValues(children), [children])

  const activeValue = value ?? internalValue

  const setActiveValue = useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue)
      }

      onValueChange?.(nextValue)
    },
    [onValueChange, value],
  )

  const selectedIndex = Math.max(values.indexOf(activeValue), 0)

  const contextValue = useMemo<TabsContextValue>(
    () => ({
      activeValue,
      setActiveValue,
      baseId,
    }),
    [activeValue, baseId, setActiveValue],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <ReactTabs
        selectedIndex={selectedIndex}
        onSelect={(index) => {
          const nextValue = values[index]

          if (!nextValue) {
            return false
          }

          setActiveValue(nextValue)
          return true
        }}
        className={cn('w-full', className)}
      >
        {children}
      </ReactTabs>
    </TabsContext.Provider>
  )
}

export const TabsList: FC<TabsListProps> = ({ className, ...props }) => {
  return (
    <ul
      role="tablist"
      className={cn(
        'inline-flex min-h-10 w-fit items-center gap-1 rounded-md border border-slate-200 bg-slate-50 p-1 text-slate-600',
        className,
      )}
      {...props}
    />
  )
}
;(TabsList as unknown as { tabsRole: string }).tabsRole = 'TabList'

export const TabsTrigger: FC<TabsTriggerProps> = ({
  className,
  value,
  onClick,
  children,
  selected,
  disabled,
  id,
  panelId,
  tabIndex,
  tabRef,
}) => {
  const { setActiveValue } = useTabsContext()

  return (
    <li
      ref={tabRef}
      role="tab"
      data-value={value}
      data-rttab="true"
      aria-selected={selected}
      aria-disabled={disabled}
      aria-controls={panelId ?? (id ? `panel-${id}` : undefined)}
      id={id ? `tab-${id}` : undefined}
      tabIndex={tabIndex ?? (selected ? 0 : -1)}
      className={cn(
        'inline-flex cursor-pointer whitespace-nowrap items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-slate-300',
        selected && 'bg-white text-slate-950 shadow-xs',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented) {
          return
        }

        setActiveValue(value)
      }}
    >
      {children}
    </li>
  )
}
;(TabsTrigger as unknown as { tabsRole: string }).tabsRole = 'Tab'

export const TabsContent: FC<TabsContentProps> = ({
  className,
  value,
  selected,
  id,
  tabId,
  children,
  tabRef,
}) => {
  const { baseId } = useTabsContext()
  const fallbackPanelId = `${baseId}-${value}-panel`
  const panelId = id ? `panel-${id}` : fallbackPanelId
  const labelledBy = tabId ?? (id ? `tab-${id}` : undefined)

  return (
    <div
      ref={tabRef}
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={!selected}
      className={cn('mt-4 outline-none', !selected && 'hidden', className)}
    >
      {children}
    </div>
  )
}
;(TabsContent as unknown as { tabsRole: string }).tabsRole = 'TabPanel'

const extractTabValues = (children: ReactNode): string[] => {
  const result: string[] = []

  const walk = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) {
        return
      }

      const childType = child.type as { tabsRole?: string }
      const childValue = (child.props as { value?: unknown }).value

      if (childType.tabsRole === 'Tab' && typeof childValue === 'string') {
        result.push(childValue)
      }

      const nestedChildren = (child.props as { children?: ReactNode }).children
      if (nestedChildren) {
        walk(nestedChildren)
      }
    })
  }

  walk(children)
  return result
}
