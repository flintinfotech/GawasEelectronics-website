// Quantity stepper for a product that is already in the cart.
// One product = one cart entry: quantity is changed here, never by clicking "Add to Cart" again.
import { useStore } from '../context/StoreContext'

export const cartQtyCss = `
.cq{display:inline-flex;align-items:center;justify-content:space-between;border:1px solid var(--ink);border-radius:999px;min-width:128px}
.cq button{width:38px;height:38px;font-size:18px;border-radius:50%}.cq button:hover:not(:disabled){background:var(--bone)}.cq button:disabled{opacity:.35;cursor:not-allowed}
.cq span{min-width:26px;text-align:center;font-weight:500}
`

export default function CartQty({ id }: { id: string }) {
  const { cart, setQty, removeFromCart } = useStore()
  const item = cart.find(i => i.id === id)
  if (!item) return null
  return (
    <div className="cq" role="group" aria-label="Cart quantity">
      <style>{cartQtyCss}</style>
      {/* at quantity 1, "−" removes the product from the cart */}
      <button aria-label={item.qty <= 1 ? 'Remove from cart' : 'Decrease quantity'} onClick={() => (item.qty <= 1 ? removeFromCart(id) : setQty(id, item.qty - 1))}>−</button>
      <span>{item.qty}</span>
      <button aria-label="Increase quantity" onClick={() => setQty(id, item.qty + 1)} disabled={item.qty >= item.stock}>+</button>
    </div>
  )
}