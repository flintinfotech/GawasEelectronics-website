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
  modelName?: string // backend bheje to model filter me kaam aata hai
  isDiscountActive: 'Y' | 'N'
  discountPercent: number
  discountedPrice: number
  labelList: string[]
  isActive: 'Y' | 'N'
  images: ProductImage[]
  totalCount: number
}

export type ProductPage = { items: ApiProduct[]; total: number }

/* ---------- Filter (Shop By Device: brand / model) ---------- */
export type ProductFilter = { brandId?: number; brandName?: string; modelId?: number; modelName?: string }

// Menu ke link ke liye URL: productsUrl({ brandId: 112, brandName: 'Apple' }) -> /products?brandId=112&brandName=Apple
export function productsUrl(f: ProductFilter = {}): string {
  const sp = new URLSearchParams()
  if (f.brandId) { sp.set('brandId', String(f.brandId)); if (f.brandName) sp.set('brandName', f.brandName) }
  if (f.modelId) { sp.set('modelId', String(f.modelId)); if (f.modelName) sp.set('modelName', f.modelName) }
  const q = sp.toString()
  return q ? `/products?${q}` : '/products'
}

// URL (?brandId=..&modelId=..) se filter wapas nikalta hai
export function filterFromParams(sp: URLSearchParams): ProductFilter {
  const num = (k: string) => { const n = Number(sp.get(k)); return n > 0 ? n : undefined }
  return {
    brandId: num('brandId'), brandName: sp.get('brandName') ?? undefined,
    modelId: num('modelId'), modelName: sp.get('modelName') ?? undefined,
  }
}

// ⚠ BACKEND PAYLOAD: yahi se API ko filter jata hai. Backend ke asli field names alag ho to SIRF yaha badlo.
// (Jo field backend ko nahi chahiye wo Spring ignore kar deta hai)

const payloadOf = (f: ProductFilter) => ({
  ...(f.modelId
    ? {
        brandId: f.brandId,
        productName: f.modelName || '',
      }
    : f.brandId
      ? { brandId: f.brandId }
      : {}),
})


// Safety: backend filter na kare tab bhi galat brand/model ke product na dikhe
const same = (a?: string | null, b?: string) => (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase()
function matches(p: ApiProduct, f: ProductFilter) {
  if (f.brandName && !same(p.brandName, f.brandName)) return false
  if (f.modelName && p.modelName !== undefined && !same(p.modelName, f.modelName)) return false // product me model ho tabhi check
  return true
}

/* ---------- API calls ---------- */
// Backend har page me inactive products bhi bhejta hai, isliye page par 12 se kam dikhte the (9 + 2 wali problem).
// Fix: ek hi baar saare products mangwao, active + filter wale chhaant lo, phir 12-12 ke page khud banao.
const FETCH_ALL = 500
const CACHE_MS = 30_000 // 30 second tak wahi list use hoti hai (page badalne par API dobara nahi jati)
const cache = new Map<string, { at: number; req: Promise<ApiProduct[]> }>()

function loadAll(filter: ProductFilter): Promise<ApiProduct[]> {
  const key = JSON.stringify(filter)
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.req
  const req = api.post<ApiProduct[]>(apiEndpoints.getAllProducts(0, FETCH_ALL), payloadOf(filter)) // payload me brand/model
    .then(list => (list ?? []).filter(p => p.isActive === 'Y' && matches(p, filter)))
    .catch(e => { cache.delete(key); throw e }) // fail ho to agli baar dobara try
  cache.set(key, { at: Date.now(), req })
  return req
}

export async function getAllProducts(page = 0, size = 12, filter: ProductFilter = {}): Promise<ProductPage> {
  const all = await loadAll(filter)
  return { items: all.slice(page * size, page * size + size), total: all.length }
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