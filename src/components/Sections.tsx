import { useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { gridProducts, sliderProducts } from '../data/products'
import { pic } from '../utils/img'

export function ProductGrid() {
  return (
    <section id="products" className="container section">
      <h2 className="h2">Phone Cases &amp; Accessories</h2><p className="sub">For the all new iPhones</p>
      <div className="grid4">{gridProducts.map(p => <ProductCard key={p.id} p={p} />)}</div>
      <div className="center"><a href="#products" className="btn dark">View All</a></div>
    </section>
  )
}

export function PromoBanner() {
  return (
    <section id="originals" className="container">
      <div className="promo" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.75), rgba(0,0,0,.1)), url(${pic('gawas-promo', 1600, 800)})` }}>
        <div><h2>Meet the Regalia</h2><p>This isn’t just a phone case.<br />It is a statement.</p><Link to="/product/chateau-rouge" className="btn light">Shop now</Link></div>
      </div>
    </section>
  )
}

export function Slider() {
  const ref = useRef<HTMLDivElement>(null)
  const go = (d: number) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.8), behavior: 'smooth' })
  return (
    <section id="accessories" className="section slider-sec">
      <div className="container"><h2 className="h2">Regalia Series</h2><p className="sub">Built for the elites</p></div>
      <div className="slider-wrap">
        <button className="arrow l" aria-label="Previous" onClick={() => go(-1)}>‹</button>
        <div className="slider" ref={ref}>{sliderProducts.map(p => <div className="slide" key={p.id}><ProductCard p={p} /></div>)}</div>
        <button className="arrow r" aria-label="Next" onClick={() => go(1)}>›</button>
      </div>
    </section>
  )
}

const perks = [['◆', 'Precision Fit, Premium Feel'], ['⬇', 'Engineered For Real Drops'], ['∞', 'Materials That Last'], ['24/7', 'Easy Return, Reliable Support']]
export function Perks() {
  return <section className="container perks">{perks.map(([i, t]) => <div key={t}><b>{i}</b><span>{t}</span></div>)}</section>
}

const shots = [['Luxury doesn’t try. It shows.', 'gawas-life-1'], ['Built for the table where decisions are made.', 'gawas-life-2'], ['Luxury that stays with you even when no one’s watching.', 'gawas-life-3']]
export function Lifestyle() {
  return (
    <section className="container section">
      <div className="life-head"><h2 className="h2">For Every Version of You</h2><p>From the street to the boardroom to your quiet moments. Regalia belongs everywhere you do.</p></div>
      <div className="life">{shots.map(([t, seed]) => <figure key={t}><img src={pic(seed, 700, 700)} alt={t} loading="lazy" /><figcaption>{t}</figcaption></figure>)}</div>
      <p className="rating">★★★★★ <b>4.8/5 from 3 Million+ Customers</b></p>
    </section>
  )
}
