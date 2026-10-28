import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { DEVICES } from '../../config/site'
import { useStore } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'

const css = `
.header{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid var(--line)}
.topbar{background:var(--ink);color:#fff;font-size:13px;font-weight:500;display:flex;justify-content:space-around;padding:9px 16px;text-align:center}
.nav{display:flex;align-items:center;justify-content:space-between;height:68px;gap:16px}
.nav-links{display:flex;gap:34px;list-style:none;font-weight:500}.nav-links>li{position:relative;padding:24px 0}
.nav-links a:hover{color:var(--accent)}
.mega{position:absolute;top:100%;left:-20px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:10px;min-width:220px;display:none;flex-direction:column;box-shadow:0 20px 40px rgba(0,0,0,.08)}
.has-menu:hover .mega{display:flex}.mega a{padding:10px 14px;border-radius:8px}.mega a:hover{background:var(--bone)}
.nav-icons{display:flex;gap:4px}.icon-btn{position:relative;padding:8px;display:grid;place-items:center}
.dot{position:absolute;top:0;right:0;background:var(--accent);color:#fff;font-size:10px;min-width:17px;height:17px;border-radius:9px;display:grid;place-items:center}
.burger{display:none}
.acct{align-self:center;margin-left:6px;padding:8px 14px;border:1px solid var(--line);border-radius:999px;font-size:14px;font-weight:500}.acct:hover{background:var(--bone)}
.drawer-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:.3s;z-index:60}.drawer-bg.show{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;left:0;bottom:0;width:min(320px,85vw);background:#fff;padding:24px;display:flex;flex-direction:column;gap:16px;transform:translateX(-100%);transition:.3s;overflow:auto;z-index:70}
.drawer.show{transform:none}.drawer>a{font-size:20px;font-weight:500}.drawer .dsub{font-size:16px;color:#555}.drawer .close{align-self:flex-end}
@media(max-width:820px){.nav-links{display:none}.burger{display:grid}.nav{display:grid;grid-template-columns:44px 1fr auto}.nav>a{justify-self:center}}
@media(max-width:600px){.hide-sm{display:none}.topbar{justify-content:center}}
`
const I = (d: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>

export default function Header() {
  const [open, setOpen] = useState(false)
  const { cartCount, wish } = useStore()
  const { user, logout } = useAuth()
  const close = () => setOpen(false)
  return (
    <header className="header">
      <style>{css}</style>
      <div className="topbar"><span>Free shipping on all paid orders</span><span className="hide-sm">Buy 2 Get 15% Off | Buy 3 Get 20% Off</span></div>
      <nav className="nav container">
        <button className="icon-btn burger" aria-label="Menu" onClick={() => setOpen(true)}>{I('M3 6h18M3 12h18M3 18h18')}</button>
        <Link to="/" aria-label="Home"><Logo /></Link>
        <ul className="nav-links">
          <li className="has-menu"><Link to="/products">Shop By Device</Link>
            <div className="mega">{DEVICES.map(d => <Link key={d} to="/products">{d}</Link>)}</div></li>
          <li><Link to="/products">Gawas Originals</Link></li>
          <li><Link to="/products">Accessories</Link></li>
        </ul>
        <div className="nav-icons">
          <Link to="/wishlist" className="icon-btn hide-sm" aria-label="Wishlist">{I('M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z')}{wish.length > 0 && <b className="dot">{wish.length}</b>}</Link>
          <Link to="/search" className="icon-btn" aria-label="Search">{I('M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3')}</Link>
          <Link to="/cart" className="icon-btn" aria-label="Cart">{I('M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01')}{cartCount > 0 && <b className="dot">{cartCount}</b>}</Link>
          {user
            ? <button className="acct" onClick={logout} title={user.email}>Logout</button>
            : <Link to="/login" className="acct">Login</Link>}
        </div>
      </nav>
      <div className={`drawer-bg ${open ? 'show' : ''}`} onClick={close} />
      <aside className={`drawer ${open ? 'show' : ''}`}>
        <button className="icon-btn close" aria-label="Close" onClick={close}>{I('M6 6l12 12M18 6L6 18')}</button>
        <Logo />
        <Link to="/products" onClick={close}>Shop By Device</Link>
        <Link to="/products" onClick={close}>Gawas Originals</Link>
        <Link to="/products" onClick={close}>Accessories</Link>
        <hr />{DEVICES.map(d => <Link key={d} className="dsub" to="/products" onClick={close}>{d}</Link>)}
      </aside>
    </header>
  )
}