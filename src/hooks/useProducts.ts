// PRODUCT HOOK: products load karta hai (loading / error / total ke saath)
import { useEffect, useState } from 'react'
import { getAllProducts, type ApiProduct } from '../services/productService'

type Result = { key: string; items: ApiProduct[]; total: number; error: boolean }

export function useProducts(page = 0, size = 12) {
  const key = `${page}-${size}`
  const [res, setRes] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false
    getAllProducts(page, size)
      .then(r => { if (!cancelled) setRes({ key, items: r.items, total: r.total, error: false }) })
      .catch(() => { if (!cancelled) setRes({ key, items: [], total: 0, error: true }) })
    return () => { cancelled = true }
  }, [page, size, key])

  const ready = res?.key === key // current page ka data aa gaya?
  return { items: ready ? res.items : [], total: res?.total ?? 0, loading: !ready, error: ready && res.error }
}
