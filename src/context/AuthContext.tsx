// AUTH: customer registration / login / logout.
//
// NOTE: the backend has no customer registration / login API yet, so customers are stored in this
// browser (localStorage) as a demo. Field names (firstNm, lastNm, mobileExt ...) already match the
// backend form, so when the API is ready only the bodies of login() and register() need to change:
//    register: api.post(apiEndpoints.registerCustomer, { firstNm, lastNm, ..., password, confirmPassword })
//    login:    api.post(apiEndpoints.login, { mobileNumber, password })   -> save the returned token
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { RegisterValues } from '../utils/validators'

// The logged-in customer (never contains the password)
export type User = {
  firstNm: string
  lastNm: string
  email: string
  mobileExt: string
  mobileNumber: string
  dateOfBirth: string
  gender: string
  state: string
  city: string
  pinCode: string
}
type Stored = User & { hash: string }
type Result = { ok: true } | { ok: false; error: string }

type Ctx = {
  user: User | null
  login: (mobileNumber: string, password: string) => Promise<Result>
  register: (v: RegisterValues) => Promise<Result>
  logout: () => void
}

const C = createContext<Ctx | null>(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(C)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

const USERS_KEY = 'gawas-customers'
const SESSION_KEY = 'gawas-customer'

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

// Passwords are never stored as plain text
async function hash(text: string): Promise<string> {
  if (!globalThis.crypto?.subtle) return btoa(unescape(encodeURIComponent(text)))
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('')
}
const secret = (mobileNumber: string, password: string) => hash(`${mobileNumber}:${password}`)

// eslint-disable-next-line react-refresh/only-export-components
export const fullName = (u: Pick<User, 'firstNm' | 'lastNm'>) => `${u.firstNm} ${u.lastNm}`.trim()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load<User | null>(SESSION_KEY, null))
  useEffect(() => save(SESSION_KEY, user), [user])

  const value = useMemo<Ctx>(() => ({
    user,

    login: async (mobileNumber, password) => {
      const users = load<Stored[]>(USERS_KEY, [])
      const found = users.find(u => u.mobileNumber === mobileNumber)
      if (!found || found.hash !== (await secret(mobileNumber, password))) {
        return { ok: false, error: 'Invalid mobile number or password.' }
      }
      const { hash: _hash, ...profile } = found
      void _hash
      setUser(profile)
      return { ok: true }
    },

    register: async v => {
      const users = load<Stored[]>(USERS_KEY, [])
      if (users.some(u => u.mobileNumber === v.mobileNumber)) return { ok: false, error: 'This mobile number is already registered. Please login.' }
      if (users.some(u => u.email === v.email.trim().toLowerCase())) return { ok: false, error: 'This email is already registered. Please login.' }
      const profile: User = {
        firstNm: v.firstNm.trim(), lastNm: v.lastNm.trim(), email: v.email.trim().toLowerCase(),
        mobileExt: v.mobileExt, mobileNumber: v.mobileNumber, dateOfBirth: v.dateOfBirth, gender: v.gender,
        state: v.state, city: v.city.trim(), pinCode: v.pinCode,
      }
      save(USERS_KEY, [...users, { ...profile, hash: await secret(v.mobileNumber, v.password) }])
      setUser(profile)
      return { ok: true }
    },

    logout: () => setUser(null),
  }), [user])

  return <C.Provider value={value}>{children}</C.Provider>
}