export type ApiClientParams = Record<string, string | number | boolean | undefined | null>

export const buildApiUrl = (path: string, params?: ApiClientParams): string => {
  if (!params) {
    return path
  }

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()

  return query ? `${path}?${query}` : path
}

export const apiClient = async <TResponse>(
  path: string,
  params?: ApiClientParams,
): Promise<TResponse> => {
  const response = await fetch(buildApiUrl(path, params))

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as TResponse
}
