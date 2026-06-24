export const apiClient = async <ResponseData>(path: string): Promise<ResponseData> => {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<ResponseData>
}
