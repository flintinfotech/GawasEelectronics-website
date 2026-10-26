import { pic } from '../utils/img'

const css = `
.lf-head{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:32px}.lf-head p{max-width:380px;color:#444}
.lf{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lf img{border-radius:20px;aspect-ratio:1;object-fit:cover;width:100%}.lf figcaption{text-align:center;margin-top:12px;font-size:15px}
.lf-rating{text-align:center;margin-top:44px;font-style:italic}.lf-rating b{font-style:normal}
@media(max-width:820px){.lf-head{flex-direction:column;align-items:start}}
@media(max-width:600px){.lf{grid-template-columns:1fr}}
`
// Apni images: seed ki jagah '/img/naam.jpg' likho (public/img/ folder me rakho)
const shots = [['Luxury doesn’t try. It shows.', 'gawas-life-1'], ['Built for the table where decisions are made.', 'gawas-life-2'], ['Luxury that stays with you even when no one’s watching.', 'gawas-life-3']]

export default function Lifestyle() {
  return (
    <section className="container section">
      <style>{css}</style>
      <div className="lf-head"><h2 className="h2">For Every Version of You</h2><p>From the street to the boardroom to your quiet moments. Regalia belongs everywhere you do.</p></div>
      <div className="lf">{shots.map(([t, seed]) => <figure key={t}><img src={pic(seed, 700, 700)} alt={t} loading="lazy" /><figcaption>{t}</figcaption></figure>)}</div>
      <p className="lf-rating">★★★★★ <b>4.8/5 from 3 Million+ Customers</b></p>
    </section>
  )
}
