export const apiClient = async <TResponse>(path: string): Promise<TResponse> => {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as TResponse
}
