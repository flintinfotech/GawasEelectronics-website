import { Link } from 'react-router-dom'
import { toItem, useStore } from '../context/StoreContext'
import { type ApiProduct, badgeClass, badgeOf, formatPrice, isNewArrival, onImgError, priceInfo, productImages } from '../services/productService'
import { useProducts } from '../hooks/useProducts'
import CartQty from '../components/CartQty'

// true = New Arrivals also appear in the grid below. false = grid shows only the other products.
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
.pc-add{display:block;margin:10px auto 0;padding:9px 22px;border:1px solid var(--ink);border-radius:999px;font-size:14px;font-weight:500;transition:.2s}.pc-add:hover:not(:disabled){background:var(--ink);color:#fff}.pc-add:disabled{opacity:.5;cursor:not-allowed}
.pc-qty{display:flex;justify-content:center;margin-top:10px}
.pc-more{text-align:center;margin-top:40px}
@media(max-width:1024px){.pg-wrap{width:calc(100% - 32px)}.pc-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:600px){.pc-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 12px}.pc-title{font-size:14px}}
@media(hover:none){.pc-heart{opacity:1}}
`

// Injects the product CSS once
export function ProductStyles() { return <style>{css}</style> }

export function ProductCard({ p }: { p: ApiProduct }) {
  const { inWish, toggleWish, addToCart, inCart } = useStore()
  const id = String(p.productInfoId)
  const imgs = productImages(p)
  const second = imgs[1] // show 2nd photo only if the product really has one
  const { sell, mrp, off } = priceInfo(p)
  const badge = badgeOf(p)
  return (
    <article className="pc">
      <Link to={`/product/${id}`} className={`pc-img ${second ? 'has-b' : ''}`}>
        {badge && <span className={`pc-badge ${badgeClass(badge)}`}>{badge === 'OFFER' && off > 0 ? `${off}% OFF` : badge}</span>}
        <img src={imgs[0]} alt={p.productName} loading="lazy" className="a" onError={onImgError('c' + id)} />
        {second && <img src={second} alt="" loading="lazy" className="b" onError={onImgError('c' + id)} />}
      </Link>
      <button className={`pc-heart ${inWish(id) ? 'on' : ''}`} aria-label="Wishlist" onClick={() => toggleWish(toItem(p))}>♥</button>
      <Link to={`/product/${id}`} className="pc-title">{p.productName}</Link>
      <div className="pc-stars">{'★'.repeat(Math.round(Number(p.rating) || 5))} <small>({p.rating})</small></div>
      <div className="pc-price">{formatPrice(sell)} {mrp && <s>{formatPrice(mrp)}</s>}</div>
      {/* One product = one cart entry: once added, quantity is changed with the stepper */}
      {inCart(id)
        ? <div className="pc-qty"><CartQty id={id} /></div>
        : <button className="pc-add" disabled={p.stockQuantity <= 0} onClick={() => addToCart(toItem(p))}>
            {p.stockQuantity <= 0 ? 'Out of stock' : 'Add to Cart'}
          </button>}
    </article>
  )
}

// Grid + loading + error + empty (used on Home, Products and Search pages)
export function ProductList({ items, loading, error, count = 12, emptyText = 'No products available right now.' }: { items: ApiProduct[]; loading: boolean; error: boolean; count?: number; emptyText?: string }) {
  let body
  if (loading) body = <div className="pc-grid">{Array.from({ length: count }, (_, i) => <div key={i} className="pc-sk" />)}</div>
  else if (error) body = <p className="pc-state">Could not load products. Please try again later.</p>
  else if (!items.length) body = <p className="pc-state">{emptyText}</p>
  else body = <div className="pc-grid">{items.map(p => <ProductCard key={p.productInfoId} p={p} />)}</div>
  return <><ProductStyles />{body}</>
}

// HOME GRID (below the slider): all products except New Arrivals, max 12 (4 x 3), with View All below
export default function ProductGrid() {
  const { items, loading, error } = useProducts(0, 50)
  const list = (SHOW_NEW_ARRIVALS_IN_GRID ? items : items.filter(p => !isNewArrival(p))).slice(0, 12)
  if (!loading && !error && list.length === 0) return null // no products -> hide the section
.pg-back{color:#666;display:inline-block;margin-bottom:18px}.pg-back+.pg-back{margin-left:18px}
.pg-pager{display:flex;justify-content:center;gap:8px;margin-top:40px;flex-wrap:wrap}
.pg-pager button{min-width:42px;height:42px;padding:0 14px;border-radius:999px;border:1px solid var(--line);font-weight:500}
.pg-pager button.on{background:var(--ink);color:#fff;border-color:var(--ink)}.pg-pager button:disabled{opacity:.4;cursor:not-allowed}
`

// View All page: URL ke ?brandId=&modelId= se filter lagta hai (Shop By Device menu se aata hai)
// URL badalte hi poora ProductsView naya ban jata hai (key), isliye page wapas 1 se shuru hota hai
export default function Products() {
  const [sp] = useSearchParams()
  return <ProductsView key={sp.toString()} sp={sp} />
}

function ProductsView({ sp }: { sp: URLSearchParams }) {
  const filter = useMemo(() => filterFromParams(sp), [sp])
  const [page, setPage] = useState(0)
  const { items, total, loading, error } = useProducts(page, PAGE_SIZE, filter) // filter payload me jata hai
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const title = [filter.brandName, filter.modelName].filter(Boolean).join(' · ') || 'All Products'
  const filtered = Boolean(filter.brandId || filter.modelId)
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [page])

  return (
    <section id="products" className="pg-sec">
      <div className="pg-wrap">
        <h2 className="h2">Latest Collection &amp; Best Offers</h2>
        <ProductList items={list} loading={loading} error={error} />
        <div className="pc-more"><Link to="/products" className="btn dark">View All</Link></div>
      </div>
    <section className="container section">
      <style>{css}</style>
      <Link to="/" className="pg-back">← Home</Link>
      {filtered && <Link to="/products" className="pg-back">Clear filter ✕</Link>}
      <h1 className="h2">{title}</h1><p className="sub">{loading ? 'Loading…' : `${total} products`}</p>
      <ProductList items={items} loading={loading} error={error} />
      {pages > 1 && (
        <nav className="pg-pager" aria-label="Pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Prev</button>
          {Array.from({ length: pages }, (_, i) => <button key={i} className={i === page ? 'on' : ''} onClick={() => setPage(i)}>{i + 1}</button>)}
          <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next ›</button>
        </nav>
      )}
    </section>
  )
}