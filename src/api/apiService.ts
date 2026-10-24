// Common service: saari API calls yahi se jayengi (base url, error handling, token).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export type ApiResponse<T> = { body: T; statusCode: string; message: string | null; statusCodeValue: number }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // login ke baad token ho to: Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const json = (await res.json()) as ApiResponse<T>
  return json.body // backend response ka "body" hi return karte hain
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
    post: <T,>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', ...(data !== undefined && { body: JSON.stringify(data) }) }),
  put: <T,>(path: string, data: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T,>(path: string) => request<T>(path, { method: 'DELETE' }),
}
