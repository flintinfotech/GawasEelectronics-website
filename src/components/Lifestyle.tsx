import { useBanners } from '../hooks/useBanners'
import { bannerSrc } from '../services/bannerService'

const css = `
.lf-sec{width:min(82%,1500px);margin-inline:auto;padding:72px 0}
.lf-head{display:flex;justify-content:space-between;align-items:center;gap:40px;margin-bottom:48px}
.lf-head h2{font-size:clamp(32px,4.2vw,64px);font-weight:700;letter-spacing:-.04em;line-height:1.05}
.lf-head p{max-width:380px;font-size:17px;line-height:1.7;color:#222}
.lf{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.lf-card{margin:0}
.lf-card a,.lf-card .lf-pic{display:block}
.lf-card img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:24px;background:var(--bone);transition:transform .5s}
.lf-card a{overflow:hidden;border-radius:24px}.lf-card a:hover img{transform:scale(1.03)}
.lf-card figcaption{text-align:center;margin-top:16px;font-size:16px;color:#222}
.lf-sk{aspect-ratio:1/1;border-radius:24px;background:linear-gradient(90deg,#eee,#f7f7f7,#eee);background-size:200% 100%;animation:sk 1.4s infinite}
@media(max-width:1024px){.lf{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:820px){.lf-sec{width:calc(100% - 32px);padding:48px 0}.lf-head{flex-direction:column;align-items:flex-start;gap:14px;margin-bottom:28px}}
@media(max-width:600px){.lf{grid-template-columns:1fr}}
`

// "For Every Version of You": admin panel me Section = "Mini banner" wale saare banners yaha dikhte hain
export default function Lifestyle() {
  const { banners, loading } = useBanners('mini')
  if (!loading && banners.length === 0) return null // koi Mini banner nahi to section nahi dikhega

  return (
    <section className="lf-sec">
      <style>{css}</style>
      <div className="lf-head">
        <h2>For Every Version of You</h2>
        <p>From the street to the boardroom to your quiet moments. Regalia belongs everywhere you do.</p>
      </div>
      <div className="lf">
        {loading
          ? Array.from({ length: 3 }, (_, i) => <div key={i} className="lf-sk" />)
          : banners.map(b => {
              const img = <img src={bannerSrc(b)} alt={b.description || b.title} loading="lazy" />
              return (
                <figure key={b.bannerId} className="lf-card">
                  {b.redirectUrl ? <a href={b.redirectUrl}>{img}</a> : <div className="lf-pic">{img}</div>}
                  {b.description && <figcaption>{b.description}</figcaption>}
                </figure>
              )
            })}
      </div>
    </section>
  )
}