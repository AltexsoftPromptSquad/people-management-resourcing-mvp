import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

export type SearchParamValue = string | number | boolean | readonly string[]

export type SearchParamDefaults = Record<string, SearchParamValue>

export type SearchParamStateUpdater<TParams> =
  | Partial<TParams>
  | ((currentParams: TParams) => TParams)

export type UseSearchParamStateResult<TParams> = {
  params: TParams
  setParams: (updater: SearchParamStateUpdater<TParams>) => void
}

const resolveSearchParamState = <TParams extends SearchParamDefaults>(
  currentParams: TParams,
  updater: SearchParamStateUpdater<TParams>,
): TParams => {
  if (typeof updater === 'function') {
    return (updater as (currentParams: TParams) => TParams)(currentParams)
  }

  return {
    ...currentParams,
    ...updater,
  }
}

const parseSearchParamValue = (
  searchParams: URLSearchParams,
  key: string,
  defaultValue: SearchParamValue,
): SearchParamValue => {
  if (Array.isArray(defaultValue)) {
    return searchParams.getAll(key)
  }

  const value = searchParams.get(key)

  if (value === null) {
    return defaultValue
  }

  if (typeof defaultValue === 'number') {
    const numberValue = Number(value)

    return Number.isFinite(numberValue) ? numberValue : defaultValue
  }

  if (typeof defaultValue === 'boolean') {
    if (value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }

    return defaultValue
  }

  return value
}

const parseSearchParams = <TParams extends SearchParamDefaults>(
  searchParams: URLSearchParams,
  defaultParams: TParams,
): TParams => {
  const params = {} as TParams

  for (const [key, defaultValue] of Object.entries(defaultParams)) {
    params[key as keyof TParams] = parseSearchParamValue(
      searchParams,
      key,
      defaultValue,
    ) as TParams[keyof TParams]
  }

  return params
}

const isDefaultSearchParamValue = (
  value: SearchParamValue,
  defaultValue: SearchParamValue,
): boolean => {
  if (Array.isArray(value) && Array.isArray(defaultValue)) {
    return (
      value.length === defaultValue.length &&
      value.every((item, index) => item === defaultValue[index])
    )
  }

  return value === defaultValue
}

const serializeSearchParams = <TParams extends SearchParamDefaults>(
  params: TParams,
  defaultParams: TParams,
): URLSearchParams => {
  const searchParams = new URLSearchParams()

  for (const [key, defaultValue] of Object.entries(defaultParams)) {
    const value = params[key]

    if (value === undefined || isDefaultSearchParamValue(value, defaultValue)) {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, item)
      }

      continue
    }

    searchParams.set(key, String(value))
  }

  return searchParams
}

export const useSearchParamState = <TParams extends SearchParamDefaults>(
  defaultParams: TParams,
): UseSearchParamStateResult<TParams> => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsString = searchParams.toString()
  const defaultParamsString = JSON.stringify(defaultParams)

  const parsedDefaultParams = useMemo(() => {
    return JSON.parse(defaultParamsString) as TParams
  }, [defaultParamsString])

  const params = useMemo(() => {
    return parseSearchParams(new URLSearchParams(searchParamsString), parsedDefaultParams)
  }, [parsedDefaultParams, searchParamsString])

  const [paramState, setParamState] = useState(params)

  useEffect(() => {
    setParamState(params)
  }, [params])

  const setParams = useCallback(
    (updater: SearchParamStateUpdater<TParams>) => {
      const nextParams = resolveSearchParamState(paramState, updater)

      setParamState(nextParams)
      setSearchParams(serializeSearchParams(nextParams, parsedDefaultParams), {
        replace: true,
      })
    },
    [paramState, parsedDefaultParams, setSearchParams],
  )

  return {
    params: paramState,
    setParams,
  }
}
