// PRODUCT SERVICE: types + API calls + helpers (UI: components/Product.tsx, hook: hooks/useProducts.ts)
import { type SyntheticEvent } from 'react'
import { api } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'
import config from '../config/config'
import { pic } from '../utils/img'

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

/* ---------- API calls ---------- */
export async function getAllProducts(page = 0, size = 12): Promise<ProductPage> {
  const list = await api.post<ApiProduct[]>(apiEndpoints.getAllProducts(page, size), {})
  return { items: list.filter(p => p.isActive === 'Y'), total: list[0]?.totalCount ?? 0 }
}

// Pehle POST, 405 aaye to GET try karta hai
export async function getProductById(id: number | string): Promise<ApiProduct> {
  const url = apiEndpoints.getProductById(id)
  try {
    return await api.post<ApiProduct>(url, {})
  } catch (e) {
    if (String(e).includes('405')) return api.get<ApiProduct>(url)
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
export function badgeOf(p: ApiProduct): 'NEW' | 'BEST SELLER' | undefined {
  if (p.labelList?.includes('Best Seller')) return 'BEST SELLER'
  if (p.labelList?.includes('New Arrivals')) return 'NEW'
}
// Image load na ho to dummy photo
export const onImgError = (seed: string) => (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.onerror = null
  e.currentTarget.src = pic(seed)
}
