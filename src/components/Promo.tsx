import { Link } from 'react-router-dom'
import { pic } from '../utils/img'

const css = `
.pm{border-radius:24px;min-height:360px;display:flex;align-items:flex-end;padding:clamp(22px,5vw,56px);color:#fff;background-size:cover;background-position:center}
.pm h2{font-size:clamp(30px,5vw,54px);letter-spacing:-.03em;margin-bottom:12px}
.pm p{margin-bottom:22px;font-size:17px;opacity:.9}
@media(max-width:600px){.pm{min-height:300px;border-radius:18px}}
`
export default function Promo() {
  return (
    <section className="container">
      <style>{css}</style>
      <div className="pm" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.75), rgba(0,0,0,.1)), url(${pic('gawas-promo', 1600, 800)})` }}>
        <div><h2>Meet the Regalia</h2><p>This isn’t just a phone case.<br />It is a statement.</p><Link to="/products" className="btn light">Shop now</Link></div>
      </div>
    </section>
  )
}
