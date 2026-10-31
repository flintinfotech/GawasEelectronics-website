// NAVBAR SEARCH: icon par click -> navbar me hi input khulta hai, type karte hi products ki list dikhti hai.
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { formatPrice, onImgError, priceInfo, productImages, searchProducts } from '../../services/productService'

const css = `
.sb{position:relative;display:flex;align-items:center}
.sb-form{display:flex;align-items:center;gap:8px;width:min(280px,32vw);height:40px;padding:0 6px 0 14px;border:1px solid var(--line);border-radius:999px;background:var(--bone);animation:sbOpen .25s ease}
@keyframes sbOpen{from{width:40px;opacity:.4}to{width:min(280px,32vw);opacity:1}}
.sb-form svg{flex:none;color:#666}
.sb-form input{flex:1;min-width:0;border:0;background:none;font:inherit;font-size:15px;outline:none}
.sb-x{flex:none;width:28px;height:28px;border-radius:50%;font-size:20px;line-height:1;color:#555}.sb-x:hover{background:#e6e6ea}
.sb-res{position:absolute;top:calc(100% + 14px);right:0;width:min(420px,92vw);max-height:min(70vh,460px);overflow-y:auto;background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 20px 40px rgba(0,0,0,.12);padding:6px;z-index:90}
.sb-item{display:flex;align-items:center;gap:12px;padding:8px;border-radius:10px}.sb-item:hover{background:var(--bone)}
.sb-item img{width:52px;height:52px;border-radius:8px;object-fit:cover;background:var(--bone);flex:none}
.sb-item b{display:block;font-weight:500;font-size:15px;line-height:1.3}.sb-item small{color:#666;font-size:13px}
.sb-item span{margin-left:auto;font-weight:600;font-size:14px;white-space:nowrap}
.sb-msg{padding:16px;color:#666;font-size:14px;text-align:center}
.sb-all{display:block;text-align:center;padding:12px;font-weight:500;font-size:14px;border-top:1px solid var(--line);margin-top:6px}.sb-all:hover{color:var(--accent)}
@media(max-width:1024px){
.sb{position:static}
.sb-form{position:absolute;inset:0 0 auto 0;height:68px;width:auto;border:0;border-radius:0;background:#fff;padding:0 12px 0 16px;z-index:3;animation:none}
.sb-form input{font-size:16px}
.sb-res{left:0;right:0;width:auto;top:100%;border-radius:0 0 14px 14px;border-top:0;max-height:70vh}
}
`
const icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" /></svg>

// Open hone par hi mount hota hai, isliye products ki API sirf tab chalti hai
function Panel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { items, loading, error } = useProducts(0, 500)
  const results = searchProducts(items, q)
  const text = q.trim()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text) return
    nav(`/search?q=${encodeURIComponent(text)}`) // Enter dabane par poora results page
    onClose()
  }

  return (
    <>
      <form className="sb-form" onSubmit={submit} role="search">
        {icon}
        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..." aria-label="Search products" />
        <button type="button" className="sb-x" aria-label="Close search" onClick={onClose}>×</button>
      </form>
      {text && (
        <div className="sb-res">
          {loading ? <p className="sb-msg">Loading...</p>
            : error ? <p className="sb-msg">Products load nahi ho paye.</p>
            : results.length === 0 ? <p className="sb-msg">No products found for “{text}”</p>
            : <>
                {results.slice(0, 6).map(p => {
                  const id = String(p.productInfoId)
                  return (
                    <Link key={id} to={`/product/${id}`} className="sb-item" onClick={onClose}>
                      <img src={productImages(p)[0]} alt="" onError={onImgError('s' + id)} />
                      <div><b>{p.productName}</b><small>{p.brandName}</small></div>
                      <span>{formatPrice(priceInfo(p).sell)}</span>
                    </Link>
                  )
                })}
                {results.length > 6 && <Link to={`/search?q=${encodeURIComponent(text)}`} className="sb-all" onClick={onClose}>View all {results.length} results →</Link>}
              </>}
        </div>
      )}
    </>
  )
}

export default function SearchBox() {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  // Bahar click ya Esc dabane par band
  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', out)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc) }
  }, [open])

  return (
    <div className="sb" ref={wrap}>
      <style>{css}</style>
      {open
        ? <Panel onClose={() => setOpen(false)} />
        : <button className="icon-btn" aria-label="Search" onClick={() => setOpen(true)}>{icon}</button>}
    </div>
  )
}