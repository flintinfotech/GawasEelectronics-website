// Saves the login session (token + customer) in the browser so it survives a page refresh.
// Only this file touches the 'gawas-auth' key. Logout removes ONLY this key (public data stays).

export type Customer = {
  customerId: string
  username: string
  name: string // full name
  email: string
  mobileNumber: string
  homeAddress: string
  officeAddress: string
  city: string
  state: string
  pinCode: string
  country: string
}

export type Session = { token: string | null; customer: Customer }

export const SESSION_KEY = 'gawas-auth'

export function readSession(): Session | null {
  try {
    const v = localStorage.getItem(SESSION_KEY)
    return v ? (JSON.parse(v) as Session) : null
  } catch {
    return null
  }
}

export function writeSession(s: Session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)) } catch { /* private mode: ignore */ }
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
}

export const getToken = (): string | null => readSession()?.token ?? null

// If the token is a JWT, read its expiry date. Not a JWT (or no "exp") -> treated as "not expired".
export function isTokenExpired(token: string): boolean {
  try {
    const part = token.split('.')[1]
    if (!part) return false
    const payload = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()
  } catch {
    return false
  }
}