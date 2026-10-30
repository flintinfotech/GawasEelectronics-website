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
// Banner kahan dikhega (admin panel ke "section" dropdown se match hota hai)
export type BannerSection = 'top' | 'middle' | 'bottom' | 'mini'

// Ek hi API call poori site ke liye (Top, Middle, Bottom, Mini sab isi data ko use karte hain)
let cache: Promise<BannerItem[]> | null = null

export function getAllBanners(): Promise<BannerItem[]> {
  if (!cache) {
    cache = api.post<BannerItem[]>(apiEndpoints.getAllBanners(0, 50), {}) // POST + empty {} payload
      .then(list => list.filter(b => b.status === 'Y')) // sirf active banners
      .catch(e => { cache = null; throw e }) // fail ho to agli baar dobara try
  }
  return cache
}

// Backend ki "section" value ko top / middle / bottom / mini me badalta hai
// (capital, small, space, "-" ya "_" kuch bhi ho chalega: "Mini banner", "mini_banner", "MINI")
function sectionOf(b: BannerItem): BannerSection | null {
  const key = (b.section ?? '').toLowerCase().replace(/[^a-z]/g, '')
  if (key === 'top') return 'top'
  if (key === 'middle' || key === 'mid') return 'middle'
  if (key === 'bottom' || key === 'button') return 'bottom' // admin panel me "button" likha ho to bhi bottom
  if (key === 'mini' || key === 'minibanner') return 'mini'
  return null
}

// Sirf us section ke banners. Jinki section bilkul khali hai (purane banners) wo Top me dikhte hain.
export const bannersFor = (list: BannerItem[], section: BannerSection) =>
  list.filter(b => {
    if (!b.section?.trim()) return section === 'top'
    return sectionOf(b) === section
  })

// base64 me "data:" prefix ho ya na ho, dono chalega
export const bannerSrc = (b: BannerItem) => (b.src.startsWith('data:') ? b.src : `data:${b.fileType};base64,${b.src}`)