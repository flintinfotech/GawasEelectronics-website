// BANNER HOOK: active banners load karta hai aur sirf ek section (top / middle / bottom) ke deta hai
import { useEffect, useState } from 'react'
import { bannersFor, getAllBanners, type BannerItem, type BannerSection } from '../services/bannerService'

export function useBanners(section: BannerSection = 'top') {
  const [all, setAll] = useState<BannerItem[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    getAllBanners()
      .then(l => { if (!cancelled) setAll(l) })
      .catch(e => console.error('Banner load failed:', e))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])
  return { banners: bannersFor(all, section), loading }
}