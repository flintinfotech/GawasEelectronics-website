// SEARCH: filters products by name, brand, category, sub category and description.
// (No search API in the backend yet, so it filters the loaded product list in the browser.)
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductList } from '../components/Product'
import { useProducts } from '../hooks/useProducts'
import { type ApiProduct } from '../services/productService'

const css = `
.sr-form{display:flex;gap:10px;margin:18px 0 8px;max-width:560px}
.sr-form input{flex:1;font:inherit;padding:13px 18px;border:1px solid var(--line);border-radius:999px}
.sr-form .btn{padding:13px 24px}
`
const hay = (p: ApiProduct) => [p.productName, p.brandName, p.categoryName, p.subCategoryName, p.description, p.feature].join(' ').toLowerCase()

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q')?.trim() ?? ''
  const { items, loading, error } = useProducts(0, 200)
  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return words.length ? items.filter(p => words.every(w => hay(p).includes(w))) : []
  }, [items, q])

  return (
    <section className="container section">
      <style>{css}</style>
      <h1 className="h2">Search</h1>
      <form className="sr-form" onSubmit={e => { e.preventDefault(); setParams({ q: String(new FormData(e.currentTarget).get('q') ?? '') }) }}>
        <input name="q" defaultValue={q} placeholder="Search products..." aria-label="Search products" autoFocus />
        <button className="btn dark" type="submit">Search</button>
      </form>
      {q && !loading && !error && <p className="sub">{results.length} result{results.length === 1 ? '' : 's'} for “{q}”</p>}
      {!q ? <p className="sub">Type a product name, brand or category.</p>
        : <ProductList items={results} loading={loading} error={error} emptyText={`No products found for “${q}”.`} />}
    </section>
  )
}