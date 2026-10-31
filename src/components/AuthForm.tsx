// Customer LOGIN form (real API: username + password).
//   variant="page" -> used inside <AuthShell> on /login
//   variant="card" -> used on the Checkout page (compact card with its own title)
import { useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

const css = `
.au{width:100%;max-width:640px}
.au.card{margin:0 auto;border:1px solid var(--line);border-radius:24px;padding:clamp(22px,4vw,40px);background:#fff;box-shadow:0 24px 60px -32px rgba(14,14,16,.28)}
.au.card.login{max-width:480px}
.au.page{max-width:480px}
.au-title{font-size:clamp(26px,3.4vw,34px);letter-spacing:-.03em;line-height:1.1}
.au-sub{color:#6b6b72;margin:8px 0 26px;line-height:1.55}
.au-form{display:grid;grid-template-columns:1fr;gap:18px 16px}
.au-f{display:flex;flex-direction:column;gap:7px;min-width:0;font-size:14px;font-weight:500;color:#3d3d44}
.au-f .req{color:#d33}
.au-f input{font:inherit;font-size:16px;font-weight:400;color:var(--ink);width:100%;height:50px;padding:0 16px;background:#fff;border:1px solid #d9d9df;border-radius:12px;transition:border-color .15s,box-shadow .15s}
.au-f input::placeholder{color:#a3a3ab}
.au-f input:hover{border-color:#b4b4bc}
.au-f input:focus{outline:0;border-color:var(--ink);box-shadow:0 0 0 4px rgba(255,106,26,.2)}
.au-f input[aria-invalid="true"]{border-color:#d33;background:#fffafa}
.au-f input[aria-invalid="true"]:focus{box-shadow:0 0 0 4px rgba(221,51,51,.16)}
.au-err{color:#c62828;font-size:13px;font-weight:400;line-height:1.4}
.au-pw{position:relative}.au-pw input{padding-right:70px}
.au-pw button{position:absolute;right:8px;top:50%;transform:translateY(-50%);padding:7px 12px;border-radius:8px;font-size:13px;font-weight:600;color:#55555d}
.au-pw button:hover{background:var(--bone);color:var(--ink)}
.au-top-err{background:#fdecec;color:#b42318;border-radius:12px;padding:13px 16px;font-size:15px;line-height:1.5}
.au-top-note{background:#fff6e5;color:#8a5a00;border-radius:12px;padding:13px 16px;font-size:15px;line-height:1.5}
.au-go{height:54px;margin-top:6px;border-radius:999px;background:var(--ink);color:#fff;font-size:16px;font-weight:600;letter-spacing:.01em;transition:transform .2s,box-shadow .2s,opacity .2s}
.au-go:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 28px -12px rgba(14,14,16,.55)}
.au-go:disabled{opacity:.6;cursor:wait}
`

type Props = {
  title?: string // card variant only
  variant?: 'page' | 'card'
  onDone?: () => void
  // AuthShell still passes these (old login/register tabs). They are ignored now.
  initialMode?: 'login' | 'register'
  mode?: 'login' | 'register'
  onModeChange?: (m: 'login' | 'register') => void
}

export default function AuthForm({ title, variant = 'card', onDone }: Props) {
  const { login, sessionExpired } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({ username: false, password: false })
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const sending = useRef(false) // blocks a second click while the first API call is running

  const errors = {
    username: username.trim() ? undefined : 'Username is required.',
    password: password ? undefined : 'Password is required.',
  }
  const show = (k: 'username' | 'password') => (submitted || touched[k] ? errors[k] : undefined)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending.current) return
    setSubmitted(true)
    if (errors.username || errors.password) {
      setTimeout(() => document.querySelector<HTMLElement>('.au [aria-invalid="true"]')?.focus(), 0)
      return
    }
    sending.current = true
    setBusy(true); setServerError('')
    const r = await login(username.trim(), password)
    sending.current = false
    setBusy(false)
    if (r.ok) onDone?.(); else setServerError(r.error)
  }

  return (
    <div className={`au ${variant} login`}>
      <style>{css}</style>
      <h1 className="au-title">{title ?? 'Login'}</h1>
      <p className="au-sub">Log in with your username and password.</p>
      <form className="au-form" onSubmit={submit} noValidate>
        {sessionExpired && !serverError && <p className="au-top-note" role="alert">Your session has expired. Please login again.</p>}
        <div className="au-f">
          <label htmlFor="au-username">Username <span className="req">*</span></label>
          <input id="au-username" name="username" value={username} autoComplete="username" autoCapitalize="none"
            onChange={e => { setUsername(e.target.value); setServerError('') }}
            onBlur={() => setTouched(t => ({ ...t, username: true }))}
            aria-invalid={show('username') ? true : undefined} />
          {show('username') && <span className="au-err" role="alert">{show('username')}</span>}
        </div>
        <div className="au-f">
          <label htmlFor="au-password">Password <span className="req">*</span></label>
          <div className="au-pw">
            <input id="au-password" name="password" type={showPw ? 'text' : 'password'} value={password} autoComplete="current-password"
              onChange={e => { setPassword(e.target.value); setServerError('') }}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              aria-invalid={show('password') ? true : undefined} />
            <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? 'Hide' : 'Show'}</button>
          </div>
          {show('password') && <span className="au-err" role="alert">{show('password')}</span>}
        </div>
        {serverError && <p className="au-top-err" role="alert">{serverError}</p>}
        <button className="au-go" type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  )
}