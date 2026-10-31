// ORDER SERVICE.
// The backend has no order API yet. Orders placed on the Checkout page are saved in this browser,
// separately for every customer, and shown on "My Orders". When the backend is ready,
// ONLY the bodies of getOrders() and saveOrder() change (see the API contract in the instructions).

export type OrderItem = { id: string; name: string; image: string; price: number; qty: number }

export type Order = {
  orderId: string
  placedAt: string // ISO date
  items: OrderItem[]
  total: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled'
  deliveryStatus?: string
  address: { name: string; phone: string; address: string; city: string; pinCode: string }
}

const key = (customerId: string) => `gawas-orders-${customerId}`

export function getOrders(customerId: string): Order[] {
  try {
    const v = localStorage.getItem(key(customerId))
    const list = v ? (JSON.parse(v) as Order[]) : []
    return list.sort((a, b) => b.placedAt.localeCompare(a.placedAt)) // newest first
  } catch {
    return []
  }
}

export function saveOrder(customerId: string, order: Order): void {
  // TODO (backend ready): api.post(apiEndpoints.placeOrder(), order)
  try { localStorage.setItem(key(customerId), JSON.stringify([order, ...getOrders(customerId)])) } catch { /* private mode: ignore */ }
}