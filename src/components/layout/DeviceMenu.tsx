import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useStaticData } from '../../hooks/useStaticData'
import { brandsOf, modelsOf, type StaticDataItem } from '../../services/staticDataService'
import { productsUrl } from '../../services/productService'

const css = `
/* ---------- Desktop ---------- */
.dm-btn{display:inline-flex;align-items:center;gap:6px;font-weight:500}
.dm-btn:hover,.dm-btn.on{color:var(--accent)}
.dm-panel{position:absolute;top:100%;left:-20px;z-index:80;min-width:230px;padding:8px 0;background:#fff;box-shadow:0 12px 32px rgba(0,0,0,.12)}
.dm-row{position:relative}
.dm-brand{display:block;padding:11px 20px;font-size:16px}
.dm-brand.on{background:var(--bone)}
.dm-models{position:absolute;top:0;left:100%;min-width:230px;max-height:360px;overflow-y:auto;background:#fff;box-shadow:0 12px 32px rgba(0,0,0,.12)}
.dm-model{display:block;padding:11px 20px;font-size:16px;white-space:nowrap}.dm-model:hover{background:var(--bone)}
.nav-links .dm-brand,.nav-links .dm-model,.nav-links .dm-brand:hover,.nav-links .dm-model:hover{color:var(--ink)}
.dm-state{padding:16px 20px;color:#666;font-size:14px;white-space:nowrap}
.dm-state button{color:var(--accent);font-weight:500;margin-left:6px}
/* ---------- Mobile drawer ---------- */
.dm-m{display:flex;flex-direction:column;gap:12px}
.dm-m-btn{display:flex;justify-content:space-between;align-items:center;width:100%;font-size:20px;font-weight:500;text-align:left}
.dm-m-btn.sub{font-size:16px;color:#555}
.dm-m-list{display:flex;flex-direction:column;gap:12px;padding-left:14px}
.dm-m-list a{font-size:15px;color:#555}
`

const Chevron = ({ dir = 'down' }: { dir?: 'down' | 'right' }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={dir === 'right' ? { transform: 'rotate(-90deg)' } : undefined}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

// Brand / Model click par /products?brandId=..&brandName=..&modelId=..&modelName=.. khulta hai (Products page filter lagata hai)
const toProducts = (brand: StaticDataItem, model?: StaticDataItem) =>
  productsUrl({
    brandId: brand.dropDownId, brandName: brand.dropDrownValue,
    ...(model ? { modelId: model.dropDownId, modelName: model.dropDrownValue } : {}),
  })

type Props = { variant?: 'desktop' | 'mobile'; onNavigate?: () => void }

// "Shop By Device": click par static data API call -> Brand Name list -> brand par hover/tap -> uske Model
function DeviceMenuInner({ variant = 'desktop', onNavigate }: Props) {
  const [open, setOpen] = useState(false)
  const [brandId, setBrandId] = useState<number | null>(null) // desktop: hover wala brand, mobile: khula hua brand
  const ref = useRef<HTMLDivElement>(null)
  const { data, loading, error, load } = useStaticData()

  const toggle = () => {
    if (!open) load() // click par hi API call
    setOpen(o => !o)
    setBrandId(null)
  }
  const pick = () => { // koi link click hua
    setOpen(false)
    setBrandId(null)
    onNavigate?.()
  }

  // Desktop: bahar click ya Esc dabane par menu band
  useEffect(() => {
    if (!open || variant !== 'desktop') return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) { setOpen(false); setBrandId(null) }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setBrandId(null) } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, variant])

  const brands = data ? brandsOf(data) : []
  const models = data && brandId !== null ? modelsOf(data, brandId) : []

  // loading / error / empty states (desktop + mobile dono me same)
  const state = loading
    ? <p className="dm-state">Loading…</p>
    : error
      ? <p className="dm-state">Couldn’t load devices.<button onClick={load}>Retry</button></p>
      : brands.length === 0
        ? <p className="dm-state">No devices available</p>
        : null

  /* ---------- Mobile (drawer ke andar accordion) ---------- */
  if (variant === 'mobile') {
    return (
      <div className="dm-m">
        <style>{css}</style>
        <button className="dm-m-btn" aria-expanded={open} onClick={toggle}>Shop By Device <Chevron dir={open ? 'down' : 'right'} /></button>
        {open && (state ?? (
          <div className="dm-m-list">
            {brands.map(b => {
              const on = b.dropDownId === brandId
              return (
                <div key={b.dropDownId} className="dm-m">
                  <button className="dm-m-btn sub" aria-expanded={on} onClick={() => setBrandId(on ? null : b.dropDownId)}>{b.dropDrownValue} <Chevron dir={on ? 'down' : 'right'} /></button>
                  {on && (
                    <div className="dm-m-list">
                      <Link to={toProducts(b)} onClick={pick}>All {b.dropDrownValue}</Link>
                      {models.map(m => <Link key={m.dropDownId} to={toProducts(b, m)} onClick={pick}>{m.dropDrownValue}</Link>)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  /* ---------- Desktop (mega menu) ---------- */
  return (
    <div className="dm" ref={ref}>
      <style>{css}</style>
      <button className={`dm-btn ${open ? 'on' : ''}`} aria-expanded={open} aria-haspopup="true" onClick={toggle}>Shop By Device</button>
      {open && (
        <div className="dm-panel" onMouseLeave={() => setBrandId(null)}>
          {state ?? brands.map(b => {
            const on = b.dropDownId === brandId
            return (
              // Models usi brand ki row ke andar khulte hain, isliye hover wali row ke barabar se start hote hain
              <div key={b.dropDownId} className="dm-row" onMouseEnter={() => setBrandId(b.dropDownId)}>
                <Link to={toProducts(b)} className={`dm-brand ${on ? 'on' : ''}`} onFocus={() => setBrandId(b.dropDownId)} onClick={pick}>
                  {b.dropDrownValue}
                </Link>
                {on && (
                  <div className="dm-models">
                    {models.length === 0
                      ? <p className="dm-state">No models available</p>
                      : models.map(m => <Link key={m.dropDownId} to={toProducts(b, m)} className="dm-model" onClick={pick}>{m.dropDrownValue}</Link>)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Menu me kuch bhi crash ho to poori website blank na ho: sirf menu ki jagah text dikhega aur console me error aayega
class MenuBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: unknown) { console.error('DeviceMenu crashed:', error) }
  render() { return this.state.failed ? <span>Shop By Device</span> : this.props.children }
}

export default function DeviceMenu(props: Props) {
  return <MenuBoundary><DeviceMenuInner {...props} /></MenuBoundary>
}