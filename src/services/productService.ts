// PRODUCT SERVICE: types + API calls + helpers (UI: components/Product.tsx, hook: hooks/useProducts.ts)
import { type SyntheticEvent } from 'react'
import { api } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'
import config from '../config/config'
import { pic } from '../utils/img'
import { availableStock } from './stockLedger'

/* ---------- Types ---------- */
export type ProductImage = {
  documentDetailsId: number
  documentName: string
  documentPath: string
  document: string | null
  byteArrayDocument: string | null
}

export type ApiProduct = {
  productInfoId: number
  productName: string
  price: number
  description: string
  feature: string
  rating: string
  categoryName: string
  subCategoryName: string
  stockQuantity: number
  brandName: string
  isDiscountActive: 'Y' | 'N'
  discountPercent: number
  discountedPrice: number
  labelList: string[]
  isActive: 'Y' | 'N'
  images: ProductImage[]
  totalCount: number
}

export type ProductPage = { items: ApiProduct[]; total: number }
// Stock shown in the website = API stock minus what was already ordered (see stockLedger.ts)
const withStock = (p: ApiProduct): ApiProduct => ({ ...p, stockQuantity: availableStock(String(p.productInfoId), p.stockQuantity) })
/* ---------- API calls ---------- */
// Same request ek saath 2 jagah se aaye (jaise slider + grid) to API sirf ek baar call hoti hai
const inflight = new Map<string, Promise<ProductPage>>()

export function getAllProducts(page = 0, size = 12): Promise<ProductPage> {
  const key = `${page}-${size}`
  let req = inflight.get(key)
  if (!req) {
    req = api.post<ApiProduct[]>(apiEndpoints.getAllProducts(page, size), {})
      .then(list => ({ items: list.filter(p => p.isActive === 'Y').map(withStock), total: list[0]?.totalCount ?? 0 }))
      .finally(() => inflight.delete(key))
    inflight.set(key, req)
  }
  return req
}

export async function getProductById(id: number | string): Promise<ApiProduct> {
  const url = apiEndpoints.getProductById(id)
  try {
    return withStock(await api.post<ApiProduct>(url, {}))
  } catch (e) {
    if (String(e).includes('405')) return withStock(await api.get<ApiProduct>(url))
    throw e
  }
}
/* ---------- Helpers ---------- */
export const formatPrice = (n: number) => '₹' + n.toLocaleString('en-IN')

// Image: base64 ho to wahi, nahi to BASE_URL + documentPath
export function imageSrc(img: ProductImage): string {
  const b64 = img.byteArrayDocument ?? img.document
  if (b64) return b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}`
  return config.baseURL + encodeURI(img.documentPath)
}
export const productImages = (p: ApiProduct): string[] =>
  p.images?.length ? p.images.map(imageSrc) : [pic('product-' + p.productInfoId)]

// Discount active ho to discountedPrice, nahi to price
export function priceInfo(p: ApiProduct) {
  const disc = p.isDiscountActive === 'Y' && p.discountedPrice > 0
  return { sell: disc ? p.discountedPrice : p.price, mrp: disc ? p.price : null, off: disc ? Math.round(p.discountPercent) : 0 }
}
export type Badge = 'NEW' | 'OFFER' | 'LATEST' | 'BEST SELLER'

// Admin panel ke Label dropdown se match (capital/small, "Arrival"/"Arrivals" dono chalega)
const hasLabel = (p: ApiProduct, re: RegExp) => p.labelList?.some(l => re.test(l.trim())) ?? false

export const isNewArrival = (p: ApiProduct) => hasLabel(p, /^new\s*arrivals?$/i)

// Product card par kaun sa label dikhega
export function badgeOf(p: ApiProduct): Badge | undefined {
  if (hasLabel(p, /^best\s*sellers?$/i)) return 'BEST SELLER'
  if (isNewArrival(p)) return 'NEW'
  if (hasLabel(p, /^offers?$/i)) return 'OFFER'
  if (hasLabel(p, /^latest$/i)) return 'LATEST'
}

// CSS class ka naam: 'BEST SELLER' -> 'best-seller'
export const badgeClass = (b: Badge) => b.toLowerCase().replace(' ', '-')

// Image load na ho to dummy photo
export const onImgError = (seed: string) => (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.onerror = null
  e.currentTarget.src = pic(seed)
}