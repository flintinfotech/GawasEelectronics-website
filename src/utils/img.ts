// Dummy image generator (SVG). Real images aayein toh products.ts me `images: ['/img/a.jpg']` daal do.
export function caseImg(color: string, accent = '#111', bg = '#f2f2f4', angle = 0): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480"><rect width="400" height="480" fill="${bg}"/><g transform="rotate(${angle} 200 240)"><rect x="120" y="50" width="160" height="380" rx="38" fill="${color}"/><rect x="120" y="50" width="160" height="380" rx="38" fill="none" stroke="${accent}" stroke-width="5"/><rect x="134" y="64" width="78" height="82" rx="20" fill="${accent}"/><circle cx="157" cy="88" r="13" fill="#222"/><circle cx="190" cy="88" r="13" fill="#222"/><circle cx="157" cy="122" r="13" fill="#222"/><circle cx="244" cy="76" r="5" fill="#fff" opacity=".8"/><text x="200" y="404" font-family="sans-serif" font-size="9" letter-spacing="3" text-anchor="middle" fill="#fff" opacity=".7">GAWAS</text></g></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
export const lifestyleImg = (c1: string, c2: string, label: string) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="600" height="700" fill="url(#g)"/><text x="300" y="360" font-family="sans-serif" font-size="26" text-anchor="middle" fill="#fff" opacity=".6">${label}</text></svg>`)

export const pic = (seed: string, w = 800, h = 960) => `https://picsum.photos/seed/${seed}/${w}/${h}`
