// PRODUCT HOOK: products load karta hai (loading / error / total ke saath). filter = brand / model (optional)
import { useEffect, useState } from 'react'
import { getAllProducts, type ApiProduct, type ProductFilter } from '../services/productService'

type Result = { key: string; items: ApiProduct[]; total: number; error: boolean }

const NO_FILTER: ProductFilter = {}

export function useProducts(page = 0, size = 12, filter: ProductFilter = NO_FILTER) {
  const key = `${page}-${size}-${JSON.stringify(filter)}`
  const [res, setRes] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false
    getAllProducts(page, size, filter)
      .then(r => { if (!cancelled) setRes({ key, items: r.items, total: r.total, error: false }) })
      .catch(() => { if (!cancelled) setRes({ key, items: [], total: 0, error: true }) })
    return () => { cancelled = true }
  }, [page, size, filter, key])

  const ready = res?.key === key // current page ka data aa gaya?
  return { items: ready ? res.items : [], total: ready ? res.total : 0, loading: !ready, error: ready && res.error }
}