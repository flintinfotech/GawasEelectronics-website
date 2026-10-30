// SEARCH: type karte hi products dikhte hain (name, brand, model, category, description, label me dhoondta hai).
// (Backend me search API nahi hai, isliye loaded products me browser me filter hota hai.)
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductList } from '../components/Product'
import { useProducts } from '../hooks/useProducts'
import { type ApiProduct } from '../services/productService'

const css = `
.sr-form{display:flex;gap:10px;margin:18px 0 8px;max-width:560px}
.sr-form input{flex:1;min-width:0;font:inherit;padding:13px 18px;border:1px solid var(--line);border-radius:999px}
.sr-form .btn{padding:13px 24px}
@media(max-width:600px){.sr-form .btn{padding:13px 18px}}
`

// "I Phone 14" aur "iphone14" dono match ho: space, - . sab hata ke compare karte hain
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
const hay = (p: ApiProduct) =>
  norm([p.productName, p.brandName, p.modelName, p.categoryName, p.subCategoryName, p.description, p.feature, ...(p.labelList ?? [])].filter(Boolean).join(' '))

export default function Search() {
  const [params, setParams] = useSearchParams()
  const [text, setText] = useState(params.get('q') ?? '')
  const q = text.trim()
  const { items, loading, error } = useProducts(0, 500)

  const results = useMemo(() => {
    const words = q.split(/\s+/).map(norm).filter(Boolean)
    if (!words.length) return []
    const whole = norm(q)
    return items
      .filter(p => { const h = hay(p); return words.every(w => h.includes(w)) })
      .sort((a, b) => Number(norm(b.productName).includes(whole)) - Number(norm(a.productName).includes(whole))) // naam me match wale pehle
  }, [items, q])

  const onType = (v: string) => {
    setText(v)
    setParams(v.trim() ? { q: v.trim() } : {}, { replace: true }) // URL me bhi q rehta hai (refresh/share ke liye)
  }

  return (
    <section className="container section">
      <style>{css}</style>
      <h1 className="h2">Search</h1>
      <form className="sr-form" onSubmit={e => e.preventDefault()}>
        <input value={text} onChange={e => onType(e.target.value)} placeholder="Search products..." aria-label="Search products" autoFocus />
        {text && <button className="btn dark" type="button" onClick={() => onType('')}>Clear</button>}
      </form>
      {q && !loading && !error && <p className="sub">{results.length} result{results.length === 1 ? '' : 's'} for “{q}”</p>}
      {!q ? <p className="sub">Type a product name, brand or category.</p>
        : <ProductList items={results} loading={loading} error={error} emptyText={`No products found for “${q}”.`} />}
    </section>
  )
}