// PERKS: dark "bento" section. Cards par cursor ke saath orange spotlight chalta hai, scroll par fade-up hote hain.
import { useEffect, useRef } from 'react'

const css = `
.pk-sec{position:relative;overflow:hidden;color:#fff;padding:96px 0;background:#0b0b0d}
.pk-sec::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px);background-size:26px 26px;-webkit-mask-image:radial-gradient(ellipse at 50% 40%,#000 20%,transparent 75%);mask-image:radial-gradient(ellipse at 50% 40%,#000 20%,transparent 75%)}
.pk-orb{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(110px);opacity:.28;pointer-events:none}
.pk-orb.a{top:-220px;left:-120px;background:#ff6a1a}.pk-orb.b{bottom:-260px;right:-140px;background:#5b3df5;opacity:.18}
.pk-wrap{position:relative;width:min(83%,1400px);margin-inline:auto}
.pk-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:600;letter-spacing:.22em;color:#ff9a3c}
.pk-eyebrow::before{content:'';width:28px;height:1px;background:#ff9a3c}
.pk-title{margin:16px 0 14px;font-size:clamp(34px,5vw,68px);font-weight:700;letter-spacing:-.045em;line-height:1.02;max-width:760px}
.pk-title span{background:linear-gradient(90deg,#ff6a1a,#ffb067);-webkit-background-clip:text;background-clip:text;color:transparent}
.pk-lead{max-width:460px;color:#9a9aa5;font-size:16px;line-height:1.7;margin-bottom:48px}

.pk-grid{display:grid;grid-template-columns:1.25fr 1fr 1fr;grid-template-rows:repeat(2,minmax(230px,auto));gap:18px}
.pk-card{--x:50%;--y:0%;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:30px;border-radius:30px;border:1px solid rgba(255,255,255,.09);background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.015));opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
.pk-card.in{opacity:1;transform:none}
.pk-card::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(460px circle at var(--x) var(--y),rgba(255,106,26,.17),transparent 60%)}
.pk-card::after{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(280px circle at var(--x) var(--y),#ff9a3c,transparent 60%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
.pk-card:hover::before,.pk-card:hover::after{opacity:1}
.pk-a{grid-row:1/3}.pk-d{grid-column:2/4}
.pk-num{position:absolute;top:22px;left:28px;font-size:13px;letter-spacing:.18em;color:rgba(255,255,255,.3)}
.pk-art{position:absolute;pointer-events:none}
.pk-card h3{position:relative;font-size:clamp(20px,1.9vw,26px);font-weight:600;letter-spacing:-.02em;line-height:1.2;margin-bottom:8px}
.pk-card p{position:relative;color:#a3a3ae;font-size:15px;line-height:1.65;max-width:360px}
.pk-tags{position:relative;display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.pk-tags span{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:#d6d6dc;padding:6px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04)}
.pk-tags span::before{content:'';width:6px;height:6px;border-radius:50%;background:#ff9a3c;box-shadow:0 0 10px #ff6a1a}

.pk-a .pk-art{top:54px;right:36px;width:min(46%,230px)}
.pk-scan{animation:pkScan 3.4s ease-in-out infinite alternate}
@keyframes pkScan{from{transform:translateY(0)}to{transform:translateY(262px)}}
.pk-b .pk-art{top:10px;right:6px;width:150px}
.pk-ring{fill:none;stroke:#ff9a3c;stroke-width:1.5;transform-box:fill-box;transform-origin:center;animation:pkRing 2.8s ease-out infinite}
@keyframes pkRing{0%{transform:scale(.2);opacity:.95}100%{transform:scale(2.1);opacity:0}}
.pk-c .pk-art{top:26px;right:22px;width:170px}
.pk-flow{stroke-dasharray:24 76;animation:pkFlow 3.2s linear infinite}
@keyframes pkFlow{to{stroke-dashoffset:-100}}
.pk-d{flex-direction:row;align-items:flex-end;justify-content:space-between;gap:24px}
.pk-big{font-size:clamp(64px,8vw,120px);font-weight:700;letter-spacing:-.05em;line-height:.9;color:transparent;-webkit-text-stroke:1.5px rgba(255,154,60,.85);transition:color .4s}
.pk-card:hover .pk-big{color:rgba(255,106,26,.16)}
.pk-live{display:inline-flex;align-items:center;gap:8px;margin-top:16px;font-size:12px;letter-spacing:.14em;color:#d6d6dc}
.pk-live::before{content:'';width:8px;height:8px;border-radius:50%;background:#35d07f;animation:pkPulse 1.8s infinite}
@keyframes pkPulse{0%{box-shadow:0 0 0 0 rgba(53,208,127,.6)}100%{box-shadow:0 0 0 10px rgba(53,208,127,0)}}

@media(max-width:1024px){
.pk-sec{padding:72px 0}.pk-wrap{width:calc(100% - 32px)}
.pk-grid{grid-template-columns:1fr 1fr;grid-template-rows:none}
.pk-a{grid-row:auto;grid-column:1/3;min-height:440px}.pk-d{grid-column:1/3}
}
@media(max-width:600px){
.pk-sec{padding:56px 0}.pk-lead{margin-bottom:32px}
.pk-grid{grid-template-columns:1fr;gap:14px}
.pk-a,.pk-d{grid-column:auto}.pk-a{min-height:420px}
.pk-card{padding:24px;border-radius:24px;min-height:230px}
.pk-a .pk-art{right:20px;width:150px}
.pk-d{flex-direction:column;align-items:flex-start;justify-content:flex-end}
}
@media(prefers-reduced-motion:reduce){.pk-card{opacity:1;transform:none;transition:none}.pk-scan,.pk-ring,.pk-flow,.pk-live::before{animation:none}}
`

