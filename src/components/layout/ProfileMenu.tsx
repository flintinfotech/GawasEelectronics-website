// Navbar account button + dropdown (shown after login, in the place of the "Login" button).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, fullName } from '../../context/AuthContext'

const css = `
.pm{position:relative;align-self:center;margin-left:6px}
.pm-btn{display:flex;align-items:center;gap:8px;padding:5px 12px 5px 5px;border:1px solid var(--line);border-radius:999px;font-size:14px;font-weight:500;max-width:200px}
.pm-btn:hover,.pm-btn[aria-expanded="true"]{background:var(--bone)}
.pm-av{width:32px;height:32px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:13px;font-weight:700;flex:none;letter-spacing:.02em}
.pm-av.lg{width:48px;height:48px;font-size:17px}
.pm-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.pm-panel{position:absolute;top:calc(100% + 10px);right:0;z-index:90;width:min(320px,calc(100vw - 24px));background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 18px 44px rgba(0,0,0,.16);padding:8px;animation:pm-in .16s ease-out}
@keyframes pm-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.pm-head{display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;background:var(--bone);margin-bottom:6px}
.pm-head:hover .pm-hname{color:var(--accent)}
.pm-info{min-width:0}
.pm-cap{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#85858d}
.pm-hname{font-weight:700;font-size:16px;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pm-mob{color:#55555d;font-size:14px;margin-top:2px}
.pm-item{display:flex;align-items:center;gap:12px;width:100%;min-height:46px;padding:10px 14px;border-radius:12px;font-size:15px;font-weight:500;text-align:left}
.pm-item:hover{background:var(--bone)}
.pm-item svg{flex:none;color:#55555d}
.pm-item.out{color:#c62828}.pm-item.out svg{color:#c62828}
.pm-sep{height:1px;background:var(--line);margin:6px 8px}
@media(max-width:600px){.pm-btn{padding:4px}.pm-name,.pm-chev{display:none}.pm{margin-left:2px}}
`

const Icon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)
const ICON = {
  heart: 'M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z',
  orders: 'M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'U'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click / tap, and on Esc
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null
  const name = fullName(user)
  const close = () => setOpen(false)
  const item = (to: string, icon: string, label: ReactNode) => (
    <Link to={to} className="pm-item" role="menuitem" onClick={close}><Icon d={icon} />{label}</Link>
  )

  return (
    <div className="pm" ref={ref}>
      <style>{css}</style>
      <button className="pm-btn" aria-haspopup="menu" aria-expanded={open} aria-label="My account" onClick={() => setOpen(o => !o)}>
        <span className="pm-av">{initials(name)}</span>
        <span className="pm-name">{name}</span>
        <svg className="pm-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="pm-panel" role="menu">
          <Link to="/my-account" className="pm-head" onClick={close}>
            <span className="pm-av lg">{initials(name)}</span>
            <span className="pm-info">
              <span className="pm-cap" style={{ display: 'block' }}>Customer Profile</span>
              <span className="pm-hname" style={{ display: 'block' }}>{name}</span>
              {user.mobileNumber && <span className="pm-mob" style={{ display: 'block' }}>{user.mobileNumber}</span>}
            </span>
          </Link>
          {item('/my-wishlist', ICON.heart, 'My Wishlist')}
          {item('/my-orders', ICON.orders, 'My Orders')}
          {item('/edit-profile', ICON.edit, 'Edit Profile')}
          <div className="pm-sep" />
          <button className="pm-item out" role="menuitem" onClick={() => { close(); logout() }}><Icon d={ICON.logout} />Logout</button>
        </div>
      )}
    </div>
  )
}