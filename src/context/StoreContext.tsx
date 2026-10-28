// STORE: cart + wishlist + buy-now (saved in localStorage, survives refresh)
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { type ApiProduct, priceInfo, productImages } from '../services/productService'

// Cart / wishlist keep a small snapshot of the product (no extra API call needed)
export type StoreItem = {
  id: string
  name: string
  image: string
  price: number // selling price
  mrp: number | null // cut price (when discounted)
  stock: number
  qty: number
}

// eslint-disable-next-line react-refresh/only-export-components
export function toItem(p: ApiProduct, qty = 1): StoreItem {
  const { sell, mrp } = priceInfo(p)
  return { id: String(p.productInfoId), name: p.productName, image: productImages(p)[0], price: sell, mrp, stock: p.stockQuantity, qty }
}

type Ctx = {
  cart: StoreItem[]
  cartCount: number // total quantity
  cartTotal: number
  addToCart: (item: StoreItem) => void
  setQty: (id: string, qty: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  inCart: (id: string) => boolean

  wish: StoreItem[]
  toggleWish: (item: StoreItem) => void
  inWish: (id: string) => boolean
  removeWish: (id: string) => void

  buyNow: StoreItem | null // the single "Buy Now" product (not added to the cart)
  startBuyNow: (item: StoreItem) => void
  clearBuyNow: () => void
}

const C = createContext<Ctx | null>(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
  const ctx = useContext(C)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

/* ---------- storage helpers (errors in private mode are ignored) ---------- */
function load<T>(store: Storage, key: string, fallback: T): T {
  try { const v = store.getItem(key); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}
function save(store: Storage, key: string, value: unknown) {
  try { store.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}
const clamp = (qty: number, stock: number) => Math.max(1, Math.min(qty, stock > 0 ? stock : 1))

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreItem[]>(() => load(localStorage, 'gawas-cart', []))
  const [wish, setWish] = useState<StoreItem[]>(() => load(localStorage, 'gawas-wish', []))
  const [buyNow, setBuyNow] = useState<StoreItem | null>(() => load(sessionStorage, 'gawas-buynow', null))

  useEffect(() => save(localStorage, 'gawas-cart', cart), [cart])
  useEffect(() => save(localStorage, 'gawas-wish', wish), [wish])
  useEffect(() => save(sessionStorage, 'gawas-buynow', buyNow), [buyNow])

  const value = useMemo<Ctx>(() => ({
    cart,
    cartCount: cart.reduce((n, i) => n + i.qty, 0),
    cartTotal: cart.reduce((n, i) => n + i.price * i.qty, 0),
    // One product = one cart entry. If it is already in the cart, repeated calls do nothing
    // (quantity is changed only through setQty).
    addToCart: item => setCart(c => (c.some(i => i.id === item.id) ? c : [...c, { ...item, qty: clamp(item.qty, item.stock) }])),
    setQty: (id, qty) => setCart(c => c.map(i => (i.id === id ? { ...i, qty: clamp(qty, i.stock) } : i))),
    removeFromCart: id => setCart(c => c.filter(i => i.id !== id)),
    clearCart: () => setCart([]),
    inCart: id => cart.some(i => i.id === id),

    wish,
    toggleWish: item => setWish(w => (w.some(i => i.id === item.id) ? w.filter(i => i.id !== item.id) : [...w, item])),
    inWish: id => wish.some(i => i.id === id),
    removeWish: id => setWish(w => w.filter(i => i.id !== id)),

    buyNow,
    startBuyNow: item => setBuyNow({ ...item, qty: clamp(item.qty, item.stock) }),
    clearBuyNow: () => setBuyNow(null),
  }), [cart, wish, buyNow])

  return <C.Provider value={value}>{children}</C.Provider>
}