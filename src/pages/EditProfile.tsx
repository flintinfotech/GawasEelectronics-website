// EDIT PROFILE: personal details + home / office address. Saved through AuthContext.updateProfile(),
// so the navbar and checkout show the new details immediately.
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { INDIAN_STATES } from '../config/locations'
import { validateMobile } from '../utils/validators'

const css = `
.ep{max-width:760px;margin-inline:auto}
.ep-form{display:grid;grid-template-columns:1fr 1fr;gap:18px 16px;margin-top:8px}
.ep-sec{grid-column:1/-1;font-size:15px;font-weight:700;padding-top:18px;margin-top:8px;border-top:1px solid var(--line)}
.ep-sec:first-child{border-top:0;padding-top:0;margin-top:0}
.ep-f{display:flex;flex-direction:column;gap:7px;min-width:0;font-size:14px;font-weight:500;color:#3d3d44}
.ep-f.full{grid-column:1/-1}.ep-f .req{color:#d33}
.ep-f input,.ep-f textarea{font:inherit;font-size:16px;font-weight:400;color:var(--ink);width:100%;padding:0 16px;background:#fff;border:1px solid #d9d9df;border-radius:12px;transition:border-color .15s,box-shadow .15s}
.ep-f input{height:50px}.ep-f textarea{padding:13px 16px;resize:vertical;min-height:84px}
.ep-f input:hover,.ep-f textarea:hover{border-color:#b4b4bc}
.ep-f input:focus,.ep-f textarea:focus{outline:0;border-color:var(--ink);box-shadow:0 0 0 4px rgba(255,106,26,.2)}
.ep-f input[readonly]{background:var(--bone);color:#6b6b72}
.ep-f [aria-invalid="true"]{border-color:#d33;background:#fffafa}
.ep-err{color:#c62828;font-size:13px;font-weight:400}
.ep-msg{grid-column:1/-1;border-radius:12px;padding:13px 16px;font-size:15px;line-height:1.5}
.ep-msg.ok{background:#e9f6ee;color:#1f7a3d}.ep-msg.bad{background:#fdecec;color:#b42318}
.ep-hint{grid-column:1/-1;color:#85858d;font-size:13px}
.ep-act{grid-column:1/-1;display:flex;gap:12px;flex-wrap:wrap;margin-top:6px}
.ep-act .btn{min-width:170px;text-align:center;height:52px;display:inline-grid;place-items:center;padding-block:0}
.ep-act .btn.line{border:1px solid var(--line)}
@media(max-width:640px){.ep-form{grid-template-columns:1fr}.ep-act .btn{flex:1}}
`

type Values = { name: string; mobileNumber: string; email: string; homeAddress: string; officeAddress: string; city: string; state: string; pinCode: string; country: string }
type Errors = Partial<Record<keyof Values, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Full name is required.'
  else if (v.name.trim().length < 2) e.name = 'Enter a valid name.'
  const m = validateMobile(v.country.trim().toLowerCase() === 'india' ? '+91' : '', v.mobileNumber)
  if (m) e.mobileNumber = m
  if (!v.email.trim()) e.email = 'Email is required.'
  else if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (!v.homeAddress.trim()) e.homeAddress = 'Home address is required.'
  if (!v.city.trim()) e.city = 'City is required.'
  if (!v.state.trim()) e.state = 'State is required.'
  if (!v.country.trim()) e.country = 'Country is required.'
  if (!v.pinCode) e.pinCode = 'Pincode is required.'
  else if (v.country.trim().toLowerCase() === 'india' ? !/^[1-9]\d{5}$/.test(v.pinCode) : !/^[A-Za-z0-9 -]{3,10}$/.test(v.pinCode)) e.pinCode = 'Enter a valid pincode (6 digits for India).'
  return e
}

