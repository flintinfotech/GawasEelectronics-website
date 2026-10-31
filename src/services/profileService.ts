// PROFILE SERVICE.
// The backend has no "get / update customer profile" API yet, so the edited details (address etc.)
// are saved in this browser, separately for every customer.
// When the backend APIs are ready, ONLY the bodies of these two functions change
// (see the API contract in the instructions).
import type { Customer } from '../lib/authStorage'

const key = (customerId: string) => `gawas-profile-${customerId}`

export function loadSavedProfile(customerId: string): Partial<Customer> {
  try {
    const v = localStorage.getItem(key(customerId))
    return v ? (JSON.parse(v) as Partial<Customer>) : {}
  } catch {
    return {}
  }
}

export async function saveProfile(customer: Customer): Promise<void> {
  // TODO (backend ready): await api.put(apiEndpoints.updateProfile(), customer)
  try { localStorage.setItem(key(customer.customerId), JSON.stringify(customer)) } catch { /* private mode: ignore */ }
}