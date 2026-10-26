import Logo from './Logo'
import { DEVICES, SITE } from '../../config/site'

const css = `
.footer{background:var(--ink);color:#fff}
.join{background:#f1f1f3;color:var(--ink);text-align:center;padding:56px 16px}
.join h2{font-size:30px;margin-bottom:8px}.join p{margin-bottom:22px}.join form{display:inline-flex;max-width:100%}
.join input{padding:14px 18px;border:1px solid var(--line);border-radius:999px 0 0 999px;min-width:min(300px,60vw);font:inherit}
.join button{background:var(--ink);color:#fff;padding:0 24px;border-radius:0 999px 999px 0;letter-spacing:.15em;font-size:12px;text-transform:uppercase}
.fgrid{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:32px;padding:52px 0 28px}
.fgrid h4{margin-bottom:14px;letter-spacing:.2em;font-size:12px;text-transform:uppercase}
.fgrid a{display:block;color:#bbb;margin-bottom:10px;font-size:15px}.fgrid a:hover{color:#fff}
.muted{color:#aaa;margin-top:14px;font-size:14px;line-height:1.7}
.copy{border-top:1px solid #2a2a2e;padding:20px 0;color:#999;font-size:13px}
@media(max-width:1024px){.fgrid{grid-template-columns:1fr 1fr}}
`
export default function Footer() {
  return (
    <footer className="footer">
      <style>{css}</style>
      <section className="join"><h2>Join Our List</h2><p>New arrivals, collabs and once-in-a-lifetime deals.</p>
        <form onSubmit={e => { e.preventDefault(); alert('Subscribed!') }}><input type="email" required placeholder="Enter your email" /><button>Subscribe</button></form></section>
      <div className="container fgrid">
        <div><Logo light /><p className="muted">{SITE.tagline}. Designed in India for real life.</p><p className="muted">{SITE.email}<br />{SITE.phone}</p></div>
        <div><h4>Company</h4>{['About Us', 'Contact Us', 'Our Blogs', 'Privacy Policy', 'Terms of Service'].map(l => <a key={l} href="#">{l}</a>)}</div>
        <div><h4>Need Help?</h4>{['Track Order', "FAQ's", 'Return & Exchange', 'Cancellation', 'Shipping Information'].map(l => <a key={l} href="#">{l}</a>)}</div>
        <div><h4>Latest Models</h4>{DEVICES.map(l => <a key={l} href="#">{l}</a>)}</div>
      </div>
      <div className="container copy">© 2026 Gawas Electronics. All rights reserved.</div>
    </footer>
  )
}
