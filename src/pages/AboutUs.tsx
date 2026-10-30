import { Link } from 'react-router-dom'
import PolicyLayout from '../components/PolicyLayout'
import { POLICY } from '../config/policies'
import { DEVICES, SITE } from '../config/site'

const css = `
.ac-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:20px 0 8px}
.ac-card{background:var(--bone);border-radius:18px;padding:22px}
.ac-card h3{margin:0 0 6px;font-size:17px}.ac-card p{margin:0;font-size:15px;line-height:1.6;color:#555}
.ac-chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 20px}
.ac-chips span{border:1px solid var(--line);border-radius:999px;padding:7px 14px;font-size:14px}
@media(max-width:700px){.ac-cards{grid-template-columns:1fr}}
`

export default function AboutUs() {
  return (
    <PolicyLayout title="About Us" intro={`${SITE.tagline}, designed in India for real life.`} showUpdated={false}>
      <style>{css}</style>

      <h2>Who we are</h2>
      <p>{POLICY.businessName} makes premium mobile covers for the phones people actually use every day. We started with a simple idea: a phone case should protect your phone, feel great in your hand and look good doing it.</p>
      <p>Every design is chosen for a precise fit, a clean finish and everyday durability, and we keep prices fair with free shipping on paid orders.</p>

      <h2>What we stand for</h2>
      <div className="ac-cards">
        <div className="ac-card"><h3>Precise fit</h3><p>Accurate cut-outs for cameras, ports and buttons, made for each phone model.</p></div>
        <div className="ac-card"><h3>Everyday protection</h3><p>Materials and edges built to handle daily bumps, drops and scratches.</p></div>
        <div className="ac-card"><h3>Designed in India</h3><p>Designs made for how we live, with support that speaks your language.</p></div>
      </div>

      <h2>Phones we cover</h2>
      <div className="ac-chips">{DEVICES.map(d => <span key={d}>{d}</span>)}</div>

      <h2>Talk to us</h2>
      <p>Have a question or an idea? Visit our <Link to="/contact">Contact page</Link> or email <a href={`mailto:${POLICY.email}`}>{POLICY.email}</a>.</p>
      <p><Link to="/products" className="btn dark" style={{ textDecoration: 'none', color: '#fff' }}>Shop Now</Link></p>
    </PolicyLayout>
  )
}