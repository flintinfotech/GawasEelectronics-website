import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { DEVICES } from '../data/products'
import { useStore } from '../context'

const I = (d: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>

export default function Header() {
  const [open, setOpen] = useState(false)
  const { cart, wish } = useStore()
  return (
    <header className="header">
      <div className="topbar"><span>Free shipping on all paid orders</span><span className="hide-sm">Buy 2 Get 15% Off | Buy 3 Get 20% Off</span></div>
      <nav className="nav container">
        <button className="icon-btn burger" aria-label="Menu" onClick={() => setOpen(true)}>{I('M3 6h18M3 12h18M3 18h18')}</button>
        <Link to="/" aria-label="Home"><Logo /></Link>
        <ul className="nav-links">
          <li className="has-menu"><a href="#devices">Shop By Device</a>
            <div className="mega">{DEVICES.map(d => <a key={d} href="#products">{d}</a>)}</div></li>
          <li><a href="#originals">Gawas Originals</a></li>
          <li><a href="#accessories">Accessories</a></li>
        </ul>
        <div className="nav-icons">
          <button className="icon-btn hide-sm" aria-label="Wishlist">{I('M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z')}{wish.length > 0 && <b className="dot">{wish.length}</b>}</button>
          <button className="icon-btn" aria-label="Search">{I('M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3')}</button>
          <button className="icon-btn" aria-label="Cart">{I('M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01')}{cart > 0 && <b className="dot">{cart}</b>}</button>
        </div>
      </nav>
      <div className={`drawer-bg ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'show' : ''}`}>
        <button className="icon-btn close" aria-label="Close" onClick={() => setOpen(false)}>{I('M6 6l12 12M18 6L6 18')}</button>
        <Logo />
        <a href="#devices" onClick={() => setOpen(false)}>Shop By Device</a>
        <a href="#originals" onClick={() => setOpen(false)}>Gawas Originals</a>
        <a href="#accessories" onClick={() => setOpen(false)}>Accessories</a>
        <hr />{DEVICES.map(d => <a key={d} className="sub" href="#products" onClick={() => setOpen(false)}>{d}</a>)}
      </aside>
    </header>
  )
}
