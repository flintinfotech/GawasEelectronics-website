import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import PolicyLayout from '../components/PolicyLayout'
import { POLICY } from '../config/policies'

const css = `
.ac-info{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:16px 0 28px}
.ac-info div{border:1px solid var(--line);border-radius:16px;padding:18px}
.ac-info small{display:block;color:#888;text-transform:uppercase;letter-spacing:.1em;font-size:11px;margin-bottom:6px}
.ac-info b,.ac-info a{font-size:16px;word-break:break-word}.ac-info a{text-decoration:none!important;color:var(--ink)!important}.ac-info a:hover{color:var(--accent)!important}
.ac-form{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ac-form label{display:flex;flex-direction:column;gap:6px;font-size:14px;color:#555}
.ac-form .full{grid-column:1/-1}
.ac-form input,.ac-form textarea,.ac-form select{font:inherit;padding:12px 14px;border:1px solid var(--line);border-radius:12px;color:var(--ink)}
.ac-form .btn{justify-self:start;border:0}
.ac-ok{grid-column:1/-1;background:#e9f6ee;color:#1d7a3a;border-radius:12px;padding:14px 16px;font-size:15px}
@media(max-width:700px){.ac-info,.ac-form{grid-template-columns:1fr}}
`

const TOPICS = ['Order status', 'Return or exchange', 'Refund', 'Product question', 'Bulk / business enquiry', 'Other']

export default function ContactUs() {
  const [sent, setSent] = useState(false)

  // No backend mail API yet: the form opens the visitor's email app with the message filled in
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const body = `${get('message')}\n\n---\nName: ${get('name')}\nEmail: ${get('email')}\nPhone: ${get('phone')}\nOrder ID: ${get('order') || '-'}`
    window.location.href = `mailto:${POLICY.email}?subject=${encodeURIComponent(`${get('topic')} - ${get('name')}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <PolicyLayout title="Contact Us" intro="Questions about an order, a return or a product? We are happy to help." showUpdated={false}>
      <style>{css}</style>

      <div className="ac-info">
        <div><small>Email</small><a href={`mailto:${POLICY.email}`}>{POLICY.email}</a></div>
        <div><small>Phone</small><a href={`tel:${POLICY.phone.replace(/\s/g, '')}`}>{POLICY.phone}</a></div>
        <div style={{ gridColumn: '1/-1' }}><small>Support hours</small><b>{POLICY.supportHours}</b></div>
      </div>

      <h2>Send us a message</h2>
      <form className="ac-form" onSubmit={submit}>
        <label>Your name<input name="name" required autoComplete="name" /></label>
        <label>Phone<input name="phone" type="tel" pattern="[0-9]{10}" title="10 digit mobile number" autoComplete="tel" /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Order ID (if any)<input name="order" /></label>
        <label className="full">Topic
          <select name="topic" defaultValue={TOPICS[0]}>{TOPICS.map(t => <option key={t}>{t}</option>)}</select>
        </label>
        <label className="full">Message<textarea name="message" required rows={5} minLength={10} /></label>
        <button className="btn dark" type="submit">Send Message</button>
        {sent && <p className="ac-ok" role="status">Your email app should open with your message ready to send. If it did not, please write to {POLICY.email}.</p>}
      </form>

      <p style={{ marginTop: 24 }}>Looking for policies? See our <Link to="/return-policy">Return Policy</Link>, <Link to="/refund-policy">Refund Policy</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.</p>
    </PolicyLayout>
  )
}