export default function EditProfile() {
  const { user, updateProfile } = useAuth()
  const [v, setV] = useState<Values>(() => ({
    name: user?.name ?? '', mobileNumber: user?.mobileNumber ?? '', email: user?.email ?? '',
    homeAddress: user?.homeAddress ?? '', officeAddress: user?.officeAddress ?? '', city: user?.city ?? '',
    state: user?.state ?? '', pinCode: user?.pinCode ?? '', country: user?.country || 'India',
  }))
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  if (!user) return null
  const errors = validate(v)
  const err = (k: keyof Values) => (submitted || touched[k] ? errors[k] : undefined)

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    let value = e.target.value
    if (name === 'mobileNumber') value = value.replace(/\D/g, '').slice(0, 14)
    if (name === 'pinCode') value = v.country.trim().toLowerCase() === 'india' ? value.replace(/\D/g, '').slice(0, 6) : value.slice(0, 10)
    setMsg(null)
    setV(x => ({ ...x, [name]: value }))
  }
  const bind = (k: keyof Values) => ({
    id: `ep-${k}`, name: k, value: v[k], onChange,
    onBlur: () => setTouched(t => ({ ...t, [k]: true })),
    'aria-invalid': err(k) ? true : undefined,
  })
  const errEl = (k: keyof Values) => (err(k) ? <span className="ep-err" role="alert">{err(k)}</span> : null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setSubmitted(true)
    if (Object.keys(errors).length) {
      setTimeout(() => document.querySelector<HTMLElement>('.ep [aria-invalid="true"]')?.focus(), 0)
      return
    }
    setBusy(true); setMsg(null)
    const r = await updateProfile({
      name: v.name.trim(), mobileNumber: v.mobileNumber, email: v.email.trim(), homeAddress: v.homeAddress.trim(),
      officeAddress: v.officeAddress.trim(), city: v.city.trim(), state: v.state.trim(), pinCode: v.pinCode, country: v.country.trim(),
    })
    setBusy(false)
    setMsg(r.ok ? { ok: true, text: 'Your profile has been updated successfully.' } : { ok: false, text: r.error })
  }

  return (
    <section className="container section">
      <style>{css}</style>
      <div className="ep">
        <h1 className="h2">Edit Profile</h1>
        <p className="sub">Keep your details and delivery addresses up to date.</p>
        <form className="ep-form" onSubmit={submit} noValidate>
          <h2 className="ep-sec">Personal details</h2>
          <div className="ep-f full">
            <label htmlFor="ep-name">Full name <span className="req">*</span></label>
            <input {...bind('name')} autoComplete="name" />{errEl('name')}
          </div>
          <div className="ep-f">
            <label htmlFor="ep-mobileNumber">Mobile number <span className="req">*</span></label>
            <input {...bind('mobileNumber')} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="e.g. 9876543210" />{errEl('mobileNumber')}
          </div>
          <div className="ep-f">
            <label htmlFor="ep-email">Email address <span className="req">*</span></label>
            <input {...bind('email')} type="email" autoComplete="email" placeholder="you@example.com" />{errEl('email')}
          </div>
          <div className="ep-f full">
            <label htmlFor="ep-username">Username</label>
            <input id="ep-username" value={user.username} readOnly aria-readonly="true" />
          </div>

          <h2 className="ep-sec">Address details</h2>
          <div className="ep-f full">
            <label htmlFor="ep-homeAddress">Home address <span className="req">*</span></label>
            <textarea {...bind('homeAddress')} rows={3} autoComplete="street-address" />{errEl('homeAddress')}
          </div>
          <div className="ep-f full">
            <label htmlFor="ep-officeAddress">Office address</label>
            <textarea {...bind('officeAddress')} rows={3} />
          </div>
          <div className="ep-f">
            <label htmlFor="ep-city">City <span className="req">*</span></label>
            <input {...bind('city')} autoComplete="address-level2" />{errEl('city')}
          </div>
          <div className="ep-f">
            <label htmlFor="ep-state">State <span className="req">*</span></label>
            <input {...bind('state')} list="ep-states" autoComplete="address-level1" />{errEl('state')}
            <datalist id="ep-states">{INDIAN_STATES.map(s => <option key={s} value={s} />)}</datalist>
          </div>
          <div className="ep-f">
            <label htmlFor="ep-pinCode">Pincode <span className="req">*</span></label>
            <input {...bind('pinCode')} inputMode="numeric" autoComplete="postal-code" placeholder="6 digits" />{errEl('pinCode')}
          </div>
          <div className="ep-f">
            <label htmlFor="ep-country">Country <span className="req">*</span></label>
            <input {...bind('country')} autoComplete="country-name" />{errEl('country')}
          </div>

          {msg && <p className={`ep-msg ${msg.ok ? 'ok' : 'bad'}`} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
          <div className="ep-act">
            <button className="btn dark" type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save Changes'}</button>
            <Link to="/my-account" className="btn line">Back to My Account</Link>
          </div>
        </form>
      </div>
    </section>
  )
}