// Shared layout for all policy pages: title, last-updated date, side menu and readable content area
import { NavLink } from 'react-router-dom'
import { POLICY, POLICY_LINKS } from '../config/policies'

const css = `
.pl-head{padding:8px 0 28px;border-bottom:1px solid var(--line);margin-bottom:36px}
.pl-head .eyebrow{color:var(--accent);font-weight:700;letter-spacing:.14em;font-size:12px;text-transform:uppercase;margin-bottom:10px}
.pl-head p.pl-sub{color:#6b6b72;margin-top:10px;font-size:17px;max-width:640px;line-height:1.6}
.pl-head small{display:block;color:#888;margin-top:14px}
.pl-grid{display:grid;grid-template-columns:240px minmax(0,1fr);gap:56px;align-items:start}
.pl-nav{position:sticky;top:110px;display:flex;flex-direction:column;gap:4px}
.pl-nav a{padding:11px 16px;border-radius:12px;color:#555;font-weight:500}
.pl-nav a:hover{background:var(--bone)}.pl-nav a.active{background:var(--ink);color:#fff}
.pl-body{max-width:780px;line-height:1.8;color:#2b2b30;font-size:16.5px}
.pl-body h2{font-size:24px;letter-spacing:-.02em;margin:36px 0 12px;color:var(--ink)}
.pl-body h2:first-child{margin-top:0}
.pl-body h3{font-size:18px;margin:22px 0 8px;color:var(--ink)}
.pl-body p{margin-bottom:14px}
.pl-body ul,.pl-body ol{padding-left:22px;margin-bottom:16px}.pl-body li{margin-bottom:8px}
.pl-body a{color:var(--accent);text-decoration:underline}
.pl-note{background:var(--bone);border-radius:16px;padding:18px 20px;margin:20px 0}
.pl-note.warn{background:#fff4ec;border:1px solid #ffd9bf}
.pl-table{width:100%;border-collapse:collapse;margin:16px 0 22px;font-size:15.5px}
.pl-table th,.pl-table td{text-align:left;padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:top}
.pl-table th{background:var(--bone);font-weight:600}
@media(max-width:900px){
  .pl-grid{grid-template-columns:1fr;gap:28px}
  .pl-nav{position:static;flex-direction:row;overflow-x:auto;gap:8px;padding-bottom:6px}
  .pl-nav a{white-space:nowrap;border:1px solid var(--line)}
}
`

export default function PolicyLayout({ title, intro, children, showUpdated = true }: { title: string; intro?: string; children: React.ReactNode; showUpdated?: boolean }) {
  return (
    <section className="container section">
      <style>{css}</style>
      <header className="pl-head">
        <p className="eyebrow">{POLICY.businessName}</p>
        <h1 className="h2">{title}</h1>
        {intro && <p className="pl-sub">{intro}</p>}
        {showUpdated && <small>Last updated: {POLICY.updated}</small>}
      </header>
      <div className="pl-grid">
        <nav className="pl-nav" aria-label="Policies">
          {POLICY_LINKS.map(l => <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>{l.label}</NavLink>)}
        </nav>
        <article className="pl-body">{children}</article>
      </div>
    </section>
  )
}