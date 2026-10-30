// STOCK LEDGER (temporary, browser-only)
// The backend has no "place order" API yet, so nothing reduces stock on the server when an order is placed.
// Until it does, we remember what was ordered in this browser and subtract it from the stock the API returns,
// so ordered-out products show "Out of stock" everywhere.
//
// WHEN THE BACKEND REDUCES STOCK ON ORDER: set USE_LOCAL_LEDGER = false (otherwise stock would be subtracted twice).
const USE_LOCAL_LEDGER = true
const KEY = 'gawas-sold'

type Sold = Record<string, number>

function read(): Sold {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Sold } catch { return {} }
}

export function recordSale(items: { id: string; qty: number }[]) {
  if (!USE_LOCAL_LEDGER) return
  const sold = read()
  for (const i of items) sold[i.id] = (sold[i.id] ?? 0) + i.qty
  try { localStorage.setItem(KEY, JSON.stringify(sold)) } catch { /* ignore */ }
}

// Stock still available = stock from the API minus what this browser already sold
export function availableStock(id: string, apiStock: number): number {
  if (!USE_LOCAL_LEDGER) return apiStock
  return Math.max(0, apiStock - (read()[id] ?? 0))
}