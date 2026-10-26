import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { type ApiProduct, badgeOf, formatPrice, onImgError, priceInfo, productImages } from '../services/productService'
import { useProducts } from '../hooks/useProducts'

const css = `
.pc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:28px 20px}
.pc{position:relative}
.pc-img{display:block;position:relative;aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:var(--bone)}
.pc-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .4s,transform .6s}
.pc-img .b{opacity:0}.pc:hover .b{opacity:1}
.pc:hover .pc-img img{transform:scale(1.04)}
.pc:hover .pc-img.has-b .a{opacity:0}
.pc-quick{position:absolute;left:10px;right:10px;bottom:10px;background:var(--ink);color:#fff;text-align:center;padding:10px;border-radius:999px;font-size:14px;transform:translateY(150%);transition:.3s}
.pc:hover .pc-quick{transform:none}
.pc-badge{position:absolute;top:10px;left:10px;z-index:2;background:#2e9e4f;color:#fff;font-size:11px;font-weight:700;padding:4px 9px;border-radius:4px;letter-spacing:.04em}
.pc-badge.gold{background:var(--gold);color:#222}
.pc-heart{position:absolute;top:10px;right:10px;z-index:3;width:34px;height:34px;border-radius:50%;background:#fff;color:#bbb;box-shadow:0 2px 8px rgba(0,0,0,.12);transition:.2s}
.pc-heart.on{color:#e0245e}.pc-heart:hover{transform:scale(1.1)}
.pc-title{display:block;text-align:center;margin-top:12px;font-weight:500;font-size:15px;line-height:1.3}.pc-title:hover{color:var(--accent)}
.pc-stars{color:#f5b301;text-align:center;font-size:13px;margin:4px 0}.pc-stars small{color:#555}
.pc-price{text-align:center;font-size:15px;font-weight:500}.pc-price s{color:#999;margin-left:6px;font-size:13px;font-weight:400}
.pc-sk{aspect-ratio:1/1.35;border-radius:14px;background:linear-gradient(90deg,#eee,#f7f7f7,#eee);background-size:200% 100%;animation:sk 1.4s infinite}
.pc-state{text-align:center;color:#666;padding:40px 0}
.pc-more{text-align:center;margin-top:36px}
@media(max-width:1024px){.pc-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:600px){.pc-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 12px}.pc-title{font-size:14px}.pc-quick{display:none}}
`

// Product ka CSS ek baar inject karne ke liye (List aur Slider dono use karte hain)
export function ProductStyles() { return <style>{css}</style> }

export function ProductCard({ p }: { p: ApiProduct }) {
  const { wish, toggleWish } = useStore()
  const id = String(p.productInfoId)
  const imgs = productImages(p)
  const second = imgs[1] // 2nd photo sirf tab dikhao jab product ki 2nd image sach me ho
  const { sell, mrp } = priceInfo(p)
  const badge = badgeOf(p)
  return (
    <article className="pc">
      <Link to={`/product/${id}`} className={`pc-img ${second ? 'has-b' : ''}`}>
        {badge && <span className={`pc-badge ${badge === 'BEST SELLER' ? 'gold' : ''}`}>{badge}</span>}
        <img src={imgs[0]} alt={p.productName} loading="lazy" className="a" onError={onImgError('c' + id)} />
        {second && <img src={second} alt="" loading="lazy" className="b" onError={onImgError('c' + id)} />}
        <span className="pc-quick">Quick View</span>
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

// HOME SECTION: 4 products x 3 rows = 12, neeche View All
export default function ProductGrid() {
  const { items, loading, error } = useProducts(0, 12)
  return (
    <section id="products" className="container section">
      <h2 className="h2">Phone Cases &amp; Accessories</h2><p className="sub">For the all new iPhones</p>
      <ProductList items={items} loading={loading} error={error} />
      <div className="pc-more"><Link to="/products" className="btn dark">View All</Link></div>
    </section>
  )
}
