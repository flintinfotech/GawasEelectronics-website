import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { type ApiProduct, badgeClass, badgeOf, formatPrice, getProductById, onImgError, priceInfo, productImages } from '../services/productService'

const css = `
.pd-back{color:#666;display:inline-block;margin-bottom:18px}
.pd-grid{display:grid;grid-template-columns:minmax(0,520px) minmax(0,1fr);gap:48px;align-items:start}
.pd-gallery{position:sticky;top:96px}
.pd-main{width:100%;aspect-ratio:1/1;max-height:520px;object-fit:contain;border-radius:18px;background:var(--bone)}
.pd-thumbs{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}
.pd-thumbs button{width:68px;height:68px;border-radius:12px;overflow:hidden;border:2px solid transparent;background:var(--bone)}
.pd-thumbs button.on{border-color:var(--ink)}.pd-thumbs img{width:100%;height:100%;object-fit:cover}
.pd-info{display:flex;flex-direction:column;gap:14px}
.pd-info h1{font-size:clamp(26px,3.5vw,36px);letter-spacing:-.02em;line-height:1.15}
.pd-badge{align-self:flex-start;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:999px;letter-spacing:.08em}
.pd-badge.new{background:linear-gradient(90deg,#ff6a1a,#ff9a3c)}
.pd-badge.offer{background:linear-gradient(90deg,#e0245e,#ff5c7c)}
.pd-badge.latest{background:linear-gradient(90deg,#5b3df5,#8b72ff)}
.pd-badge.best-seller{background:linear-gradient(90deg,#c9ab4a,#e8cf74);color:#2a2200}
.pd-meta{color:#666}.pd-stars{color:#f5b301}.pd-stars small{color:#555}
.pd-price{font-size:24px;font-weight:700}.pd-price s{color:#999;font-size:16px;font-weight:400;margin-left:6px}.pd-price em{font-style:normal;color:#2e9e4f;font-size:14px;margin-left:8px}
.pd-feat{padding-left:20px;color:#444;line-height:1.9}
.pd-stock.ok{color:#2e9e4f}.pd-stock.no{color:#d33}
.pd-buy{display:flex;gap:12px;max-width:420px}.pd-buy .btn{flex:1}
.pd-qty{display:flex;align-items:center;border:1px solid var(--line);border-radius:999px}.pd-qty button{width:42px;height:46px;font-size:20px}.pd-qty span{min-width:24px;text-align:center}
.pd-sk{min-height:420px;border-radius:18px;background:linear-gradient(90deg,#eee,#f7f7f7,#eee);background-size:200% 100%;animation:sk 1.4s infinite}
@media(max-width:820px){.pd-grid{grid-template-columns:1fr;gap:24px}.pd-gallery{position:static}.pd-main{max-height:420px}.pd-buy{max-width:none}}
`

// id badalte hi poora Detail naya ban jata hai (key), isliye state reset ka code nahi chahiye
export default function ProductDetail() {
  const { id } = useParams()
  return <Detail key={id} id={id} />
}

function Detail({ id }: { id?: string }) {
  const { add } = useStore()
  const [p, setP] = useState<ApiProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [img, setImg] = useState(0)
  const [qty, setQty] = useState(1)

  // URL ki id se API call: /flint/product/getProductById/{id}
  useEffect(() => {
    if (!id) return
    let cancelled = false
    getProductById(id)
      .then(r => { if (!cancelled) setP(r) })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <section className="container section"><style>{css}</style><div className="pd-grid"><div className="pd-sk" /><div className="pd-sk" /></div></section>
  if (error || !p) return <div className="container section"><style>{css}</style><h2>Product nahi mila</h2><Link to="/products" className="pd-back">← Back to products</Link></div>

  const imgs = productImages(p)
  const { sell, mrp, off } = priceInfo(p)
  const badge = badgeOf(p)
  const inStock = p.stockQuantity > 0
  return (
    <section className="container section">
      <style>{css}</style>
      <Link to="/products" className="pd-back">← Back to products</Link>
      <div className="pd-grid">
        <div className="pd-gallery">
          <img className="pd-main" src={imgs[img]} alt={p.productName} onError={onImgError('d' + p.productInfoId)} />
          <div className="pd-thumbs">{imgs.map((s, i) => <button key={i} className={i === img ? 'on' : ''} onClick={() => setImg(i)}><img src={s} alt="" onError={onImgError('d' + p.productInfoId)} /></button>)}</div>
        </div>
        <div className="pd-info">
          {badge && <span className={`pd-badge ${badgeClass(badge)}`}>{badge}</span>}
          <h1>{p.productName}</h1>
          <p className="pd-meta">{p.brandName} · {p.categoryName} · {p.subCategoryName}</p>
          <div className="pd-stars">{'★'.repeat(Math.round(Number(p.rating) || 5))} <small>{p.rating}</small></div>
          <div className="pd-price">{formatPrice(sell)} {mrp && <s>{formatPrice(mrp)}</s>} {off > 0 && <em>{off}% off</em>}</div>
          <p>{p.description}</p>
          {p.feature && <ul className="pd-feat"><li>{p.feature}</li></ul>}
          <p className={`pd-stock ${inStock ? 'ok' : 'no'}`}>{inStock ? `In stock (${p.stockQuantity} available)` : 'Out of stock'}</p>
          <div className="pd-buy">
            <div className="pd-qty"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span><button onClick={() => setQty(Math.min(p.stockQuantity || 1, qty + 1))}>+</button></div>
            <button className="btn dark" disabled={!inStock} onClick={() => add(qty)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </section>
  )
}