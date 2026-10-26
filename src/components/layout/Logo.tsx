const css = `
.logo{display:inline-flex;align-items:center;gap:10px}
.logo-text{font-weight:700;letter-spacing:.16em;font-size:18px;display:flex;flex-direction:column;line-height:1}
.logo-text small{font-size:8.5px;letter-spacing:.42em;font-weight:500;margin-top:4px;opacity:.7}
`
export default function Logo({ light = false }: { light?: boolean }) {
  const c = light ? '#fff' : '#0e0e10'
  return (
    <span className="logo" aria-label="Gawas Electronics">
      <style>{css}</style>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="9" y="3" width="22" height="34" rx="7" fill="none" stroke={c} strokeWidth="2.6" />
        <path d="M26 15a7 7 0 1 0 0 10v-4h-6" fill="none" stroke="#ff6a1a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-text" style={{ color: c }}>GAWAS<small>ELECTRONICS</small></span>
    </span>
  )
}
