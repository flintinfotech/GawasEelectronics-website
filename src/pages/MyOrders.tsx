// MY ORDERS: every order placed by the logged-in customer (newest first), with details + tracking.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getOrders, type Order } from '../services/orderService'
import { formatPrice, onImgError } from '../services/productService'

const css = `
.mo-list{display:flex;flex-direction:column;gap:20px;margin-top:24px}
.mo-card{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
.mo-top{display:flex;justify-content:space-between;gap:12px 24px;flex-wrap:wrap;padding:16px 20px;background:var(--bone);font-size:14px}
.mo-top div{display:flex;flex-direction:column;gap:2px;min-width:0}.mo-top small{color:#6b6b72;font-size:12px;text-transform:uppercase;letter-spacing:.06em}
.mo-top b{overflow-wrap:anywhere}
.mo-badges{display:flex;gap:8px;flex-wrap:wrap;padding:14px 20px 0}
.mo-badge{font-size:12.5px;font-weight:600;padding:5px 12px;border-radius:999px;background:var(--bone);color:#3d3d44}
.mo-badge.ok{background:#e9f6ee;color:#1f7a3d}.mo-badge.wait{background:#fff6e5;color:#8a5a00}.mo-badge.bad{background:#fdecec;color:#b42318}
.mo-items{padding:8px 20px 4px}
.mo-item{display:flex;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line)}.mo-item:last-child{border-bottom:0}
.mo-item img{width:76px;height:76px;object-fit:cover;border-radius:12px;background:var(--bone);flex:none}
.mo-info{min-width:0;flex:1}.mo-name{font-weight:500;line-height:1.3;display:block;overflow-wrap:anywhere}.mo-name:hover{color:var(--accent)}
.mo-meta{color:#6b6b72;font-size:14px;margin-top:4px}
.mo-amt{font-weight:600;white-space:nowrap}
.mo-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:14px 20px 18px}
.mo-link{font-weight:600;text-decoration:underline;text-underline-offset:3px}.mo-link:hover{color:var(--accent)}
.mo-more{padding:0 20px 20px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.mo-more h3{font-size:14px;margin-bottom:8px}.mo-more p{color:#55555d;line-height:1.55;font-size:14px;overflow-wrap:anywhere}
.mo-steps{list-style:none;display:flex;flex-direction:column;gap:10px}
.mo-steps li{display:flex;align-items:center;gap:10px;font-size:14px;color:#85858d}
.mo-steps i{width:14px;height:14px;border-radius:50%;border:2px solid #cfcfd6;flex:none}
.mo-steps li.on{color:var(--ink);font-weight:600}.mo-steps li.on i{background:#2e9e4f;border-color:#2e9e4f}
.mo-empty{text-align:center;padding:60px 0;color:#666}.mo-empty .btn{margin-top:18px}
@media(max-width:600px){
  .mo-item{align-items:flex-start;flex-wrap:wrap}.mo-item img{width:64px;height:64px}
  .mo-amt{width:100%;padding-left:78px}
  .mo-more{grid-template-columns:1fr}
}
`

const STEPS: Order['orderStatus'][] = ['Placed', 'Packed', 'Shipped', 'Delivered']
const date = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const tone = (s: string) => (/deliver|paid|success/i.test(s) ? 'ok' : /cancel|fail/i.test(s) ? 'bad' : 'wait')

function OrderCard({ o }: { o: Order }) {
  const [open, setOpen] = useState(false)
  const step = STEPS.indexOf(o.orderStatus)
  return (
    <article className="mo-card">
      <div className="mo-top">
        <div><small>Order ID</small><b>{o.orderId}</b></div>
        <div><small>Order date</small><b>{date(o.placedAt)}</b></div>
        <div><small>Total</small><b>{formatPrice(o.total)}</b></div>
      </div>
      <div className="mo-badges">
        <span className={`mo-badge ${tone(o.orderStatus)}`}>Order: {o.orderStatus}</span>
        <span className={`mo-badge ${tone(o.paymentStatus)}`}>Payment: {o.paymentStatus}</span>
        {o.deliveryStatus && <span className={`mo-badge ${tone(o.deliveryStatus)}`}>Delivery: {o.deliveryStatus}</span>}
      </div>
      <div className="mo-items">
        {o.items.map(i => (
          <div key={i.id} className="mo-item">
            <Link to={`/product/${i.id}`}><img src={i.image} alt={i.name} onError={onImgError('o' + i.id)} /></Link>
            <div className="mo-info">
              <Link to={`/product/${i.id}`} className="mo-name">{i.name}</Link>
              <div className="mo-meta">Qty: {i.qty} × {formatPrice(i.price)}</div>
            </div>
            <div className="mo-amt">{formatPrice(i.price * i.qty)}</div>
          </div>
        ))}
      </div>
      <div className="mo-foot">
        <span>{o.paymentMethod}</span>
        <button className="mo-link" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'Hide details' : 'View details & tracking'}</button>
      </div>
      {open && (
        <div className="mo-more">
          <div>
            <h3>Delivery address</h3>
            <p>{o.address.name}<br />{o.address.address}<br />{o.address.city} - {o.address.pinCode}<br />📞 {o.address.phone}</p>
          </div>
          <div>
            <h3>Order tracking</h3>
            {o.orderStatus === 'Cancelled'
              ? <p>This order was cancelled.</p>
              : <ol className="mo-steps">{STEPS.map((s, k) => <li key={s} className={k <= step ? 'on' : ''}><i />{s}</li>)}</ol>}
          </div>
        </div>
      )}
    </article>
  )
}

export default function MyOrders() {
  const { user } = useAuth()
  const orders = useMemo(() => (user ? getOrders(user.customerId) : []), [user])
  return (
    <section className="container section">
      <style>{css}</style>
      <h1 className="h2">My Orders</h1>
      <p className="sub">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
      {!orders.length ? (
        <div className="mo-empty"><p>You have not placed any orders yet.</p><Link to="/products" className="btn dark">Start Shopping</Link></div>
      ) : (
        <div className="mo-list">{orders.map(o => <OrderCard key={o.orderId} o={o} />)}</div>
      )}
    </section>
  )
}