import { useRef } from 'react'
import { ProductCard, ProductStyles } from './Product'
import { useProducts } from '../hooks/useProducts'

const css = `
.sl-sec{background:var(--bone);margin-top:56px}
.sl-wrap{position:relative;width:min(1200px,100% - 32px);margin-inline:auto}
.sl{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:4px 2px 8px}.sl::-webkit-scrollbar{display:none}
.sl-item{flex:0 0 calc(25% - 15px);scroll-snap-align:start;background:#fff;padding:14px;border-radius:20px}
.sl-arrow{position:absolute;top:42%;z-index:5;width:44px;height:44px;border-radius:50%;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.18);font-size:26px;line-height:1}.sl-arrow.l{left:-10px}.sl-arrow.r{right:-10px}
@media(max-width:1024px){.sl-item{flex-basis:calc(33.3% - 14px)}}
@media(max-width:600px){.sl-item{flex-basis:72%}.sl-arrow{display:none}}
`

export default function ProductSlider() {
  const ref = useRef<HTMLDivElement>(null)
  const { items } = useProducts(0, 10)
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' })
  if (!items.length) return null
  return (
    <section className="section sl-sec">
      <style>{css}</style><ProductStyles />
      <div className="container"><h2 className="h2">Regalia Series</h2><p className="sub">Built for the elites</p></div>
      <div className="sl-wrap">
        <button className="sl-arrow l" aria-label="Previous" onClick={() => go(-1)}>‹</button>
        <div className="sl" ref={ref}>{items.map(p => <div className="sl-item" key={p.productInfoId}><ProductCard p={p} /></div>)}</div>
        <button className="sl-arrow r" aria-label="Next" onClick={() => go(1)}>›</button>
      </div>
    </section>
  )
}
