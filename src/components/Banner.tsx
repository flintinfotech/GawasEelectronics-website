import { useEffect, useState, useCallback, useRef } from 'react'
import { api } from '../api/apiService'
import { ENDPOINTS } from '../api/endpoints'
import type { BannerItem } from '../types/banner'
import { pic } from '../utils/img'

const AUTO_SLIDE_MS = 3000

// base64 me "data:image/..." prefix ho ya na ho, dono chalega
const toSrc = (b: BannerItem) => (b.src.startsWith('data:') ? b.src : `data:${b.fileType};base64,${b.src}`)

// Backend na chale ya banner na ho to ye dikhega
const FALLBACK: BannerItem[] = [{
  bannerId: 0, src: pic('gawas-hero', 1800, 900), title: 'Gawas Electronics', redirectUrl: '#products', fileType: 'image/jpeg',
  description: 'Premium mobile covers', size: 0, width: 1800, height: 900, aspectRatio: '2', startDate: '', endDate: '', status: 'Y', totalCount: 1, section: null,
}]

export default function Banner() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)

  // 1) API call
  useEffect(() => {
api.post<BannerItem[]>(ENDPOINTS.banner.getAll(0, 10, 'bannerId,desc'), {})
      .then(list => setBanners(list.filter(b => b.status === 'Y'))) // sirf active banners
      .catch(err => console.error('Banner load failed:', err))
      .finally(() => setLoading(false))
  }, [])

  const slides = banners.length ? banners : FALLBACK
  const next = useCallback(() => setIndex(i => (i + 1) % slides.length), [slides.length])
  const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length)

  // 2) Har 3 second me auto slide (hover par ruk jata hai)
  useEffect(() => {
    if (slides.length < 2 || paused) return
    const t = setInterval(next, AUTO_SLIDE_MS)
    return () => clearInterval(t)
  }, [slides.length, paused, next])

  if (loading) return <div className="banner banner-skeleton" aria-busy="true" />

  return (
    <section
      className="banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
        touchX.current = null
      }}
    >
      <div className="banner-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map(b => {
          const img = <img src={b.src.startsWith('http') || b.bannerId === 0 ? b.src : toSrc(b)} alt={b.description || b.title} />
          return (
            <div className="banner-slide" key={b.bannerId}>
              {b.redirectUrl ? <a href={b.redirectUrl}>{img}</a> : img}
            </div>
          )
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button className="banner-arrow l" aria-label="Previous banner" onClick={prev}>‹</button>
          <button className="banner-arrow r" aria-label="Next banner" onClick={next}>›</button>
          <div className="banner-dots">
            {slides.map((b, i) => (
              <button key={b.bannerId} aria-label={`Banner ${i + 1}`} className={i === index ? 'on' : ''} onClick={() => setIndex(i)} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
