// AUTH: login / register / logout.
// NOTE: backend login API is not available yet, so users are stored in this browser (localStorage) as a demo.
// When the API is ready, replace the bodies of login() and register() with api.post(...) calls.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type User = { name: string; email: string; phone: string }
type Stored = User & { hash: string }
type Result = { ok: true } | { ok: false; error: string }

type Ctx = {
  user: User | null
  login: (email: string, password: string) => Promise<Result>
  register: (u: User & { password: string }) => Promise<Result>
  logout: () => void
}

const C = createContext<Ctx | null>(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(C)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load<User | null>('gawas-user', null))
  useEffect(() => save('gawas-user', user), [user])

  const value = useMemo<Ctx>(() => ({
    user,
    login: async (email, password) => {
      const users = load<Stored[]>('gawas-users', [])
      const found = users.find(u => u.email === email.trim().toLowerCase())
      if (!found || found.hash !== (await hash(password))) return { ok: false, error: 'Invalid email or password.' }
      setUser({ name: found.name, email: found.email, phone: found.phone })
      return { ok: true }
    },
    register: async ({ name, email, phone, password }) => {
      const users = load<Stored[]>('gawas-users', [])
      const mail = email.trim().toLowerCase()
      if (users.some(u => u.email === mail)) return { ok: false, error: 'An account with this email already exists.' }
      save('gawas-users', [...users, { name: name.trim(), email: mail, phone, hash: await hash(password) }])
      setUser({ name: name.trim(), email: mail, phone })
      return { ok: true }
    },
    logout: () => setUser(null),
  }), [user])

  return <C.Provider value={value}>{children}</C.Provider>
}