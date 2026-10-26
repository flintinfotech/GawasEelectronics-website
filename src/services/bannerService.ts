// BANNER SERVICE: types + API call + helper (UI: components/Banner.tsx, hook: hooks/useBanners.ts)
import { api } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'

export type BannerItem = {
  bannerId: number
  src: string // base64
  title: string
  redirectUrl: string
  fileType: string
  description: string
  size: number
  width: number
  height: number
  aspectRatio: string
  startDate: string
  endDate: string
  status: 'Y' | 'N'
  totalCount: number
  section: string | null
}

// API call (POST + empty {} payload)
export async function getAllBanners(page = 0, size = 10): Promise<BannerItem[]> {
  const list = await api.post<BannerItem[]>(apiEndpoints.getAllBanners(page, size), {})
  return list.filter(b => b.status === 'Y') // sirf active banners
}

// base64 me "data:" prefix ho ya na ho, dono chalega
export const bannerSrc = (b: BannerItem) => (b.src.startsWith('data:') ? b.src : `data:${b.fileType};base64,${b.src}`)
