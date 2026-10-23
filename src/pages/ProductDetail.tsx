import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { products, inr, DEVICES } from '../data/products'
import { useStore } from '../context'

export default function ProductDetail() {
  const { id } = useParams()
  const p = products.find(x => x.id === id)
  const { add } = useStore()
  const [img, setImg] = useState(0), [color, setColor] = useState(0), [qty, setQty] = useState(1), [model, setModel] = useState(DEVICES[0])
  if (!p) return <div className="container section"><h2>Product not found</h2><Link to="/">← Back</Link></div>
  return (
    <section className="container section pd">
      <Link to="/" className="back">← Back to shop</Link>
      <div className="pd-grid">
        <div className="gallery"><img className="main" src={p.images[img]} alt={p.name} />
          <div className="thumbs">{p.images.map((s, i) => <button key={i} className={i === img ? 'on' : ''} onClick={() => setImg(i)}><img src={s} alt="" /></button>)}</div></div>
        <div className="info">
          {p.badge && <span className="badge static">{p.badge}</span>}
          <h1>{p.name}</h1><div className="stars">★★★★★ <small>{p.rating.toFixed(1)} ({p.reviews} reviews)</small></div>
          <div className="price big">{inr(p.price)} <s>{inr(p.mrp)}</s> <em>{Math.round((1 - p.price / p.mrp) * 100)}% off</em></div>
          <p>{p.description}</p>
          <label>Device<select value={model} onChange={e => setModel(e.target.value)}>{DEVICES.map(d => <option key={d}>{d}</option>)}</select></label>
          <div className="swatches">{p.colors.map((c, i) => <button key={c.name} title={c.name} className={i === color ? 'on' : ''} style={{ background: c.hex }} onClick={() => setColor(i)} />)}<span>{p.colors[color].name}</span></div>
          <div className="buy">
            <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span><button onClick={() => setQty(qty + 1)}>+</button></div>
            <button className="btn dark grow" onClick={() => add(qty)}>Add to Cart</button>
          </div>
          <ul className="feat">{p.features.map(f => <li key={f}>{f}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
