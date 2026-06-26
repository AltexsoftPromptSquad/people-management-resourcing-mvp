import { useCallback, useEffect, useState } from 'react'

export type LocalStorageValueUpdater<TValue> = TValue | ((currentValue: TValue) => TValue)

export type UseLocalStorageOptions<TValue> = {
  serialize?: (value: TValue) => string
  deserialize?: (value: string) => TValue
}

export type UseLocalStorageResult<TValue> = readonly [
  value: TValue,
  setValue: (value: LocalStorageValueUpdater<TValue>) => void,
  removeValue: () => void,
]

const resolveLocalStorageValue = <TValue>(
  currentValue: TValue,
  value: LocalStorageValueUpdater<TValue>,
): TValue => {
  if (typeof value === 'function') {
    return (value as (currentValue: TValue) => TValue)(currentValue)
  }

  return value
}

const readLocalStorageValue = <TValue>(
  key: string,
  defaultValue: TValue,
  deserialize: (value: string) => TValue,
): TValue => {
  const storedValue = window.localStorage.getItem(key)

  if (storedValue === null) {
    return defaultValue
  }

  try {
    return deserialize(storedValue)
  } catch {
    return defaultValue
  }
}

export const useLocalStorage = <TValue>(
  key: string,
  defaultValue: TValue,
  options: UseLocalStorageOptions<TValue> = {},
): UseLocalStorageResult<TValue> => {
  const serialize = options.serialize ?? JSON.stringify
  const deserialize = options.deserialize ?? JSON.parse

  const [value, setStoredValue] = useState<TValue>(() => {
    return readLocalStorageValue(key, defaultValue, deserialize)
  })

  useEffect(() => {
    setStoredValue(readLocalStorageValue(key, defaultValue, deserialize))
  }, [defaultValue, deserialize, key])

  const setValue = useCallback(
    (nextValue: LocalStorageValueUpdater<TValue>) => {
      setStoredValue((currentValue) => {
        const resolvedValue = resolveLocalStorageValue(currentValue, nextValue)

        window.localStorage.setItem(key, serialize(resolvedValue))

        return resolvedValue
      })
    },
    [key, serialize],
  )

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key)
    setStoredValue(defaultValue)
  }, [defaultValue, key])

  return [value, setValue, removeValue]
}
