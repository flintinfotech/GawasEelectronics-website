// STATIC DATA SERVICE: backend ka dropdown data (Brand Name, Model, Label, Section ...)
// (UI: components/layout/DeviceMenu.tsx, hook: hooks/useStaticData.ts)
import { api } from '../lib/apiClient'
import { apiEndpoints } from './apiEndpoints'

export type StaticDataItem = {
  dropDownId: number
  dropDrownValue: string // ⚠ backend ki spelling aisi hi hai (do 'r'): dropDrownValue
  parentDropDrownId?: number // Model ke liye: ye kis Brand ka model hai (Brand ka dropDownId)
}
// { "Brand Name": [...], "Model": [...], "Label": [...], ... }
export type StaticData = Record<string, StaticDataItem[]>

// Poori site ke liye API sirf ek baar call hoti hai (Header ke 2 jagah se bhi)
let cache: Promise<StaticData> | null = null

export function getStaticData(): Promise<StaticData> {
  if (!cache) {
    cache = api.post<StaticData>(apiEndpoints.getStaticDataDD(), {}) // POST + empty {} payload
      .catch(e => { cache = null; throw e }) // fail ho to agli baar dobara try
  }
  return cache
}

/* ---------- Helpers ---------- */
export const brandsOf = (d: StaticData): StaticDataItem[] => (Array.isArray(d?.['Brand Name']) ? d['Brand Name'] : [])

// Ek brand ke saare models (Model.parentDropDrownId === Brand.dropDownId)
export const modelsOf = (d: StaticData, brandId: number): StaticDataItem[] =>
  (Array.isArray(d?.['Model']) ? d['Model'] : []).filter(m => m.parentDropDrownId === brandId)