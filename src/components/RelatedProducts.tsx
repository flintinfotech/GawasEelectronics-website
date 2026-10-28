// RELATED PRODUCTS: product detail page ke neeche, sirf usi brand ke baaki products (Apple ka product = sirf Apple)
import { useMemo, useRef } from 'react'
import { ProductCard, ProductStyles } from './Product'
import { useProducts } from '../hooks/useProducts'
import type { ApiProduct } from '../services/productService'

const css = `
.rp-sec{padding:8px 0 64px}
.rp-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:24px}
.rp-head h2{font-size:clamp(22px,3vw,32px);font-weight:700;letter-spacing:-.02em}
.rp-nav{display:flex;gap:8px}
.rp-nav button{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);font-size:22px;line-height:1}.rp-nav button:hover{background:var(--bone)}
.rp{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;padding-bottom:4px}
.rp::-webkit-scrollbar{display:none}
.rp-item{flex:0 0 calc(25% - 15px);min-width:0;scroll-snap-align:start}
@media(max-width:1024px){.rp-item{flex-basis:calc(33.333% - 14px)}}
@media(max-width:600px){.rp{gap:12px}.rp-item{flex-basis:calc(50% - 6px)}.rp-nav{display:none}.rp-sec{padding-bottom:44px}}
`

export default function RelatedProducts({ product }: { product: ApiProduct }) {
  const ref = useRef<HTMLDivElement>(null)
  // filter ko useMemo me rakhna zaruri hai, warna har render par API dobara chalti hai
  const filter = useMemo(() => ({ brandId: product.brandId, brandName: product.brandName }), [product.brandId, product.brandName])
  const { items } = useProducts(0, 30, filter)
  const list = items.filter(p => p.productInfoId !== product.productInfoId) // abhi wala product hata do
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' })

  if (!product.brandName || list.length === 0) return null // same brand ka koi aur product nahi to section nahi dikhega
  return (
    <section className="container rp-sec">
      <style>{css}</style>
      <ProductStyles />
      <div className="rp-head">
        <h2>More from {product.brandName}</h2>
        <div className="rp-nav">
          <button aria-label="Previous" onClick={() => go(-1)}>‹</button>
          <button aria-label="Next" onClick={() => go(1)}>›</button>
        </div>
      </div>
      <div className="rp" ref={ref}>
        {list.map(p => <div className="rp-item" key={p.productInfoId}><ProductCard p={p} /></div>)}
      </div>
    </section>
  )
}