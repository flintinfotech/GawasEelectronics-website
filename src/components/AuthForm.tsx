// Login + Customer Registration form.
//   variant="page" -> used inside <AuthShell> on /login and /register
//   variant="card" -> used on the Checkout page (compact card with its own title)
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { GENDERS, INDIAN_STATES, MOBILE_EXTS } from '../config/locations'
import { validateLogin, validateRegister, type LoginValues, type RegisterValues } from '../utils/validators'

const css = `
.au{width:100%;max-width:640px}
.au.card{margin:0 auto;border:1px solid var(--line);border-radius:24px;padding:clamp(22px,4vw,40px);background:#fff;box-shadow:0 24px 60px -32px rgba(14,14,16,.28)}
.au.card.login{max-width:480px}
.au-title{font-size:clamp(26px,3.4vw,34px);letter-spacing:-.03em;line-height:1.1}
.au-sub{color:#6b6b72;margin-top:8px;line-height:1.55}

.au-tabs{display:inline-grid;grid-auto-flow:column;gap:4px;background:var(--bone);border-radius:999px;padding:4px;margin:0 0 30px}
.au-tabs.spaced{margin-top:22px}
.au-tabs button{padding:10px 28px;border-radius:999px;font-weight:600;color:#6b6b72;transition:background .2s,color .2s,box-shadow .2s}
.au-tabs button:hover{color:var(--ink)}
.au-tabs button.on{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(14,14,16,.16)}

.au-form{display:grid;grid-template-columns:1fr 1fr;gap:18px 16px}
.au-form.one{grid-template-columns:1fr}
.au-sec{grid-column:1/-1;font-size:15px;font-weight:700;letter-spacing:-.01em;color:var(--ink);padding-top:18px;margin-top:8px;border-top:1px solid var(--line)}
.au-sec:first-child{border-top:0;padding-top:0;margin-top:0}

.au-f{display:flex;flex-direction:column;gap:7px;min-width:0;font-size:14px;font-weight:500;color:#3d3d44}
.au-f.full{grid-column:1/-1}
.au-f .req{color:#d33}
.au-f input:not([type="radio"]),.au-f select{
  font:inherit;font-size:16px;font-weight:400;color:var(--ink);width:100%;height:50px;padding:0 16px;
  background:#fff;border:1px solid #d9d9df;border-radius:12px;transition:border-color .15s,box-shadow .15s}
.au-f input:not([type="radio"])::placeholder{color:#a3a3ab}
.au-f input:not([type="radio"]):hover,.au-f select:hover{border-color:#b4b4bc}
.au-f input:not([type="radio"]):focus,.au-f select:focus{outline:0;border-color:var(--ink);box-shadow:0 0 0 4px rgba(255,106,26,.2)}
.au-f input[aria-invalid="true"]:not([type="radio"]),.au-f select[aria-invalid="true"]{border-color:#d33;background:#fffafa}
.au-f input[aria-invalid="true"]:not([type="radio"]):focus,.au-f select[aria-invalid="true"]:focus{box-shadow:0 0 0 4px rgba(221,51,51,.16)}
.au-f select{appearance:none;padding-right:42px;cursor:pointer;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8' fill='none' stroke='%236b6b72' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 1l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 16px center}
.au-err{color:#c62828;font-size:13px;font-weight:400;line-height:1.4}
.au-hint{color:#85858d;font-size:13px;font-weight:400}

.au-phone{display:grid;grid-template-columns:150px minmax(0,1fr);gap:10px}
.au-phone select{padding:0 34px 0 14px;background-position:right 12px center}

.au-pw{position:relative}.au-pw input{padding-right:70px!important}
.au-pw button{position:absolute;right:8px;top:50%;transform:translateY(-50%);padding:7px 12px;border-radius:8px;font-size:13px;font-weight:600;color:#55555d}
.au-pw button:hover{background:var(--bone);color:var(--ink)}
.au-meter{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:2px}
.au-meter i{height:4px;border-radius:2px;background:#e4e4e8;transition:background .2s}
.au-meter[data-score="1"] i.on{background:#d33}.au-meter[data-score="2"] i.on{background:#e8a317}
.au-meter[data-score="3"] i.on{background:#6aa84f}.au-meter[data-score="4"] i.on{background:#2e9e4f}
.au-meter-l{font-size:12.5px;font-weight:400;color:#6b6b72}

.au-gender{border:0;padding:0;min-width:0}.au-gender legend{padding:0;margin-bottom:7px;font-size:14px;font-weight:500;color:#3d3d44}
.au-radios{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.au-radio{position:relative;display:flex;align-items:center;justify-content:center;height:50px;border:1px solid #d9d9df;border-radius:12px;cursor:pointer;
  font-size:15px;font-weight:500;color:#3d3d44;background:#fff;transition:border-color .15s,background .15s,color .15s}
.au-radio:hover{border-color:#b4b4bc}
.au-radio input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.au-radio:has(input:checked){background:var(--ink);border-color:var(--ink);color:#fff}
.au-radio:has(input:focus-visible){box-shadow:0 0 0 4px rgba(255,106,26,.28)}
.au-radio:has(input[aria-invalid="true"]){border-color:#d33}

.au-top-err{grid-column:1/-1;background:#fdecec;color:#b42318;border-radius:12px;padding:13px 16px;font-size:15px;line-height:1.5}
.au-go{grid-column:1/-1;height:54px;margin-top:6px;border-radius:999px;background:var(--ink);color:#fff;font-size:16px;font-weight:600;letter-spacing:.01em;transition:transform .2s,box-shadow .2s,opacity .2s}
.au-go:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 28px -12px rgba(14,14,16,.55)}
.au-go:disabled{opacity:.6;cursor:wait}
.au-switch{grid-column:1/-1;text-align:center;color:#6b6b72;font-size:15px}
.au-switch button{color:var(--ink);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.au-switch button:hover{color:var(--accent)}

@media(max-width:640px){
  .au-form{grid-template-columns:1fr}
  .au-phone{grid-template-columns:148px minmax(0,1fr)}
  .au-tabs{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;width:100%}
}
`

