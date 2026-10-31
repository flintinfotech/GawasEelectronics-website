// AUTH SERVICE: customer login API  ->  POST /flint/auth/login  { username, password }
//
// The exact response fields of the backend are read in ONE place (the alias lists below).
// If your response uses a different field name, add that name to the matching list. Nothing else changes.
import { ApiError, messageOf, rawRequest } from '../lib/apiClient'
import type { Customer } from '../lib/authStorage'
import { apiEndpoints } from './apiEndpoints'

export type LoginResult = { token: string | null; customer: Customer }

/* ---------- field names we look for in the login response ---------- */
const TOKEN_KEYS = ['token', 'accessToken', 'access_token', 'jwt', 'jwtToken', 'authToken', 'idToken', 'bearerToken']
const ID_KEYS = ['customerId', 'customerInfoId', 'userId', 'userInfoId', 'id']
const USERNAME_KEYS = ['username', 'userName', 'loginId']
const NAME_KEYS = ['fullName', 'customerName', 'name', 'displayName']
const FIRST_KEYS = ['firstNm', 'firstName']
const LAST_KEYS = ['lastNm', 'lastName']
const MOBILE_KEYS = ['mobileNumber', 'mobileNo', 'mobile', 'phoneNumber', 'phone', 'contactNumber', 'contactNo']
const EMAIL_KEYS = ['email', 'emailId', 'emailAddress']

// Looks for the first matching key in the response (nearest level first, up to 4 levels deep)
function find(root: unknown, keys: string[]): string {
  const wanted = keys.map(k => k.toLowerCase())
  let level: unknown[] = [root]
  for (let depth = 0; depth <= 4 && level.length; depth++) {
    const next: unknown[] = []
    for (const node of level) {
      if (Array.isArray(node)) { next.push(...node); continue }
      if (!node || typeof node !== 'object') continue
      const o = node as Record<string, unknown>
      for (const want of wanted) {
        const hit = Object.keys(o).find(k => k.toLowerCase() === want)
        if (hit !== undefined) {
          const v = o[hit]
          if ((typeof v === 'string' && v.trim()) || typeof v === 'number') return String(v).trim()
        }
      }
      next.push(...Object.values(o))
    }
    level = next
  }
  return ''
}

// Only for developers: lists the KEY NAMES of the response (never the values / token) when the token is missing
function keyPaths(node: unknown, prefix = '', depth = 0): string[] {
  if (!node || typeof node !== 'object' || depth > 3) return []
  return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) => [prefix + k, ...keyPaths(v, `${prefix}${k}.`, depth + 1)])
}

const stripBearer = (t: string) => t.replace(/^Bearer\s+/i, '').trim()

export async function loginCustomer(username: string, password: string): Promise<LoginResult> {
  const { data, headers } = await rawRequest(apiEndpoints.login(), {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

  // Some backends answer HTTP 200 and put the error inside the JSON
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>
    const code = o.statusCodeValue
    if ((typeof code === 'number' && code >= 400) || o.success === false) {
      throw new ApiError(messageOf(data) ?? 'Invalid username or password.', typeof code === 'number' ? code : 401)
    }
  }

  // The token can come in the JSON, as a plain-text JWT, or in the Authorization response header
  let token = find(data, TOKEN_KEYS)
  if (!token && typeof data === 'string' && data.split('.').length === 3) token = data.trim()
  if (!token) token = headers.get('Authorization') ?? ''
  token = stripBearer(token)

  if (!token) {
    if (import.meta.env.DEV) console.warn('[login] token not found. Response keys:', keyPaths(data))
    throw new ApiError('Login worked but the server did not send a token. Please contact support.', 500)
  }

  const first = find(data, FIRST_KEYS)
  const last = find(data, LAST_KEYS)
  const username2 = find(data, USERNAME_KEYS) || username
  const customer: Customer = {
    customerId: find(data, ID_KEYS) || username2, // used to keep each customer's wishlist / orders separate
    username: username2,
    name: find(data, NAME_KEYS) || [first, last].filter(Boolean).join(' ') || username2,
    email: find(data, EMAIL_KEYS),
    mobileNumber: find(data, MOBILE_KEYS),
    homeAddress: '', officeAddress: '', city: '', state: '', pinCode: '', country: 'India',
  }
  return { token, customer }
}