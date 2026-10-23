import { createContext, useContext, useState, type ReactNode } from 'react'
type Ctx = { cart: number; add: (n?: number) => void; wish: string[]; toggleWish: (id: string) => void }
const C = createContext<Ctx>({ cart: 0, add: () => {}, wish: [], toggleWish: () => {} })
export const useStore = () => useContext(C)
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState(0)
  const [wish, setWish] = useState<string[]>([])
  return <C.Provider value={{ cart, add: (n = 1) => setCart(c => c + n), wish, toggleWish: id => setWish(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]) }}>{children}</C.Provider>
}
