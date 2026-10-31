// Common API client: saari API calls isi se jati hain (base url, headers, error handling).
// Login ke baad token automatically `Authorization: Bearer <token>` me chala jata hai
// (public APIs - banner / product / staticData - ko token nahi bheja jata, taaki unka CORS na toote).
import config from '../config/config'
import { getToken } from './authStorage'

type ApiResponse<T> = { body: T; statusCode: string; message: string | null; statusCodeValue: number }

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// AuthContext listens to this event and logs the customer out when the server says "token is invalid / expired"
export const SESSION_EXPIRED_EVENT = 'gawas:session-expired'

const PUBLIC_PATHS = ['/flint/banner', '/flint/product', '/flint/staticData']
const isPublic = (path: string) => PUBLIC_PATHS.some(p => path.startsWith(p))

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return text }
}

// Finds the backend's own error message in an error response
export function messageOf(data: unknown): string | null {
  if (typeof data === 'string') return data.trim().slice(0, 200) || null
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>
    for (const k of ['message', 'errorMessage', 'error', 'msg']) {
      if (typeof o[k] === 'string' && o[k]) return o[k] as string
    }
    if (o.body && typeof o.body === 'object') return messageOf(o.body)
  }
  return null
}

// Returns the full JSON + response headers (login needs this to find the token)
export async function rawRequest(path: string, options: RequestInit = {}): Promise<{ data: unknown; headers: Headers }> {
  const token = isPublic(path) ? null : getToken()
  let res: Response
  try {
    res = await fetch(config.baseURL + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError('Cannot reach the server. Please check your internet connection and try again.', 0)
  }
  const data = await readBody(res)
  if (!res.ok) {
    if (res.status === 401 && token) window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    // public APIs keep the old message (productService checks for "405" in it)
    throw new ApiError(isPublic(path) ? `API error ${res.status}` : messageOf(data) ?? `Request failed (${res.status})`, res.status)
  }
  return { data, headers: res.headers }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { data } = await rawRequest(path, options)
  if (data && typeof data === 'object' && 'body' in data) return (data as ApiResponse<T>).body // backend ka "body" hi return hota hai
  return data as T
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', ...(data !== undefined && { body: JSON.stringify(data) }) }),
  put: <T,>(path: string, data: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T,>(path: string) => request<T>(path, { method: 'DELETE' }),
}