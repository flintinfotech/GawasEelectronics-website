// MY ACCOUNT: overview of the logged-in customer with shortcuts to Wishlist, Orders and Edit Profile.
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, fullName } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { getOrders } from '../services/orderService'

const css = `
.ma-card{display:flex;align-items:center;gap:18px;flex-wrap:wrap;border:1px solid var(--line);border-radius:20px;padding:clamp(18px,3vw,28px);background:#fff}
.ma-av{width:68px;height:68px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:24px;font-weight:700;flex:none}
.ma-info{min-width:0;flex:1}
.ma-name{font-size:clamp(20px,3vw,26px);font-weight:700;letter-spacing:-.02em;overflow-wrap:anywhere}
.ma-line{color:#55555d;margin-top:4px;overflow-wrap:anywhere}
.ma-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:20px}
.ma-tile{display:flex;flex-direction:column;gap:6px;border:1px solid var(--line);border-radius:18px;padding:22px;background:var(--bone);transition:transform .2s,box-shadow .2s}
.ma-tile:hover{transform:translateY(-3px);box-shadow:0 14px 30px -18px rgba(14,14,16,.45)}
.ma-tile b{font-size:18px}.ma-tile span{color:#6b6b72;font-size:14px}
.ma-out{margin-top:24px}
@media(max-width:820px){.ma-grid{grid-template-columns:1fr}}
`

export default function MyAccount() {
  const { user, logout } = useAuth()
  const { wish } = useStore()
  const orders = useMemo(() => (user ? getOrders(user.customerId) : []), [user])
  if (!user) return null
  const name = fullName(user)
  const address = [user.homeAddress, user.city, user.state, user.pinCode].filter(Boolean).join(', ')
  return (
    <section className="container section">
      <style>{css}</style>
      <h1 className="h2">My Account</h1>
      <p className="sub">Manage your wishlist, orders and personal details.</p>
      <div className="ma-card">
        <span className="ma-av">{name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'U'}</span>
        <div className="ma-info">
          <div className="ma-name">{name}</div>
          {user.mobileNumber && <div className="ma-line">📞 {user.mobileNumber}</div>}
          {user.email && <div className="ma-line">✉ {user.email}</div>}
          <div className="ma-line">{address || 'No address added yet.'}</div>
        </div>
        <Link to="/edit-profile" className="btn dark">Edit Profile</Link>
      </div>
      <div className="ma-grid">
        <Link to="/my-wishlist" className="ma-tile"><b>My Wishlist</b><span>{wish.length} saved {wish.length === 1 ? 'product' : 'products'}</span></Link>
        <Link to="/my-orders" className="ma-tile"><b>My Orders</b><span>{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</span></Link>
        <Link to="/edit-profile" className="ma-tile"><b>Edit Profile</b><span>Update your details and addresses</span></Link>
      </div>
      <button className="btn dark ma-out" onClick={logout}>Logout</button>
    </section>
  )
}