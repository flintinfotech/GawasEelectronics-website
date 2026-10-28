// CHECKOUT: ?mode=buynow shows only the Buy Now product, otherwise the whole cart.
// NOTE: there is no "place order" API in the backend yet. When it is ready, call it inside placeOrder().
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'
import ItemRow, { itemRowCss } from '../components/ItemRow'
import { formatPrice } from '../services/productService'

const css = itemRowCss + `
.co-grid{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:40px;align-items:start;margin-top:24px}
.co-form{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.co-form label{display:flex;flex-direction:column;gap:6px;font-size:14px;color:#555}
.co-form .full{grid-column:1/-1}
.co-form input,.co-form textarea,.co-form select{font:inherit;padding:12px 14px;border:1px solid var(--line);border-radius:12px;color:var(--ink)}
.co-sum{background:var(--bone);border-radius:18px;padding:24px;display:flex;flex-direction:column;gap:14px;position:sticky;top:110px}
.co-sum .row{display:flex;justify-content:space-between}.co-sum .tot{font-size:20px;font-weight:700;border-top:1px solid var(--line);padding-top:14px}
.co-sum .ir img{width:64px;height:64px}.co-qty{font-size:13px;color:#666}
.co-sum .btn{text-align:center}
.co-done{text-align:center;padding:60px 0}.co-done .btn{margin-top:18px}
@media(max-width:820px){.co-grid{grid-template-columns:1fr}.co-sum{position:static}.co-form{grid-template-columns:1fr}}
`

export default function Checkout() {
  const [params] = useSearchParams()
  const { cart, buyNow, clearCart, clearBuyNow } = useStore()
  const isBuyNow = params.get('mode') === 'buynow'
  const items = isBuyNow ? (buyNow ? [buyNow] : []) : cart
  const total = items.reduce((n, i) => n + i.price * i.qty, 0)
  const { user } = useAuth()
  const [orderId, setOrderId] = useState<string | null>(null)

  const placeOrder = (e: FormEvent) => {
    e.preventDefault()
    // TODO: call the backend order API here (send items + address)
    setOrderId('GE' + Date.now().toString().slice(-8))
    if (isBuyNow) clearBuyNow(); else clearCart()
  }

  if (orderId) return (
    <section className="container section"><style>{css}</style>
      <div className="co-done"><h1 className="h2">Order placed 🎉</h1><p className="sub">Order ID: {orderId}</p>
        <Link to="/products" className="btn dark">Continue Shopping</Link></div>
    </section>
  )

  if (!items.length) return (
    <section className="container section"><style>{css}</style>
      <div className="co-done"><h1 className="h2">Nothing to checkout</h1><Link to="/products" className="btn dark">Browse Products</Link></div>
    </section>
  )

  // Not logged in -> show login / register first (cart and Buy Now item stay saved)
  if (!user) return (
    <section className="container section"><style>{css}</style>
      <AuthForm title="Login or Register to Checkout" />
    </section>
  )

  return (
    <section className="container section">
      <style>{css}</style>
      <h1 className="h2">Checkout</h1>
      <div className="co-grid">
        <form id="co" className="co-form" onSubmit={placeOrder}>
          <label className="full">Full name<input name="name" required autoComplete="name" defaultValue={user.name} /></label>
          <label>Phone<input name="phone" required type="tel" pattern="[0-9]{10}" title="10 digit mobile number" autoComplete="tel" defaultValue={user.phone} /></label>
          <label>Email<input name="email" type="email" autoComplete="email" defaultValue={user.email} /></label>
          <label className="full">Address<textarea name="address" required rows={3} autoComplete="street-address" /></label>
          <label>City<input name="city" required autoComplete="address-level2" /></label>
          <label>Pincode<input name="pin" required pattern="[0-9]{6}" title="6 digit pincode" autoComplete="postal-code" /></label>
          <label className="full">Payment
            <select name="pay" defaultValue="cod"><option value="cod">Cash on Delivery</option></select>
          </label>
        </form>
        <aside className="co-sum">
          {items.map(i => <ItemRow key={i.id} item={i}><span className="co-qty">Qty: {i.qty}</span></ItemRow>)}
          <div className="row"><span>Shipping</span><span>Free</span></div>
          <div className="row tot"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button className="btn dark" type="submit" form="co">Place Order</button>
        </aside>
      </div>
    </section>
  )
}