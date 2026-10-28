import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ItemRow, { itemRowCss } from '../components/ItemRow'
import { formatPrice } from '../services/productService'

const css = itemRowCss + `
/* Larger ("zoomed-in") cart layout: wider page, bigger text, images and buttons */
.ct-page{width:min(1500px,100% - 32px);font-size:18px}
.ct-page .h2{font-size:clamp(34px,4.5vw,52px)}
.ct-grid{display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:48px;align-items:start;margin-top:32px}
.ct-list{display:flex;flex-direction:column}
.ct-line{display:flex;justify-content:space-between;gap:20px;padding:26px 0;border-bottom:1px solid var(--line)}
.ct-line .ir{gap:22px}.ct-line .ir img{width:130px;height:130px;border-radius:14px}
.ct-line .ir-info{gap:8px}.ct-line .ir-name{font-size:20px}.ct-line .ir-price{font-size:19px}.ct-line .ir-price s{font-size:15px}
.ct-qty{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:999px;align-self:flex-start;margin-top:6px}
.ct-qty button{width:44px;height:44px;font-size:22px}.ct-qty span{min-width:30px;text-align:center;font-size:18px}
.ct-right{text-align:right;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;font-size:20px}
.ct-rm{color:#d33;font-size:16px}
.ct-sum{background:var(--bone);border-radius:22px;padding:32px;display:flex;flex-direction:column;gap:18px;position:sticky;top:120px;font-size:19px}
.ct-sum div{display:flex;justify-content:space-between}.ct-sum .tot{font-size:26px;font-weight:700;border-top:1px solid var(--line);padding-top:18px}
.ct-sum .btn{text-align:center;padding:17px 28px;font-size:19px}
.ct-empty{text-align:center;padding:70px 0;color:#666;font-size:20px}.ct-empty .btn{margin-top:20px}
@media(max-width:1024px){.ct-grid{grid-template-columns:minmax(0,1fr) 340px;gap:32px}}
@media(max-width:820px){.ct-page{font-size:16px}.ct-grid{grid-template-columns:1fr}.ct-sum{position:static}.ct-line .ir img{width:96px;height:96px}.ct-line .ir-name{font-size:17px}.ct-line .ir-price{font-size:16px}.ct-right{font-size:17px}.ct-sum{font-size:17px;padding:24px}}
`

export default function Cart() {
  const { cart, cartCount, cartTotal, setQty, removeFromCart, clearBuyNow } = useStore()
  const nav = useNavigate()

  // Checkout from cart: clear any old Buy Now item to avoid confusion
  const checkout = () => { clearBuyNow(); nav('/checkout') }

  return (
    <section className="container ct-page section">
      <style>{css}</style>
      <h1 className="h2">Your Cart</h1>
      {!cart.length ? (
        <div className="ct-empty"><p>Your cart is empty.</p><Link to="/products" className="btn dark">Continue Shopping</Link></div>
      ) : (
        <div className="ct-grid">
          <div className="ct-list">
            {cart.map(i => (
              <div key={i.id} className="ct-line">
                <ItemRow item={i}>
                  <div className="ct-qty">
                    <button aria-label="Decrease" onClick={() => setQty(i.id, i.qty - 1)} disabled={i.qty <= 1}>−</button>
                    <span>{i.qty}</span>
                    <button aria-label="Increase" onClick={() => setQty(i.id, i.qty + 1)} disabled={i.qty >= i.stock}>+</button>
                  </div>
                </ItemRow>
                <div className="ct-right">
                  <b>{formatPrice(i.price * i.qty)}</b>
                  <button className="ct-rm" onClick={() => removeFromCart(i.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <aside className="ct-sum">
            <div><span>Items ({cartCount})</span><span>{formatPrice(cartTotal)}</span></div>
            <div><span>Shipping</span><span>Free</span></div>
            <div className="tot"><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
            <button className="btn dark" onClick={checkout}>Proceed to Checkout</button>
            <Link to="/products" style={{ textAlign: 'center', color: '#666' }}>Continue Shopping</Link>
          </aside>
        </div>
      )}
    </section>
  )
}