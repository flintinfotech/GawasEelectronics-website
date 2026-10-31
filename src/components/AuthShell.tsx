// Split-screen layout for the /login and /register pages:
// left = brand panel with the product drawing, right = the form.
import { useState } from 'react'
import AuthForm from './AuthForm'

const css = `
/* --hdr = height of the sticky site header (top bar + nav) */
.as{--hdr:104px;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);min-height:calc(100vh - var(--hdr))}
/* overflow:clip (not hidden) so the sticky panel below keeps working */
.as-brand{position:relative;overflow:clip;background:#141416;color:#fff}
/* image panel is pinned under the header and always fits the screen */
.as-sticky{position:sticky;top:var(--hdr);height:calc(100vh - var(--hdr));display:flex;flex-direction:column;gap:20px;padding:clamp(24px,5vh,56px) clamp(32px,5vw,84px);overflow:hidden}
.as-brand h1{font-size:clamp(30px,3.4vw,50px);line-height:1.04;letter-spacing:-.035em;font-weight:700;max-width:11em}
.as-lead{color:#b4b4bc;font-size:17px;line-height:1.65;max-width:27em;margin-top:14px}
/* stage takes whatever height is left; the case + rings scale to it */
.as-stage{position:relative;flex:1;min-height:0;container-type:size}
.as-ring{position:absolute;inset:0;margin:auto;border-radius:50%;border:1px solid rgba(201,171,74,.32);pointer-events:none}
.as-ring.a{width:min(96cqh,96cqw,440px);height:min(96cqh,96cqw,440px)}
.as-ring.b{width:min(68cqh,68cqw,310px);height:min(68cqh,68cqw,310px);border-color:rgba(201,171,74,.16)}
.as-case{position:absolute;inset:0;margin:auto;height:min(86cqh,430px);width:auto;max-width:90cqw;filter:drop-shadow(0 28px 36px rgba(0,0,0,.55));transform:rotate(-4deg);animation:as-rise .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes as-rise{from{opacity:0;transform:translateY(34px) rotate(-10deg)}to{opacity:1;transform:translateY(0) rotate(-4deg)}}
.as-perks{list-style:none;display:grid}
.as-perks li{padding:13px 0;border-top:1px solid rgba(255,255,255,.12);color:#d2d2d9;font-size:15px}
/* login AND register both start at the top of the right side */
.as-main{display:flex;align-items:flex-start;justify-content:center;padding:clamp(32px,6vh,64px) clamp(20px,5vw,76px) 56px;background:#fff}
/* short screens: drop the extras so the image still fits */
@media(max-height:800px){.as-perks{display:none}}
@media(max-height:620px){.as-lead{display:none}}
@media(max-width:960px){
  .as{grid-template-columns:1fr;min-height:0}
  .as-sticky{position:static;height:auto;padding:36px 24px 32px}
  .as-stage,.as-perks{display:none}
  .as-main{padding:32px 20px 56px}
}
@media(prefers-reduced-motion:reduce){.as-case{animation:none}}
`

const COPY = {
  login: { h: 'Welcome back', p: 'Log in to see your orders, your saved cases and a faster checkout.' },
  register: { h: 'Create your Gawas account', p: 'Save cases to your wishlist, check out faster and keep track of every order.' },
}

// A leather phone case, seen from the back (generic design, not any specific phone)
function CaseArt() {
  return (
    <svg className="as-case" viewBox="0 0 240 480" role="img" aria-label="Leather phone case with a triple camera cut-out">
      <defs>
        <linearGradient id="as-leather" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c58650" />
          <stop offset="1" stopColor="#7a4725" />
        </linearGradient>
        <radialGradient id="as-sheen" cx=".25" cy=".12" r=".7">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="14" y="132" width="7" height="46" rx="3.5" fill="#5c381c" />
      <rect x="219" y="168" width="7" height="74" rx="3.5" fill="#5c381c" />
      <rect x="20" y="10" width="200" height="460" rx="46" fill="url(#as-leather)" />
      <rect x="20" y="10" width="200" height="460" rx="46" fill="url(#as-sheen)" />
      <rect x="34" y="24" width="172" height="432" rx="33" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.4" strokeDasharray="5 5" />
      <rect x="42" y="44" width="106" height="106" rx="30" fill="#1a1a1d" stroke="#34343a" strokeWidth="2" />
      {[[72, 78], [118, 78], [95, 120]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="20" fill="#09090a" stroke="#3b3b41" strokeWidth="3" />
          <circle cx={x} cy={y} r="12" fill="#14141a" stroke="#26262e" strokeWidth="1.5" />
          <circle cx={x - 4} cy={y - 4} r="3.4" fill="#fff" fillOpacity=".4" />
        </g>
      ))}
      <circle cx="126" cy="120" r="6.5" fill="#efe2b6" />
      <text x="120" y="424" textAnchor="middle" fill="#fff" fillOpacity=".6" fontSize="13" fontWeight="600" letterSpacing="6">GAWAS</text>
    </svg>
  )
}

export default function AuthShell({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const c = COPY[mode]
  return (
    <section className="as">
      <style>{css}</style>
      <aside className="as-brand">
        <div className="as-sticky">
          <div>
            <h1>{c.h}</h1>
            <p className="as-lead">{c.p}</p>
          </div>
          <div className="as-stage">
            <span className="as-ring a" /><span className="as-ring b" />
            <CaseArt />
          </div>
          <ul className="as-perks">
            <li>Track every order from dispatch to delivery</li>
            <li>Keep your favourite cases in one wishlist</li>
            <li>Check out with your saved details</li>
          </ul>
        </div>
      </aside>
      <div className="as-main">
        <AuthForm variant="page" mode={mode} onModeChange={setMode} />
      </div>
    </section>
  )
}