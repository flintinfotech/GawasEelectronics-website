import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { type ApiProduct, badgeClass, badgeOf, formatPrice, isNewArrival, onImgError, priceInfo, productImages } from '../services/productService'
import { useProducts } from '../hooks/useProducts'

// true karo to New Arrivals bhi neeche ke grid me aayenge. false = grid me sirf baaki products.
const SHOW_NEW_ARRIVALS_IN_GRID = false

const css = `
.pg-sec{padding:56px 0}
.pg-wrap{width:min(83%,1500px);margin-inline:auto}
.pg-wrap .h2{margin-bottom:28px}
.pc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:36px 20px}
.pc{position:relative}
.pc-img{display:block;position:relative;aspect-ratio:1/1;overflow:hidden;background:var(--bone)}
.pc-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .4s,transform .6s}
.pc-img .b{opacity:0}.pc:hover .b{opacity:1}
.pc:hover .pc-img img{transform:scale(1.03)}
.pc:hover .pc-img.has-b .a{opacity:0}
.pc-badge{position:absolute;top:0;left:0;z-index:2;color:#fff;font-size:11px;font-weight:700;padding:6px 13px 6px 10px;letter-spacing:.08em;border-radius:0 0 14px 0;box-shadow:0 4px 12px rgba(0,0,0,.18)}
.pc-badge.new{background:linear-gradient(90deg,#ff6a1a,#ff9a3c)}
.pc-badge.offer{background:linear-gradient(90deg,#e0245e,#ff5c7c)}
.pc-badge.latest{background:linear-gradient(90deg,#5b3df5,#8b72ff)}
.pc-badge.best-seller{background:linear-gradient(90deg,#c9ab4a,#e8cf74);color:#2a2200}
.pc-heart{position:absolute;top:10px;right:10px;z-index:3;width:34px;height:34px;border-radius:50%;background:#fff;color:#bbb;box-shadow:0 2px 8px rgba(0,0,0,.12);opacity:0;transition:.2s}
.pc:hover .pc-heart,.pc-heart.on{opacity:1}.pc-heart.on{color:#e0245e}.pc-heart:hover{transform:scale(1.1)}
.pc-title{display:block;text-align:center;margin-top:14px;font-size:15px;line-height:1.35}.pc-title:hover{color:var(--accent)}
.pc-stars{color:#f5b301;text-align:center;font-size:13px;margin:6px 0 4px}.pc-stars small{color:#555}
.pc-price{text-align:center;font-size:15px}.pc-price s{color:#999;margin-left:6px;font-size:13px}
.pc-sk{aspect-ratio:1/1.35;background:linear-gradient(90deg,#eee,#f7f7f7,#eee);background-size:200% 100%;animation:sk 1.4s infinite}
.pc-state{text-align:center;color:#666;padding:40px 0}
.pc-more{text-align:center;margin-top:40px}
@media(max-width:1024px){.pg-wrap{width:calc(100% - 32px)}.pc-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:600px){.pc-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 12px}.pc-title{font-size:14px}}
@media(hover:none){.pc-heart{opacity:1}}
`

// Product ka CSS ek baar inject karne ke liye
export function ProductStyles() { return <style>{css}</style> }

export function ProductCard({ p }: { p: ApiProduct }) {
  const { wish, toggleWish } = useStore()
  const id = String(p.productInfoId)
  const imgs = productImages(p)
  const second = imgs[1] // 2nd photo sirf tab dikhao jab product ki 2nd image sach me ho
  const { sell, mrp, off } = priceInfo(p)
  const badge = badgeOf(p)
  return (
    <article className="pc">
      <Link to={`/product/${id}`} className={`pc-img ${second ? 'has-b' : ''}`}>
        {badge && <span className={`pc-badge ${badgeClass(badge)}`}>{badge === 'OFFER' && off > 0 ? `${off}% OFF` : badge}</span>}
        <img src={imgs[0]} alt={p.productName} loading="lazy" className="a" onError={onImgError('c' + id)} />
        {second && <img src={second} alt="" loading="lazy" className="b" onError={onImgError('c' + id)} />}
      </Link>
      <button className={`pc-heart ${wish.includes(id) ? 'on' : ''}`} aria-label="Wishlist" onClick={() => toggleWish(id)}>♥</button>
      <Link to={`/product/${id}`} className="pc-title">{p.productName}</Link>
      <div className="pc-stars">{'★'.repeat(Math.round(Number(p.rating) || 5))} <small>({p.rating})</small></div>
      <div className="pc-price">{formatPrice(sell)} {mrp && <s>{formatPrice(mrp)}</s>}</div>
    </article>
  )
}

// Grid + loading + error + empty (Home aur Products page dono me)
export function ProductList({ items, loading, error, count = 12 }: { items: ApiProduct[]; loading: boolean; error: boolean; count?: number }) {
  let body
  if (loading) body = <div className="pc-grid">{Array.from({ length: count }, (_, i) => <div key={i} className="pc-sk" />)}</div>
  else if (error) body = <p className="pc-state">Products load nahi ho paye. Thodi der baad try karo.</p>
  else if (!items.length) body = <p className="pc-state">Abhi koi product available nahi hai.</p>
  else body = <div className="pc-grid">{items.map(p => <ProductCard key={p.productInfoId} p={p} />)}</div>
  return <><ProductStyles />{body}</>
}

// HOME GRID (slider ke niche): New Arrivals chhodke baaki products, max 12 (4 x 3), neeche View All
export default function ProductGrid() {
  const { items, loading, error } = useProducts(0, 50)
  const list = (SHOW_NEW_ARRIVALS_IN_GRID ? items : items.filter(p => !isNewArrival(p))).slice(0, 12)
  if (!loading && !error && list.length === 0) return null // koi product nahi to section hi nahi dikhega
  return (
    <section id="products" className="pg-sec">
      <div className="pg-wrap">
      <h2 className="h2">Latest Collection &amp; Best Offers</h2>  
        <ProductList items={list} loading={loading} error={error} />
        <div className="pc-more"><Link to="/products" className="btn dark">View All</Link></div>
      </div>
    </section>
  )
}