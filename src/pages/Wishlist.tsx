import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, onImgError } from '../services/productService'
import { useSyncStock } from '../hooks/useSyncStock'

const css = `
.wl-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:32px 20px;margin-top:24px}
.wl-card{display:flex;flex-direction:column;gap:8px}
.wl-img{aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:var(--bone);display:block}
.wl-img img{width:100%;height:100%;object-fit:cover}
.wl-name{font-weight:500;line-height:1.3}.wl-name:hover{color:var(--accent)}
.wl-price s{color:#999;font-size:13px;margin-left:6px}
.wl-act{display:flex;gap:8px;margin-top:4px;align-items:center}.wl-act .btn.added{background:#e9f6ee;color:#2e9e4f;opacity:1}.wl-act .btn{flex:1;padding:10px 12px;font-size:14px;text-align:center}
.wl-rm{border:1px solid var(--line);border-radius:999px;width:42px;color:#d33}
.wl-empty{text-align:center;padding:60px 0;color:#666}.wl-empty .btn{margin-top:18px}
@media(max-width:1024px){.wl-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:600px){.wl-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 12px}}
`

export default function Wishlist() {
  const { wish, removeWish, addToCart, inCart } = useStore()
    useSyncStock(wish.map(i => i.id)) // refresh stock when the wishlist opens
  return (
    <section className="container section">
      <style>{css}</style>
      <h1 className="h2">Wishlist</h1><p className="sub">{wish.length} items</p>
      {!wish.length ? (
        <div className="wl-empty"><p>Your wishlist is empty. Tap ♥ on a product to save it.</p><Link to="/products" className="btn dark">Browse Products</Link></div>
      ) : (
        <div className="wl-grid">
          {wish.map(i => (
            <article key={i.id} className="wl-card">
              <Link to={`/product/${i.id}`} className="wl-img"><img src={i.image} alt={i.name} onError={onImgError('w' + i.id)} /></Link>
              <Link to={`/product/${i.id}`} className="wl-name">{i.name}</Link>
              <div className="wl-price">{formatPrice(i.price)} {i.mrp && <s>{formatPrice(i.mrp)}</s>}</div>
              <div className="wl-act">
                {inCart(i.id)
                  ? <button className="btn dark added" disabled>Already added ✓</button>
                  : <button className="btn dark" disabled={i.stock <= 0} onClick={() => addToCart({ ...i, qty: 1 })}>
                      {i.stock <= 0 ? 'Out of stock' : 'Add to Cart'}
                    </button>}
                <button className="wl-rm" aria-label="Remove" onClick={() => removeWish(i.id)}>✕</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}