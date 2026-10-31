import { GENDERS } from '../config/locations'

// Form validation for registration and login. Every function returns an object of
// { fieldName: 'error message' }. An empty object means the form is valid.

export type RegisterValues = {
  firstNm: string
  lastNm: string
  email: string
  mobileExt: string
  mobileNumber: string
  dateOfBirth: string // yyyy-mm-dd
  gender: string
  state: string
  city: string
  pinCode: string
  password: string
  confirmPassword: string
}
export type LoginValues = { mobileNumber: string; password: string }
export type Errors<T> = Partial<Record<keyof T, string>>

const NAME = /^[A-Za-z][A-Za-z .'-]{0,49}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateMobile(ext: string, number: string): string | undefined {
  if (!number) return 'Mobile number is required.'
  if (!/^\d+$/.test(number)) return 'Mobile number can contain digits only.'
  if (ext === '+91') return /^[6-9]\d{9}$/.test(number) ? undefined : 'Enter a valid 10-digit Indian mobile number.'
  return /^\d{6,14}$/.test(number) ? undefined : 'Enter a valid mobile number (6 to 14 digits).'
}

export function validateRegister(v: RegisterValues): Errors<RegisterValues> {
  const e: Errors<RegisterValues> = {}

  if (!v.firstNm.trim()) e.firstNm = 'First name is required.'
  else if (!NAME.test(v.firstNm.trim())) e.firstNm = 'Use letters only.'

  if (!v.lastNm.trim()) e.lastNm = 'Last name is required.'
  else if (!NAME.test(v.lastNm.trim())) e.lastNm = 'Use letters only.'

  if (!v.email.trim()) e.email = 'Email is required.'
  else if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address.'

  if (!v.mobileExt) e.mobileExt = 'Select a country code.'
  const mobileErr = validateMobile(v.mobileExt, v.mobileNumber)
  if (mobileErr) e.mobileNumber = mobileErr

  if (!v.dateOfBirth) e.dateOfBirth = 'Date of birth is required.'
  else {
    const d = new Date(v.dateOfBirth)
    const now = new Date()
    const oldest = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate())
    if (Number.isNaN(d.getTime()) || d > now) e.dateOfBirth = 'Date of birth cannot be in the future.'
    else if (d < oldest) e.dateOfBirth = 'Enter a valid date of birth.'
  }

  if (!v.gender) e.gender = 'Select your gender.'
  else if (!GENDERS.includes(v.gender)) e.gender = 'Select a valid gender.'

  if (!v.state) e.state = 'Select your state.'

  if (!v.city.trim()) e.city = 'City is required.'
  else if (v.city.trim().length < 2) e.city = 'Enter a valid city.'

  if (!v.pinCode) e.pinCode = 'Pincode is required.'
  else if (!/^[1-9]\d{5}$/.test(v.pinCode)) e.pinCode = 'Enter a valid 6-digit pincode.'

  if (!v.password) e.password = 'Password is required.'
  else if (v.password.length < 8) e.password = 'Password must be at least 8 characters.'
  else if (!/[A-Za-z]/.test(v.password) || !/\d/.test(v.password)) e.password = 'Password must contain letters and numbers.'

  if (!v.confirmPassword) e.confirmPassword = 'Please confirm your password.'
  else if (v.confirmPassword !== v.password) e.confirmPassword = 'Passwords do not match.'

  return e
}

export function validateLogin(v: LoginValues): Errors<LoginValues> {
  const e: Errors<LoginValues> = {}
  if (!v.mobileNumber) e.mobileNumber = 'Mobile number is required.'
  else if (!/^\d{6,14}$/.test(v.mobileNumber)) e.mobileNumber = 'Enter a valid mobile number.'
  if (!v.password) e.password = 'Password is required.'
  return e
}