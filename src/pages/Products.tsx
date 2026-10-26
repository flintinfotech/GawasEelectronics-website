import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductList } from '../components/Product'
import { useProducts } from '../hooks/useProducts'

const PAGE_SIZE = 12 // 4 x 3

const css = `
.pg-back{color:#666;display:inline-block;margin-bottom:18px}
.pg-pager{display:flex;justify-content:center;gap:8px;margin-top:40px;flex-wrap:wrap}
.pg-pager button{min-width:42px;height:42px;padding:0 14px;border-radius:999px;border:1px solid var(--line);font-weight:500}
.pg-pager button.on{background:var(--ink);color:#fff;border-color:var(--ink)}.pg-pager button:disabled{opacity:.4;cursor:not-allowed}
`

// View All page (pagination ke saath)
export default function Products() {
  const [page, setPage] = useState(0)
  const { items, total, loading, error } = useProducts(page, PAGE_SIZE)
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [page])

  return (
    <section className="container section">
      <style>{css}</style>
      <Link to="/" className="pg-back">← Home</Link>
      <h1 className="h2">All Products</h1><p className="sub">{total} products</p>
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
