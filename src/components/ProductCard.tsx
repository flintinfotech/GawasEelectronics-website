import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { inr } from '../data/products'
import { useStore } from '../context'

export default function ProductCard({ p }: { p: Product }) {
  const { wish, toggleWish } = useStore()
  const on = wish.includes(p.id)
  return (
    <article className="card">
      <Link to={`/product/${p.id}`} className="card-img">
        {p.badge && <span className={`badge ${p.badge === 'BEST SELLER' ? 'gold' : ''}`}>{p.badge}</span>}
        <img src={p.images[0]} alt={p.name} loading="lazy" className="a" />
        <img src={p.images[1]} alt="" loading="lazy" className="b" />
        <span className="quick">Quick View</span>
      </Link>
      <button className={`heart ${on ? 'on' : ''}`} aria-label="Wishlist" onClick={() => toggleWish(p.id)}>♥</button>
      <Link to={`/product/${p.id}`} className="card-title">{p.name}</Link>
      <div className="stars">{'★'.repeat(5)} <small>({p.reviews})</small></div>
      <div className="price">{inr(p.price)} <s>{inr(p.mrp)}</s></div>
    </article>
  )
}
