const css = `
.pk{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:52px 0;text-align:center}
.pk div{display:flex;flex-direction:column;gap:12px;align-items:center}.pk b{font-size:26px;color:var(--accent)}
@media(max-width:820px){.pk{grid-template-columns:1fr 1fr}}
`
const perks = [['◆', 'Precision Fit, Premium Feel'], ['⬇', 'Engineered For Real Drops'], ['∞', 'Materials That Last'], ['24/7', 'Easy Return, Reliable Support']]

export default function Perks() {
  return <section className="container pk"><style>{css}</style>{perks.map(([i, t]) => <div key={t}><b>{i}</b><span>{t}</span></div>)}</section>
}
