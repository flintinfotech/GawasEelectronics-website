// Common API client (JNPV ke lib/axios.ts jaisa): saari API calls isi se jati hain (base url, headers, error handling).
import config from '../config/config'

type ApiResponse<T> = { body: T; statusCode: string; message: string | null; statusCodeValue: number }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(config.baseURL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // login ke baad: Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const json = (await res.json()) as ApiResponse<T>
  return json.body // backend ka "body" hi return hota hai
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', ...(data !== undefined && { body: JSON.stringify(data) }) }),
  put: <T,>(path: string, data: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T,>(path: string) => request<T>(path, { method: 'DELETE' }),
}