// Cursor ke saath spotlight
const spot = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

export default function Perks() {
  const root = useRef<HTMLDivElement>(null)

  // Scroll karne par cards ek ek karke upar aate hain
  useEffect(() => {
    const cards = root.current?.querySelectorAll('.pk-card')
    if (!cards) return
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) } }), { threshold: 0.18 })
    cards.forEach(c => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <section className="pk-sec" aria-label="Why choose Gawas">
      <style>{css}</style>
      <span className="pk-orb a" /><span className="pk-orb b" />
      <div className="pk-wrap">
        <span className="pk-eyebrow">WHY GAWAS</span>
        <h2 className="pk-title">Built to protect. <span>Made to impress.</span></h2>
        <p className="pk-lead">Every case is shaped around your phone and tested against the everyday drops, scratches and spills.</p>

        <div className="pk-grid" ref={root}>
          {/* 01 Precision Fit */}
          <article className="pk-card pk-a" onMouseMove={spot}>
            <span className="pk-num">01</span>
            <svg className="pk-art" viewBox="0 0 220 300" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="pkg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff9a3c" /><stop offset="1" stopColor="#ff6a1a" stopOpacity=".4" /></linearGradient>
                <linearGradient id="pks" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ff6a1a" stopOpacity="0" /><stop offset=".5" stopColor="#ffb067" /><stop offset="1" stopColor="#ff6a1a" stopOpacity="0" /></linearGradient>
              </defs>
              <rect x="40" y="8" width="140" height="284" rx="36" stroke="url(#pkg)" strokeWidth="2" />
              <rect x="54" y="22" width="68" height="68" rx="20" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="76" cy="44" r="10" stroke="url(#pkg)" strokeWidth="1.5" /><circle cx="76" cy="70" r="10" stroke="url(#pkg)" strokeWidth="1.5" /><circle cx="102" cy="57" r="10" stroke="url(#pkg)" strokeWidth="1.5" />
              <rect x="35" y="96" width="5" height="34" rx="2.5" fill="#ff9a3c" /><rect x="180" y="124" width="5" height="52" rx="2.5" fill="#ff9a3c" />
              <rect x="86" y="284" width="48" height="4" rx="2" fill="rgba(255,255,255,.35)" />
              <g className="pk-scan"><rect x="30" y="12" width="160" height="2" fill="url(#pks)" /></g>
            </svg>
            <h3>Precision Fit, Premium Feel</h3>
            <p>Cut around your exact model, so every button, port and camera ring lines up perfectly.</p>
            <div className="pk-tags"><span>Button cut-outs</span><span>Camera ring</span><span>Port access</span></div>
          </article>

          {/* 02 Real Drops */}
          <article className="pk-card pk-b" onMouseMove={spot}>
            <span className="pk-num">02</span>
            <svg className="pk-art" viewBox="0 0 150 150" fill="none" aria-hidden="true">
              <rect x="30" y="30" width="72" height="72" rx="20" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
              <circle className="pk-ring" cx="102" cy="102" r="30" />
              <circle className="pk-ring" cx="102" cy="102" r="30" style={{ animationDelay: '.9s' }} />
              <circle className="pk-ring" cx="102" cy="102" r="30" style={{ animationDelay: '1.8s' }} />
              <circle cx="102" cy="102" r="5" fill="#ff9a3c" />
            </svg>
            <h3>Engineered For Real Drops</h3>
            <p>Shock-absorbing corners soak up the impact.</p>
          </article>

          {/* 03 Materials */}
          <article className="pk-card pk-c" onMouseMove={spot}>
            <span className="pk-num">03</span>
            <svg className="pk-art" viewBox="0 0 160 80" fill="none" aria-hidden="true">
              <path d="M80 40C66 12 18 12 18 40S66 68 80 40S142 12 142 40S94 68 80 40Z" stroke="rgba(255,255,255,.14)" strokeWidth="3" />
              <path className="pk-flow" pathLength="100" d="M80 40C66 12 18 12 18 40S66 68 80 40S142 12 142 40S94 68 80 40Z" stroke="#ff9a3c" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <h3>Materials That Last</h3>
            <p>Scratch-resistant, anti-yellowing finish that stays new.</p>
          </article>

          {/* 04 Support */}
          <article className="pk-card pk-d" onMouseMove={spot}>
            <span className="pk-num">04</span>
            <div>
              <h3>Easy Return, Reliable Support</h3>
              <p>Hassle-free returns and a team that actually helps, whenever you need it.</p>
              <span className="pk-live">SUPPORT ONLINE</span>
            </div>
            <span className="pk-big" aria-hidden="true">24/7</span>
          </article>
        </div>
      </div>
    </section>
  )
}