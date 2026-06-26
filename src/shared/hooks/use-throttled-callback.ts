import { useCallback, useEffect, useRef } from 'react'

export type ThrottledCallback<TArgs extends readonly unknown[]> = (...args: TArgs) => void

export const useThrottledCallback = <TArgs extends readonly unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
): ThrottledCallback<TArgs> => {
  const callbackRef = useRef(callback)
  const lastRunAtRef = useRef(0)
  const trailingTimeoutRef = useRef<number | null>(null)
  const trailingArgsRef = useRef<TArgs | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      if (trailingTimeoutRef.current !== null) {
        window.clearTimeout(trailingTimeoutRef.current)
        trailingTimeoutRef.current = null
      }
    }
  }, [delayMs])

  return useCallback(
    (...args: TArgs) => {
      const now = Date.now()
      const elapsedMs = now - lastRunAtRef.current

      if (elapsedMs >= delayMs) {
        lastRunAtRef.current = now
        callbackRef.current(...args)
        return
      }

      trailingArgsRef.current = args

      if (trailingTimeoutRef.current !== null) {
        return
      }

      trailingTimeoutRef.current = window.setTimeout(() => {
        trailingTimeoutRef.current = null
        lastRunAtRef.current = Date.now()

        if (trailingArgsRef.current !== null) {
          callbackRef.current(...trailingArgsRef.current)
          trailingArgsRef.current = null
        }
      }, delayMs - elapsedMs)
    },
    [delayMs],
  )
}
