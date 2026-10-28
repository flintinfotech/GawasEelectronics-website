// Login / Register form (used on the Checkout page and on /login)
import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

const css = `
.au{max-width:440px;margin:0 auto}
.au-tabs{display:flex;border:1px solid var(--line);border-radius:999px;padding:4px;margin:18px 0}
.au-tabs button{flex:1;padding:10px;border-radius:999px;font-weight:500}.au-tabs button.on{background:var(--ink);color:#fff}
.au-form{display:flex;flex-direction:column;gap:14px}
.au-form label{display:flex;flex-direction:column;gap:6px;font-size:14px;color:#555}
.au-form input{font:inherit;padding:12px 14px;border:1px solid var(--line);border-radius:12px;color:var(--ink)}
.au-err{color:#d33;font-size:14px}
.au-form .btn{text-align:center}
`

export default function AuthForm({ title = 'Sign in to continue', onDone }: { title?: string; onDone?: () => void }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '')
    setBusy(true); setError('')
    if (mode === 'register' && get('password') !== get('confirm')) { setBusy(false); return setError('Passwords do not match.') }
    const r = mode === 'login'
      ? await login(get('email'), get('password'))
      : await register({ name: get('name'), email: get('email'), phone: get('phone'), password: get('password') })
    setBusy(false)
    if (r.ok) onDone?.(); else setError(r.error)
  }

  return (
    <div className="au">
      <style>{css}</style>
      <h1 className="h2">{title}</h1>
      <div className="au-tabs">
        <button className={mode === 'login' ? 'on' : ''} onClick={() => { setMode('login'); setError('') }} type="button">Login</button>
        <button className={mode === 'register' ? 'on' : ''} onClick={() => { setMode('register'); setError('') }} type="button">Register</button>
      </div>
      <form className="au-form" onSubmit={submit} key={mode}>
        {mode === 'register' && <>
          <label>Full name<input name="name" required autoComplete="name" /></label>
          <label>Phone<input name="phone" required type="tel" pattern="[0-9]{10}" title="10 digit mobile number" autoComplete="tel" /></label>
        </>}
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Password<input name="password" type="password" required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        {mode === 'register' && <label>Confirm password<input name="confirm" type="password" required minLength={6} autoComplete="new-password" /></label>}
        {error && <p className="au-err" role="alert">{error}</p>}
        <button className="btn dark" type="submit" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}</button>
      </form>
    </div>
  )
}