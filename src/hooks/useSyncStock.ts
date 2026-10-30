// Re-checks the latest stock of the given products and updates cart / wishlist / buy-now items.
// Quantity is reduced if it is above the new stock; stock 0 makes the item show "Out of stock".
import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { getProductById } from '../services/productService'

export function useSyncStock(ids: string[]) {
  const { syncStock } = useStore()
  const key = ids.join(',')
  useEffect(() => {
    if (!key) return
    const list = key.split(',')
    let cancelled = false
    Promise.allSettled(list.map(id => getProductById(id))).then(results => {
      const stocks: Record<string, number> = {}
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') stocks[list[i]] = r.value.isActive === 'N' ? 0 : r.value.stockQuantity
      })
      if (!cancelled) syncStock(stocks)
    })
    return () => { cancelled = true }
  }, [key, syncStock])
}