import { useCallback, useEffect, useRef, useState } from 'react'
import { bannerSrc } from '../services/bannerService'
import { useBanners } from '../hooks/useBanners'

const AUTO_SLIDE_MS = 3000 // 3 second

const css = `
.bn{position:relative;overflow:hidden;background:#0a0a0c;width:100%;aspect-ratio:2.6/1;min-height:190px;max-height:520px}
.bn-sk{background:linear-gradient(90deg,#1a1a1d,#26262b,#1a1a1d);background-size:200% 100%;animation:sk 1.4s infinite}
.bn-track{display:flex;height:100%;transition:transform .7s cubic-bezier(.65,0,.35,1)}
.bn-slide{flex:0 0 100%;height:100%}.bn-slide a{display:block;height:100%}
.bn-slide img{width:100%;height:100%;object-fit:cover}
.bn-arrow{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.9);font-size:26px;line-height:1;box-shadow:0 4px 16px rgba(0,0,0,.25);opacity:0;transition:.2s}
.bn:hover .bn-arrow{opacity:1}.bn-arrow.l{left:16px}.bn-arrow.r{right:16px}
.bn-dots{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:8px}
.bn-dots button{width:9px;height:9px;border-radius:99px;background:rgba(255,255,255,.55);transition:.3s}.bn-dots .on{width:26px;background:#fff}
@media(max-width:820px){.bn-arrow{display:none}}
`

export default function Banner() {
  const { banners, loading } = useBanners()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = banners.length

  const next = useCallback(() => setIndex(i => (count ? (i + 1) % count : 0)), [count])
  const prev = () => setIndex(i => (i - 1 + count) % count)

  // Har 3 second me auto slide (hover par ruk jata hai)
  useEffect(() => {
    if (count < 2 || paused) return
    const t = setInterval(next, AUTO_SLIDE_MS)
    return () => clearInterval(t)
  }, [count, paused, next])

  if (loading) return <div className="bn bn-sk" aria-busy="true"><style>{css}</style></div>
  if (!count) return null // koi active banner nahi to section hi nahi dikhega

  return (
    <section
      className="bn"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev() }
        touchX.current = null
      }}
    >
      <style>{css}</style>
      <div className="bn-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {banners.map(b => {
          const img = <img src={bannerSrc(b)} alt={b.description || b.title} />
          return <div className="bn-slide" key={b.bannerId}>{b.redirectUrl ? <a href={b.redirectUrl}>{img}</a> : img}</div>
        })}
      </div>
      {count > 1 && (
        <>
          <button className="bn-arrow l" aria-label="Previous banner" onClick={prev}>‹</button>
          <button className="bn-arrow r" aria-label="Next banner" onClick={next}>›</button>
          <div className="bn-dots">
            {banners.map((b, i) => <button key={b.bannerId} aria-label={`Banner ${i + 1}`} className={i === index ? 'on' : ''} onClick={() => setIndex(i)} />)}
          </div>
        </>
      )}
    </section>
  )
}
