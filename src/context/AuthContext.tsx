// AUTH: customer login (real backend API) / logout / profile update.
// State: user, token, isAuthenticated. The session is kept in localStorage ('gawas-auth'), so a refresh keeps the customer logged in.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SESSION_EXPIRED_EVENT } from '../lib/apiClient'
import { SESSION_KEY, clearSession, isTokenExpired, readSession, writeSession, type Customer, type Session } from '../lib/authStorage'
import { loginCustomer } from '../services/authService'
import { loadSavedProfile, saveProfile } from '../services/profileService'

export type User = Customer
type Result = { ok: true } | { ok: false; error: string }

type Ctx = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  sessionExpired: boolean // true when the server rejected the token (shown on the login form)
  login: (username: string, password: string) => Promise<Result>
  logout: () => void
  updateProfile: (changes: Partial<Omit<User, 'customerId' | 'username'>>) => Promise<Result>
}

const C = createContext<Ctx | null>(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(C)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export const fullName = (u: Pick<User, 'name' | 'username'>) => u.name || u.username

// Session saved earlier (an expired JWT is thrown away)
function initialSession(): Session | null {
  const s = readSession()
  if (!s) return null
  if (s.token && isTokenExpired(s.token)) { clearSession(); return null }
  return s
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [sessionExpired, setSessionExpired] = useState(false)

  const logout = useCallback(() => {
    clearSession() // only the login session; public data (products, cart, wishlist) is not touched
    setSession(null)
  }, [])

  // 1) server said 401 for our token  2) logout / login in another tab
  useEffect(() => {
    const onExpired = () => { clearSession(); setSession(null); setSessionExpired(true) }
    const onStorage = (e: StorageEvent) => { if (e.key === SESSION_KEY) setSession(readSession()) }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const login = useCallback<Ctx['login']>(async (username, password) => {
    try {
      const { token, customer } = await loginCustomer(username, password)
      const next: Session = { token, customer: { ...customer, ...loadSavedProfile(customer.customerId) } } // saved profile (address ...) on top
      writeSession(next)
      setSession(next)
      setSessionExpired(false)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Login failed. Please try again.' }
    }
  }, [])

  const updateProfile = useCallback<Ctx['updateProfile']>(async changes => {
    if (!session) return { ok: false, error: 'Please login again.' }
    try {
      const customer: User = { ...session.customer, ...changes }
      await saveProfile(customer)
      const next: Session = { token: session.token, customer }
      writeSession(next)
      setSession(next) // navbar + checkout update immediately
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Could not save your profile. Please try again.' }
    }
  }, [session])

  const value = useMemo<Ctx>(() => ({
    user: session?.customer ?? null,
    token: session?.token ?? null,
    isAuthenticated: !!session,
    sessionExpired,
    login, logout, updateProfile,
  }), [session, sessionExpired, login, logout, updateProfile])

  return <C.Provider value={value}>{children}</C.Provider>
}