// BANNER HOOK: active banners load karta hai
import { useEffect, useState } from 'react'
import { getAllBanners, type BannerItem } from '../services/bannerService'

export function useBanners() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    getAllBanners()
      .then(l => { if (!cancelled) setBanners(l) })
      .catch(e => console.error('Banner load failed:', e))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])
  return { banners, loading }
}
