import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { isNewArrival, onImgError, priceInfo, productImages } from '../services/productService'

const css = `
.ns-sec{background:#f4f4f6;padding:64px 0 72px}
.ns-head,.ns-wrap{width:min(95%,1700px);margin-inline:auto}
.ns-head .sub{margin-bottom:0}
.ns-wrap{position:relative;margin-top:28px}
.ns{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:2px}.ns::-webkit-scrollbar{display:none}
.ns-card{flex:0 0 21%;min-width:230px;scroll-snap-align:start;display:flex;flex-direction:column;background:#fff;color:var(--ink);border-radius:28px;padding:22px}
.ns-card.dark{background:#000;color:#fff}
.ns-new{align-self:flex-start;display:inline-flex;align-items:center;gap:7px;background:linear-gradient(90deg,#ff6a1a,#ff9a3c);color:#fff;font-size:12px;font-weight:700;letter-spacing:.1em;padding:5px 13px 5px 10px;border-radius:999px;box-shadow:0 4px 14px rgba(255,106,26,.35)}
.ns-new::before{content:'';width:7px;height:7px;border-radius:50%;background:#fff;animation:nsPulse 1.6s infinite}
@keyframes nsPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
.ns-card h3{font-size:clamp(20px,1.7vw,26px);font-weight:600;letter-spacing:-.02em;line-height:1.15;margin:8px 0 6px}
.ns-sub{font-size:15px;opacity:.85}.ns-price{font-size:15px;margin:10px 0 16px}
.ns-btn{align-self:flex-start;background:#000;color:#fff;padding:11px 22px;border-radius:999px;font-size:14px;font-weight:500;margin-bottom:18px}
.ns-card.dark .ns-btn{background:#1c1c1e}
.ns-img{display:block;aspect-ratio:1/1;overflow:hidden;background:#f6f5f3;border-radius:16px;margin-top:auto}
.ns-img img{width:100%;height:100%;object-fit:contain;transition:transform .5s}.ns-card:hover .ns-img img{transform:scale(1.05)}
.ns-sk{flex:0 0 21%;min-width:230px;aspect-ratio:1/1.5;border-radius:28px;background:linear-gradient(90deg,#e8e8ea,#f1f1f3,#e8e8ea);background-size:200% 100%;animation:sk 1.4s infinite}
.ns-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:5;width:46px;height:46px;border-radius:50%;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.18);font-size:26px;line-height:1}
.ns-arrow.l{left:-22px}.ns-arrow.r{right:-22px}
@media(max-width:1024px){.ns-card,.ns-sk{flex-basis:31%}}
@media(max-width:600px){.ns-sec{padding:44px 0 52px}.ns-head,.ns-wrap{width:calc(100% - 32px)}.ns-card,.ns-sk{flex-basis:74%}.ns-arrow{display:none}}
`

// HOME SLIDER: sirf wo products jinka Label = "New Arrival" hai (admin panel se)
export default function ProductSlider() {
  const ref = useRef<HTMLDivElement>(null)
  const { items, loading } = useProducts(0, 50)
  const list = items.filter(isNewArrival).slice(0, 10)
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' })

  if (!loading && list.length === 0) return null // New Arrival product nahi to section nahi dikhega
  return (
    <section className="ns-sec">
      <style>{css}</style>
      <div className="ns-head"><h2 className="h2">Phone Cases &amp; Accessories</h2><p className="sub">For the all new iPhones</p></div>
      <div className="ns-wrap">
        <button className="ns-arrow l" aria-label="Previous" onClick={() => go(-1)}>‹</button>
        <div className="ns" ref={ref}>
          {loading
            ? Array.from({ length: 5 }, (_, i) => <div key={i} className="ns-sk" />)
            : list.map((p, i) => {
                const id = String(p.productInfoId)
                const { sell } = priceInfo(p)
                return (
                  <article key={id} className={`ns-card ${i % 2 ? 'dark' : ''}`}>
                    <span className="ns-new">NEW</span>
                    <h3>{p.productName}</h3>
                    <p className="ns-sub">{p.feature || p.subCategoryName}</p>
                    <p className="ns-price">₹ {sell.toLocaleString('en-IN')}/-</p>
                    <Link to={`/product/${id}`} className="ns-btn">Shop Now</Link>
                    <Link to={`/product/${id}`} className="ns-img" aria-label={p.productName}>
                      <img src={productImages(p)[0]} alt={p.productName} loading="lazy" onError={onImgError('n' + id)} />
                    </Link>
                  </article>
                )
              })}
        </div>
        <button className="ns-arrow r" aria-label="Next" onClick={() => go(1)}>›</button>
      </div>
    </section>
  )
}