const today = () => new Date().toLocaleDateString('en-CA') // yyyy-mm-dd in local time

const EMPTY_REG: RegisterValues = {
  firstNm: '', lastNm: '', email: '', mobileExt: '+91', mobileNumber: '', dateOfBirth: '', gender: '',
  state: '', city: '', pinCode: '', password: '', confirmPassword: '',
}
const EMPTY_LOGIN: LoginValues = { mobileNumber: '', password: '' }

type Mode = 'login' | 'register'

// 0 (too short) ... 4 (strong)
function passwordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: '' }
  if (pw.length < 8) return { score: 0, label: 'Too short' }
  let score = 1
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++
  return { score, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][score] }
}

type Props = {
  title?: string // card variant only
  variant?: 'page' | 'card'
  initialMode?: Mode
  mode?: Mode // pass mode + onModeChange to control the tabs from outside (AuthShell does this)
  onModeChange?: (m: Mode) => void
  onDone?: () => void
}

export default function AuthForm({ title, variant = 'card', initialMode = 'login', mode: modeProp, onModeChange, onDone }: Props) {
  const { login, register } = useAuth()
  const [innerMode, setInnerMode] = useState<Mode>(initialMode)
  const mode = modeProp ?? innerMode
  const [reg, setReg] = useState<RegisterValues>(EMPTY_REG)
  const [log, setLog] = useState<LoginValues>(EMPTY_LOGIN)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const isLogin = mode === 'login'
  const errors: Record<string, string | undefined> = isLogin ? validateLogin(log) : validateRegister(reg)
  const err = (k: string) => (submitted || touched[k] ? errors[k] : undefined)

  const switchMode = (m: Mode) => {
    setInnerMode(m); onModeChange?.(m)
    setTouched({}); setSubmitted(false); setServerError(''); setShowPw(false)
  }

  // Typing rules: mobile = digits only, pinCode = 6 digits only
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target
    let value = e.target.value
    if (name === 'mobileNumber') value = value.replace(/\D/g, '').slice(0, 14)
    if (name === 'pinCode') value = value.replace(/\D/g, '').slice(0, 6)
    setServerError('')
    if (isLogin) setLog(v => ({ ...v, [name]: value }))
    else setReg(v => ({ ...v, [name]: value }))
  }
  const values = (isLogin ? log : reg) as Record<string, string>
  const bind = (k: string) => ({
    id: `au-${k}`, name: k, value: values[k], onChange,
    onBlur: () => setTouched(t => ({ ...t, [k]: true })),
    'aria-invalid': err(k) ? true : undefined,
    'aria-describedby': err(k) ? `au-${k}-err` : undefined,
  })
  const errEl = (k: string) => (err(k) ? <span id={`au-${k}-err`} className="au-err" role="alert">{err(k)}</span> : null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) {
      setTimeout(() => document.querySelector<HTMLElement>('.au [aria-invalid="true"]')?.focus(), 0)
      return
    }
    setBusy(true); setServerError('')
    const r = isLogin ? await login(log.mobileNumber, log.password) : await register(reg)
    setBusy(false)
    if (r.ok) onDone?.(); else setServerError(r.error)
  }

  const strength = passwordStrength(reg.password)
  const pwField = (k: 'password' | 'confirmPassword', label: string, auto: string, meter = false) => (
    <div className="au-f">
      <label htmlFor={`au-${k}`}>{label} <span className="req">*</span></label>
      <div className="au-pw">
        <input {...bind(k)} type={showPw ? 'text' : 'password'} autoComplete={auto} />
        <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? 'Hide' : 'Show'}</button>
      </div>
      {errEl(k)}
      {meter && reg.password && (
        <>
          <div className="au-meter" data-score={strength.score} aria-hidden="true">
            {[1, 2, 3, 4].map(n => <i key={n} className={n <= strength.score ? 'on' : ''} />)}
          </div>
          <span className="au-meter-l">Password strength: {strength.label}</span>
        </>
      )}
    </div>
  )

  return (
    <div className={`au ${variant} ${isLogin ? 'login' : 'register'}`}>
      <style>{css}</style>
      {variant === 'card' && (
        <>
          <h1 className="au-title">{title ?? (isLogin ? 'Login' : 'Create your account')}</h1>
          <p className="au-sub">{isLogin ? 'Log in with your mobile number.' : 'Register as a customer to place and track your orders.'}</p>
        </>
      )}

      <div className={`au-tabs ${variant === 'card' ? 'spaced' : ''}`} role="tablist" aria-label="Login or register">
        <button type="button" role="tab" aria-selected={isLogin} className={isLogin ? 'on' : ''} onClick={() => switchMode('login')}>Login</button>
        <button type="button" role="tab" aria-selected={!isLogin} className={!isLogin ? 'on' : ''} onClick={() => switchMode('register')}>Register</button>
      </div>

      {isLogin ? (
        <form className="au-form one" onSubmit={submit} noValidate>
          <div className="au-f">
            <label htmlFor="au-mobileNumber">Mobile number <span className="req">*</span></label>
            <input {...bind('mobileNumber')} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="e.g. 9876543210" />
            {errEl('mobileNumber')}
          </div>
          {pwField('password', 'Password', 'current-password')}
          {serverError && <p className="au-top-err" role="alert">{serverError}</p>}
          <button className="au-go" type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
          <p className="au-switch">New to Gawas? <button type="button" onClick={() => switchMode('register')}>Create an account</button></p>
        </form>
      ) : (
        <form className="au-form" onSubmit={submit} noValidate>
          <h2 className="au-sec">About you</h2>
          <div className="au-f">
            <label htmlFor="au-firstNm">First name <span className="req">*</span></label>
            <input {...bind('firstNm')} autoComplete="given-name" />
            {errEl('firstNm')}
          </div>
          <div className="au-f">
            <label htmlFor="au-lastNm">Last name <span className="req">*</span></label>
            <input {...bind('lastNm')} autoComplete="family-name" />
            {errEl('lastNm')}
          </div>
          <div className="au-f">
            <label htmlFor="au-dateOfBirth">Date of birth <span className="req">*</span></label>
            <input {...bind('dateOfBirth')} type="date" max={today()} autoComplete="bday" />
            {errEl('dateOfBirth')}
          </div>
          <fieldset className="au-f au-gender" aria-describedby={err('gender') ? 'au-gender-err' : undefined}>
            <legend>Gender <span className="req">*</span></legend>
            <div className="au-radios" role="radiogroup" aria-label="Gender">
              {GENDERS.map(g => (
                <label key={g} className="au-radio">
                  <input type="radio" name="gender" value={g} checked={reg.gender === g} onChange={onChange}
                    onBlur={() => setTouched(t => ({ ...t, gender: true }))} aria-invalid={err('gender') ? true : undefined} />
                  {g}
                </label>
              ))}
            </div>
            {errEl('gender')}
          </fieldset>

          <h2 className="au-sec">Contact</h2>
          <div className="au-f full">
            <label htmlFor="au-email">Email <span className="req">*</span></label>
            <input {...bind('email')} type="email" autoComplete="email" placeholder="you@example.com" />
            {errEl('email')}
          </div>
          <div className="au-f full">
            <label htmlFor="au-mobileNumber">Mobile number <span className="req">*</span></label>
            <div className="au-phone">
              <select {...bind('mobileExt')} aria-label="Country code">
                {MOBILE_EXTS.map(x => <option key={x.code} value={x.code}>{x.label}</option>)}
              </select>
              <input {...bind('mobileNumber')} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="e.g. 9876543210" />
            </div>
            {errEl('mobileExt')}{errEl('mobileNumber')}
          </div>

          <h2 className="au-sec">Address</h2>
          <div className="au-f full">
            <label htmlFor="au-state">State <span className="req">*</span></label>
            <select {...bind('state')} autoComplete="address-level1">
              <option value="">Select your state</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errEl('state')}
          </div>
          <div className="au-f">
            <label htmlFor="au-city">City <span className="req">*</span></label>
            <input {...bind('city')} autoComplete="address-level2" />
            {errEl('city')}
          </div>
          <div className="au-f">
            <label htmlFor="au-pinCode">Pincode <span className="req">*</span></label>
            <input {...bind('pinCode')} inputMode="numeric" autoComplete="postal-code" placeholder="6 digits" />
            {errEl('pinCode')}
          </div>

          <h2 className="au-sec">Password</h2>
          {pwField('password', 'Password', 'new-password', true)}
          {pwField('confirmPassword', 'Confirm password', 'new-password')}
          <p className="au-hint" style={{ gridColumn: '1/-1', marginTop: -6 }}>Use at least 8 characters with letters and numbers.</p>

          {serverError && <p className="au-top-err" role="alert">{serverError}</p>}
          <button className="au-go" type="submit" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
          <p className="au-switch">Already have an account? <button type="button" onClick={() => switchMode('login')}>Login</button></p>
        </form>
      )}
    </div>
  )
}