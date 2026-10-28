import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductList } from '../components/Product'
import { useProducts } from '../hooks/useProducts'
import { filterFromParams } from '../services/productService'

const PAGE_SIZE = 12 // 4 x 3

const css = `
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