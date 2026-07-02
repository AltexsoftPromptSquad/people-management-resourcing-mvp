export type ApiClientParams = Record<string, string | number | boolean | undefined | null>

type ApiClientMethod = 'GET' | 'POST' | 'PATCH'

type ApiClientOptions<TBody = undefined> = {
  method?: ApiClientMethod
  params?: ApiClientParams
  body?: TBody
  headers?: HeadersInit
}

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

const request = async <TResponse, TBody = undefined>(
  path: string,
  { method = 'GET', params, body, headers }: ApiClientOptions<TBody> = {},
): Promise<TResponse> => {
  const response = await fetch(buildApiUrl(path, params), {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}

export const apiClient = <TResponse>(
  path: string,
  params?: ApiClientParams,
): Promise<TResponse> => {
  return request<TResponse>(path, { params })
}

export const apiGet = <TResponse>(path: string, params?: ApiClientParams): Promise<TResponse> => {
  return request<TResponse>(path, { method: 'GET', params })
}

export const apiPost = <TResponse, TBody = undefined>(
  path: string,
  body?: TBody,
  params?: ApiClientParams,
): Promise<TResponse> => {
  return request<TResponse, TBody>(path, { method: 'POST', body, params })
}

export const apiPatch = <TResponse, TBody = undefined>(
  path: string,
  body?: TBody,
  params?: ApiClientParams,
): Promise<TResponse> => {
  return request<TResponse, TBody>(path, { method: 'PATCH', body, params })
}
