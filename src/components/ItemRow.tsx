// One line item (image, name, price) used in Cart and Checkout
import { Link } from 'react-router-dom'
import { type StoreItem } from '../context/StoreContext'
import { formatPrice, onImgError } from '../services/productService'

export default function ItemRow({ item, children }: { item: StoreItem; children?: React.ReactNode }) {
  return (
    <div className="ir">
      <Link to={`/product/${item.id}`}><img src={item.image} alt={item.name} onError={onImgError('i' + item.id)} /></Link>
      <div className="ir-info">
        <Link to={`/product/${item.id}`} className="ir-name">{item.name}</Link>
        <div className="ir-price">{formatPrice(item.price)} {item.mrp && <s>{formatPrice(item.mrp)}</s>}</div>
        {children}
      </div>
    </div>
  )
}

export const itemRowCss = `
.ir{display:flex;gap:16px;align-items:flex-start}
.ir img{width:96px;height:96px;object-fit:cover;border-radius:12px;background:var(--bone)}
.ir-info{display:flex;flex-direction:column;gap:6px;min-width:0}
.ir-name{font-weight:500;line-height:1.3}.ir-name:hover{color:var(--accent)}
.ir-price s{color:#999;font-size:13px;margin-left:6px}
`