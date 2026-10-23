import { pic } from '../utils/img'

export type Product = {
  id: string; name: string; price: number; mrp: number; rating: number; reviews: number
  badge?: 'NEW' | 'BEST SELLER' | 'SALE'; images: string[]; colors: { name: string; hex: string }[]
  description: string; features: string[]; slider?: boolean
}

export const SITE = { name: 'Gawas Electronics', tagline: 'Premium Mobile Covers', phone: '+91 98765 43210', email: 'support@gawaselectronics.com' }
export const DEVICES = ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17 Air', 'iPhone 17', 'Galaxy S26 Ultra', 'Galaxy Z Fold8', 'OnePlus 15']

const colors = [
  { name: 'Onyx', hex: '#1c1c1f' }, { name: 'Bordeaux', hex: '#5a1624' }, { name: 'Slate', hex: '#6f7f93' },
  { name: 'Gold', hex: '#c9ab4a' }, { name: 'Sage', hex: '#9fae92' }, { name: 'Mauve', hex: '#cfa7ee' },
]
const mk = (id: string, name: string, price: number, ci: number, badge?: Product['badge'], slider = false): Product => {
  const c = colors[ci]
  return {
    id, name, price, mrp: Math.round(price * 1.35 / 100) * 100 + 99, rating: 4.5 + (ci % 5) / 10, reviews: 10 + ci * 7 + price % 13, badge, slider,
    images: [pic(id + '-1'), pic(id + '-2'), pic(id + '-3')],
    colors: [c, colors[(ci + 2) % 6], colors[(ci + 4) % 6]],
    description: `${name} — precision-cut, drop-tested protection with a premium soft-touch finish. Wireless charging friendly.`,
    features: ['MagSafe compatible', '12 ft drop protection', 'Anti-yellowing material', 'Raised camera & screen edges'],
  }
}
export const products: Product[] = [
  mk('modern-defense-mag-shield', 'Modern Defense Mag Shield', 2199, 0, 'NEW'),
  mk('slide-lock-wallet-case', 'Slide Lock Wallet Case', 2199, 3, 'NEW'),
  mk('air-pro-clear-stand', 'Air Pro Clear Stand Case', 1999, 1, 'NEW'),
  mk('urban-matte-grip', 'Urban Matte Grip Case', 2499, 4, 'NEW'),
  mk('regal-matte-stand', 'Regal Matte Camera Stand', 1499, 3, 'NEW'),
  mk('crystal-snap', 'Crystal Snap', 1499, 1, 'BEST SELLER'),
  mk('techwoven-magsafe', 'TechWoven Case MagSafe', 2499, 0, 'NEW'),
  mk('smart-shield-glass', 'Smart Shield Privacy Glass', 1899, 2),
  mk('core-tones', 'Core Tones Case', 999, 5),
  mk('elite-darks', 'Elite Darks Luxe', 4999, 0, 'NEW'),
  mk('woven-pro', 'New Woven Case Pro', 1999, 3, 'SALE'),
  mk('clear-armor', 'Clear Armor Case', 1299, 2),
  mk('chateau-rouge', 'Chateau Rouge', 1799, 1, 'NEW', true),
  mk('eclipse-shadow', 'Eclipse Shadow', 1799, 0, 'NEW', true),
  mk('misty-meadow', 'Misty Meadow', 1799, 2, 'NEW', true),
  mk('gilded-hour', 'Gilded Hour', 1799, 3, 'NEW', true),
  mk('empress-sage', 'Empress Sage', 1799, 4, 'NEW', true),
  mk('lilac-dream', 'Lilac Dream', 1799, 5, 'NEW', true),
]
export const gridProducts = products.filter(p => !p.slider)
export const sliderProducts = products.filter(p => p.slider)
export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')
