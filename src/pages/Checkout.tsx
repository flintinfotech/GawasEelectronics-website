// CHECKOUT: ?mode=buynow shows only the Buy Now product, otherwise the whole cart.
// Before an order is placed, the latest stock of every item is checked again.
// NOTE: there is no "place order" API in the backend yet. When it is ready, call it inside placeOrder().
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useAuth, fullName } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'
import ItemRow, { itemRowCss } from '../components/ItemRow'
import { formatPrice, getProductById } from '../services/productService'
import { recordSale } from '../services/stockLedger'
import { useSyncStock } from '../hooks/useSyncStock'

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
.co-oos{color:#d33;font-size:13px;font-weight:500}
.co-err{grid-column:1/-1;background:#fdecec;color:#b42318;border-radius:12px;padding:14px 16px;font-size:15px;line-height:1.5}
.co-err ul{padding-left:18px}.co-err a{text-decoration:underline;font-weight:500}
.co-done{text-align:center;padding:60px 0}.co-done .btn{margin-top:18px}
@media(max-width:820px){.co-grid{grid-template-columns:1fr}.co-sum{position:static}.co-form{grid-template-columns:1fr}}
`

export default function Checkout() {
  const [params] = useSearchParams()
  const { cart, buyNow, clearCart, clearBuyNow, syncStock } = useStore()
  const isBuyNow = params.get('mode') === 'buynow'
  const items = isBuyNow ? (buyNow ? [buyNow] : []) : cart
  const total = items.reduce((n, i) => n + i.price * i.qty, 0)
  const { user } = useAuth()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [problems, setProblems] = useState<string[]>([])
  const hasOutOfStock = items.some(i => i.stock <= 0)

  useSyncStock(items.map(i => i.id)) // check latest stock as soon as the page opens

  const placeOrder = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true); setProblems([])

    // 1) Re-check the latest stock of every item
    const results = await Promise.allSettled(items.map(i => getProductById(i.id)))
    const fresh: Record<string, number> = {}
    const issues: string[] = []
    results.forEach((r, idx) => {
      const it = items[idx]
      if (r.status === 'rejected') { issues.push(`Could not check stock for "${it.name}". Please try again.`); return }
      const stock = r.value.isActive === 'N' ? 0 : r.value.stockQuantity
      fresh[it.id] = stock
      if (stock <= 0) issues.push(`"${it.name}" is out of stock. Please remove it to continue.`)
      else if (it.qty > stock) issues.push(`Only ${stock} of "${it.name}" ${stock === 1 ? 'is' : 'are'} available. Your quantity was reduced to ${stock}. Please review and place the order again.`)
    })
    syncStock(fresh) // update the cart / buy-now item with the latest stock

    if (issues.length) { setProblems(issues); setBusy(false); return }

    // 2) Everything is in stock -> place the order
    // TODO: call the backend order API here (send items + address). The backend must reduce stock.
    recordSale(items) // temporary: remember what was sold (see services/stockLedger.ts)
    setOrderId('GE' + Date.now().toString().slice(-8))
    if (isBuyNow) clearBuyNow(); else clearCart()
    setBusy(false)
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
          {(problems.length > 0 || hasOutOfStock) && (
            <div className="co-err" role="alert">
              <ul>
                {problems.length > 0
                  ? problems.map(m => <li key={m}>{m}</li>)
                  : items.filter(i => i.stock <= 0).map(i => <li key={i.id}>"{i.name}" is out of stock.</li>)}
              </ul>
              <Link to={isBuyNow ? '/products' : '/cart'}>{isBuyNow ? 'Back to products' : 'Go to cart'}</Link>
            </div>
          )}
                    <label className="full">Full name<input name="name" required autoComplete="name" defaultValue={fullName(user)} /></label>
          <label>Phone<input name="phone" required type="tel" pattern="[0-9]{10}" title="10 digit mobile number" autoComplete="tel" defaultValue={user.mobileNumber} /></label>
          <label>Email<input name="email" type="email" autoComplete="email" defaultValue={user.email} /></label>
          <label className="full">Address<textarea name="address" required rows={3} autoComplete="street-address" /></label>
                    <label>City<input name="city" required autoComplete="address-level2" defaultValue={user.city} /></label>
                    <label>Pincode<input name="pin" required pattern="[0-9]{6}" title="6 digit pincode" autoComplete="postal-code" defaultValue={user.pinCode} /></label>
                    <label className="full">Payment
            <select name="pay" defaultValue="cod"><option value="cod">Cash on Delivery</option></select>
          </label>
        </form>
        <aside className="co-sum">
          {items.map(i => (
            <ItemRow key={i.id} item={i}>
              {i.stock <= 0 ? <span className="co-oos">Out of stock</span> : <span className="co-qty">Qty: {i.qty}</span>}
            </ItemRow>
          ))}
          <div className="row"><span>Shipping</span><span>Free</span></div>
          <div className="row tot"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button className="btn dark" type="submit" form="co" disabled={busy || hasOutOfStock}>
            {hasOutOfStock ? 'Out of stock' : busy ? 'Checking stock...' : 'Place Order'}
          </button>
        </aside>
      </div>
    </section>
  )
}